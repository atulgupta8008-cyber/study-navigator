from app.models.chapter_signal import ChapterSignal

def revise_weekly_allocations(
    db,
    weekly_allocations: list
):
    """
    Input:
      [{ chapter, weekly_minutes }]

    Output:
      revised list with adjusted minutes
    """

    revised = []

    for item in weekly_allocations:
        chapter = item["chapter"]
        minutes = item["weekly_minutes"]

        signal = (
            db.query(ChapterSignal)
            .filter(ChapterSignal.chapter == chapter)
            .first()
        )

        if not signal:
            revised.append(item)
            continue

        # ---- RULES ----
        if signal.resistance_score >= 30:
            minutes = int(minutes * 1.2)

        if signal.effort_score >= 40:
            minutes = int(minutes * 0.9)

        if signal.trust_score <= 30:
            minutes = max(minutes, 120)  # never drop too low

        revised.append({
            "chapter": chapter,
            "weekly_minutes": minutes
        })

    return revised
