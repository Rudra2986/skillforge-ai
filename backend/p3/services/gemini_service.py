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
    if "```" in text:
        parts = text.split("```")
        for part in parts:
            p = part.strip()
            if p.startswith("json"):
                p = p[4:].strip()
            if p.startswith("{") and p.endswith("}"):
                try:
                    return json.loads(p)
                except Exception:
                    pass

    first_brace = text.find("{")
    last_brace = text.rfind("}")
    if first_brace != -1 and last_brace != -1 and last_brace > first_brace:
        return json.loads(text[first_brace:last_brace + 1])

    return json.loads(text)


def normalize_resume(raw_text: str) -> StructuredResumeProfile:
    prompt = f"""
You are an expert AI Resume Parser and Document Classifier.
Carefully analyze the text from the uploaded PDF document below.

STRICT INSTRUCTIONS:
1. Extract ONLY factual information that is explicitly stated in the document text.
2. If the document is NOT a resume or CV (for example: it is a college practical list, course syllabus, assignment sheet, question bank, invoice, research paper, or general document):
   - Set "is_valid_resume" to false.
   - Set "candidate_name" to "Unrecognized Document".
   - Set "current_skills" to [].
   - Set "projects" to [].
   - Set "education" to "".
3. If it IS a genuine candidate resume or curriculum vitae:
   - Set "is_valid_resume" to true.
   - Extract candidate's real full name.
   - Extract candidate's real contact email if present.
   - Extract candidate's real degree, branch, university, and graduation year.
   - Extract technical skills, programming languages, and frameworks explicitly stated.
   - Extract listed portfolio projects with tech stacks and descriptions.
   - Extract listed industry certifications.

Return ONLY a valid JSON object with these exact keys:
{{
  "is_valid_resume": true or false,
  "candidate_name": "string",
  "contact_email": "string or null",
  "education": "string",
  "current_skills": ["list of technical skills"],
  "tools_and_platforms": ["list of tools, IDEs, platforms"],
  "projects": [
    {{
      "title": "string",
      "tech_stack": ["list of tech used"],
      "description": "string"
    }}
  ],
  "certifications": ["list of certifications, empty if none"]
}}

Document Text:
\"\"\"
{raw_text[:8000]}
\"\"\"
"""
    data = _parse_json_response(_chat(prompt))

    if not data.get("is_valid_resume", True):
        # Document is not a resume
        return StructuredResumeProfile(
            candidate_name=data.get("candidate_name", "Unrecognized Document"),
            contact_email=data.get("contact_email"),
            education="",
            current_skills=[],
            tools_and_platforms=[],
            projects=[],
            certifications=[],
        )

    projects = [
        ExtractedProject(
            title=p.get("title", "Untitled Project"),
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

Rules & Strict Requirements:
1. Target Role Relevancy:
   - All generated gaps, milestones, and projects MUST be 100% relevant to the target role: "{target_role}".
   - For Full-Stack / AI Engineer: Focus strictly on full-stack architecture, API design, scalable databases, state management, caching, vector search (RAG/LangChain/pgvector), and cloud deployment. Do NOT suggest generic off-topic courses like basic Computer Vision unless specifically asked.
   - For Data Science / ML: Focus strictly on advanced ML modeling, PySpark, MLOps, Airflow pipelines, and production inference.
2. Accurate Gap Detection:
   - Cross-reference the student's "Current Skills" and "Tools & Platforms".
   - CRITICAL: Do NOT list any skill in "skills_missing" that the student ALREADY possesses.
   - "skills_missing" must contain 3-5 specific, modern, industry-standard competencies that are genuinely absent from the student's resume and necessary to be hired as a {target_role} (e.g. "Redis & In-Memory Caching", "LangChain & Vector Embeddings", "Kubernetes Orchestration", "Next.js & SSR", "GraphQL API Design", "AWS Cloud Architecture").
3. Roadmap & Projects:
   - "roadmap" must have exactly 3 milestones covering the {timeline_weeks}-week timeline, designed to close the identified "skills_missing".
   - "recommended_projects" must have exactly 2 realistic, production-grade projects that demonstrate mastery of the missing competencies for {target_role}.
   - "mock_interview_questions" must have exactly 3 technical interview questions tailored to {target_role}.
4. "readiness_score" must reflect the ratio of current role-relevant skills to total role benchmark requirements (0-100).

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

    current_skills_lower = {s.lower().strip() for s in (profile.current_skills or []) + (profile.tools_and_platforms or [])}

    cleaned_skills_missing = []
    for s in data.get("skills_missing", []):
        skill_name = s.get("skill", "").strip()
        if skill_name and skill_name.lower() not in current_skills_lower:
            cleaned_skills_missing.append(
                SkillItem(
                    skill=skill_name,
                    proficiency_or_importance=s.get("proficiency_or_importance", "High Priority"),
                )
            )

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
        skills_missing=cleaned_skills_missing,
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
