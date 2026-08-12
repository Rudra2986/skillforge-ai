from datetime import datetime
from typing import Optional, List
from sqlmodel import SQLModel, Field, Relationship


class User(SQLModel, table=True):
    __tablename__ = "user"

    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    email: str = Field(unique=True, index=True)
    hashed_password: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

    # Relationships
    resume: Optional["SavedResume"] = Relationship(back_populates="user")
    roadmaps: List["RoadmapRecord"] = Relationship(back_populates="user")


class SavedResume(SQLModel, table=True):
    __tablename__ = "saved_resume"

    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id", unique=True, index=True)
    raw_text: str
    structured_json: str  # Serialized StructuredResumeProfile
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    # Relationship
    user: Optional[User] = Relationship(back_populates="resume")


class RoadmapRecord(SQLModel, table=True):
    __tablename__ = "roadmap_record"

    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id", index=True)
    target_role: str
    readiness_score: int
    data_json: str  # Serialized FullCareerIntelligencePackage
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    # Relationship
    user: Optional[User] = Relationship(back_populates="roadmaps")
