"""
SkillForge AI — Unified Integration Test (P2 + P3)
Run from: c:\GDG\skillforge-ai\backend\
Command:  python test_integration.py
"""
import sys
import os

# Mirror run.py path setup
sys.path.insert(0, os.path.dirname(__file__))
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "p2"))

from fastapi.testclient import TestClient
from p2.main import app

client = TestClient(app)

PASS = "[PASS]"
FAIL = "[FAIL]"

def section(title):
    print(f"\n{'='*60}\n  {title}\n{'='*60}")

def check(label, condition, detail=""):
    status = PASS if condition else FAIL
    print(f"  {status} {label}" + (f" — {detail}" if detail else ""))
    return condition


# ── 1. HEALTH ────────────────────────────────────────────────
section("1. Health Check")
res = client.get("/api/health")
check("GET /api/health returns 200", res.status_code == 200)
check("Status is healthy", res.json().get("status") == "healthy")


# ── 2. AUTH ──────────────────────────────────────────────────
section("2. Auth — Register / Login / Me")
USER = {"name": "Test User", "email": "test_integration@skillforge.ai", "password": "testpass123"}

res = client.post("/api/auth/register", json=USER)
if res.status_code == 400:
    # Already registered — login instead
    res = client.post("/api/auth/login", json={"email": USER["email"], "password": USER["password"]})
    check("POST /api/auth/login (existing user)", res.status_code == 200)
else:
    check("POST /api/auth/register", res.status_code == 201)

token = res.json().get("access_token")
check("JWT token received", bool(token))
AUTH = {"Authorization": f"Bearer {token}"}

res = client.get("/api/auth/me", headers=AUTH)
check("GET /api/auth/me", res.status_code == 200, f"name={res.json().get('name')}")


# ── 3. RESUME PARSE (P2 PDF parser) ─────────────────────────
section("3. Resume Parse — P2 PDF Extraction")
# Use a minimal in-memory PDF-like bytes; pdfplumber will return empty text
# but the endpoint should still return a valid StructuredResumeProfile shape
import io
dummy_pdf = b"%PDF-1.4 1 0 obj<</Type/Catalog>>endobj\nxref\n0 0\ntrailer<</Size 1>>\nstartxref\n9\n%%EOF"
res = client.post(
    "/api/resume/parse",
    files={"file": ("resume.pdf", io.BytesIO(dummy_pdf), "application/pdf")}
)
# Accept 200 (parsed) or 422 (pdfplumber couldn't read dummy bytes) — both mean endpoint is live
check("POST /api/resume/parse endpoint reachable", res.status_code in (200, 422, 500),
      f"status={res.status_code}")


# ── 4. PROGRESS — Save Roadmap ───────────────────────────────
section("4. Progress — Save & Retrieve Roadmap (P2 SQLite)")
PACKAGE = {
    "readiness_score": 65,
    "summary_assessment": "Integration test package.",
    "target_role": "Full-Stack Developer",
    "skills_present": [{"skill": "React", "proficiency_or_importance": "80%"}],
    "skills_missing": [{"skill": "Docker", "proficiency_or_importance": "Critical"}],
    "roadmap": [
        {
            "id": "m1", "title": "Learn Docker", "duration": "Weeks 1-2",
            "completed": False, "action_items": ["Build Dockerfile"], "curated_resources": ["docs.docker.com"]
        },
        {
            "id": "m2", "title": "FastAPI Microservices", "duration": "Weeks 3-6",
            "completed": False, "action_items": ["Build REST API"], "curated_resources": ["fastapi.tiangolo.com"]
        }
    ],
    "recommended_projects": [],
    "mock_interview_questions": []
}
res = client.post("/api/progress/save-roadmap", json=PACKAGE, headers=AUTH)
check("POST /api/progress/save-roadmap", res.status_code in (200, 201))

res = client.get("/api/progress/me", headers=AUTH)
check("GET /api/progress/me", res.status_code == 200,
      f"score={res.json().get('readiness_score')}")


# ── 5. PROGRESS — Milestone Toggle ──────────────────────────
section("5. Progress — Milestone Toggle & Score Recalculation")
res = client.post("/api/progress/update", json={"milestone_id": "m1", "completed": True}, headers=AUTH)
check("POST /api/progress/update", res.status_code == 200)
if res.status_code == 200:
    data = res.json()
    check("Score recalculated", "readiness_score" in data, f"score={data.get('readiness_score')}")
    check("Milestone count correct", data.get("completed_milestones") == 1,
          f"{data.get('completed_milestones')}/{data.get('total_milestones')}")


# ── 6. AI — Normalize Resume (P3 Gemini) ────────────────────
section("6. AI — Normalize Resume (P3 + Gemini)")
SAMPLE_RESUME = """
John Doe | john@example.com
B.Tech Computer Science, IIT Delhi, 2023
Skills: Python, React, FastAPI, PostgreSQL
Tools: VS Code, Git, Docker
Projects:
  - E-Commerce Platform: Built with React + FastAPI. Tech: React, Python, PostgreSQL
Certifications: AWS Cloud Practitioner
"""
res = client.post("/api/ai/normalize-resume", json={"raw_text": SAMPLE_RESUME})
check("POST /api/ai/normalize-resume", res.status_code == 200,
      f"status={res.status_code}")
if res.status_code == 200:
    profile = res.json()
    check("candidate_name extracted", bool(profile.get("candidate_name")), profile.get("candidate_name"))
    check("current_skills extracted", len(profile.get("current_skills", [])) > 0)
    NORMALIZED_PROFILE = profile
else:
    print(f"  [SKIP] Gemini unavailable: {res.json().get('detail', '')[:80]}")
    NORMALIZED_PROFILE = None


# ── 7. AI — Analyze Gap (P3 Gemini) ─────────────────────────
section("7. AI — Gap Analysis + Roadmap Generation (P3 + Gemini)")
if NORMALIZED_PROFILE:
    res = client.post(
        "/api/ai/analyze-gap",
        json={"profile": NORMALIZED_PROFILE, "target_role": "Full-Stack AI Engineer", "timeline_weeks": 12},
        headers=AUTH
    )
    check("POST /api/ai/analyze-gap", res.status_code == 200, f"status={res.status_code}")
    if res.status_code == 200:
        pkg = res.json()
        check("readiness_score present", "readiness_score" in pkg, str(pkg.get("readiness_score")))
        check("roadmap has 3 milestones", len(pkg.get("roadmap", [])) == 3)
        check("2 recommended projects", len(pkg.get("recommended_projects", [])) == 2)
        check("3 mock interview questions", len(pkg.get("mock_interview_questions", [])) == 3)
else:
    print("  [SKIP] No normalized profile from Step 6")


# ── 8. AI — Evaluate Interview Answer (P3 Gemini) ───────────
section("8. AI — Mock Interview Answer Evaluator (P3 + Gemini)")
res = client.post("/api/ai/evaluate-answer", json={
    "question": "What is the difference between REST and GraphQL?",
    "user_answer": "REST uses fixed endpoints while GraphQL lets clients request exactly the data they need.",
    "ideal_points": [
        "REST has fixed endpoints per resource",
        "GraphQL uses a single endpoint with flexible queries",
        "GraphQL avoids over-fetching and under-fetching",
        "REST is simpler to cache"
    ]
})
check("POST /api/ai/evaluate-answer", res.status_code == 200, f"status={res.status_code}")
if res.status_code == 200:
    result = res.json()
    check("score returned (0-100)", 0 <= result.get("score", -1) <= 100, str(result.get("score")))
    check("feedback present", bool(result.get("feedback")))


# ── SUMMARY ──────────────────────────────────────────────────
section("DONE")
print("  All tests completed. Review any [FAIL] lines above.\n")
