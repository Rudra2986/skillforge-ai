# ⚡ SkillForge AI — Person 2 (Core Backend & DB Lead) Phased Integration Plan

This plan breaks down backend execution into **Phase 1 (Immediate Frontend Integration)** and **Phase 2 (AI Engine & Roadmap Integration)**.

---

## 🎯 Phase 1: Immediate Frontend Integration (Person 1 Work Alignment)

Goal: Build and launch the exact backend endpoints required by Person 1's frontend components (`AuthModal.jsx`, `ResumeUploader.jsx`, `ProfileReviewModal.jsx`).

```
┌─────────────────────────────────────────┐         ┌─────────────────────────────────────────┐
│     PERSON 1 FRONTEND (React + Vite)    │         │     PERSON 2 BACKEND (FastAPI + SQLite) │
│                                         │         │                                         │
│ • AuthModal (Login / Register)          │ ──────> │ • POST /api/auth/register               │
│                                         │ <────── │ • POST /api/auth/login                  │
│ • AuthContext (JWT Session Check)       │ ──────> │ • GET /api/auth/me                      │
│                                         │         │                                         │
│ • ResumeUploader (Dropzone PDF Upload)  │ ──────> │ • POST /api/resume/parse                │
│ • ProfileReviewModal (Skill Tags)       │ <────── │   (pdfplumber PDF text extraction)      │
└─────────────────────────────────────────┘         └─────────────────────────────────────────┘
```

### Phase 1 Deliverables:

#### 1. Security & Auth Service (`backend/services/auth_service.py`)
- Password hashing with `bcrypt` (`passlib`).
- JWT token encoding/decoding (`python-jose`).
- FastAPI `get_current_user` Bearer token dependency.

#### 2. Authentication API Routes (`backend/routes/auth.py`)
- `POST /api/auth/register`: Create user in SQLite `user` table, return JWT token.
- `POST /api/auth/login`: Validate credentials, return JWT token.
- `GET /api/auth/me`: Protected route returning user info for frontend session restore.

#### 3. PDF Resume Extraction Service & Endpoint (`backend/services/pdf_parser.py` & `backend/routes/resume.py`)
- `pdfplumber` PDF text parser.
- `POST /api/resume/parse`: Takes `UploadFile` (PDF), extracts text, returns `StructuredResumeProfile` JSON for `ProfileReviewModal.jsx`.

#### 4. Core FastAPI Entry Point (`backend/main.py`)
- Configured FastAPI server with `CORSMiddleware` (allowing `http://localhost:5173`).
- Health check `GET /api/health`.

---

## 🚀 Phase 2: AI Engine & Interactive Roadmap Integration (Person 3 & Person 4 Alignment)

Goal: Connect backend persistence and score math with Person 3's Gemini AI pipeline and Person 4's Roadmap Timeline.

### Phase 2 Deliverables:
- `POST /api/progress/update`: Server-side Placement Readiness Score recalculation math.
- `POST /api/user/save-roadmap`: Save generated intelligence package into `RoadmapRecord` table.
- `GET /api/progress/me`: Fetch active user saved roadmap.
