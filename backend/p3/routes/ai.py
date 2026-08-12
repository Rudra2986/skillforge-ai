from fastapi import APIRouter, HTTPException, status, Depends
from pydantic import BaseModel
from typing import List, Optional

from p2.schemas import StructuredResumeProfile, FullCareerIntelligencePackage
from p3.services.gemini_service import normalize_resume, analyze_gap, evaluate_interview_answer
from p2.services.auth_service import get_current_user
from p2.models import User

router = APIRouter(prefix="/api/ai", tags=["AI Intelligence"])


# ── Request Bodies ────────────────────────────────────────────────────────────

class NormalizeResumeRequest(BaseModel):
    raw_text: str


class AnalyzeGapRequest(BaseModel):
    profile: StructuredResumeProfile
    target_role: str
    timeline_weeks: Optional[int] = 12


class EvaluateAnswerRequest(BaseModel):
    question: str
    user_answer: str
    ideal_points: List[str]


# ── Endpoints ─────────────────────────────────────────────────────────────────

@router.post("/normalize-resume", response_model=StructuredResumeProfile)
def normalize_resume_endpoint(body: NormalizeResumeRequest):
    """
    Stage 1 — Resume Normalization.
    Takes raw PDF text (from POST /api/resume/parse) and uses Gemini to
    extract a clean StructuredResumeProfile for the human-in-the-loop review modal.
    """
    if not body.raw_text or len(body.raw_text.strip()) < 50:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="raw_text is too short to extract a meaningful profile."
        )
    try:
        return normalize_resume(body.raw_text)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"Gemini normalization failed: {str(e)}"
        )


@router.post("/analyze-gap", response_model=FullCareerIntelligencePackage)
def analyze_gap_endpoint(
    body: AnalyzeGapRequest,
    current_user: User = Depends(get_current_user)
):
    """
    Stage 2 — Skill Gap Analysis & Roadmap Generation.
    Takes the human-verified StructuredResumeProfile + target role and returns
    the full FullCareerIntelligencePackage (score, roadmap, projects, Q&A).
    Requires JWT Bearer token (authenticated users only).
    """
    if not body.target_role.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="target_role cannot be empty."
        )
    try:
        return analyze_gap(body.profile, body.target_role, body.timeline_weeks)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"Gemini gap analysis failed: {str(e)}"
        )


@router.post("/evaluate-answer")
def evaluate_answer_endpoint(body: EvaluateAnswerRequest):
    """
    Stage 3 — Mock Interview Answer Evaluator.
    Scores the student's answer against ideal answer points.
    Returns score (0-100), feedback, strengths, and missed points.
    Used by Person 4's MockInterviewHub.jsx component.
    """
    if not body.user_answer.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="user_answer cannot be empty."
        )
    try:
        return evaluate_interview_answer(
            body.question,
            body.user_answer,
            body.ideal_points
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"Gemini evaluation failed: {str(e)}"
        )
