from pathlib import Path

from fastapi import FastAPI, HTTPException

from ai.chunking import chunk_pages
from ai.extraction import extract_text_from_pdf

from .config import DEFAULT_APPROVED_DOCS_DIR, DEFAULT_CHUNK_OVERLAP, DEFAULT_CHUNK_SIZE, ROOT_DIR
from .generation import generate_answer
from .retrieval import retrieve
from .schemas import ChatRequest, ChatResponse, DocumentSummary, IngestRequest
from .store import delete_paper, load_index, summarize_documents, upsert_paper_chunks
from .vector_store import VectorStoreUnavailable, count_vectors, has_vector_index, is_vector_store_available, rebuild_vectors

app = FastAPI(
    title="PolarConnect RAG Service",
    description="PDF ingestion, retrieval, and source-grounded student answers for PolarConnect.",
    version="0.2.0",
)


@app.get("/")
def root():
    documents = summarize_documents()
    return {
        "message": "PolarConnect RAG Service is running",
        "status": "ok",
        "documents": len(documents),
        "chunks": len(load_index()),
        "open_api_docs": "/docs",
        "health_check": "/health",
        "documents_api": "/documents",
        "chat_api": {
            "method": "POST",
            "path": "/chat",
            "example_body": {
                "question": "Why is Antarctica important for climate change research?",
                "limit": 5,
            },
        },
    }


@app.get("/health")
def health():
    documents = summarize_documents()
    vector_store_installed = is_vector_store_available()
    vector_index_ready = has_vector_index()
    vector_store = "chroma" if vector_store_installed and vector_index_ready else "lexical_fallback"
    vector_chunks = 0
    if vector_store_installed and vector_index_ready:
        try:
            vector_chunks = count_vectors()
        except VectorStoreUnavailable:
            vector_store = "lexical_fallback"
            vector_index_ready = False
    return {
        "status": "ok",
        "service": "rag",
        "documents": len(documents),
        "chunks": len(load_index()),
        "vector_store": vector_store,
        "chroma_installed": vector_store_installed,
        "vector_index_ready": vector_index_ready,
        "vector_chunks": vector_chunks,
    }


@app.get("/documents", response_model=list[DocumentSummary])
def documents():
    return summarize_documents()


@app.post("/ingest")
def ingest(payload: IngestRequest):
    pdf_path = Path(payload.file_path)
    if not pdf_path.is_absolute():
        pdf_path = ROOT_DIR / pdf_path
    if not pdf_path.exists():
        raise HTTPException(status_code=404, detail=f"PDF not found: {payload.file_path}")
    pages = extract_text_from_pdf(pdf_path)
    chunks = chunk_pages(pages, chunk_size=DEFAULT_CHUNK_SIZE, overlap=DEFAULT_CHUNK_OVERLAP)
    count = upsert_paper_chunks(payload.paper_id, payload.title, chunks)
    return {"paper_id": payload.paper_id, "chunks": count}


@app.post("/ingest/approved")
def ingest_all_approved():
    if not DEFAULT_APPROVED_DOCS_DIR.exists():
        raise HTTPException(status_code=404, detail=f"Approved PDF folder not found: {DEFAULT_APPROVED_DOCS_DIR}")
    results = []
    for pdf_path in sorted(DEFAULT_APPROVED_DOCS_DIR.glob("*.pdf")):
        pages = extract_text_from_pdf(pdf_path)
        chunks = chunk_pages(pages, chunk_size=DEFAULT_CHUNK_SIZE, overlap=DEFAULT_CHUNK_OVERLAP)
        count = upsert_paper_chunks(pdf_path.stem, pdf_path.stem, chunks)
        results.append({"paper_id": pdf_path.stem, "title": pdf_path.stem, "chunks": count})
    return {"documents": len(results), "results": results}


@app.post("/vector/rebuild")
def rebuild_vector_index():
    chunks = load_index()
    try:
        count = rebuild_vectors(chunks)
    except VectorStoreUnavailable as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc
    return {"vector_store": "chroma", "vector_chunks": count}


@app.post("/chat", response_model=ChatResponse)
def chat(payload: ChatRequest):
    chunks = retrieve(payload.question, limit=payload.limit)
    return generate_answer(payload.question, chunks)


@app.delete("/documents/{paper_id}")
def remove_document(paper_id: str):
    return {"paper_id": paper_id, "deleted_chunks": delete_paper(paper_id)}
