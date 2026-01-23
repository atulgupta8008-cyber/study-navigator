from app.models.chapter_signal import ChapterSignal

def generate_weekly_plan(db, roadmap, total_hours_per_week: int):
    """
    roadmap: list of chapters with priority_label
    """

    total_minutes = total_hours_per_week * 60

    signals = {
        s.chapter: s
        for s in db.query(ChapterSignal).all()
    }

    weights = []
    for item in roadmap:
        chapter = item["chapter"]
        priority = item["priority_label"]

        signal = signals.get(chapter)

        weight = 1.0

        if priority == "Immediate Action Required":
            weight += 1.5
        elif priority == "High":
            weight += 1.0

        if signal:
            weight += (signal.resistance_score or 0) * 0.05
            weight -= (signal.trust_score or 50) * 0.01

        weights.append((chapter, max(weight, 0.3)))

    weight_sum = sum(w for _, w in weights)

    weekly_plan = []
    for chapter, weight in weights:
        minutes = int((weight / weight_sum) * total_minutes)

        weekly_plan.append({
            "chapter": chapter,
            "weekly_minutes": minutes,
            "reason": "Adaptive based on priority and feedback"
        })

    return weekly_plan
