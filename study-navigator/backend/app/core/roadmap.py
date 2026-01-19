from app.core.priority import calculate_priority, classify_priority
from app.core.planner import generate_daily_plan
from app.core.analytics import generate_analytics
from app.services.advisor_ai import get_next_action


def generate_roadmap(survey: dict, chapters: list, context: dict):
    roadmap = []

    # ---------------- PRIORITY ----------------
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

    # ---------------- DAILY PLAN ----------------
    timetable = generate_daily_plan(survey)

    # ---------------- ANALYTICS ----------------
    analytics = generate_analytics(roadmap)

    # ---------------- 🧭 ADVISOR (AUTO) ----------------
    top = roadmap[0]  # most important chapter

    advice_text = get_next_action(
        chapter=top["chapter"],
        student_level=top["student_level"],
        priority=top["priority_label"],
        months_left=context.get("months_left", 6)
    )

    advice = {
        "chapter": top["chapter"],
        "message": advice_text
    }

    return {
        "roadmap": roadmap,
        "daily_plan": timetable,
        "analytics": analytics,
        "advice": advice   # 🔥 THIS WAS MISSING
    }
