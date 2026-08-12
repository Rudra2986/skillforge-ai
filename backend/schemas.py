from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, EmailStr, Field

# ==========================================
# 🔑 AUTHENTICATION SCHEMAS
# ==========================================

class UserRegister(BaseModel):
    name: str = Field(..., example="Alex Johnson")
    email: EmailStr = Field(..., example="alex@example.com")
    password: str = Field(..., min_length=6, example="secret123")


class UserLogin(BaseModel):
    email: EmailStr = Field(..., example="alex@example.com")
    password: str = Field(..., example="secret123")


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: "UserOut"


class TokenData(BaseModel):
    user_id: Optional[int] = None
    email: Optional[str] = None


class UserOut(BaseModel):
    id: int
    name: str
    email: EmailStr
    created_at: datetime

    class Config:
        from_attributes = True


# ==========================================
# 📄 RESUME & PROFILE SCHEMAS
# ==========================================

class ExtractedProject(BaseModel):
    title: str
    tech_stack: List[str] = []
    description: str


class StructuredResumeProfile(BaseModel):
    candidate_name: str
    contact_email: Optional[str] = None
    education: str
    current_skills: List[str] = []
    tools_and_platforms: List[str] = []
    projects: List[ExtractedProject] = []
    certifications: List[str] = []


# ==========================================
# 🧠 INTELLIGENCE & ROADMAP SCHEMAS
# ==========================================

class SkillItem(BaseModel):
    skill: str
    proficiency_or_importance: str  # e.g., "85%" or "Critical"


class RoadmapMilestone(BaseModel):
    id: str
    title: str
    duration: str
    completed: bool = False
    action_items: List[str] = []
    curated_resources: List[str] = []


class ProjectBlueprint(BaseModel):
    id: str
    title: str
    difficulty: str  # e.g., "Intermediate", "Advanced"
    skills_gained: List[str] = []
    architecture_overview: str
    github_starter_steps: List[str] = []


class MockInterviewQnA(BaseModel):
    id: str
    topic: str
    question: str
    ideal_answer_points: List[str] = []


class FullCareerIntelligencePackage(BaseModel):
    readiness_score: int
    summary_assessment: str
    target_role: Optional[str] = "Full-Stack Developer"
    skills_present: List[SkillItem] = []
    skills_missing: List[SkillItem] = []
    roadmap: List[RoadmapMilestone] = []
    recommended_projects: List[ProjectBlueprint] = []
    mock_interview_questions: List[MockInterviewQnA] = []


# ==========================================
# 📈 PROGRESS & MATH SCHEMAS
# ==========================================

class ProgressUpdatePayload(BaseModel):
    milestone_id: str
    completed: bool


class ProgressResponse(BaseModel):
    readiness_score: int
    completed_milestones: int
    total_milestones: int
    updated_at: datetime
