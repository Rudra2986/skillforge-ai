import sys
import os

# Ensure backend package import resolution
backend_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(backend_dir)
for d in (backend_dir, parent_dir):
    if d not in sys.path:
        sys.path.insert(0, d)

from sqlmodel import Session, select

try:
    from p2.database import engine
    from p2.models import User, SavedResume, RoadmapRecord
except ImportError:
    from database import engine
    from models import User, SavedResume, RoadmapRecord


import httpx

LIVE_BACKEND_URL = "https://skillforge-ai-backend-7f8r.onrender.com"


def show_live_database():
    """Fetches and prints the live database hosted on Render."""
    print("=" * 65)
    print(f"SKILLFORGE AI -- LIVE PRODUCTION CLOUD DB ({LIVE_BACKEND_URL})")
    print("=" * 65)
    try:
        r = httpx.get(f"{LIVE_BACKEND_URL}/api/admin/database", timeout=15.0)
        if r.status_code != 200:
            print(f"Error connecting to live server: Status {r.status_code}")
            return
        data = r.json()

        # Users
        users = data.get("users", [])
        print(f"\n[USERS TABLE] ({len(users)} rows):")
        print("-" * 65)
        for u in users:
            print(f"  ID: {u['id']:<4} | Name: {u['name']:<18} | Email: {u['email']:<25} | Created: {u['created_at']}")

        # Resumes
        resumes = data.get("saved_resumes", [])
        print(f"\n[SAVED RESUMES TABLE] ({len(resumes)} rows):")
        print("-" * 65)
        for res in resumes:
            print(f"  ID: {res['id']:<4} | User ID: {res['user_id']:<4} | Updated: {res['updated_at']}")
            print(f"    Raw Text Preview: {res['raw_text_preview']}")

        # Roadmaps
        roadmaps = data.get("roadmaps", [])
        print(f"\n[ROADMAP RECORDS TABLE] ({len(roadmaps)} rows):")
        print("-" * 65)
        for rm in roadmaps:
            print(f"  ID: {rm['id']:<4} | User ID: {rm['user_id']:<4} | Role: {rm['target_role']:<22} | Score: {rm['readiness_score']}%")

        print("\n" + "=" * 65)
    except Exception as e:
        print(f"Failed to fetch live database: {e}")


def show_database():
    """Prints formatted summary of all SQLite tables and rows."""
    print("=" * 65)
    print("SKILLFORGE AI -- LOCAL SQLITE DATABASE VIEWER (skillforge.db)")
    print("=" * 65)

    with Session(engine) as session:
        # 1. Users Table
        users = session.exec(select(User)).all()
        print(f"\n[USERS TABLE] ({len(users)} rows):")
        print("-" * 65)
        for u in users:
            print(f"  ID: {u.id:<4} | Name: {u.name:<18} | Email: {u.email:<25} | Created: {u.created_at}")

        # 2. Saved Resumes Table
        resumes = session.exec(select(SavedResume)).all()
        print(f"\n[SAVED RESUMES TABLE] ({len(resumes)} rows):")
        print("-" * 65)
        for r in resumes:
            print(f"  ID: {r.id:<4} | User ID: {r.user_id:<4} | Updated: {r.updated_at}")
            preview = r.raw_text[:70].replace('\n', ' ') if r.raw_text else ""
            print(f"    Raw Text Preview: {preview}...")

        # 3. Roadmap Records Table
        roadmaps = session.exec(select(RoadmapRecord)).all()
        print(f"\n[ROADMAP RECORDS TABLE] ({len(roadmaps)} rows):")
        print("-" * 65)
        for rm in roadmaps:
            print(f"  ID: {rm.id:<4} | User ID: {rm.user_id:<4} | Role: {rm.target_role:<22} | Score: {rm.readiness_score}%")

    print("\n" + "=" * 65)


if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] in ("--live", "-l", "live"):
        show_live_database()
    else:
        # If run with no args, print both local and live for convenience!
        show_database()
        print("\n")
        show_live_database()
