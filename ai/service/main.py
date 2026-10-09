from pathlib import Path

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

from ai.chunking import chunk_pages
from ai.extraction import extract_text_from_pdf

from .generation import generate_answer
from .retrieval import retrieve
from .store import delete_paper, load_index, upsert_paper_chunks

ROOT = Path(__file__).resolve().parents[2]

app = FastAPI(title="PolarConnect RAG Service")


class IngestRequest(BaseModel):
    paper_id: int | str
    title: str
    file_path: str


class ChatRequest(BaseModel):
    question: str


@app.get("/health")
def health():
    return {"status": "ok", "service": "rag", "chunks": len(load_index())}


@app.post("/ingest")
def ingest(payload: IngestRequest):
    pdf_path = Path(payload.file_path)
    if not pdf_path.is_absolute():
        pdf_path = ROOT / pdf_path
    if not pdf_path.exists():
        raise HTTPException(status_code=404, detail=f"PDF not found: {payload.file_path}")
    pages = extract_text_from_pdf(pdf_path)
    chunks = chunk_pages(pages)
    count = upsert_paper_chunks(payload.paper_id, payload.title, chunks)
    return {"paper_id": payload.paper_id, "chunks": count}


@app.post("/chat")
def chat(payload: ChatRequest):
    chunks = retrieve(payload.question)
    return generate_answer(payload.question, chunks)


@app.delete("/documents/{paper_id}")
def remove_document(paper_id: str):
    return {"paper_id": paper_id, "deleted_chunks": delete_paper(paper_id)}
