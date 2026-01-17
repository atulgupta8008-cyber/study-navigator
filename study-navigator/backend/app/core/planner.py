from datetime import datetime, timedelta

def generate_daily_plan(survey: dict):
    plan = []

    # Determine study blocks
    total_hours = survey.get("daily_self_study_hours", 3)
    burnout = survey.get("burnout_level", 3)

    # Reduce load if burnout is high
    if burnout >= 4:
        total_hours -= 1

    block_duration = 90  # minutes
    blocks = max(1, total_hours * 60 // block_duration)

    subjects_cycle = ["Physics", "Maths", "Chemistry"]

    for i in range(int(blocks)):
        plan.append({
            "block": i + 1,
            "subject": subjects_cycle[i % 3],
            "duration_min": block_duration,
            "task_type": "concept + practice"
        })

    return {
        "total_blocks": blocks,
        "plan": plan
    }
