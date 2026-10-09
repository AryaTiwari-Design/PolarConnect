import os

import httpx

AI_SERVICE_URL = os.getenv("AI_SERVICE_URL", "http://127.0.0.1:8000")


async def ask_rag(question: str) -> dict:
    try:
        async with httpx.AsyncClient(timeout=20) as client:
            response = await client.post(f"{AI_SERVICE_URL}/chat", json={"question": question})
            response.raise_for_status()
            return response.json()
    except Exception:
        return {
            "answer": "The RAG service is not available yet. I can still show approved papers, but grounded AI answers need the AI service running.",
            "sources": [],
        }


async def ingest_paper(paper: dict) -> bool:
    if not paper.get("file_path"):
        return False
    try:
        async with httpx.AsyncClient(timeout=30) as client:
            response = await client.post(
                f"{AI_SERVICE_URL}/ingest",
                json={
                    "paper_id": paper["id"],
                    "title": paper["title"],
                    "file_path": paper["file_path"],
                },
            )
            response.raise_for_status()
            return True
    except Exception:
        return False
