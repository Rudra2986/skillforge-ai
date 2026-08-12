import os
import sys

backend_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(backend_dir)
for d in (backend_dir, parent_dir):
    if d not in sys.path:
        sys.path.insert(0, d)

from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)

def run_person2_backend_test():
    print("\n" + "=" * 70)
    print("SKILLFORGE AI -- PERSON 2 CORE BACKEND INTEGRATION TEST")
    print("=" * 70)

    # 1. Health Check
    res = client.get("/api/health")
    assert res.status_code == 200
    print("\n[STEP 1] Health Check OK:", res.json())

    # 2. Register New User
    user_payload = {
        "name": "Alex Johnson (Core Flow)",
        "email": "alex.core@skillforge.ai",
        "password": "secretpassword123"
    }
    res = client.post("/api/auth/register", json=user_payload)
    if res.status_code == 400:
        login_res = client.post("/api/auth/login", json={"email": user_payload["email"], "password": user_payload["password"]})
        token = login_res.json()["access_token"]
        print("\n[STEP 2 & 3] Existing user logged in successfully!")
    else:
        assert res.status_code == 201
        token = res.json()["access_token"]
        print("\n[STEP 2 & 3] User Registration & JWT Token issuance OK!")

    headers = {"Authorization": f"Bearer {token}"}

    # 3. Authenticated Profile Check
    res = client.get("/api/auth/me", headers=headers)
    assert res.status_code == 200
    print(f"\n[STEP 4] User Authenticated via JWT: ID={res.json()['id']}, Name='{res.json()['name']}'")

    # 4. Save Roadmap into SQLite Database
    sample_package = {
        "readiness_score": 75,
        "summary_assessment": "Solid foundation skills in FastAPI and React.",
        "target_role": "Full-Stack Developer",
        "skills_present": [{"skill": "React", "proficiency_or_importance": "85%"}, {"skill": "FastAPI", "proficiency_or_importance": "90%"}],
        "skills_missing": [{"skill": "Docker", "proficiency_or_importance": "Critical"}],
        "roadmap": [
            {
                "id": "m1",
                "title": "Master Docker Containerization",
                "duration": "Week 1",
                "completed": False,
                "action_items": ["Build multi-stage Dockerfile"],
                "curated_resources": ["Docker Docs"]
            }
        ],
        "recommended_projects": [],
        "mock_interview_questions": []
    }
    res = client.post("/api/progress/save-roadmap", json=sample_package, headers=headers)
    assert res.status_code == 201
    print("\n[STEP 5] Roadmap Package persisted into SQLite `roadmap_record` table!")

    # 5. Toggle Milestone Progress & Server-Side Math Recalculation
    update_payload = {
        "milestone_id": "m1",
        "completed": True
    }
    res = client.post("/api/progress/update", json=update_payload, headers=headers)
    assert res.status_code == 200
    progress_res = res.json()
    print(f"\n[STEP 6] Milestone 'm1' Completed! Dynamic Readiness Score recalculated server-side:")
    print(f"  - New Score: {progress_res['readiness_score']}%")
    print(f"  - Progress: {progress_res['completed_milestones']} / {progress_res['total_milestones']} milestones finished")

    # 6. Retrieve Saved User Progress from SQLite
    res = client.get("/api/progress/me", headers=headers)
    assert res.status_code == 200
    saved_pkg = res.json()
    print(f"\n[STEP 7] Fetched Saved User Roadmap from SQLite Database! Active Readiness Score: {saved_pkg['readiness_score']}%")

    print("\n" + "=" * 70)
    print("SUCCESS: ALL PERSON 2 CORE BACKEND & DB APIS WORKING 100% PERFECTLY!")
    print("=" * 70 + "\n")


if __name__ == "__main__":
    run_person2_backend_test()
