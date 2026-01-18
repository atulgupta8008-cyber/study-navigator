from sqlalchemy.orm import Session
from app.models.explanation import Explanation
from datetime import datetime, timedelta


def get_memory_pressure(db: Session, chapter: str) -> float:
    """
    Returns a value between 0–100
    Higher value = needs more revision
    """

    records = db.query(Explanation).filter(
        Explanation.chapter == chapter
    ).all()

    if not records:
        return 0.0

    pressure = 0.0

    for r in records:
        # More requests → more importance
        pressure += min(r.times_requested * 5, 40)

        # Old memory → needs revision
        if r.last_requested_at:
            days = (datetime.utcnow() - r.last_requested_at).days
            if days > 7:
                pressure += 20
            elif days > 3:
                pressure += 10

    return min(pressure, 100.0)
