from fastapi import APIRouter, Depends, HTTPException, Query

from ..database import get_db, rows_to_dicts
from ..deps import current_user, require_roles
from ..schemas import ResearchIn
from ..services.rag_client import ingest_paper

router = APIRouter(prefix="/research", tags=["research"])
admin_router = APIRouter(prefix="/admin/research", tags=["admin"])


@router.get("")
def list_research(
    q: str = "",
    topic: str = "",
    station: str = "",
    year: int | None = Query(default=None),
    user=Depends(current_user),
):
    clauses = ["status = 'approved'"]
    params = []
    if user["role"] in {"researcher", "admin"}:
        clauses = ["1 = 1"]
    if q:
        clauses.append("(title LIKE ? OR abstract LIKE ? OR topic LIKE ?)")
        params.extend([f"%{q}%", f"%{q}%", f"%{q}%"])
    if topic:
        clauses.append("topic = ?")
        params.append(topic)
    if station:
        clauses.append("station = ?")
        params.append(station)
    if year:
        clauses.append("year = ?")
        params.append(year)
    with get_db() as db:
        rows = db.execute(
            f"SELECT * FROM research_papers WHERE {' AND '.join(clauses)} ORDER BY created_at DESC",
            params,
        ).fetchall()
    return rows_to_dicts(rows)


@router.get("/{paper_id}")
def get_research(paper_id: int, user=Depends(current_user)):
    with get_db() as db:
        paper = db.execute("SELECT * FROM research_papers WHERE id = ?", (paper_id,)).fetchone()
    if not paper:
        raise HTTPException(status_code=404, detail="Research paper not found")
    if paper["status"] != "approved" and user["role"] not in {"researcher", "admin"}:
        raise HTTPException(status_code=404, detail="Research paper not found")
    return dict(paper)


@router.post("")
def create_research(payload: ResearchIn, user=Depends(require_roles("researcher", "admin"))):
    with get_db() as db:
        cursor = db.execute(
            """
            INSERT INTO research_papers (title, abstract, topic, station, year, file_path, uploaded_by)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            """,
            (payload.title, payload.abstract, payload.topic, payload.station, payload.year, payload.file_path, user["id"]),
        )
        paper = db.execute("SELECT * FROM research_papers WHERE id = ?", (cursor.lastrowid,)).fetchone()
    return dict(paper)


@admin_router.get("/pending")
def pending(user=Depends(require_roles("admin"))):
    with get_db() as db:
        rows = db.execute("SELECT * FROM research_papers WHERE status = 'pending' ORDER BY created_at").fetchall()
    return rows_to_dicts(rows)


@admin_router.post("/{paper_id}/approve")
async def approve(paper_id: int, user=Depends(require_roles("admin"))):
    with get_db() as db:
        paper = db.execute("SELECT * FROM research_papers WHERE id = ?", (paper_id,)).fetchone()
        if not paper:
            raise HTTPException(status_code=404, detail="Research paper not found")
        db.execute("UPDATE research_papers SET status = 'approved' WHERE id = ?", (paper_id,))
        updated = db.execute("SELECT * FROM research_papers WHERE id = ?", (paper_id,)).fetchone()
    ingested = await ingest_paper(dict(updated))
    result = dict(updated)
    result["ingested"] = ingested
    return result


@admin_router.post("/{paper_id}/reject")
def reject(paper_id: int, user=Depends(require_roles("admin"))):
    with get_db() as db:
        paper = db.execute("SELECT * FROM research_papers WHERE id = ?", (paper_id,)).fetchone()
        if not paper:
            raise HTTPException(status_code=404, detail="Research paper not found")
        db.execute("UPDATE research_papers SET status = 'rejected' WHERE id = ?", (paper_id,))
        updated = db.execute("SELECT * FROM research_papers WHERE id = ?", (paper_id,)).fetchone()
    return dict(updated)
