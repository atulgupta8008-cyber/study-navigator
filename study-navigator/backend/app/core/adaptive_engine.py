def interpret_feedback(action: str):
    """
    Convert raw feedback into system signals.
    """

    if action == "done":
        return {
            "effort_delta": +1,
            "resistance_delta": -1,
            "trust_delta": +1
        }

    if action == "skipped":
        return {
            "effort_delta": -1,
            "resistance_delta": +1,
            "trust_delta": -1
        }

    # fallback (should never happen)
    return {
        "effort_delta": 0,
        "resistance_delta": 0,
        "trust_delta": 0
    }
