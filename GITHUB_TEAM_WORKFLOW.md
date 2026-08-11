# 🚀 SkillForge AI — Team GitHub Workflow & Execution Guide

This document defines the **Branching Strategy, Git Protocol, File Ownership, and Merge Checkpoints** for our 4-person hackathon team to ensure **zero merge conflicts, maximum speed, and a smooth deployment**.

---

## 🌳 1. The Branching Strategy

Your plan to use `main` + 4 feature branches is **excellent and industry-standard** for hackathons.

```
                    [ Hour 0: Initial Scaffold & Schemas Locked ]
                                         │
                                         ▼
   ┌────────────────────────────────── main ──────────────────────────────────┐
   │                                     ▲                                    │
   │    ┌───────────────┬────────────────┼───────────────┬───────────────┐    │
   │    │ (PR at Hr 8)  │ (PR at Hr 8)   │ (PR at Hr 8)  │ (PR at Hr 8)  │    │
   ▼    ▼               ▼                ▼               ▼               ▼    ▼
feat/p1-frontend-auth   feat/p2-core-backend   feat/p3-ai-engine   feat/p4-roadmap-interview
  (👤 Person 1)           (👤 Person 2)          (👤 Person 3)       (👤 Person 4)
```

### Branch Naming Conventions:
* `main` ➔ **Production Branch** (Connected directly to Vercel/Render auto-deployment. Only merge working code here!)
* `feat/p1-frontend-auth` ➔ Owned by **Person 1**
* `feat/p2-core-backend` ➔ Owned by **Person 2**
* `feat/p3-ai-engine` ➔ Owned by **Person 3**
* `feat/p4-roadmap-interview` ➔ Owned by **Person 4**

---

## 📁 2. Hard File Ownership Matrix (Zero Conflict Guarantee)

To guarantee **zero merge conflicts**, each team member strictly edits **only their assigned files**:

```
skillforge-ai/
├── client/                                    # FRONTEND (React + Vite)
│   ├── src/
│   │   ├── context/
│   │   │   ├── AuthContext.jsx                # 👤 [Person 1]
│   │   │   └── CareerContext.jsx              # 👤 [Person 1]
│   │   ├── services/
│   │   │   ├── supabaseClient.js              # 👤 [Person 1]
│   │   │   └── mockData.js                    # 👤 [Person 3]
│   │   ├── components/
│   │   │   ├── Navbar.jsx                     # 👤 [Person 1]
│   │   │   ├── AuthModal.jsx                  # 👤 [Person 1]
│   │   │   ├── ResumeUploader.jsx             # 👤 [Person 1]
│   │   │   ├── ProfileReviewModal.jsx         # 👤 [Person 1]
│   │   │   ├── ReadinessScoreCard.jsx         # 👤 [Person 1]
│   │   │   ├── RoadmapTimeline.jsx            # 👤 [Person 4]
│   │   │   ├── MockInterviewHub.jsx           # 👤 [Person 4]
│   │   │   ├── SkillGapRadar.jsx              # 👤 [Person 4]
│   │   │   └── ProjectRecommendations.jsx     # 👤 [Person 4]
│   │   ├── App.jsx                            # 👤 [Person 1]
│   │   └── index.css                          # 👤 [Person 1]
│
├── backend/                                   # BACKEND (FastAPI)
│   ├── main.py                                # 👤 [Person 2]
│   ├── schemas.py                             # 👤 [Person 2 & 3 Locked Schemas]
│   ├── routes/
│   │   ├── resume.py                          # 👤 [Person 2]
│   │   ├── progress.py                        # 👤 [Person 2]
│   │   └── ai.py                              # 👤 [Person 3]
│   ├── services/
│   │   ├── pdf_parser.py                      # 👤 [Person 2]
│   │   ├── supabase_service.py                # 👤 [Person 2]
│   │   └── gemini_service.py                  # 👤 [Person 3]
│   └── data/
│       └── role_benchmarks.json               # 👤 [Person 2]
│
└── docs/
    └── pitch_deck.md                          # 👤 [Person 4]
```

---

## 💻 3. Step-by-Step Git Commands (Cheat Sheet)

### 👑 Step 0: Team Lead (Hour 0 - Initial Setup)
*The team lead initializes the repository, scaffolds folder structure, and pushes to `main`:*

```bash
# 1. Initialize and add base templates
git init
git add .
git commit -m "feat: initial project scaffold, schemas, and folder structure"
git branch -M main
git remote add origin https://github.com/YOUR_TEAM/skillforge-ai.git
git push -u origin main
```

---

### 👥 Step 1: Team Members (Hour 0 to 1 - Cloning & Creating Your Branch)

Every team member runs this once to get started:

```bash
# 1. Clone the repo
git clone https://github.com/YOUR_TEAM/skillforge-ai.git
cd skillforge-ai

# 2. Create and switch to your dedicated branch (Example for Person 2):
git checkout -b feat/p2-core-backend

# 3. Verify you are on your branch
git branch
```

---

### 🔄 Step 2: Daily Working Loop (Every 1-2 Hours)

While developing your features, commit and push your work regularly:

```bash
# 1. Save your changes
git add .
git commit -m "feat(backend): implemented pdf text parsing endpoint"

# 2. Push to your remote branch on GitHub
git push -u origin feat/p2-core-backend
```

---

### 🔀 Step 3: Syncing with `main` Without Breaking Code

Whenever someone merges changes into `main`, sync your local branch:

```bash
# 1. Commit any local work in progress
git add .
git commit -m "wip: saving current progress"

# 2. Fetch latest changes from main
git checkout main
git pull origin main

# 3. Switch back to your branch and merge main into it
git checkout feat/p2-core-backend
git merge main
```

---

## ⏱️ 4. The 4 Golden Integration Checkpoints

To avoid chaotic last-minute merges, follow this exact **Merge Rhythm**:

| Checkpoint | Time | Who Merges to `main` | Milestone Output |
| :--- | :--- | :--- | :--- |
| **Checkpoint 1** | **Hour 1** | **Team Lead** | Base folder structure, `schemas.py`, `.env.example`, dependencies installed. |
| **Checkpoint 2** | **Hour 8** | **Person 2 & Person 3 (Backend)** | Backend APIs for PDF extraction and Gemini AI tested at `localhost:8000/docs`. |
| **Checkpoint 3** | **Hour 14** | **Person 1 & Person 4 (Frontend)** | Frontend components wired to live backend. Full end-to-end user flow working! |
| **Checkpoint 4** | **Hour 20** | **ALL (Code Freeze)** | Bug fixes only. Connect `main` to Vercel/Render for live public link. Practice pitch. |

---

## ⚠️ 5. Golden Rules to Prevent Conflicts

1. **NEVER push directly to `main`** (Except initial scaffold at Hour 0). Always use Pull Requests (PRs).
2. **Never touch someone else's files** without verbally asking them in Discord/hackathon table.
3. **Do NOT commit `.env` files**:
   - Create `.env.example` with dummy keys:
     ```env
     VITE_SUPABASE_URL=https://xyz.supabase.co
     VITE_SUPABASE_ANON_KEY=your_key_here
     GEMINI_API_KEY=your_gemini_key_here
     ```
   - Add `.env` to `.gitignore` so your API keys are never leaked publicly.
4. **Use Pre-Agreed JSON Schemas**: If you need to change a field name in the JSON (e.g. changing `target_role` to `career_goal`), announce it to the whole team FIRST before committing!

---

## 🚨 6. Emergency: How to Resolve a Git Merge Conflict in 60 Seconds

If Git throws a merge conflict during a PR or merge:

1. Open the conflicting file in **VS Code**.
2. You will see colored banners:
   - `<<<<<<< HEAD (Current Change)` (Your code)
   - `=======`
   - `>>>>>>> main (Incoming Change)` (Teammate's code)
3. Click **"Accept Both Changes"** or pick the correct version.
4. Save the file and run:
   ```bash
   git add .
   git commit -m "fix: resolved merge conflict with main"
   git push origin <your-branch-name>
   ```

---

### 🎯 Ready to Rock!
Share this guide with your 4 team members on Discord/WhatsApp so everyone knows their branch, their files, and their exact merge schedule!
