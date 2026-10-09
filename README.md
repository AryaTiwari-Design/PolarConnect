# PolarConnect

PolarConnect is an AI-powered polar science research, education and exploration platform. This branch contains a basic full-stack implementation covering frontend, backend, database bootstrap, RAG service and map/academy modules.

## What Is Implemented

- React + Vite frontend with login/register, dashboard, research repository, admin approval, AI chat, station map and Polar Academy.
- FastAPI backend with JWT auth, role checks, research workflows, chat history, station APIs, lessons, quizzes, XP and badges.
- Local SQLite bootstrap for quick demos plus MySQL-compatible `database/schema.sql` and `database/seed.sql`.
- RAG FastAPI service that ingests approved PDFs, chunks them, stores a local JSON index and returns cited answers from retrieved chunks.
- Docker Compose for running frontend, backend and RAG service together.

## Demo Accounts

These are created automatically by the backend on first startup:

| Role | Email | Password |
| --- | --- | --- |
| Admin | `admin@polarconnect.test` | `ChangeMe123` |
| Researcher | `researcher@polarconnect.test` | `ChangeMe123` |
| Student | `student@polarconnect.test` | `ChangeMe123` |

## Run Locally

### Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --port 5000
```

Backend API: `http://localhost:5000/api`

### RAG Service

Run from the repository root so the `ai` package and PDF paths resolve correctly.

```bash
pip install -r ai/requirements.txt
uvicorn ai.service.main:app --reload --port 8000
```

RAG health: `http://localhost:8000/health`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend: `http://localhost:5173`

### Docker

```bash
docker compose up --build
```

## Main API Routes

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/research`
- `POST /api/research`
- `GET /api/admin/research/pending`
- `POST /api/admin/research/{id}/approve`
- `POST /api/admin/research/{id}/reject`
- `POST /api/chat`
- `GET /api/chat/history`
- `GET /api/stations`
- `GET /api/education`
- `GET /api/quizzes/{id}`
- `POST /api/quizzes/{id}/submit`
- `GET /api/users/me/progress`

## Notes

- The local backend uses SQLite at `backend/polarconnect.db` for fast demos.
- The database folder contains MySQL DDL for handoff to the final database owner.
- The RAG service has a lexical fallback retrieval/generation path. It can be extended with ChromaDB and an LLM provider later without changing the backend API contract.
