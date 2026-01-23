from app.core.priority import calculate_priority, classify_priority
from app.core.planner import generate_daily_plan
from app.core.analytics import generate_analytics
from app.services.advisor_ai import get_next_action
from app.core.weekly_planner import generate_weekly_plan
from app.db import SessionLocal


def generate_roadmap(survey: dict, chapters: list, context: dict):
    roadmap = []

    # ---------------- PRIORITY ENGINE ----------------
    for chapter in chapters:
        score = calculate_priority(chapter, context)
        label = classify_priority(score)

        roadmap.append({
            "chapter": chapter["name"],
            "student_level": chapter["student_level"],
            "priority_score": score,
            "priority_label": label
        })

    roadmap.sort(key=lambda x: x["priority_score"], reverse=True)

    db = SessionLocal()

    # ---------------- WEEKLY PLAN (SINGLE SOURCE) ----------------
    weekly_plan = generate_weekly_plan(
        db=db,
        roadmap=roadmap,
        total_hours_per_week=survey["daily_self_study_hours"] * 7
    )

    # ---------------- ADVISOR (AUTO) ----------------
    top = roadmap[0]

    advice_message = get_next_action(
        chapter=top["chapter"],
        student_level=top["student_level"],
        priority=top["priority_label"],
        months_left=context["months_left"]
    )

    advice = {
        "chapter": top["chapter"],
        "priority": top["priority_label"],
        "message": advice_message
    }

    # ---------------- DAILY PLAN & ANALYTICS ----------------
    daily_plan = generate_daily_plan(survey)
    analytics = generate_analytics(roadmap)

    return {
        "roadmap": roadmap,
        "weekly_plan": weekly_plan,
        "daily_plan": daily_plan,
        "advice": advice,
        "analytics": analytics
    }
