import json
from typing import Optional
from fastapi import APIRouter, Depends, File, UploadFile, HTTPException, status
from sqlmodel import Session, select

from p2.database import get_db
from p2.models import SavedResume, User
from p2.schemas import StructuredResumeProfile
from p2.services.pdf_parser import extract_raw_text_from_pdf, parse_resume_to_structured_profile
from p3.services.gemini_service import normalize_resume
from p2.services.auth_service import get_current_user

router = APIRouter(prefix="/api/resume", tags=["Resume Ingestion"])


@router.post("/parse", response_model=StructuredResumeProfile)
async def parse_uploaded_resume(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    """
    Ingests an uploaded PDF resume file.
    Extracts text using pdfplumber, normalizes competencies with Groq LLM,
    and returns structured candidate JSON profile.
    """
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only PDF files are supported."
        )

    contents = await file.read()
    if not contents:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Uploaded file is empty."
        )

    raw_text = extract_raw_text_from_pdf(contents)
    if not raw_text or len(raw_text.strip()) < 30:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Could not extract readable text from this PDF. Please ensure the PDF has selectable text."
        )

    try:
        # Use Groq LLM for intelligent resume parsing
        structured_profile = normalize_resume(raw_text)
    except Exception as e:
        # Fallback to local heuristic parser
        structured_profile = parse_resume_to_structured_profile(raw_text)

    # Validate if the document is an actual resume
    if (
        structured_profile.candidate_name in ["Unrecognized Document", "Unknown Document"]
        or (not structured_profile.current_skills and not structured_profile.projects)
    ):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="The uploaded PDF does not appear to be a candidate resume or technical CV. Please upload a valid developer resume."
        )

    return structured_profile


@router.get("/me", response_model=StructuredResumeProfile)
def get_user_saved_resume(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Fetches the current user's saved resume profile from SQLite."""
    saved_resume = db.exec(
        select(SavedResume).where(SavedResume.user_id == current_user.id)
    ).first()

    if not saved_resume:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No saved resume found for this user."
        )

    data = json.loads(saved_resume.structured_json)
    return StructuredResumeProfile.model_validate(data)
