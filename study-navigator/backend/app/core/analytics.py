from app.core.pyq_weights import (
    PYQ_WEIGHTS_PHYSICS,
    PYQ_WEIGHTS_MATHS,
    PYQ_WEIGHTS_CHEMISTRY
)

PHYSICS = PYQ_WEIGHTS_PHYSICS.keys()
MATHS = PYQ_WEIGHTS_MATHS.keys()
CHEMISTRY = PYQ_WEIGHTS_CHEMISTRY.keys()



def generate_analytics(roadmap: list):
    """
    roadmap: list of
    {
      chapter,
      priority_score,
      priority_label
    }
    """

    # ---------- Weak chapters ----------
    weak_chapters = [
        ch for ch in roadmap
        if ch["priority_label"] in ("must_do", "should_do")
    ][:5]

    # ---------- Subject split ----------
    subject_count = {
        "Physics": 0,
        "Maths": 0,
        "Chemistry": 0
    }

    for ch in roadmap:
        name = ch["chapter"]
        if name in PHYSICS:
            subject_count["Physics"] += 1
        elif name in MATHS:
            subject_count["Maths"] += 1
        elif name in CHEMISTRY:
            subject_count["Chemistry"] += 1

    # ---------- Simple mentor insight ----------
    max_subject = max(subject_count, key=subject_count.get)

    suggestion = (
        f"You should focus more on {max_subject} this week."
        if subject_count[max_subject] > 0
        else "Your preparation looks balanced."
    )

    return {
        "weak_chapters": weak_chapters,
        "subject_load": subject_count,
        "suggestion": suggestion
    }

