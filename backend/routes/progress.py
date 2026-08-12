import json
from datetime import datetime
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select

from backend.database import get_db
from backend.models import RoadmapRecord, User
from backend.schemas import (
    ProgressUpdatePayload,
    ProgressResponse,
    FullCareerIntelligencePackage
)
from backend.services.auth_service import get_current_user
from backend.services.progress_math import calculate_placement_readiness_score

router = APIRouter(prefix="/api/progress", tags=["Progress & Roadmap Persistence"])


@router.post("/save-roadmap", response_model=RoadmapRecord, status_code=status.HTTP_201_CREATED)
def save_user_career_roadmap(
    package: FullCareerIntelligencePackage,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Saves or updates the generated FullCareerIntelligencePackage into SQLite database for the user.
    """
    existing_record = db.exec(
        select(RoadmapRecord).where(RoadmapRecord.user_id == current_user.id)
    ).first()

    data_json_str = package.model_dump_json()

    if existing_record:
        existing_record.target_role = package.target_role or "Full-Stack Developer"
        existing_record.readiness_score = package.readiness_score
        existing_record.data_json = data_json_str
        existing_record.updated_at = datetime.utcnow()
        db.add(existing_record)
        db.commit()
        db.refresh(existing_record)
        return existing_record
    else:
        new_record = RoadmapRecord(
            user_id=current_user.id,
            target_role=package.target_role or "Full-Stack Developer",
            readiness_score=package.readiness_score,
            data_json=data_json_str
        )
        db.add(new_record)
        db.commit()
        db.refresh(new_record)
        return new_record


@router.post("/update", response_model=ProgressResponse)
def update_milestone_progress(
    payload: ProgressUpdatePayload,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Toggles milestone completion status and recalculates Placement Readiness Score server-side.
    """
    roadmap_record = db.exec(
        select(RoadmapRecord).where(RoadmapRecord.user_id == current_user.id)
    ).first()

    if not roadmap_record:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No active roadmap found for current user."
        )

    data_dict = json.loads(roadmap_record.data_json)
    milestones = data_dict.get("roadmap", [])

    milestone_found = False
    for m in milestones:
        if m.get("id") == payload.milestone_id:
            m["completed"] = payload.completed
            milestone_found = True
            break

    if not milestone_found:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Milestone with ID '{payload.milestone_id}' not found."
        )

    new_score = calculate_placement_readiness_score(
        roadmap_milestones=milestones,
        current_skills_count=len(data_dict.get("skills_present", []))
    )

    data_dict["readiness_score"] = new_score
    data_dict["roadmap"] = milestones

    roadmap_record.readiness_score = new_score
    roadmap_record.data_json = json.dumps(data_dict)
    roadmap_record.updated_at = datetime.utcnow()

    db.add(roadmap_record)
    db.commit()
    db.refresh(roadmap_record)

    completed_count = sum(1 for m in milestones if m.get("completed", False))

    return ProgressResponse(
        readiness_score=new_score,
        completed_milestones=completed_count,
        total_milestones=len(milestones),
        updated_at=roadmap_record.updated_at
    )


@router.get("/me", response_model=FullCareerIntelligencePackage)
def get_user_saved_career_package(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Fetches active user's saved roadmap intelligence package from SQLite."""
    roadmap_record = db.exec(
        select(RoadmapRecord).where(RoadmapRecord.user_id == current_user.id)
    ).first()

    if not roadmap_record:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No saved roadmap found for current user."
        )

    data = json.loads(roadmap_record.data_json)
    return FullCareerIntelligencePackage.model_validate(data)
