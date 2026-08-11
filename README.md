# 🚀 SkillForge AI: Personalized Learning & Career Mentor

> **PS-01 | GDG Hackathon**  
> *Empowering students to bridge skill gaps, build industry-ready portfolios, and master placement interviews with adaptive AI guidance.*

---

## 🌟 Overview

Students often struggle to identify actionable skill gaps, build portfolio-ready projects, and prepare effectively for tech placement interviews. **SkillForge AI** solves this by:
1. **Ingesting & Parsing Resumes**: Extracts skills, projects, and experience into a clean structured profile.
2. **Human-in-the-Loop Verification**: Allows students to review and enrich their profile, specify target roles (e.g. *Full-Stack AI Engineer*, *Data Scientist*), and set timelines.
3. **AI-Powered Skill Gap Analysis**: Identifies exact missing competencies and calculates a live **Placement Readiness Score (0-100%)**.
4. **Adaptive Milestone Roadmap**: Generates interactive weekly learning phases with curated high-yield resources.
5. **Portfolio Project Recommendations**: Curates GitHub-ready project blueprints to bridge specific missing skills.
6. **AI Mock Interview Hub**: Provides tailored technical interview questions with instant AI evaluation and scoring.

---

## 🛠️ Architecture & Tech Stack

- **Frontend**: React 18 (Vite) + Tailwind CSS + Lucide Icons + Recharts + Framer Motion
- **Backend**: Python (FastAPI + Uvicorn) + `pdfplumber`
- **Database & Auth**: Supabase (Cloud PostgreSQL + Supabase Auth)
- **AI Engine**: Google Gemini 1.5 Flash API (Structured Pydantic outputs)
- **State**: React Context API + LocalStorage Cache

---

## 👥 4-Member Team Workstreams

| Role | Lead | Responsibilities |
| :--- | :--- | :--- |
| **Frontend Core & Auth** | 👤 Person 1 (Team Lead) | App shell, Supabase Auth, Profile Review & Edit UI, Readiness Gauge. |
| **Core Backend & DB** | 👤 Person 2 | FastAPI server, PDF parsing endpoint, Supabase DB sync, scoring math. |
| **AI Intelligence** | 👤 Person 3 | Gemini prompt pipelines, Resume normalizer, Gap Matrix, Interview evaluator. |
| **Roadmap & Interview Hub** | 👤 Person 4 | Interactive Roadmap timeline, Mock Interview quiz UI, Radar chart, Pitch deck. |

For detailed Git branching, file ownership, and PR guidelines, see [GITHUB_TEAM_WORKFLOW.md](./GITHUB_TEAM_WORKFLOW.md).

---

## 🚀 Quickstart Guide

### 1. Clone the Repository
```bash
git clone https://github.com/Rudra2986/skillforge-ai.git
cd skillforge-ai
```

### 2. Frontend Setup (Client)
```bash
cd client
npm install
npm run dev
```

### 3. Backend Setup (FastAPI)
```bash
cd backend
python -m venv venv
# On Windows:
.\venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```
API Documentation will be live at `http://localhost:8000/docs`.

---

## 📄 License
MIT License - Created for GDG Hackathon 2026.
