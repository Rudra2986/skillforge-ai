from typing import List, Dict, Any


def calculate_placement_readiness_score(
    roadmap_milestones: List[Dict[str, Any]],
    current_skills_count: int = 5,
    base_score: int = 55
) -> int:
    """
    Calculates dynamic Placement Readiness Score (0 - 100%).
    
    Formula:
    Base Score (55) + (Completed Milestones / Total Milestones * 30) + Skill Count Bonus (up to 15)
    """
    if not roadmap_milestones:
        return base_score

    total_milestones = len(roadmap_milestones)
    completed_count = sum(1 for m in roadmap_milestones if m.get("completed", False))

    # Milestone Completion Bonus (0 - 30 points)
    milestone_bonus = int((completed_count / total_milestones) * 30)

    # Verified Skill Bonus (0 - 15 points, maxed at 15 skills)
    skill_bonus = min(15, current_skills_count)

    final_score = base_score + milestone_bonus + skill_bonus
    return min(100, max(0, final_score))
