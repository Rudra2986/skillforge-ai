<div align="center">

# ⚡ SkillForge AI
### Autonomous Career & Learning Navigator for Tech Placements

[![Live App](https://img.shields.io/badge/Live%20Demo-skillforge--ai--one.vercel.app-6366f1?style=for-the-badge&logo=vercel)](https://skillforge-ai-one.vercel.app)
[![Live Backend](https://img.shields.io/badge/Backend%20API-Render-46e3b7?style=for-the-badge&logo=render)](https://skillforge-ai-backend-7f8r.onrender.com/docs)
[![Admin DB](https://img.shields.io/badge/Admin%20DB-Visual%20Dashboard-f59e0b?style=for-the-badge&logo=postgresql)](https://skillforge-ai-backend-7f8r.onrender.com/admin)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

<br/>

**Transforming raw candidate resumes into verified competency benchmarks, adaptive learning milestones, placement-proof portfolio blueprints, and AI mock interview simulations.**

---

[Explore Live Web App](https://skillforge-ai-one.vercel.app) • [Interactive API Docs](https://skillforge-ai-backend-7f8r.onrender.com/docs) • [Visual Admin DB](https://skillforge-ai-backend-7f8r.onrender.com/admin) • [Watch 1-Click Demo](https://skillforge-ai-one.vercel.app)

</div>

<br/>

---

## 📌 The Problem
Engineering students face a massive **Placement Readiness Gap**:
- **Resume Opacity**: Resumes list generic buzzwords with zero verification or benchmark alignment against real-world job roles.
- **Unstructured Learning**: Generic tutorials overwhelm students without telling them *which exact skills are missing* for their target job.
- **Lack of Placement Proof**: Recruiters look for production-ready capstone architectures, not boilerplate clone projects.
- **Interview Anxiety**: Students lack on-demand, role-tailored technical interview practice with instant hiring-manager feedback.

## 💡 The Solution: SkillForge AI
**SkillForge AI** is a complete, closed-loop placement acceleration engine:
1. **Extract & Verify**: Ingests candidate resumes via high-precision PDF parsing + AI normalization with a Human-in-the-Loop review modal.
2. **Diagnose & Benchmark**: Computes a dynamic **Placement Readiness Index (0–100%)** based on verified role skills, roadmap execution, and capstone proof.
3. **Adaptive Roadmapping**: Curates weekly learning milestones with high-yield study resources.
4. **Capstone Blueprints**: Generates production architectures with concrete GitHub starter steps.
5. **Interview Simulation**: Conducts voice/text mock interviews evaluated dynamically by AI with scoring and model answer rubrics.

---

## 🌟 Key Features

| Feature | Description |
| :--- | :--- |
| 📄 **AI Resume Ingestion & Normalizer** | Extracts candidate details, education, skills, and projects from raw PDF text and formats into a clean structured schema. |
| 🔍 **Human-in-the-Loop Review** | Allows students to refine extracted skills, select target roles (*Full-Stack AI, Data Science, Cloud DevOps*), and choose timelines before generation. |
| 📊 **Unified Placement Readiness Index** | Multi-factor benchmark gauge combining **40% Technical Skills**, **40% Roadmap Execution**, and **20% Portfolio Proof**. |
| 🎯 **Target-Role Competency Gap Matrix** | Identifies specific, prioritized skill deficiencies (Critical / High / Medium) while filtering out already-verified proficiencies. |
| 🗺️ **Adaptive Milestone Timeline** | Weekly interactive learning phases with check-off tracking, actionable tasks, and curated documentation links. |
| 💼 **Placement-Proof Capstones** | Tailored production project specifications with architecture overviews, difficulty tags, and GitHub starter steps. |
| 🏆 **Role-Aligned Industry Certifications** | Curated high-ROI industry certifications (*AWS ML Specialty, TensorFlow Developer, Databricks, CKA*). |
| 🧠 **AI Mock Interview Simulator** | Role-tailored behavioral and system-design questions with real-time AI scoring (0–100) and actionable improvement feedback. |
| 🔒 **Enterprise Auth & Cloud DB** | JWT Bearer authentication with multi-dialect database engine (Supabase PostgreSQL in Cloud, SQLite locally). |
| 🛠️ **Dark-Mode Visual Admin Dashboard** | Built-in `/admin` web interface for live database exploration and single-click `.db` backups. |

---

## 🏗️ System Architecture & Data Flow

```mermaid
flowchart TB
    %% Styling Classes
    classDef clientStyle fill:#1e293b,stroke:#38bdf8,stroke-width:2px,color:#f8fafc,rx:8px,ry:8px;
    classDef apiStyle fill:#0f172a,stroke:#818cf8,stroke-width:2px,color:#f8fafc,rx:8px,ry:8px;
    classDef aiStyle fill:#18181b,stroke:#ec4899,stroke-width:2px,color:#f8fafc,rx:8px,ry:8px;
    classDef dbStyle fill:#14532d,stroke:#4ade80,stroke-width:2px,color:#f8fafc,rx:8px,ry:8px;
    classDef userStyle fill:#312e81,stroke:#a78bfa,stroke-width:2px,color:#f8fafc,rx:8px,ry:8px;

    User([👤 Candidate / Judge]):::userStyle

    subgraph CLIENT["🌐 FRONTEND CLIENT — React 18 + Vite (Vercel)"]
        direction TB
        UploadUI["📄 Resume Ingestion & Scan Animation<br/><i>(ResumeUploader.jsx)</i>"]:::clientStyle
        HITLModal["🔍 Human-in-the-Loop Review Modal<br/><i>(ProfileReviewModal.jsx)</i>"]:::clientStyle
        ScoreDial["📊 Placement Readiness Score Gauge<br/><i>(ReadinessScoreCard.jsx)</i>"]:::clientStyle
        GapMatrix["🎯 Competency Gap Matrix<br/><i>(SkillGapVisualizer.jsx)</i>"]:::clientStyle
        RoadmapUI["🗺️ Adaptive Milestone Timeline<br/><i>(RoadmapTimeline.jsx)</i>"]:::clientStyle
        CapstonesUI["💼 Production Capstone Blueprints<br/><i>(Architecture & GitHub Steps)</i>"]:::clientStyle
        MockHub["🧠 AI Mock Interview Hub<br/><i>(InterviewQuestionHub.jsx)</i>"]:::clientStyle
        AdminUI["🛠️ Dark-Mode Visual DB Explorer<br/><i>(/admin Dashboard)</i>"]:::clientStyle
    end

    subgraph API_GATEWAY["⚙️ CORE BACKEND API — FastAPI + Uvicorn (Render)"]
        direction TB
        ParserSvc["📑 PDF Parser Engine<br/><i>(pdfplumber + pypdf)</i>"]:::apiStyle
        AuthSvc["🔐 Auth & Security Service<br/><i>(JWT Bearer + bcrypt)</i>"]:::apiStyle
        ProgressMath["📐 Placement Score Recalculator<br/><i>(40% Skills + 40% Roadmap + 20% Projects)</i>"]:::apiStyle
        APIRoutes["📡 REST API Endpoints Controller<br/><i>/api/resume, /api/ai, /api/progress, /admin</i>"]:::apiStyle
    end

    subgraph AI_CORE["🧠 AI INTELLIGENCE ENGINE"]
        direction TB
        GroqLLM["⚡ Groq Cloud LPU Engine<br/><b>LLaMA 3.3 70B Versatile (~500ms)</b>"]:::aiStyle
        GeminiFallback["🛡️ Google Gemini 1.5 Flash<br/><i>(Automated Fallback)</i>"]:::aiStyle
        PydanticGuard["✅ Pydantic v2 Schema Guardrails<br/><i>(Zero-Hallucination JSON Pipelines)</i>"]:::aiStyle
    end

    subgraph STORAGE["🗄️ PERSISTENT CLOUD & LOCAL STORAGE"]
        direction TB
        PostgreSQL["🐘 Supabase Cloud PostgreSQL<br/><i>(Production Cloud DB)</i>"]:::dbStyle
        SQLiteLocal["💾 SQLite Database Engine<br/><i>(Local Dev skillforge.db)</i>"]:::dbStyle
        SQLAlchemy["🔄 SQLAlchemy Multi-Dialect ORM<br/><i>(Tables: Users, Resumes, Roadmaps)</i>"]:::dbStyle
    end

    %% Flow Connections
    User -->|1. Uploads Resume PDF| UploadUI
    UploadUI -->|POST /api/resume/parse| ParserSvc
    ParserSvc -->|Extracted Raw Text| GroqLLM
    GroqLLM -->|Structured Profile JSON| PydanticGuard
    PydanticGuard -->|Canonical Schema| HITLModal
    
    User -->|2. Verifies Skills & Chooses Role| HITLModal
    HITLModal -->|POST /api/ai/analyze-gap| APIRoutes
    APIRoutes -->|Profile + Role Benchmark| GroqLLM
    GroqLLM -.->|Failover| GeminiFallback
    
    GroqLLM -->|3-Phase Roadmap & Gap Matrix| APIRoutes
    APIRoutes -->|Career Intelligence Package| ScoreDial
    ScoreDial --> GapMatrix
    GapMatrix --> RoadmapUI
    RoadmapUI --> CapstonesUI
    
    User -->|3. Toggles Milestone Check-off| RoadmapUI
    RoadmapUI -->|POST /api/progress/update| ProgressMath
    ProgressMath -->|Updated Readiness Index| ScoreDial
    ProgressMath -->|Persist Progress| SQLAlchemy
    
    User -->|4. Submits Mock Interview Response| MockHub
    MockHub -->|POST /api/ai/evaluate-answer| GroqLLM
    GroqLLM -->|Score 0-100 & Model Answer Rubric| MockHub
    
    SQLAlchemy --> PostgreSQL
    SQLAlchemy --> SQLiteLocal
    AdminUI -->|GET /api/admin/database| APIRoutes
```

### 🔄 End-to-End Pipeline

| Stage | Action | Technology / Model | Output |
| :--- | :--- | :--- | :--- |
| **1. Parse** | Student uploads raw PDF resume | `pdfplumber` + FastAPI | Extracted raw text blocks |
| **2. Normalize** | AI structures text into canonical profile | Groq LLaMA 3.3 70B | `StructuredResumeProfile` (JSON) |
| **3. Review** | Student verifies skills & chooses target role | React Human-in-the-Loop Modal | Verified candidate criteria |
| **4. Benchmark** | AI compares skills against role requirements | Groq Intelligence Pipeline | 3-Phase Roadmap + Deficiencies Matrix |
| **5. Track & Sync**| Real-time milestone & project updates | Supabase PostgreSQL / LocalStorage | Dynamic **Placement Readiness Score** |
| **6. Simulate** | Technical mock interview practice | AI Rubric Evaluator | Real-time score (0–100) & model answers |

---

## 📐 Placement Readiness Scoring Formula

The **Placement Readiness Index (0–100%)** is calculated via a multi-factor benchmark:

$$\text{Readiness Score} = \text{Skills Pillar (40\%)} + \text{Roadmap Pillar (40\%)} + \text{Projects Pillar (20\%)}$$

```
┌────────────────────────────────────────────────────────────────────────┐
│                      PLACEMENT READINESS INDEX                         │
├──────────────────────────┬─────────────────────────┬───────────────────┤
│   Core Skills Match      │   Roadmap Execution     │  Portfolio Proof  │
│   (Up to 40%)            │   (Up to 40%)           │  (Up to 20%)      │
│   Calculates alignment   │   Calculates completed  │  Calculates built │
│   against 8+ target role │   milestone phases      │  production       │
│   competencies           │   (e.g., 0/3 -> 3/3)    │  capstone proofs  │
└──────────────────────────┴─────────────────────────┴───────────────────┘
```

- **Tier-1 Ready ($\ge 80\%$)**: Meets top-tier tech placement standards.
- **Core Competency ($55\% - 79\%$)**: Strong foundation; complete pending phases to reach Tier-1 readiness.
- **Foundation Stage ($< 55\%$)**: Initial ingestion state; build core backend and system fundamentals.

---

## 💻 Tech Stack

### **Frontend**
- **Framework**: React 18 with Vite
- **Styling**: Tailwind CSS (Tailored dark canvas palette `#0a0c10`)
- **Icons**: Lucide React
- **Animations**: Framer Motion & Tailwind Animate
- **State Management**: React Context API (`AuthContext`, `CareerContext`) with persistent `localStorage` cache

### **Backend**
- **Framework**: Python 3.11 + FastAPI (Async RESTful endpoints)
- **ASGI Server**: Uvicorn
- **Resume Parsing**: `pdfplumber` + `pypdf`
- **Database ORM**: SQLAlchemy with multi-dialect support (PostgreSQL via `psycopg2-binary` & SQLite)
- **Authentication**: Passlib (Bcrypt hashing) + PyJWT (Bearer token validation)
- **AI Integration**: Groq Cloud SDK (`llama-3.3-70b-versatile`) + Google Gemini 1.5 Flash API fallback

---

## 🚀 Live Demo & Quick Links

- 🌐 **Production Web Application**: [https://skillforge-ai-one.vercel.app](https://skillforge-ai-one.vercel.app)
- ⚙️ **Backend API Documentation**: [https://skillforge-ai-backend-7f8r.onrender.com/docs](https://skillforge-ai-backend-7f8r.onrender.com/docs)
- 🗄️ **Admin Visual Database Explorer**: [https://skillforge-ai-backend-7f8r.onrender.com/admin](https://skillforge-ai-backend-7f8r.onrender.com/admin)
- 🧪 **1-Click Sandbox Demos**:
  - **Alex Morgan** (*Full-Stack AI Engineer Persona*)
  - **Priya Sharma** (*Data Scientist & ML Engineer Persona*)

---

## 🛠️ Local Development Setup

### Prerequisites
- Node.js (v18+)
- Python (v3.10+)
- Git

### 1. Clone the Repository
```bash
git clone https://github.com/Rudra2986/skillforge-ai.git
cd skillforge-ai
```

### 2. Configure Backend Environment
Create a `.env` file in the root directory:
```env
# AI Engine
GROQ_API_KEY=your_groq_api_key_here
GEMINI_API_KEY=your_gemini_api_key_here

# Security & Auth
SECRET_KEY=your_super_secret_jwt_key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440

# Database (Leave blank for local SQLite fallback)
DATABASE_URL=sqlite:///./skillforge.db
# Or Supabase: postgresql://postgres:password@db.supabase.co:5432/postgres
```

### 3. Start Backend Server
```bash
# Set up Python virtual environment
python -m venv venv

# Windows
.\venv\Scripts\activate
# Linux/macOS
source venv/bin/activate

# Install dependencies
pip install -r backend/p2/requirements.txt

# Launch FastAPI Server
python -m uvicorn backend.p2.main:app --reload --port 8000
```
> API Docs will be available at: `http://localhost:8000/docs`  
> Visual Admin DB will be available at: `http://localhost:8000/admin`

### 4. Start Frontend Client
In a new terminal:
```bash
cd client
npm install
npm run dev
```
> Web App will be available at: `http://localhost:5173`

---

## 📡 API Endpoint Overview

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Create a new student account | No |
| `POST` | `/api/auth/login` | Authenticate student & retrieve JWT | No |
| `POST` | `/api/resume/parse` | Extract text & structure from PDF resume | No |
| `POST` | `/api/ai/normalize-resume` | AI Normalizer for candidate profile | No |
| `POST` | `/api/ai/analyze-gap` | Generate Skill Gap Matrix & 3-phase Roadmap | Yes |
| `POST` | `/api/ai/evaluate-answer` | Grade technical interview response & return feedback | Yes |
| `POST` | `/api/progress/save-roadmap` | Save active career roadmap to cloud DB | Yes |
| `GET` | `/api/progress/me` | Fetch student's persisted career roadmap | Yes |
| `GET` | `/admin` | Dark-mode visual database explorer | No |
| `GET` | `/api/admin/database` | Return complete database tables in JSON | No |
| `GET` | `/api/admin/download-db` | Download SQLite database binary | No |

---

## 👥 Team & Contributors

| Member | Role | Core Contributions |
| :--- | :--- | :--- |
| **Marshal Godhani** <br/>([@marshal0207](https://github.com/marshal0207)) | 👑 **Team Lead & Core Backend Engineer** (P2) | • FastAPI RESTful API architecture & async Uvicorn server setup.<br/>• High-precision PDF resume parsing & text extraction endpoints.<br/>• SQLAlchemy ORM schema modeling, migrations, and Pydantic request validations. |
| **Rudra Patel** <br/>([@Rudra2986](https://github.com/Rudra2986)) | 💻 **Frontend Lead & Full-Stack Architect** (P1) | • React 18 frontend architecture & UI/UX design system.<br/>• Supabase Cloud PostgreSQL integration & multi-dialect SQLAlchemy engine.<br/>• JWT Authentication, `/admin` visual database dashboard & deployment pipelines.<br/>• Zero-downtime health monitoring (`/api/health` dual `HEAD`/`GET` keep-alive engine).<br/>• Placement Readiness Index multi-factor mathematical scoring model. |
| **Parv Patel** <br/>([@ParvPatel236](https://github.com/ParvPatel236)) | 🧠 **AI Intelligence Engineer** (P3) | • Groq Cloud LLaMA 3.3 70B & Google Gemini prompt engineering.<br/>• Structured resume normalization and candidate profile extractor pipelines.<br/>• Competency Gap Analysis, adaptive roadmap synthesis & AI interview evaluator. |
| **Deep Bhalani** <br/>([@Deepbhalani1277](https://github.com/Deepbhalani1277)) | 🗺️ **Product & Roadmap Engineer** (P4) | • Interactive Roadmap Timeline component & phase check-off tracking.<br/>• AI Mock Interview Simulator hub, topic question banks & rubric grading UI.<br/>• Presentation deck, pitch materials, and product workflow design. |

---

## 📄 License

This project is licensed under the **MIT License** — feel free to use, modify, and distribute for educational and hackathon purposes.
