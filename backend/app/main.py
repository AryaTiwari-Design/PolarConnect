from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .database import init_db
from .routes import auth, chat, education, map, research

app = FastAPI(title="PolarConnect API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api")
app.include_router(research.router, prefix="/api")
app.include_router(research.admin_router, prefix="/api")
app.include_router(chat.router, prefix="/api")
app.include_router(map.router, prefix="/api")
app.include_router(education.router, prefix="/api")


@app.on_event("startup")
def startup():
    init_db()


@app.get("/api/health")
def health():
    return {"status": "ok", "service": "backend"}
