from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.database import init_db
from backend.routes import auth, resume, progress

app = FastAPI(
    title="SkillForge AI — Core Backend API",
    description="Production FastAPI core backend serving Auth, PDF Extraction, SQLite Storage & Progress Math.",
    version="1.0.0"
)

# Configure CORS Middleware for Frontend React Client (Port 5173 / Vite)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "*"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Startup event to initialize SQLite tables automatically
@app.on_event("startup")
def on_startup():
    init_db()

# Include Routers for Person 2 Core Backend Scope
app.include_router(auth.router)
app.include_router(resume.router)
app.include_router(progress.router)


@app.get("/")
def root():
    return {
        "message": "SkillForge AI Core Backend API is running!",
        "docs": "http://localhost:8000/docs",
        "status": "online"
    }


@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "database": "sqlite",
        "auth_engine": "jwt_bcrypt",
        "pdf_engine": "pdfplumber",
        "progress_engine": "active"
    }
