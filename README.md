# PolarConnect RAG

PolarConnect RAG is the AI retrieval service for approved polar research PDFs. It ingests PDF documents, extracts page text, chunks the content, stores a local RAG index, retrieves relevant passages for a question, and returns student-friendly answers with source page citations.

## What Is Kept

- `ai/` contains the RAG service and PDF pipeline.
- `ai/rag_index.json` is the local RAG database/index.
- `ai/vector_store/` is reserved for vector storage upgrades.
- `research_docs/approved/` contains approved PDFs used by the RAG service.
- Original helper tests in `ai/test_*.py` are kept.

## Architecture

```text
Approved PDFs
    |
    v
PDF text extraction
    |
    v
Chunking by page
    |
    v
Local RAG index: ai/rag_index.json
    |
    v
Question retrieval
    |
    v
Student-friendly answer + citations
```

## Run The RAG Service

From the project root:

```powershell
cd "C:\Users\Pari Mishra\OneDrive\Desktop\PolarConnect\PolarConnect-1"
.\venv\Scripts\Activate.ps1
pip install -r ai\requirements.txt
python -m uvicorn ai.service.main:app --host 127.0.0.1 --port 8000
```

Health check:

```powershell
Invoke-RestMethod http://127.0.0.1:8000/health
```

API docs:

```text
http://127.0.0.1:8000/docs
```

## Ingest PDFs

Ingest one PDF:

```powershell
$body = @{
  paper_id = "Antarctic_factsheet"
  title = "Antarctic_factsheet"
  file_path = "research_docs/approved/Antarctic_factsheet.pdf"
} | ConvertTo-Json

Invoke-RestMethod -Uri http://127.0.0.1:8000/ingest -Method Post -ContentType "application/json" -Body $body
```

Ingest every approved PDF:

```powershell
Invoke-RestMethod -Uri http://127.0.0.1:8000/ingest/approved -Method Post
```

List indexed documents:

```powershell
Invoke-RestMethod http://127.0.0.1:8000/documents
```

Build or rebuild the ChromaDB vector index from the existing JSON RAG database:

```powershell
Invoke-RestMethod -Uri http://127.0.0.1:8000/vector/rebuild -Method Post
```

Ask a question:

```powershell
$body = @{ question = "Why do scientists study Antarctic ice?"; limit = 5 } | ConvertTo-Json
Invoke-RestMethod -Uri http://127.0.0.1:8000/chat -Method Post -ContentType "application/json" -Body $body
```

## Current RAG Level

This is now a professional hybrid RAG service:

- PDF extraction uses `pypdf`.
- Chunking is page-aware with overlap.
- ChromaDB stores semantic vector embeddings when `chromadb` and `sentence-transformers` are installed.
- Retrieval uses ChromaDB semantic search first.
- If ChromaDB dependencies are unavailable, retrieval safely falls back to lexical scoring with document-frequency weighting.
- Answers are formatted for students and include source pages.

Future production upgrade:

- Add an LLM provider for stronger final answer synthesis while preserving citations.
- Add admin approval metadata and richer document metadata filters.
