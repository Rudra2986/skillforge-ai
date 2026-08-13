# 🚀 SkillForge AI — Core Backend Handoff & Frontend Integration Guide

> **To**: Frontend Lead (Person 1), AI Specialist (Person 3), Roadmap Lead (Person 4)  
> **From**: Person 2 (Core Backend & DB Lead)  
> **Backend Base URL**: `http://localhost:8000`  
> **Interactive Swagger API Docs**: `http://localhost:8000/docs`  

---

## 📁 1. Complete Workspace Folder Structure

```
skillforge-ai/
├── client/                                    # FRONTEND (React + Vite) - Owned by Person 1 & Person 4
│   ├── src/
│   │   ├── context/
│   │   │   ├── AuthContext.jsx                # Auth state (Connect to /api/auth/*)
│   │   │   └── CareerContext.jsx              # Career state (Connect to /api/progress/*)
│   │   ├── components/
│   │   │   ├── AuthModal.jsx                  # Sign In / Sign Up Modal
│   │   │   ├── ResumeUploader.jsx             # PDF Upload Dropzone (Connect to /api/resume/parse)
│   │   │   ├── ProfileReviewModal.jsx         # Skill verification & Target role selector
│   │   │   ├── ReadinessScoreCard.jsx         # Radial donut gauge
│   │   │   ├── RoadmapTimeline.jsx            # Interactive Milestone Timeline
│   │   │   └── MockInterviewHub.jsx           # AI Mock Interview Practice
│   │   ├── App.jsx
│   │   └── index.css
│   └── package.json
│
└── backend/                                   # CORE BACKEND (FastAPI + SQLite) - Completed by Person 2
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

## 🛠️ 2. Summary of Completed Backend Work (Person 2)

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

## 📡 3. REST API Endpoint Specification

### 🔑 Authentication API (`/api/auth`)

#### 1. Register New User
* **Endpoint**: `POST /api/auth/register`
* **Request Body**:
  ```json
  {
    "name": "Alex Johnson",
    "email": "alex@skillforge.ai",
    "password": "password123"
  }
  ```
* **Response (201 Created)**:
  ```json
  {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "token_type": "bearer",
    "user": {
      "id": 1,
      "name": "Alex Johnson",
      "email": "alex@skillforge.ai",
      "created_at": "2026-08-12T03:21:28.938885"
    }
  }
  ```

#### 2. User Login
* **Endpoint**: `POST /api/auth/login`
* **Request Body**:
  ```json
  {
    "email": "alex@skillforge.ai",
    "password": "password123"
  }
  ```
* **Response (200 OK)**: Returns JWT `access_token` and `user` object.

#### 3. Get Authenticated User Session
* **Endpoint**: `GET /api/auth/me`
* **Header**: `Authorization: Bearer <access_token>`
* **Response (200 OK)**: Returns current authenticated `UserOut` profile.

---

### 📄 Resume PDF Extraction API (`/api/resume`)

#### 1. Parse Uploaded PDF Resume
* **Endpoint**: `POST /api/resume/parse`
* **Content-Type**: `multipart/form-data`
* **Form Field**: `file` (PDF file)
* **Response (200 OK)**:
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

---

### 🧠 Progress Recalculation & Roadmap Persistence API (`/api/progress`)

#### 1. Toggle Milestone & Recalculate Score
* **Endpoint**: `POST /api/progress/update`
* **Header**: `Authorization: Bearer <access_token>`
* **Request Body**:
  ```json
  {
    "milestone_id": "m1",
    "completed": true
  }
  ```
* **Response (200 OK)**:
  ```json
  {
    "readiness_score": 85,
    "completed_milestones": 1,
    "total_milestones": 3,
    "updated_at": "2026-08-12T03:30:00"
  }
  ```

#### 2. Save Full Career Intelligence Package
* **Endpoint**: `POST /api/progress/save-roadmap`
* **Header**: `Authorization: Bearer <access_token>`
* **Request Body**: Full `FullCareerIntelligencePackage` JSON object.

#### 3. Fetch Saved Roadmap
* **Endpoint**: `GET /api/progress/me`
* **Header**: `Authorization: Bearer <access_token>`
* **Response (200 OK)**: Saved `FullCareerIntelligencePackage` object.

---

## 💻 4. Frontend Code Integration Snippets for Person 1 & Person 4

### A. Wiring Auth in `AuthContext.jsx` (Person 1)
```javascript
// Register User
const registerUser = async (name, email, password) => {
  const response = await fetch('http://localhost:8000/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password })
  });
  const data = await response.json();
  if (response.ok) {
    localStorage.setItem('token', data.access_token);
    setUser(data.user);
  }
};

// Login User
const loginUser = async (email, password) => {
  const response = await fetch('http://localhost:8000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const data = await response.json();
  if (response.ok) {
    localStorage.setItem('token', data.access_token);
    setUser(data.user);
  }
};
```

### B. Wiring PDF Resume Upload in `ResumeUploader.jsx` (Person 1)
```javascript
const uploadPDFResume = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch('http://localhost:8000/api/resume/parse', {
    method: 'POST',
    body: formData
  });

  const extractedProfile = await response.json();
  return extractedProfile; // Pass directly to ProfileReviewModal.jsx
};
```

### C. Wiring Milestone Progress in `RoadmapTimeline.jsx` (Person 4)
```javascript
const toggleMilestoneOnServer = async (milestoneId, isCompleted) => {
  const token = localStorage.getItem('token');
  const response = await fetch('http://localhost:8000/api/progress/update', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      milestone_id: milestoneId,
      completed: isCompleted
    })
  });

  const updatedProgress = await response.json();
  // Updates readiness_score automatically!
};
```

---

## ⚡ 5. How to Launch Backend Locally

```powershell
# From workspace root directory (C:\Users\marsh\Desktop\GDG Hackthon):
python -m uvicorn backend.main:app --reload --port 8000
```
Open **`http://localhost:8000/docs`** to verify API health and test endpoints!
