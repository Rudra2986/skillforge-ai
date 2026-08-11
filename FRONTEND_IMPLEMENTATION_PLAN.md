# 🎨 SkillForge AI — Frontend Implementation Plan (Person 1 Lead)

This document is the **step-by-step technical implementation guide** for **Person 1 (Frontend & Auth Lead)**. It breaks down the frontend development into **4 bite-sized, high-polish parts** to ensure pixel-perfect design, zero rush, and a demo-ready application.

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
│  │ 📄 STEP 1: RESUME INGESTION            │  │ 📊 PLACEMENT READINESS SCORE GAUGE   │  │
│  │ [ResumeUploader.jsx]                   │  │ [ReadinessScoreCard.jsx]             │  │
│  │ • Drag-and-drop PDF dropzone           │  │ • Radial 0–100% animated dial        │  │
│  │ • Simulated AI scanning progress bar   │  │ • "Needs Focus" ➔ "Interview Ready"  │  │
│  │ • "⚡ Load Demo Resume" quick buttons  │  │ • Category breakdown (Skills, Projs) │  │
│  └────────────────────────────────────────┘  └──────────────────────────────────────┘  │
│                                                                                        │
│  ┌──────────────────────────────────────────────────────────────────────────────────┐  │
│  │ 🛑 STEP 2: HUMAN-IN-THE-LOOP VERIFICATION MODAL                                  │  │
│  │ [ProfileReviewModal.jsx]                                                         │  │
│  │ • Candidate Name & Education inputs                                              │  │
│  │ • Interactive Skill Tag Badges: [ React ✕ ] [ Python ✕ ] [ + Add Skill ]         │  │
│  │ • Target Career Goal & Experience Level Selector                                 │  │
│  │ • [ 🚀 Generate My AI Career Roadmap ] Action Button                             │  │
│  └──────────────────────────────────────────────────────────────────────────────────┘  │
│                                                                                        │
│  ┌──────────────────────────────────────────────────────────────────────────────────┐  │
│  │ 🔐 AUTH & DEMO MODAL                                                             │  │
│  │ [AuthModal.jsx]                                                                  │  │
│  │ • Supabase Sign In / Sign Up tabs                                                │  │
│  │ • ⭐ "1-Click Guest Demo Login" (Instant Judge Mode)                             │  │
│  └──────────────────────────────────────────────────────────────────────────────────┘  │
│                                                                                        │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 🧩 The 4-Part Implementation Plan

---

### 🔹 Part 1: Design System, App Shell & Global State
* **Goal**: Establish a stunning dark glassmorphic design foundation, theme tokens, and bulletproof global state with instant localStorage caching.
* **Files to Create / Configure**:
  - `client/package.json` — All required dependencies (`@supabase/supabase-js`, `lucide-react`, `recharts`, `framer-motion`, `tailwind-merge`).
  - `client/tailwind.config.js` — Custom dark palette (`#0B0F19`), glowing accents (`#6366F1`), and glass blur utilities.
  - `client/src/index.css` — Global styles, Inter typography, custom scrollbars, and glassmorphism classes.
  - `client/src/services/supabaseClient.js` — Supabase connection client with graceful fallback.
  - `client/src/services/mockData.js` — Realistic demo personas (*Alex - Full-Stack Aspirant* vs *Priya - AI/ML Aspirant*).
  - `client/src/context/AuthContext.jsx` — Supabase user session + Guest mode state.
  - `client/src/context/CareerContext.jsx` — Central store for extracted profile, roadmap, active milestones, and live score.
  - `client/src/components/Navbar.jsx` — Glass header with logo, active goal badge, demo switcher, and profile avatar.
* **Deliverable Checklist**:
  - [ ] React + Vite app running with hot module replacement (HMR).
  - [ ] Tailwind theme displaying modern dark glassmorphism.
  - [ ] Navbar rendering with working Demo Persona switcher.
  - [ ] Context storing data and persisting to `localStorage` on page refresh.

---

### 🔹 Part 2: Cloud Auth & "1-Click Guest Demo" Modal
* **Goal**: Enable frictionless user onboarding with real Supabase Auth plus an instant 1-click test mode for hackathon judges.
* **Files to Create / Configure**:
  - `client/src/components/AuthModal.jsx` — Glassmorphism modal with animated tabs for Sign In / Sign Up.
  - Integration with `AuthContext.jsx` for login/logout/signup triggers.
  - **⭐ "1-Click Guest Demo (Judge Mode)" Button**: Instantly authenticates with a pre-configured guest session and preloads realistic data with 0 friction.
* **Deliverable Checklist**:
  - [ ] Clicking "Sign In" opens the sleek Auth modal.
  - [ ] Email/password authentication works with Supabase.
  - [ ] "1-Click Demo Login" instantly logs in with 0 typing required.
  - [ ] Navbar updates with user avatar, name, and logout button.

---

### 🔹 Part 3: Resume Dropzone & Animated AI Scanning
* **Goal**: Build an engaging, interactive PDF upload dropzone with realistic multi-step AI scan animations.
* **Files to Create / Configure**:
  - `client/src/components/ResumeUploader.jsx` — Drag-and-drop file upload area supporting `.pdf` and `.docx`.
  - Animated scanning status ticker (*"Step 1/3: Reading PDF structure..." ➔ "Step 2/3: Extracting technical competencies..." ➔ "Step 3/3: Parsing portfolio projects..."*).
  - **"⚡ Quick Load Sample Resume"** shortcuts (*Full-Stack Resume*, *AI/ML Resume*) for 1-click testing.
* **Deliverable Checklist**:
  - [ ] File drop and file picker working with drag-over visual effects.
  - [ ] Animated scan sequence with smooth progress bar.
  - [ ] "Quick Load Sample Resume" buttons instantly trigger the scanning animation and load data.

---

### 🔹 Part 4: "Human-in-the-Loop" Profile Review Modal & Readiness Gauge
* **Goal**: Give the student full control to review/edit their extracted profile and calculate an animated Placement Readiness Score.
* **Files to Create / Configure**:
  - `client/src/components/ProfileReviewModal.jsx`:
    - Name & Education editable inputs.
    - Interactive Skill Chips: clickable `[ React ✕ ]` to delete, input box to add new skills.
    - Career Aspirations selector: Target Role (*Full-Stack, AI/ML, DevOps*), Target Company Tier, Timeline (3/6 mos).
    - `[ 🚀 Generate My AI Career Roadmap ]` action button.
  - `client/src/components/ReadinessScoreCard.jsx`:
    - SVG / Recharts animated radial progress donut (0–100%).
    - Dynamic tier labels: *"Foundation Stage" (45%) ➔ "Interview Ready" (85%)*.
    - Breakdown metrics for Core Skills, Projects, and Interview Prep.
* **Deliverable Checklist**:
  - [ ] Profile review modal opens automatically after resume scan.
  - [ ] Skills can be added and removed with interactive tag animations.
  - [ ] Target role and experience level selection works cleanly.
  - [ ] Readiness Score gauge animates smoothly and updates based on verified skills.

---

## 🤝 How Your Work Integrates with Teammates

- **For Person 4 (Roadmap & Interview Hub)**: Your `CareerContext.jsx` will feed roadmap data directly to Person 4's `RoadmapTimeline.jsx` and `MockInterviewHub.jsx`.
- **For Person 2 & 3 (Backend & AI)**: When their FastAPI endpoints are ready, your `ResumeUploader.jsx` and `ProfileReviewModal.jsx` will switch from `mockData.js` to live `fetch('/api/...')` calls with 0 code refactoring.

---

## 🚦 Execution Order
1. **Execute Part 1** ➔ Verify app shell, theme, Navbar & Context.
2. **Execute Part 2** ➔ Verify Auth modal & 1-Click Guest Demo.
3. **Execute Part 3** ➔ Verify Resume Uploader & Scan animation.
4. **Execute Part 4** ➔ Verify Profile Review Modal & Readiness Gauge.
