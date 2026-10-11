from datetime import date, timedelta
from fastapi import APIRouter, Query
from app.database.db import connection

router = APIRouter(prefix="/api/analysis", tags=["Analysis"])

def load_records(location: str | None = None):
    sql = "SELECT observation_date, location, temperature_c, wind_speed_m_s FROM polar_data WHERE temperature_c IS NOT NULL"
    params = []
    if location:
        sql += " AND location LIKE ?"
        params.append(f"%{location}%")
    sql += " ORDER BY observation_date ASC LIMIT 1000"
    with connection() as conn:
        return [dict(row) for row in conn.execute(sql, params).fetchall()]

@router.get("/trend")
def temperature_trend(location: str | None = None):
    rows = load_records(location)
    if len(rows) < 2:
        return {"count": len(rows), "message": "At least two temperature records are needed.", "trend": None}
    first, last = float(rows[0]["temperature_c"]), float(rows[-1]["temperature_c"])
    change = round(last - first, 3)
    return {"location_filter": location, "count": len(rows), "first_date": rows[0]["observation_date"],
            "last_date": rows[-1]["observation_date"], "first_temperature_c": first,
            "last_temperature_c": last, "change_c": change,
            "trend": "increasing" if change > 0 else "decreasing" if change < 0 else "stable",
            "note": "Simple first-to-last comparison, not a formal climate trend estimate."}

@router.get("/prediction")
def temperature_prediction(location: str | None = None, days_ahead: int = Query(default=7, ge=1, le=30)):
    rows = load_records(location)
    if not rows:
        return {"count": 0, "message": "No temperature records found.", "predictions": []}
    y = [float(row["temperature_c"]) for row in rows]
    x = list(range(len(y)))
    n = len(x)
    x_mean, y_mean = sum(x) / n, sum(y) / n
    denom = sum((v - x_mean) ** 2 for v in x)
    slope = sum((a - x_mean) * (b - y_mean) for a, b in zip(x, y)) / denom if denom else 0.0
    intercept = y_mean - slope * x_mean
    last_date = date.fromisoformat(rows[-1]["observation_date"])
    predictions = [{"date": (last_date + timedelta(days=i)).isoformat(),
                    "predicted_temperature_c": round(intercept + slope * (n - 1 + i), 2)}
                   for i in range(1, days_ahead + 1)]
    return {"model": "simple linear regression", "training_records": n, "location_filter": location,
            "predictions": predictions, "warning": "Illustrative estimate, not an operational weather forecast."}

@router.get("/anomalies")
def detect_anomalies(location: str | None = None):
    rows = load_records(location)
    values = [float(row["temperature_c"]) for row in rows]
    if len(values) < 3:
        return {"count": len(values), "anomalies": [], "message": "At least three records are needed."}
    mean = sum(values) / len(values)
    std = (sum((v - mean) ** 2 for v in values) / len(values)) ** 0.5
    anomalies = []
    if std:
        for row in rows:
            z = (float(row["temperature_c"]) - mean) / std
            if abs(z) >= 2:
                anomalies.append({**row, "z_score": round(z, 3)})
    return {"method": "Z-score", "threshold": 2, "mean_temperature_c": round(mean, 3),
            "standard_deviation": round(std, 3), "anomaly_count": len(anomalies), "anomalies": anomalies,
            "note": "Statistical flags need review; they are not automatically scientific conclusions."}

@router.get("/insights")
def insights(location: str | None = None):
    rows = load_records(location)
    if not rows:
        return {"insights": ["No temperature records are available yet."]}
    vals = [float(row["temperature_c"]) for row in rows]
    change = vals[-1] - vals[0]
    result = [f"{len(vals)} temperature records are available for this query."]
    if change > 0:
        result.append(f"Temperature rose by {change:.2f} °C from the first to latest record.")
    elif change < 0:
        result.append(f"Temperature fell by {abs(change):.2f} °C from the first to latest record.")
    else:
        result.append("First and latest recorded temperatures are equal.")
    result.append("Treat this as a small-sample summary, not a scientific conclusion.")
    return {"insights": result}
