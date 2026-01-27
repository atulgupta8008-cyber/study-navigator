from collections import defaultdict
from math import floor

SESSION_MINUTES = 90
MAX_WEEKLY_SESSIONS = 12


def generate_weekly_plan(db, roadmap, total_hours_per_week: int):
    PRIORITY_WEIGHTS = {
        "must_do": 3.0,
        "should_do": 2.0,
        "optional": 1.0,
        "skip_if_short_time": 0.0,
    }

    # ----------------------------------
    # 1️⃣ Select chapters for THIS week
    # ----------------------------------
    candidates = [
        r for r in roadmap
        if r["priority_label"] in ("must_do", "should_do")
    ]

    if len(candidates) < 5:
        candidates += [
            r for r in roadmap
            if r["priority_label"] == "optional"
        ]

    # HARD SAFETY: cap number of chapters
    candidates = candidates[:MAX_WEEKLY_SESSIONS]

    # ----------------------------------
    # 2️⃣ Weight calculation
    # ----------------------------------
    weighted = []
    total_weight = 0.0

    for r in candidates:
        w = PRIORITY_WEIGHTS[r["priority_label"]]
        weighted.append({
            "chapter": r["chapter"],
            "weight": w,
        })
        total_weight += w

    # ----------------------------------
    # 3️⃣ Allocate sessions (ALLOW ZERO)
    # ----------------------------------
    chapter_sessions = defaultdict(int)

    for item in weighted:
        fraction = item["weight"] / total_weight
        sessions = floor(fraction * MAX_WEEKLY_SESSIONS)
        chapter_sessions[item["chapter"]] = sessions

    # Ensure at least ONE must_do chapter exists
    if sum(chapter_sessions.values()) == 0:
        top = weighted[0]["chapter"]
        chapter_sessions[top] = 1

    # ----------------------------------
    # 4️⃣ Aggregate into weekly minutes
    # ----------------------------------
    weekly_plan = []

    for ch, sessions in chapter_sessions.items():
        if sessions == 0:
            continue

        weekly_plan.append({
            "chapter": ch,
            "weekly_minutes": sessions * SESSION_MINUTES,
            "reason": f"{sessions} focused study session(s)",
        })

    weekly_plan.sort(
        key=lambda x: x["weekly_minutes"],
        reverse=True
    )

    return weekly_plan
