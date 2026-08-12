# 🚀 SkillForge AI — Person 2 Core Backend Handoff Guide

> **To**: Frontend Lead (Person 1), AI Specialist (Person 3), Roadmap Lead (Person 4)  
> **From**: Person 2 (Core Backend & DB Lead)  
> **Backend Base URL**: `http://localhost:8000`  
> **Interactive Swagger API Docs**: `http://localhost:8000/docs`  

---

## 📁 1. Strict File Ownership & Folder Structure (Person 2 Scope)

```
skillforge-ai/
└── backend/                                   # CORE BACKEND (Person 2 Scope)
    ├── main.py                                # FastAPI App Server & CORS Middleware
    ├── database.py                            # SQLite engine (`skillforge.db`) & Session manager
    ├── models.py                              # SQLModel ORM Tables (User, SavedResume, RoadmapRecord)
    ├── schemas.py                             # Pydantic v2 Unified Schemas (Auth, Resume, Intelligence)
    ├── view_db.py                             # CLI Database viewer tool
    ├── requirements.txt                       # Backend Python dependencies
    ├── routes/
    │   ├── auth.py                            # /api/auth/register, /login, /me
    │   ├── resume.py                          # /api/resume/parse, /me
    │   └── progress.py                        # /api/progress/update, /save-roadmap, /me
    ├── services/
    │   ├── auth_service.py                    # Direct bcrypt hashing & 7-day JWT Bearer tokens
    │   ├── pdf_parser.py                      # Multi-column pdfplumber text extraction
    │   └── progress_math.py                   # Placement Readiness Score recalculation algorithm
    └── data/
        └── role_benchmarks.json               # Skill benchmark expectations for target roles
```

---

## 🛠️ 2. Summary of Person 2 Work Completed

1. **SQLite Database Architecture (`skillforge.db`)**:
   - `User` Table: Primary ID, Name, Email (Unique Index), `bcrypt` Hashed Password, Timestamp.
   - `SavedResume` Table: Primary ID, User ID (Foreign Key), Raw extracted PDF text, `StructuredResumeProfile` JSON.
   - `RoadmapRecord` Table: Primary ID, User ID (Foreign Key), Target Role, Placement Readiness Score %, `FullCareerIntelligencePackage` JSON.

2. **Security & Authentication Engine**:
   - Password hashing with direct native `bcrypt` (Python 3.13 compatible).
   - 7-day expiration JWT Bearer Token generation & validation dependencies.

3. **PDF Resume Ingestion & Parsing**:
   - Layout-preserving multi-column PDF text extraction via `pdfplumber` with `pypdf` fallback.
   - Normalizes raw text into structured skills, tools, education, and project lists.

4. **Placement Readiness Score Engine**:
   - Dynamic math formula:
     $$\text{Readiness Score} = \min\left(100, \text{Base Score } (55) + \left(\frac{\text{Completed Milestones}}{\text{Total Milestones}} \times 30\right) + \text{Skill Bonus}\right)$$

---

## 📡 3. Person 2 REST API Endpoints Specification

### 🔑 Authentication API (`/api/auth`)
* `POST /api/auth/register` (Registers user in SQLite, returns JWT token)
* `POST /api/auth/login` (Authenticates user, returns JWT token)
* `GET /api/auth/me` (Validates JWT Bearer token, returns user profile)

### 📄 Resume PDF Extraction API (`/api/resume`)
* `POST /api/resume/parse` (Parses uploaded PDF resume into structured JSON profile)
* `GET /api/resume/me` (Fetches user's saved resume from SQLite)

### 🧠 Progress Recalculation & Persistence API (`/api/progress`)
* `POST /api/progress/update` (Toggles milestone completion, recalculates Readiness Score server-side)
* `POST /api/progress/save-roadmap` (Persists full career package into SQLite)
* `GET /api/progress/me` (Retrieves saved user roadmap)

---

## ⚡ 4. How to Launch Core Backend Locally

```powershell
python -m uvicorn backend.main:app --reload --port 8000
```
Open **`http://localhost:8000/docs`** to verify API health and test endpoints!
