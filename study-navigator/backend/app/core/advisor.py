from sqlalchemy.orm import Session
from app.models.advisor_memory import AdvisorMemory
from datetime import datetime, timedelta

def decide_advice_type(db: Session, chapter: str):
    last = (
        db.query(AdvisorMemory)
        .filter(AdvisorMemory.chapter == chapter)
        .order_by(AdvisorMemory.created_at.desc())
        .first()
    )

    if not last:
        return "new"

    gap = datetime.utcnow() - last.created_at

    if gap.days >= 3:
        return "warning"

    return "followup"
