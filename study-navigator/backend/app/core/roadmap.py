from app.core.priority import calculate_priority, classify_priority
from app.core.planner import generate_daily_plan
from app.core.analytics import generate_analytics



def generate_roadmap(survey: dict, chapters: list, context: dict):
    roadmap = []

    for chapter in chapters:
        score = calculate_priority(chapter, context)
        label = classify_priority(score)

        roadmap.append({
            "chapter": chapter["name"],
            "priority_score": score,
            "priority_label": label
        })

    roadmap.sort(key=lambda x: x["priority_score"], reverse=True)

    timetable = generate_daily_plan(survey)

    analytics = generate_analytics(roadmap)

    return {
        "roadmap": roadmap,
        "daily_plan": timetable,
        "analytics": analytics
    }
