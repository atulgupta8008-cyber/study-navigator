from datetime import datetime

def needs_revision(times_requested: int, last_requested_at: datetime) -> bool:
    """
    Simple forgetting curve:
    - 1st time → revise after 1 day
    - 2–3 times → revise after 3 days
    - 4+ times → revise after 7 days
    """

    days_gap = (datetime.utcnow() - last_requested_at).days

    if times_requested == 1:
        return days_gap >= 1
    elif times_requested <= 3:
        return days_gap >= 3
    else:
        return days_gap >= 7
