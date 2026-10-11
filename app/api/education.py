from fastapi import APIRouter
from app.database.db import connection

router = APIRouter(prefix="/api", tags=["Education"])

@router.get("/education")
def list_education_resources(category: str | None = None):
    with connection() as conn:
        if category:
            rows = conn.execute("SELECT * FROM education_resources WHERE category LIKE ? ORDER BY id", (f"%{category}%",)).fetchall()
        else:
            rows = conn.execute("SELECT * FROM education_resources ORDER BY id").fetchall()
    return {"resources": [dict(row) for row in rows]}

@router.get("/research-stations")
def list_research_stations():
    with connection() as conn:
        rows = conn.execute("SELECT * FROM research_stations ORDER BY name").fetchall()
    return {"stations": [dict(row) for row in rows]}
