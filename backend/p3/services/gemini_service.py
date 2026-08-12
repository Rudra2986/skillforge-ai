import os
import json
from groq import Groq
from dotenv import load_dotenv

from p2.schemas import (
    StructuredResumeProfile,
    ExtractedProject,
    FullCareerIntelligencePackage,
    SkillItem,
    RoadmapMilestone,
    ProjectBlueprint,
    MockInterviewQnA,
)

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))
MODEL = "llama-3.3-70b-versatile"


def _chat(prompt: str) -> str:
    response = client.chat.completions.create(
        model=MODEL,
        messages=[{"role": "user", "content": prompt}],
        temperature=0.3,
    )
    return response.choices[0].message.content


def _parse_json_response(text: str) -> dict:
    text = text.strip()
    if text.startswith("```"):
        text = text.split("```")[1]
        if text.startswith("json"):
            text = text[4:]
    return json.loads(text.strip())


def normalize_resume(raw_text: str) -> StructuredResumeProfile:
    prompt = f"""
You are a resume parser. Extract structured information from the resume text below.
Return ONLY a valid JSON object with exactly these fields:
{{
  "candidate_name": "string",
  "contact_email": "string or null",
  "education": "string (degree, institution, year)",
  "current_skills": ["list of technical skills"],
  "tools_and_platforms": ["list of tools, IDEs, platforms"],
  "projects": [
    {{
      "title": "string",
      "tech_stack": ["list"],
      "description": "string"
    }}
  ],
  "certifications": ["list of certifications, empty if none"]
}}

Resume Text:
\"\"\"
{raw_text}
\"\"\"
"""
    data = _parse_json_response(_chat(prompt))

    projects = [
        ExtractedProject(
            title=p.get("title", "Untitled"),
            tech_stack=p.get("tech_stack", []),
            description=p.get("description", ""),
        )
        for p in data.get("projects", [])
    ]

    return StructuredResumeProfile(
        candidate_name=data.get("candidate_name", "Candidate"),
        contact_email=data.get("contact_email"),
        education=data.get("education", ""),
        current_skills=data.get("current_skills", []),
        tools_and_platforms=data.get("tools_and_platforms", []),
        projects=projects,
        certifications=data.get("certifications", []),
    )


def analyze_gap(
    profile: StructuredResumeProfile,
    target_role: str,
    timeline_weeks: int = 12,
) -> FullCareerIntelligencePackage:
    profile_summary = f"""
Candidate: {profile.candidate_name}
Education: {profile.education}
Current Skills: {', '.join(profile.current_skills)}
Tools & Platforms: {', '.join(profile.tools_and_platforms)}
Projects: {', '.join([p.title for p in profile.projects])}
Certifications: {', '.join(profile.certifications)}
Target Role: {target_role}
Timeline: {timeline_weeks} weeks
"""

    prompt = f"""
You are an expert career coach and technical hiring manager. Analyze the student profile below
against the target role and return ONLY a valid JSON object with exactly this structure:

{{
  "readiness_score": <integer 0-100>,
  "summary_assessment": "2-3 sentence honest assessment",
  "target_role": "{target_role}",
  "skills_present": [
    {{"skill": "string", "proficiency_or_importance": "percentage like 85%"}}
  ],
  "skills_missing": [
    {{"skill": "string", "proficiency_or_importance": "Critical|High|Medium"}}
  ],
  "roadmap": [
    {{
      "id": "m1",
      "title": "string",
      "duration": "Weeks X - Y",
      "completed": false,
      "action_items": ["3-4 specific actionable tasks"],
      "curated_resources": ["2-3 specific resource names/links"]
    }}
  ],
  "recommended_projects": [
    {{
      "id": "p1",
      "title": "string",
      "difficulty": "Beginner|Intermediate|Advanced",
      "skills_gained": ["list"],
      "architecture_overview": "2 sentence description",
      "github_starter_steps": ["3 concrete steps"]
    }}
  ],
  "mock_interview_questions": [
    {{
      "id": "q1",
      "topic": "string",
      "question": "string",
      "ideal_answer_points": ["3-4 key points"]
    }}
  ]
}}

Rules:
- roadmap must have exactly 3 milestones covering the {timeline_weeks} week timeline
- skills_missing must have 3-5 items prioritized by importance to the target role
- recommended_projects must have exactly 2 items
- mock_interview_questions must have exactly 3 items
- readiness_score must reflect actual skill gaps honestly

Student Profile:
{profile_summary}
"""

    data = _parse_json_response(_chat(prompt))

    roadmap = [
        RoadmapMilestone(
            id=m.get("id", f"m{i+1}"),
            title=m.get("title", ""),
            duration=m.get("duration", ""),
            completed=m.get("completed", False),
            action_items=m.get("action_items", []),
            curated_resources=m.get("curated_resources", []),
        )
        for i, m in enumerate(data.get("roadmap", []))
    ]

    projects = [
        ProjectBlueprint(
            id=p.get("id", f"p{i+1}"),
            title=p.get("title", ""),
            difficulty=p.get("difficulty", "Intermediate"),
            skills_gained=p.get("skills_gained", []),
            architecture_overview=p.get("architecture_overview", ""),
            github_starter_steps=p.get("github_starter_steps", []),
        )
        for i, p in enumerate(data.get("recommended_projects", []))
    ]

    questions = [
        MockInterviewQnA(
            id=q.get("id", f"q{i+1}"),
            topic=q.get("topic", ""),
            question=q.get("question", ""),
            ideal_answer_points=q.get("ideal_answer_points", []),
        )
        for i, q in enumerate(data.get("mock_interview_questions", []))
    ]

    return FullCareerIntelligencePackage(
        readiness_score=int(data.get("readiness_score", 50)),
        summary_assessment=data.get("summary_assessment", ""),
        target_role=data.get("target_role", target_role),
        skills_present=[
            SkillItem(
                skill=s.get("skill", ""),
                proficiency_or_importance=s.get("proficiency_or_importance", ""),
            )
            for s in data.get("skills_present", [])
        ],
        skills_missing=[
            SkillItem(
                skill=s.get("skill", ""),
                proficiency_or_importance=s.get("proficiency_or_importance", ""),
            )
            for s in data.get("skills_missing", [])
        ],
        roadmap=roadmap,
        recommended_projects=projects,
        mock_interview_questions=questions,
    )


def evaluate_interview_answer(
    question: str,
    user_answer: str,
    ideal_points: list[str],
) -> dict:
    prompt = f"""
You are a senior technical interviewer. Evaluate the student's answer to the interview question below.
Return ONLY a valid JSON object with exactly this structure:
{{
  "score": <integer 0-100>,
  "feedback": "2-3 sentence overall feedback",
  "strengths": ["list of things the student got right"],
  "missed_points": ["list of ideal points the student missed or was vague about"]
}}

Question: {question}

Ideal Answer Points:
{json.dumps(ideal_points, indent=2)}

Student's Answer:
\"\"\"{user_answer}\"\"\"

Scoring guide:
- 90-100: Covered all ideal points with depth
- 70-89: Covered most points, minor gaps
- 50-69: Covered some points, significant gaps
- 0-49: Missed most key points
"""
    return _parse_json_response(_chat(prompt))
