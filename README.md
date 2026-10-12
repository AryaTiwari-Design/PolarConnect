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
# Polar Connect Backend

Beginner-friendly FastAPI backend starter for the Polar Science Portal.

## Setup (Windows PowerShell)
Open this folder in VS Code, then run these commands in the terminal:

```powershell
py -m venv venv
.\venv\Scripts\python.exe -m pip install --upgrade pip
.\venv\Scripts\python.exe -m pip install -r requirements.txt
.\venv\Scripts\python.exe -m uvicorn app.main:app --reload
```

If `py` is not recognized, use `python -m venv venv` instead.

Open http://127.0.0.1:8000/docs and http://127.0.0.1:8000/health.

## API features
- Register/login and protected current-user endpoint
- Polar data list/detail/create
- NASA POWER daily data import (requires internet and login)
- Temperature trend, simple regression prediction, Z-score anomalies, insights
- Education resources and research-station reference locations
- PDF report generation
- SQLite database created automatically for local development

## Test authentication
1. In `/docs`, use `POST /api/auth/register` with:
   `{"name":"Demo User","email":"demo@example.com","password":"DemoPass123!"}`
2. Use `POST /api/auth/login` with the same email/password.
3. Copy `access_token`, click **Authorize**, and enter `Bearer YOUR_TOKEN` (or just the token if the dialog adds Bearer automatically).
4. Test `GET /api/users/me` and `POST /api/polar-data/fetch-nasa`.

## Important data note
The first run inserts clearly labelled illustrative demo records so endpoints work offline. They are not verified scientific observations. NASA POWER import retrieves data from the public NASA POWER API. The station records are reference/demo locations and should be verified before scientific use.

This is a working MVP starter, not production-hardened software. Before deployment, change the secret key, restrict CORS, add rate limiting, and review authentication/security.
# 🧊 PolarConnect

**An AI-assisted Polar Science Knowledge, Education and Outreach Portal**

> Smart India Hackathon · Problem Statement **26063** · Ministry of Earth Sciences (MoES) · National Centre for Polar and Ocean Research (NCPOR) · Theme: Smart Education

PolarConnect is a single web platform where polar research is stored, approved, searched, explained and taught. Scientists upload reports, administrators verify them, and students, teachers and the public can explore verified knowledge through search, an AI assistant that cites its sources, an interactive Antarctica map and a gamified learning academy.

<!-- Add a screenshot or GIF of the demo here -->
<!-- ![PolarConnect demo](docs/screenshots/home.png) -->

---

## 📌 Table of Contents

1. [The Problem](#-the-problem)
2. [Our Solution](#-our-solution)
3. [Key Features](#-key-features)
4. [System Architecture](#-system-architecture)
5. [Tech Stack](#-tech-stack)
6. [Project Structure](#-project-structure)
7. [Getting Started](#-getting-started)
8. [Environment Variables](#-environment-variables)
9. [API Overview](#-api-overview)
10. [User Roles](#-user-roles)
11. [Core Workflow](#-core-workflow)
12. [Team](#-team)
13. [Git Workflow](#-git-workflow)
14. [Roadmap](#-roadmap)
15. [Demo](#-demo)

---

## 🎯 The Problem

Scientists collect valuable information from polar expeditions: research reports, datasets, photographs, videos and educational material. This information is scattered, hard to search, and slow to turn into content that students and the public can use.

The challenge is to build **one digital platform** that stores this information, makes it accessible, and helps disseminate it to students, researchers and the general public.

## 💡 Our Solution

PolarConnect provides:

- A **central repository** for polar research with an approval workflow
- **Smart search** with filters
- An **AI science assistant** that answers only from approved documents and links to the original sources
- An **interactive research-station map**
- **Polar Academy**, with lessons, quizzes, XP and badges
- **Role-based access** for students, researchers and administrators

---

## ✨ Key Features

| Feature | Description |
|---|---|
| 📚 **Knowledge Repository** | Upload, categorise and store research PDFs with metadata (title, year, expedition, topic) |
| 🔍 **Smart Search** | Keyword search with filters by year, category and station |
| ✅ **Approval Workflow** | Researchers submit, admins approve or reject. Only approved papers are visible and used by the AI |
| 🤖 **AI Science Assistant (RAG)** | Ask questions in plain language, get answers grounded in approved papers with paper and page citations |
| 🗺️ **Interactive Map** | Antarctica research stations shown on a map, with details and related research |
| 🎓 **Polar Academy** | Lessons, multiple-choice quizzes, XP, levels and badges |
| 🔐 **Role-Based Access** | Separate access for students, researchers and admins using JWT authentication |
| 📊 **Dashboard** | Personalised view of recent papers, progress and activity |

---

## 🏗️ System Architecture

```
┌──────────────────────┐
│   React (Frontend)   │
└──────────┬───────────┘
           │  HTTP / JSON
           ▼
┌──────────────────────┐
│ Python FastAPI       │
│ Backend API          │
└──────┬────────┬──────┘
       │        │
       ▼        ▼
┌────────────┐ ┌────────────────────────┐
│ SQLite     │ │ RAG / AI modules       │
│ local data │ │  ├─ PDF parsing        │
│ users      │ │  ├─ Chunking           │
│ stations   │ │  ├─ Retrieval          │
│ education  │ │  └─ ChromaDB-ready     │
└────────────┘ └────────────────────────┘
```

**Why this shape**

- The browser calls the FastAPI backend through `/api/...` endpoints.
- SQLite is used for the local MVP so the backend can run without a separate database server.
- The RAG files under `ai/` can be run or expanded separately from the core app.

---

## 🧰 Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React (Vite), React Router, Context API, Tailwind CSS |
| **Map** | Leaflet + react-leaflet |
| **Backend** | Python + FastAPI |
| **Database** | SQLite for local MVP |
| **AI service** | RAG modules with ChromaDB-ready vector storage |
| **DevOps** | Docker, docker-compose, Git and GitHub |

---

## 📁 Project Structure

```
PolarConnect/
├── README.md
├── .gitignore
├── .env.example
├── docker-compose.yml
│
├── docs/                     API contract, architecture diagram, workflow notes
│   ├── api-contract.md
│   ├── architecture.png
│   └── workflow.md
│
├── frontend/                 React app (Vite)
│   └── src/
│       ├── components/       shared UI (navbar, layout, chat, research cards)
│       ├── pages/            Home, Login, Register, Dashboard, Research, Search, Chat, Admin
│       ├── services/         API calls to the backend
│       ├── hooks/
│       ├── context/          auth context
│       ├── utils/
│       └── modules/
│           ├── map/          interactive Antarctica map
│           └── education/    Polar Academy (lessons, quizzes, XP, badges)
│
├── app/                      FastAPI backend
│   ├── main.py               app entry point
│   ├── api/                  auth, polar data, analysis, education, reports
│   ├── database/             SQLite connection and initialization
│   ├── services/             security helpers
│   └── schemas.py            request models
│
├── backend/                  placeholder package from an older/backend split
│
├── database/                 SQL schema and seed references
│   ├── schema.sql
│   ├── seed.sql
│   └── README.md
│
├── ai/                       Python RAG modules and service package
│   ├── service/              service-oriented RAG modules
│   ├── rag_index.json        local RAG index
│   ├── vector_store/         vector store data
│   └── requirements.txt
│
├── data/
│   ├── sample-papers/        open-access Antarctic PDFs used for the demo
│   ├── stations.json
│   └── quizzes.json
│
├── tests/                    API smoke tests
└── demo/                     presentation, demo script, backup recording
```

---

## 🚀 Getting Started

### Prerequisites

- [Docker](https://www.docker.com/) and docker-compose (optional)
- Or, for running services manually: Node.js 18+ and Python 3.10+

### Option 1: Run everything with Docker (recommended)

```bash
# 1. Clone the repository
git clone https://github.com/<your-org>/PolarConnect.git
cd PolarConnect

# 2. Create your environment file and fill in the values
cp .env.example .env

# 3. Start all services
docker-compose up --build
```

| Service | URL |
|---|---|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:8000/api |
| API docs | http://localhost:8000/docs |

The FastAPI backend initializes the local SQLite database on startup.

### Option 2: Run each service manually

**Backend**
```bash
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

**Frontend**
```bash
cd frontend
npm install
npm run dev          # http://localhost:5173
```

### Demo accounts

Create a demo user through `POST /api/auth/register` or the app registration screen.

---

## 🔑 Environment Variables

Copy `.env.example` to `.env`. Never commit `.env`.

```env
# Backend
POLAR_SECRET_KEY=change_this_secret
DATABASE_PATH=data/polar_connect.db

# Frontend
VITE_API_URL=http://localhost:8000/api
VITE_USE_MOCK=true
```

---

## 📡 API Overview

All requests go to the FastAPI backend. Protected routes need the header `Authorization: Bearer <token>`. FastAPI validation and API errors use the standard `detail` field.

| Group | Endpoints | Access |
|---|---|---|
| **Auth** | `POST /api/auth/register` · `POST /api/auth/login` · `GET /api/users/me` | Public / logged in |
| **Polar data** | `GET /api/polar-data` · `GET /api/polar-data/{id}` · `POST /api/polar-data` · `POST /api/polar-data/fetch-nasa` | Public / logged in for writes |
| **Analysis** | `GET /api/analysis/trend` · `GET /api/analysis/prediction` · `GET /api/analysis/anomalies` · `GET /api/analysis/insights` | Public |
| **Education** | `GET /api/education/resources` · `GET /api/research-stations` | Public |
| **Reports** | `GET /api/reports/summary.pdf` | Public |
| **System** | `GET /` · `GET /health` | Public |

**Design rules**

- Quiz answers are never sent to the client. Scoring, XP and badges are awarded by the server inside `POST /api/quizzes/:id/submit`.
- Only approved papers are visible to users and only approved papers reach the AI index.

---

## 👥 User Roles

| Role | What they can do |
|---|---|
| **Student / Public** | Browse approved research, search, use the AI assistant, take lessons and quizzes, earn XP and badges, explore the map |
| **Researcher** | Everything above, plus upload papers and track approval status |
| **Admin** | Everything above, plus review, approve or reject uploads |

---

## 🔄 Core Workflow

```
Researcher uploads PDF
        │
        ▼
Backend saves file + metadata  →  status: PENDING
        │
        ▼
Admin reviews  ──── reject ────►  status: REJECTED
        │
     approve
        │
        ▼
Backend/RAG pipeline indexes approved content
        │
        ▼
PDF → chunks → embeddings → ChromaDB   (status: APPROVED)
        │
        ▼
User asks a question in chat
        │
        ▼
Backend/RAG pipeline retrieves relevant content
        │
        ▼
Relevant chunks retrieved → LLM answers using only those chunks
        │
        ▼
Answer + clickable sources (paper, page) shown to the user
```

If the approved papers do not cover a question, the assistant says so instead of guessing.

---

## 🧑‍💻 Team

| Member | Role | Owns |
|---|---|---|
| **Pari** | 🤖 AI + RAG | `ai/` |
| **Arya** | 🔗 Integration + Presentation (Team Lead) | Root files, `docs/`, `tests/`, `demo/`, `.github/` |
| **Ashish** | ⚙️ Backend | `backend/` |
| **Harsh** | 🗄️ Database + Repository | `database/`, `data/sample-papers/` |
| **Jai** | 🎨 Website / UI | `frontend/` (except `src/modules/`) |
| **Shiva** | 🗺️ Map + Education | `frontend/src/modules/`, `data/stations.json`, `data/quizzes.json` |

> **Rule:** commit only inside your own folders. Anything else goes through the owner or a pull request.

---

## 🌿 Git Workflow

- `main` is protected. Nobody pushes to it directly.
- Create a branch for every task: `<name>/<feature>`, for example `jai/login-page` or `ashish/auth-api`.
- Open a pull request, get at least one review, then merge.
- Use clear commit messages: `feat: add station markers`, `fix: quiz score bug`, `docs: update api contract`.
- If you add an environment variable, add it to `.env.example` in the same PR.
- Never commit `.env`, `node_modules/`, `uploads/`, `chroma_db/` or `__pycache__/`.

---

## 🗺️ Roadmap

**Phase 1: Core demo (must work end to end)**
- [ ] Register, login and role-based access
- [ ] Research upload, list, search and download
- [ ] Admin approval and rejection
- [ ] AI ingestion of approved papers
- [ ] AI chat with cited sources

**Phase 2: Engagement features**
- [ ] Interactive Antarctica map with station details
- [ ] Polar Academy: lessons and quizzes
- [ ] XP, levels and badges
- [ ] Dashboard

**Phase 3: Future scope (aligned with the problem statement)**
- [ ] Image, video and dataset uploads in the repository
- [ ] AI content generation: draft articles, photo captions and social posts, with human review before publishing
- [ ] AI summaries of long reports in simple language
- [ ] Semantic search
- [ ] Multilingual content (English and Hindi)
- [ ] Low-bandwidth mode with compressed images and downloadable material
- [ ] Audit logs and publication history for admin actions
- [ ] Certificates for completed lessons
- [ ] Admin user management and content management screens

---

## 🎬 Demo

The demo follows this path:

1. Log in as a researcher and upload a paper
2. Log in as an admin and approve it
3. Ask the AI assistant a question and open the cited source
4. Explore the station map
5. Complete a lesson and quiz in Polar Academy and earn XP and a badge

Materials are in [`demo/`](demo/): presentation, click-by-click script and a backup recording.

---

## 📄 License

This project was built for the Smart India Hackathon. Add a license here if you plan to open-source it.

## 🙏 Acknowledgements

- Ministry of Earth Sciences (MoES) and the National Centre for Polar and Ocean Research (NCPOR) for the problem statement
- Open-access polar research publications used as demo data
- Smart India Hackathon
