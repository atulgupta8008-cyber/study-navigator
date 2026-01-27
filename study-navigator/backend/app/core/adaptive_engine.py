from app.models.chapter_signal import ChapterSignal


# -------------------------------
# Advisor tone decision
# -------------------------------
def decide_advice_type(signal: ChapterSignal | None) -> str:
    """
    Decide advisor tone SAFELY.

    Rules:
    - No signal → new
    - First interaction → new
    - Repeated resistance → warning
    - High trust → followup
    """

    if signal is None:
        return "new"

    # First interaction safeguard
    if signal.effort_score == 0 and signal.resistance_score == 0:
        return "new"

    if signal.resistance_score >= 6:
        return "warning"

    if signal.trust_score >= 70:
        return "followup"

    return "new"


# -------------------------------
# Feedback interpretation
# -------------------------------
def interpret_feedback(action: str):
    """
    Translate user action into signal deltas.
    This is used by signal_updater.py
    """

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
