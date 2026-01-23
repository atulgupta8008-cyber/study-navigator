from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from app.models.chapter_signal import ChapterSignal


def decide_advice_type(db: Session, chapter: str) -> str:
    """
    Decide advisor tone automatically based on past behavior
    """

    signal = (
        db.query(ChapterSignal)
        .filter(ChapterSignal.chapter == chapter)
        .first()
    )

    # No history → normal guidance
    if not signal:
        return "new"
    
    if signal is None:
        return "normal"

    # Strong resistance → warning
    if signal.resistance_score >= 6:
        return "warning"

    # Low trust → strict follow-up
    if signal.trust_score <= 35:
        return "followup"

    # Recently active & cooperative → softer guidance
    if signal.trust_score >= 60:
        return "new"

    return "followup"

def interpret_feedback(action: str):
    if action == "done":
        return {
            "effort_delta": 2,
            "resistance_delta": -1,
            "trust_delta": 3,
        }

    if action == "skipped":
        return {
            "effort_delta": -2,
            "resistance_delta": 3,
            "trust_delta": -4,
        }

    return {
        "effort_delta": 0,
        "resistance_delta": 0,
        "trust_delta": 0,
    }


def decide_advice_type(signal):
    if signal.resistance_score >= 6:
        return "warning"
    if signal.trust_score >= 70:
        return "followup"
    return "new"
