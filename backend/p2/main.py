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


@app.api_route("/", methods=["GET", "HEAD"])
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


@app.api_route("/api/health", methods=["GET", "HEAD"])
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


from fastapi.responses import FileResponse, JSONResponse, HTMLResponse


@app.get("/admin", response_class=HTMLResponse, tags=["Admin DB Viewer"])
def admin_html_dashboard():
    """Visual HTML Dashboard to inspect live SQLite database tables with real-time UI."""
    return """
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>SkillForge AI — Live Database Dashboard</title>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
        <style>
            * { box-sizing: border-box; margin: 0; padding: 0; }
            body { background: #0B0F19; color: #E2E8F0; font-family: 'Inter', sans-serif; padding: 24px; }
            .container { max-width: 1200px; margin: 0 auto; }
            header { display: flex; justify-content: space-between; align-items: center; padding-bottom: 24px; border-bottom: 1px solid #1E293B; margin-bottom: 24px; }
            h1 { font-size: 24px; font-weight: 700; color: #38BDF8; display: flex; align-items: center; gap: 10px; }
            .badge { background: #064E3B; color: #34D399; font-size: 12px; font-weight: 600; padding: 4px 10px; border-radius: 9999px; border: 1px solid #059669; }
            .btn { background: #2563EB; color: #FFF; padding: 8px 16px; border-radius: 8px; text-decoration: none; font-size: 14px; font-weight: 500; display: inline-flex; align-items: center; gap: 6px; cursor: pointer; border: none; transition: 0.2s; }
            .btn:hover { background: #1D4ED8; }
            .btn-secondary { background: #1E293B; border: 1px solid #334155; color: #94A3B8; }
            .btn-secondary:hover { background: #334155; color: #FFF; }
            .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px; margin-bottom: 28px; }
            .stat-card { background: #111827; border: 1px solid #1F2937; padding: 20px; border-radius: 12px; }
            .stat-label { font-size: 13px; color: #9CA3AF; text-transform: uppercase; font-weight: 600; }
            .stat-val { font-size: 28px; font-weight: 700; color: #F9FAFB; margin-top: 4px; }
            .section { background: #111827; border: 1px solid #1F2937; border-radius: 12px; padding: 20px; margin-bottom: 24px; }
            .section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
            .section-title { font-size: 18px; font-weight: 600; color: #F3F4F6; }
            table { width: 100%; border-collapse: collapse; text-align: left; font-size: 14px; }
            th { background: #1F2937; color: #9CA3AF; padding: 12px; font-weight: 600; border-bottom: 1px solid #374151; }
            td { padding: 12px; border-bottom: 1px solid #1F2937; color: #D1D5DB; }
            tr:hover td { background: #1A2234; }
            .mono { font-family: 'JetBrains Mono', monospace; font-size: 13px; }
            .empty { color: #6B7280; font-style: italic; padding: 20px; text-align: center; }
            .pill { background: #1E3A8A; color: #60A5FA; padding: 2px 8px; border-radius: 6px; font-size: 12px; }
        </style>
    </head>
    <body>
        <div class="container">
            <header>
                <div>
                    <h1>SkillForge AI — Cloud Database Viewer</h1>
                    <p style="color: #94A3B8; font-size: 13px; margin-top: 4px;">Live Production SQLite Database &bull; Auto-refreshes every 10s</p>
                </div>
                <div style="display: flex; gap: 10px;">
                    <button class="btn btn-secondary" onclick="loadData()">🔄 Refresh Now</button>
                    <a class="btn" href="/api/admin/download-db">⬇️ Download .db File</a>
                </div>
            </header>

            <div class="stats-grid">
                <div class="stat-card"><div class="stat-label">Total Users</div><div class="stat-val" id="cnt-users">0</div></div>
                <div class="stat-card"><div class="stat-label">Saved Resumes</div><div class="stat-val" id="cnt-resumes">0</div></div>
                <div class="stat-card"><div class="stat-label">Roadmaps Generated</div><div class="stat-val" id="cnt-roadmaps">0</div></div>
                <div class="stat-card"><div class="stat-label">Database Status</div><div class="stat-val" style="color: #34D399; font-size: 18px; margin-top: 10px;">🟢 Online</div></div>
            </div>

            <!-- USERS TABLE -->
            <div class="section">
                <div class="section-header">
                    <div class="section-title">👥 Registered Users (user table)</div>
                </div>
                <div id="users-container">Loading...</div>
            </div>

            <!-- ROADMAPS TABLE -->
            <div class="section">
                <div class="section-header">
                    <div class="section-title">🗺️ Roadmap & Readiness Records (roadmap_record table)</div>
                </div>
                <div id="roadmaps-container">Loading...</div>
            </div>

            <!-- RESUMES TABLE -->
            <div class="section">
                <div class="section-header">
                    <div class="section-title">📄 Saved Resumes (saved_resume table)</div>
                </div>
                <div id="resumes-container">Loading...</div>
            </div>
        </div>

        <script>
            async function loadData() {
                try {
                    const res = await fetch('/api/admin/database');
                    const data = await res.json();

                    document.getElementById('cnt-users').innerText = data.counts.users;
                    document.getElementById('cnt-resumes').innerText = data.counts.resumes;
                    document.getElementById('cnt-roadmaps').innerText = data.counts.roadmaps;

                    // Render Users
                    if (data.users.length === 0) {
                        document.getElementById('users-container').innerHTML = '<div class="empty">No users registered yet. Register an account on your frontend to see it here!</div>';
                    } else {
                        let html = '<table><thead><tr><th>ID</th><th>Name</th><th>Email</th><th>Created At (UTC)</th></tr></thead><tbody>';
                        data.users.forEach(u => {
                            html += `<tr><td class="mono">#${u.id}</td><td><strong>${u.name}</strong></td><td class="mono">${u.email}</td><td>${u.created_at || 'N/A'}</td></tr>`;
                        });
                        html += '</tbody></table>';
                        document.getElementById('users-container').innerHTML = html;
                    }

                    // Render Roadmaps
                    if (data.roadmaps.length === 0) {
                        document.getElementById('roadmaps-container').innerHTML = '<div class="empty">No roadmap records generated yet. Run resume analysis on frontend to see it here!</div>';
                    } else {
                        let html = '<table><thead><tr><th>ID</th><th>User ID</th><th>Target Role</th><th>Readiness Score</th><th>Last Updated</th></tr></thead><tbody>';
                        data.roadmaps.forEach(r => {
                            html += `<tr><td class="mono">#${r.id}</td><td class="mono">User #${r.user_id}</td><td><span class="pill">${r.target_role}</span></td><td><strong>${r.readiness_score}%</strong></td><td>${r.updated_at || 'N/A'}</td></tr>`;
                        });
                        html += '</tbody></table>';
                        document.getElementById('roadmaps-container').innerHTML = html;
                    }

                    // Render Resumes
                    if (data.saved_resumes.length === 0) {
                        document.getElementById('resumes-container').innerHTML = '<div class="empty">No saved resumes found.</div>';
                    } else {
                        let html = '<table><thead><tr><th>ID</th><th>User ID</th><th>Resume Raw Text Preview</th><th>Updated At</th></tr></thead><tbody>';
                        data.saved_resumes.forEach(r => {
                            html += `<tr><td class="mono">#${r.id}</td><td class="mono">User #${r.user_id}</td><td style="color:#9CA3AF; font-size:12px;">${r.raw_text_preview || 'N/A'}</td><td>${r.updated_at || 'N/A'}</td></tr>`;
                        });
                        html += '</tbody></table>';
                        document.getElementById('resumes-container').innerHTML = html;
                    }
                } catch(e) {
                    console.error("Error loading database overview:", e);
                }
            }

            loadData();
            setInterval(loadData, 10000);
        </script>
    </body>
    </html>
    """


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
