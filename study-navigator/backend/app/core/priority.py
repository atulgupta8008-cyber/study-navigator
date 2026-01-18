from app.core.pyq_weights import (
    PYQ_WEIGHTS_PHYSICS,
    PYQ_WEIGHTS_MATHS,
    PYQ_WEIGHTS_CHEMISTRY
)

from app.core.memory_stats import get_memory_pressure
from app.db import SessionLocal


def calculate_priority(chapter_data: dict, context: dict):
    """
    chapter_data:
    {
        "name": "Kinematics",
        "student_level": "weak"
    }
    """

    # -------------------------------
    # 1. Student level → gap mapping
    # -------------------------------
    level_map = {
        "not_started": 9,
        "weak": 7,
        "confident": 4,
        "strong": 1
    }

    chapter_name = chapter_data.get("name", "")

    # -------------------------------
    # 2. PYQ-based importance (PCM)
    # -------------------------------
    if chapter_name in PYQ_WEIGHTS_PHYSICS:
        pyq_raw = PYQ_WEIGHTS_PHYSICS[chapter_name]
    elif chapter_name in PYQ_WEIGHTS_MATHS:
        pyq_raw = PYQ_WEIGHTS_MATHS[chapter_name]
    elif chapter_name in PYQ_WEIGHTS_CHEMISTRY:
        pyq_raw = PYQ_WEIGHTS_CHEMISTRY[chapter_name]
    else:
        pyq_raw = 5

    pyq_weight = pyq_raw * 10  # 0–100

    # -------------------------------
    # 3. Student gap score
    # -------------------------------
    student_level = chapter_data.get("student_level", "not_started")
    student_gap = level_map.get(student_level, 5) * 10

    # -------------------------------
    # 4. Time urgency
    # -------------------------------
    months_left = context.get("months_left", 12)
    time_urgency = max(0, (12 - months_left)) * 5

    # -------------------------------
    # 5. Backlog pressure
    # -------------------------------
    backlog_map = {
        "small": 10,
        "medium": 20,
        "large": 30
    }

    backlog_size = context.get("backlog_size", "medium")
    backlog_pressure = backlog_map.get(backlog_size, 20)

    # -------------------------------
    # 6. 🧠 MEMORY PRESSURE (NEW)
    # -------------------------------
    db = SessionLocal()
    memory_pressure = get_memory_pressure(db, chapter_name)
    db.close()

    # -------------------------------
    # 7. FINAL PRIORITY SCORE
    # -------------------------------
    priority_score = (
        pyq_weight * 0.35 +
        student_gap * 0.25 +
        time_urgency * 0.2 +
        backlog_pressure * 0.1 +
        memory_pressure * 0.1   # 🧠 behavior-based boost
    )

    return round(priority_score, 2)


def classify_priority(score: float):
    if score >= 75:
        return "must_do"
    elif score >= 55:
        return "should_do"
    elif score >= 35:
        return "optional"
    else:
        return "skip_if_short_time"
