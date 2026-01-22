from datetime import datetime
from sqlalchemy.orm import Session
from app.models.chapter_signal import ChapterSignal
from app.core.adaptive_engine import interpret_feedback


def update_chapter_signal(
    db: Session,
    chapter: str,
    action: str
):
    deltas = interpret_feedback(action)

    signal = (
        db.query(ChapterSignal)
        .filter(ChapterSignal.chapter == chapter)
        .first()
    )

    if not signal:
        signal = ChapterSignal(chapter=chapter)
        db.add(signal)

        signal.effort_score = (signal.effort_score or 0) + 1
        signal.resistance_score = (signal.resistance_score or 0) + deltas["resistance_delta"]

        signal.trust_score = max(
            0,
            min(100, (signal.trust_score or 50) + deltas["trust_delta"])
        )


    signal.last_action_at = datetime.utcnow()

    db.commit()

    return signal
