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
│  Node.js / Express   │   ← the ONLY service the browser talks to
│      (Backend)       │
└──────┬────────┬──────┘
       │        │
       ▼        ▼
┌────────────┐ ┌────────────────────────┐
│ PostgreSQL │ │ Python RAG (FastAPI)   │
│            │ │  ├─ PDF parsing        │
│ users      │ │  ├─ Chunking           │
│ papers     │ │  ├─ Embeddings         │
│ stations   │ │  ├─ ChromaDB (vectors) │
│ quizzes    │ │  └─ LLM API            │
│ progress   │ └────────────────────────┘
└────────────┘
```

**Why this shape**

- The browser never calls the AI service directly, so Express checks login and role first and API keys stay on the server.
- The AI service knows nothing about users. It only handles "ingest this paper" and "answer this question".
- Each team member can build and test their part independently against the API contract.

---

## 🧰 Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React (Vite), React Router, Context API, Tailwind CSS |
| **Map** | Leaflet + react-leaflet |
| **Backend** | Python + FasApi|
| **Database** | MySQL |
| **AI service** |RAG |
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
├── backend/                  Express API
│   └── src/
│       ├── config/           DB connection, env
│       ├── routes/
│       ├── controllers/
│       ├── middleware/       JWT auth, role check, file upload, error handler
│       ├── services/         aiClient.js (only file that calls the AI service)
│       ├── app.js
│       └── server.js
│
├── database/                 PostgreSQL schema and seed data
│   ├── schema.sql
│   ├── seed.sql
│   └── README.md
│
├── ai-service/               Python RAG service
│   ├── main.py               FastAPI: /ingest, /chat, /health
│   ├── ingestion.py          PDF → chunks → embeddings
│   ├── retrieval.py          vector search
│   ├── generation.py         prompt + answer with sources
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

- [Docker](https://www.docker.com/) and docker-compose (recommended)
- Or, for running services manually: Node.js 18+, Python 3.10+, PostgreSQL 14+
- An API key for the LLM provider used by the AI service

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
| Backend API | http://localhost:5000/api |
| AI service (internal) | http://localhost:8000 |
| PostgreSQL | localhost:5432 |

The database schema and demo data (`schema.sql`, `seed.sql`) load automatically the first time the Postgres container starts.

### Option 2: Run each service manually

**Database**
```bash
createdb polarconnect
psql -d polarconnect -f database/schema.sql
psql -d polarconnect -f database/seed.sql
```

**Backend**
```bash
cd backend
npm install
npm run dev          # http://localhost:5000
```

**AI service**
```bash
cd ai-service
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

**Frontend**
```bash
cd frontend
npm install
npm run dev          # http://localhost:5173
```

### Demo accounts

Seeded by `database/seed.sql`. Change these before any real deployment.

| Role | Email | Password |
|---|---|---|
| Admin | `admin@polarconnect.test` | `ChangeMe123` |
| Researcher | `researcher@polarconnect.test` | `ChangeMe123` |
| Student | `student@polarconnect.test` | `ChangeMe123` |

---

## 🔑 Environment Variables

Copy `.env.example` to `.env`. Never commit `.env`.

```env
# Backend
PORT=5000
JWT_SECRET=change_this_secret
JWT_EXPIRES_IN=1d
UPLOAD_DIR=./uploads
AI_SERVICE_URL=http://ai-service:8000

# Database
DB_HOST=postgres
DB_PORT=5432
DB_NAME=polarconnect
DB_USER=postgres
DB_PASSWORD=change_this_password

# AI service
LLM_API_KEY=your_llm_api_key
EMBEDDING_MODEL=all-MiniLM-L6-v2
CHROMA_PATH=./chroma_db

# Frontend
VITE_API_URL=http://localhost:5000/api
```

---

## 📡 API Overview

All requests go to the Express backend. Protected routes need the header `Authorization: Bearer <token>`. Errors always use the format `{ "error": "message" }`.

Full request and response examples are in [`docs/api-contract.md`](docs/api-contract.md).

| Group | Endpoints | Access |
|---|---|---|
| **Auth** | `POST /api/auth/register` · `POST /api/auth/login` · `POST /api/auth/logout` · `GET /api/auth/me` | Public / logged in |
| **Research** | `GET /api/research` · `GET /api/research/:id` · `POST /api/research` · `GET /api/research/:id/download` | Logged in (upload: researcher) |
| **Admin approval** | `GET /api/admin/research/pending` · `POST /api/admin/research/:id/approve` · `POST /api/admin/research/:id/reject` | Admin |
| **AI chat** | `POST /api/chat` · `GET /api/chat/history` | Logged in |
| **Map** | `GET /api/stations` · `GET /api/stations/:id` | Logged in |
| **Education** | `GET /api/education` · `GET /api/education/:id` · `GET /api/quizzes/:id` · `POST /api/quizzes/:id/submit` | Logged in |
| **Progress** | `GET /api/users/me/progress` · `GET /api/users/me/xp` · `GET /api/users/me/badges` | Logged in |
| **System** | `GET /api/health` | Public |

**Internal AI service (called only by the backend)**

| Endpoint | Purpose |
|---|---|
| `POST /ingest` | Chunk, embed and store an approved paper |
| `POST /chat` | Retrieve relevant chunks and return `{ answer, sources: [{ paper_id, title, page }] }` |
| `DELETE /documents/:paper_id` | Remove a paper from the index |
| `GET /health` | Service check |

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
Backend calls AI service /ingest
        │
        ▼
PDF → chunks → embeddings → ChromaDB   (status: APPROVED)
        │
        ▼
User asks a question in chat
        │
        ▼
Backend forwards to AI service /chat
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
| **Pari** | 🤖 AI + RAG | `ai-service/` |
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