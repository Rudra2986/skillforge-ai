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


from p2.database import init_db
from p2.routes import auth, resume, progress
from p3.routes import ai

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


@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "database": "sqlite",
        "auth_engine": "jwt_bcrypt",
        "pdf_engine": "pdfplumber",
        "progress_engine": "active"
    }
