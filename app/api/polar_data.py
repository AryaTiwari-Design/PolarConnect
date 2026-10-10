from datetime import date, timedelta
import httpx
from fastapi import APIRouter, HTTPException, Query, Depends
from app.database.db import connection
from app.schemas import PolarDataCreate
from app.api.auth import get_current_user

router = APIRouter(prefix="/api/polar-data", tags=["Polar Data"])

@router.get("")
def list_polar_data(location: str | None = None, limit: int = Query(default=100, ge=1, le=1000), offset: int = Query(default=0, ge=0)):
    sql = "SELECT * FROM polar_data"
    params = []
    if location:
        sql += " WHERE location LIKE ?"
        params.append(f"%{location}%")
    sql += " ORDER BY observation_date DESC LIMIT ? OFFSET ?"
    params.extend([limit, offset])
    with connection() as conn:
        rows = conn.execute(sql, params).fetchall()
        count_sql = "SELECT COUNT(*) AS n FROM polar_data" + (" WHERE location LIKE ?" if location else "")
        total = conn.execute(count_sql, ([f"%{location}%"] if location else [])).fetchone()["n"]
    return {"total": total, "limit": limit, "offset": offset, "records": [dict(row) for row in rows]}

@router.get("/{record_id}")
def get_polar_record(record_id: int):
    with connection() as conn:
        row = conn.execute("SELECT * FROM polar_data WHERE id = ?", (record_id,)).fetchone()
    if not row:
        raise HTTPException(status_code=404, detail="Polar data record not found.")
    return dict(row)

@router.post("")
def create_polar_record(payload: PolarDataCreate, user: dict = Depends(get_current_user)):
    with connection() as conn:
        cursor = conn.execute("INSERT INTO polar_data (observation_date, location, latitude, longitude, temperature_c, wind_speed_m_s, source) VALUES (?, ?, ?, ?, ?, ?, ?)",
                              (payload.observation_date, payload.location, payload.latitude, payload.longitude, payload.temperature_c, payload.wind_speed_m_s, payload.source))
        row = conn.execute("SELECT * FROM polar_data WHERE id = ?", (cursor.lastrowid,)).fetchone()
    return {"message": "Record created", "record": dict(row)}

@router.post("/fetch-nasa")
async def fetch_nasa_power_data(latitude: float = Query(default=78.22, ge=-90, le=90),
                                longitude: float = Query(default=15.65, ge=-180, le=180),
                                days: int = Query(default=14, ge=2, le=90),
                                user: dict = Depends(get_current_user)):
    end_day = date.today() - timedelta(days=5)
    start_day = end_day - timedelta(days=days - 1)
    params = {"parameters": "T2M,WS10M", "community": "RE", "longitude": longitude,
              "latitude": latitude, "start": start_day.strftime("%Y%m%d"),
              "end": end_day.strftime("%Y%m%d"), "format": "JSON"}
    try:
        async with httpx.AsyncClient(timeout=30) as client:
            response = await client.get("https://power.larc.nasa.gov/api/temporal/daily/point", params=params)
            response.raise_for_status()
            data = response.json()
        values = data["properties"]["parameter"]
        temperatures = values.get("T2M", {})
        winds = values.get("WS10M", {})
    except (httpx.HTTPError, KeyError, ValueError) as exc:
        raise HTTPException(status_code=502, detail=f"NASA POWER request failed: {exc}")
    saved = 0
    location = f"NASA POWER ({latitude:.3f}, {longitude:.3f})"
    with connection() as conn:
        for day, temp in temperatures.items():
            wind = winds.get(day)
            temp_value = None if temp is None or temp == -999 else float(temp)
            wind_value = None if wind is None or wind == -999 else float(wind)
            conn.execute("INSERT OR IGNORE INTO polar_data (observation_date, location, latitude, longitude, temperature_c, wind_speed_m_s, source) VALUES (?, ?, ?, ?, ?, ?, 'NASA POWER API')",
                         (f"{day[:4]}-{day[4:6]}-{day[6:]}", location, latitude, longitude, temp_value, wind_value))
            saved += conn.execute("SELECT changes()").fetchone()[0]
    return {"message": "NASA POWER data retrieved", "source": "NASA POWER API",
            "requested_start": start_day.isoformat(), "requested_end": end_day.isoformat(),
            "saved_records": saved, "note": "Daily values may be revised by the provider."}
