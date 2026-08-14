import sys
import os
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Load environment variables (.env from root and p3)
load_dotenv()
load_dotenv(os.path.join(os.path.dirname(__file__), "..", "..", ".env"))
load_dotenv(os.path.join(os.path.dirname(__file__), "..", "p3", ".env"))

# Ensure p3 and backend are importable
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))


from contextlib import asynccontextmanager

from p2.database import init_db
from p2.routes import auth, resume, progress
from p3.routes import ai

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: initialize SQLite database tables
    init_db()
    yield

app = FastAPI(
    title="SkillForge AI — Core Backend API",
    description="Production FastAPI core backend serving Auth, PDF Extraction, SQLite Storage & Progress Math.",
    version="1.0.0",
    lifespan=lifespan
)

# Configure CORS Middleware for Frontend React Client (Vite, Localhost & Vercel)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000"
    ],
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(auth.router)
app.include_router(resume.router)
app.include_router(progress.router)
app.include_router(ai.router)


@app.get("/")
def root():
    return {
        "message": "SkillForge AI Core Backend API is running!",
        "docs": "http://localhost:8000/docs",
        "status": "online"
    }


from sqlmodel import Session, select
from fastapi.responses import FileResponse, JSONResponse
from p2.database import engine, DB_PATH
from p2.models import User, SavedResume, RoadmapRecord


@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "database": "sqlite",
        "auth_engine": "jwt_bcrypt",
        "pdf_engine": "pdfplumber",
        "progress_engine": "active"
    }


@app.get("/api/admin/database", tags=["Admin DB Viewer"])
def view_live_database():
    """Inspect all rows and summary statistics in the live cloud SQLite database."""
    with Session(engine) as session:
        users = session.exec(select(User)).all()
        resumes = session.exec(select(SavedResume)).all()
        roadmaps = session.exec(select(RoadmapRecord)).all()

        return {
            "database_file": DB_PATH,
            "counts": {
                "users": len(users),
                "resumes": len(resumes),
                "roadmaps": len(roadmaps)
            },
            "users": [
                {
                    "id": u.id,
                    "name": u.name,
                    "email": u.email,
                    "created_at": u.created_at.isoformat() if u.created_at else None
                }
                for u in users
            ],
            "saved_resumes": [
                {
                    "id": r.id,
                    "user_id": r.user_id,
                    "updated_at": r.updated_at.isoformat() if r.updated_at else None,
                    "raw_text_preview": (r.raw_text[:120] + "...") if r.raw_text else ""
                }
                for r in resumes
            ],
            "roadmaps": [
                {
                    "id": rm.id,
                    "user_id": rm.user_id,
                    "target_role": rm.target_role,
                    "readiness_score": rm.readiness_score,
                    "updated_at": rm.updated_at.isoformat() if rm.updated_at else None
                }
                for rm in roadmaps
            ]
        }


@app.get("/api/admin/download-db", tags=["Admin DB Viewer"])
def download_live_database():
    """Download the raw live skillforge.db file to inspect locally in SQLite Viewer or DB Browser."""
    if os.path.exists(DB_PATH):
        return FileResponse(
            path=DB_PATH,
            filename="skillforge_live.db",
            media_type="application/octet-stream"
        )
    return JSONResponse(status_code=404, content={"detail": "Database file not found on server disk."})
