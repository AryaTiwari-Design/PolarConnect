from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database.init_db import initialize_database
from app.api.auth import router as auth_router
from app.api.polar_data import router as polar_data_router
from app.api.analysis import router as analysis_router
from app.api.education import router as education_router
from app.api.reports import router as reports_router

app = FastAPI(title="Polar Connect API", description="Backend API for the Polar Science Portal", version="1.0.0")

app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_credentials=False,
                   allow_methods=["*"], allow_headers=["*"])

@app.on_event("startup")
def startup():
    initialize_database()

@app.get("/", tags=["System"])
def home():
    return {"message": "Polar Connect Backend is running", "status": "success", "docs": "/docs"}

@app.get("/health", tags=["System"])
def health_check():
    return {"status": "healthy", "service": "Polar Connect API"}

app.include_router(auth_router)
app.include_router(polar_data_router)
app.include_router(analysis_router)
app.include_router(education_router)
app.include_router(reports_router)
