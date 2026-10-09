import json

from fastapi import APIRouter, Depends

from ..database import get_db, rows_to_dicts
from ..deps import current_user
from ..schemas import ChatIn
from ..services.rag_client import ask_rag

router = APIRouter(prefix="/chat", tags=["chat"])


@router.post("")
async def chat(payload: ChatIn, user=Depends(current_user)):
    rag = await ask_rag(payload.question)
    with get_db() as db:
        db.execute(
            "INSERT INTO chat_messages (user_id, question, answer, sources_json) VALUES (?, ?, ?, ?)",
            (user["id"], payload.question, rag["answer"], json.dumps(rag.get("sources", []))),
        )
    return rag


@router.get("/history")
def history(user=Depends(current_user)):
    with get_db() as db:
        rows = db.execute(
            "SELECT * FROM chat_messages WHERE user_id = ? ORDER BY created_at DESC LIMIT 20",
            (user["id"],),
        ).fetchall()
    messages = rows_to_dicts(rows)
    for message in messages:
        message["sources"] = json.loads(message.pop("sources_json"))
    return messages
