# 🎨 SkillForge AI — Frontend Implementation Plan (Person 1 Lead)

This document is the **step-by-step technical implementation guide** for **Person 1 (Frontend & Auth Lead)**, updated to integrate seamlessly with the **FastAPI & SQLite Backend** completed by **Person 2** ([BACKEND_HANDOFF_DOC.md](file:///c:/COLLEGE/Personal/GDG%20Hackathon/BACKEND_HANDOFF_DOC.md)). It breaks down frontend development into **4 bite-sized, high-polish parts** to ensure pixel-perfect design, zero demo latency, and full API synchronization.

---

## 🧭 Visual Component Hierarchy & Layout

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│  [Navbar.jsx] ➔ Logo | Target Goal Badge | "⚡ Demo Mode" Switcher | Auth / Profile     │
├────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                        │
│  [App.jsx Main Shell]                                                                  │
│                                                                                        │
│  ┌────────────────────────────────────────┐  ┌──────────────────────────────────────┐  │
│  │ 📄 PART 3: RESUME INGESTION            │  │ 📊 PART 4: READINESS SCORE GAUGE     │  │
│  │ [ResumeUploader.jsx]                   │  │ [ReadinessScoreCard.jsx]             │  │
│  │ • Drag-and-drop PDF dropzone           │  │ • Radial 0–100% animated dial        │  │
│  │ • Simulated & Live AI scan progress    │  │ • "Needs Focus" ➔ "Interview Ready"  │  │
│  │ • Connects to POST /api/resume/parse   │  │ • Category breakdown (Skills, Projs) │  │
│  │ • "⚡ Load Demo Resume" quick buttons  │  │ • Live sync with /api/progress/update│  │
│  └────────────────────────────────────────┘  └──────────────────────────────────────┘  │
│                                                                                        │
│  ┌──────────────────────────────────────────────────────────────────────────────────┐  │
│  │ 🛑 PART 4: HUMAN-IN-THE-LOOP PROFILE VERIFICATION MODAL                          │  │
│  │ [ProfileReviewModal.jsx]                                                         │  │
│  │ • Candidate Name & Education inputs                                              │  │
│  │ • Interactive Skill Tag Badges: [ React ✕ ] [ Python ✕ ] [ + Add Skill ]         │  │
│  │ • Target Career Goal & Experience Level Selector                                 │  │
│  │ • [ 🚀 Generate My AI Career Roadmap ] Action Button                             │  │
│  │ • Persists via POST /api/progress/save-roadmap                                   │  │
│  └──────────────────────────────────────────────────────────────────────────────────┘  │
│                                                                                        │
│  ┌──────────────────────────────────────────────────────────────────────────────────┐  │
│  │ 🔐 PART 2: AUTH & JUDGE DEMO MODAL                                               │  │
│  │ [AuthModal.jsx]                                                                  │  │
│  │ • FastAPI Sign In / Sign Up tabs (POST /api/auth/login & /register)              │  │
│  │ • JWT Bearer Token persistence (localStorage 'token')                            │  │
│  │ • ⭐ "1-Click Guest Demo Login" (Instant Evaluator / Judge Mode)                 │  │
│  │ • Live Backend Status Indicator ("FastAPI Port 8000" vs "Sandbox Mode")         │  │
│  └──────────────────────────────────────────────────────────────────────────────────┘  │
│                                                                                        │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 🧩 The 4-Part Implementation Plan

---

### 🔹 Part 1: Design System, App Shell & Global State (✅ Completed)
* **Goal**: Establish a dark glassmorphic design foundation, theme tokens, and global state with instant localStorage caching.
* **Files Created / Configured**:
  - `client/package.json` — Dependencies (`lucide-react`, `recharts`, `framer-motion`, `tailwind-merge`, `clsx`).
  - `client/tailwind.config.js` — Custom dark palette (`#0D0F12`), glowing accents (`#2563EB`), and minimalist shadows.
  - `client/src/index.css` — Global styles, Plus Jakarta Sans typography, custom scrollbars, and form focus styles.
  - `client/src/services/mockData.js` — Realistic demo personas (*Alex - Full-Stack Aspirant* vs *Priya - AI/ML Aspirant*).
  - `client/src/context/AuthContext.jsx` — Auth provider supporting guest mode and active persona selection.
  - `client/src/context/CareerContext.jsx` — Central store for extracted profile, roadmap, active milestones, and live score.
  - `client/src/components/Navbar.jsx` — Header with logo, target role badge, demo persona switcher, and profile avatar.

---

### 🔹 Part 2: FastAPI Backend Auth & "1-Click Guest Demo" Modal (🎯 CURRENT STEP)
* **Goal**: Enable frictionless user onboarding connecting directly to Person 2's FastAPI auth endpoints (`/api/auth/register`, `/api/auth/login`, `/api/auth/me`) plus an instant 1-click test mode for hackathon judges with 0 credentials needed.
* **Files to Create / Configure**:
  - `client/src/services/api.js` [NEW] — Unified REST API client handling base URL (`http://localhost:8000`), JWT Bearer tokens in headers, `/api/auth/*` requests, and automatic fallback to mock mode if backend is offline.
  - `client/src/components/AuthModal.jsx` [NEW] — Glassmorphic modal with animated tabs for Sign In / Sign Up, form validation, live backend status indicator, and prominent **"1-Click Guest Demo (Judge Mode)"** buttons (*Alex vs Priya*).
  - `client/src/context/AuthContext.jsx` [MODIFY] — Integrate `api.js` for `loginUser`, `registerUser`, session restoration from `localStorage.getItem('token')`, `loginAsDemo`, and `logout`.
  - `client/src/components/Navbar.jsx` [MODIFY] — Wire "Sign In" button to open `AuthModal`, show authenticated user details/guest pill, and quick logout.
  - `client/src/App.jsx` [MODIFY] — Mount `AuthModal` and pass state triggers.
* **Deliverable Checklist**:
  - [ ] Clicking "Sign In" opens the sleek Auth modal.
  - [ ] Sign In & Sign Up forms connect cleanly to `POST /api/auth/login` and `/register`.
  - [ ] "1-Click Demo Login" instantly authenticates as Alex or Priya with 0 typing required.
  - [ ] Token is saved to `localStorage` and `GET /api/auth/me` restores session on refresh.
  - [ ] Navbar updates with user avatar, name, guest badge, and logout button.

---

### 🔹 Part 3: Resume Dropzone & Multi-Step AI Extraction Engine (🎯 NEXT STEP)
* **Goal**: Build an interactive, drag-and-drop PDF upload dropzone connecting to Person 2's FastAPI `POST /api/resume/parse` endpoint, complete with realistic multi-stage AI scan animations, offline resilience, and 1-click sample resume shortcuts for hackathon judges.

#### 🏗️ Architecture & Component Data Flow
```
┌────────────────────────────────────────────────────────────────────────┐
│  [ResumeUploader.jsx]                                                  │
│  ├─ 1. Drag & Drop PDF Zone (< 10MB, .pdf validation)                  │
│  ├─ 2. Multi-Stage AI Scanning Ticker (0% ➔ 100%)                      │
│  ├─ 3. REST API: POST http://localhost:8000/api/resume/parse           │
│  │     (multipart/form-data with automatic fallback if offline)        │
│  └─ 4. ⚡ "Quick Sample Resume" 1-Click Evaluator Buttons (Alex/Priya)   │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ onScanComplete(extractedData)
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│  [CareerContext.jsx & App.jsx]                                         │
│  • Stores `candidate_name`, `education`, `current_skills`, `projects`  │
│  • Transitions workflow to Step 4: [ProfileReviewModal.jsx]           │
└────────────────────────────────────────────────────────────────────────┘
```

#### 📁 Files to Create / Configure
1. `client/src/components/ResumeUploader.jsx` [NEW / POLISH]:
   - **Dark Glassmorphic Dropzone**: Border-dashed drop area with drag-over glow effects, supporting file drop and native file picker.
   - **File Validation**: Strict `.pdf` check with clear error badges for unsupported file formats or files > 10MB.
   - **Multi-Stage AI Scan Animation Ticker**:
     - *Stage 1 (0% – 45%)*: `"Stage 1/3: Reading PDF layout structure & text blocks..."`
     - *Stage 2 (45% – 85%)*: `"Stage 2/3: Extracting verified technical competencies & tools..."`
     - *Stage 3 (85% – 100%)*: `"Stage 3/3: Normalizing portfolio projects & certifications..."`
   - **Extracted Summary Card**: Post-scan preview showing extracted candidate name, education, and interactive skill tags with verification badges.
   - **⚡ 1-Click Sample Resumes**: Instant test shortcuts for **Alex Rivera (Full-Stack PDF)** and **Priya Sharma (AI/ML PDF)** for seamless zero-latency demo evaluation.
2. `client/src/services/api.js` [VERIFY / CONFIGURE]:
   - `resumeAPI.parsePDF(file)`: Sends `multipart/form-data` with `file` field to `http://localhost:8000/api/resume/parse`.
   - Includes timeout and offline fallback to ensure the demo never crashes if the backend is down.
3. `client/src/App.jsx` [MODIFY]:
   - Mount `ResumeUploader.jsx` in the main workflow and pass `onScanComplete={(data) => handleScanComplete(data)}`.
   - Wire state transition to trigger `ProfileReviewModal` (Part 4).

#### 📡 Backend Contract Reference (`POST /api/resume/parse`)
* **Endpoint**: `http://localhost:8000/api/resume/parse`
* **Form-Data**: `file` (`application/pdf`)
* **Expected Response Schema**:
  ```json
  {
    "candidate_name": "Alex Johnson",
    "contact_email": "alex@skillforge.ai",
    "education": "B.Tech Computer Science & Engineering (2022 - 2026)",
    "current_skills": ["React", "Python", "FastAPI", "SQLite", "Git"],
    "tools_and_platforms": ["Vite", "GitHub", "Postman", "Vercel"],
    "projects": [
      {
        "title": "E-Commerce API Service",
        "tech_stack": ["FastAPI", "SQLite"],
        "description": "Built high-throughput RESTful order processing API."
      }
    ],
    "certifications": ["AWS Certified Cloud Practitioner"]
  }
  ```

#### 📋 Step 3 Deliverable Checklist
- [x] Bespoke SkillForge SVG favicon and Navbar branding created.
- [x] Dark glassmorphic `ResumeUploader.jsx` created with responsive layout.
- [x] Drag-and-drop event listeners with drag-over border glow effects.
- [x] Strict PDF file validation and file size limits (< 10MB).
- [x] Multi-stage AI scanning animation ticker and smooth progress bar.
- [x] `POST /api/resume/parse` integration via `services/api.js`.
- [x] Offline fallback support for zero-error hackathon demo resilience.
- [x] 1-Click Quick Sample Resume shortcuts for Alex Rivera & Priya Sharma.
- [ ] Mount ResumeUploader into `App.jsx` and connect `onScanComplete` callback to launch Step 4 (`ProfileReviewModal`).

---

### 🔹 Part 4: "Human-in-the-Loop" Profile Review Modal & Readiness Score Gauge
* **Goal**: Give the student full control to review/edit their extracted profile and calculate an animated Placement Readiness Score synced with Person 2's `/api/progress/update` math algorithm.
* **Files to Create / Configure**:
  - `client/src/components/ProfileReviewModal.jsx` [NEW]:
    - Editable Name & Education fields.
    - Interactive Skill Chips: clickable `[ React ✕ ]` to delete, input box to add new skills.
    - Career Aspirations selector: Target Role (*Full-Stack, AI/ML, DevOps*), Target Company Tier, Timeline (3/6 mos).
    - `[ 🚀 Generate My AI Career Roadmap ]` action button saving to `POST /api/progress/save-roadmap`.
  - `client/src/components/ReadinessScoreCard.jsx` [NEW]:
    - SVG / Recharts animated radial progress donut (0–100%).
    - Dynamic tier labels: *"Foundation Stage" (45%) ➔ "Interview Ready" (85%)*.
    - Breakdown metrics for Core Skills, Projects, and Interview Prep.
    - Synced with `POST /api/progress/update` on milestone toggles.
* **Deliverable Checklist**:
  - [ ] Profile review modal opens automatically after resume scan.
  - [ ] Skills can be added and removed with interactive tag animations.
  - [ ] Target role selection updates career context.
  - [ ] Readiness Score gauge animates smoothly and synchronizes with server math formula.

---

## 🤝 Teammate Integration Reference

- **With Person 2 (FastAPI & DB Lead)**:
  - Base URL: `http://localhost:8000` (configurable via `VITE_API_URL`).
  - Auth: `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`.
  - Resume: `POST /api/resume/parse` (`multipart/form-data`, field: `file`).
  - Progress: `POST /api/progress/update` (`{ milestone_id, completed }`), `POST /api/progress/save-roadmap`.
- **With Person 4 (Roadmap & Interview Lead)**:
  - `CareerContext.jsx` provides active roadmap milestones, verified skills, and readiness scores directly to `RoadmapTimeline.jsx` and `MockInterviewHub.jsx`.

---

## 🚦 Execution Order
1. **Execute Part 1** ➔ (Done) Design tokens, app shell, Navbar & Context stores.
2. **Execute Part 2** ➔ (Now) FastAPI Auth client, AuthModal, 1-Click Judge Demo & Token lifecycle.
3. **Execute Part 3** ➔ Resume Dropzone, PDF upload to `/api/resume/parse`, & animated AI scanner.
4. **Execute Part 4** ➔ Profile Review Modal, skill tag editor, & Readiness Score Donut Gauge.
