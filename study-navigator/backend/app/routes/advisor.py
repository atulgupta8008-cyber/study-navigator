from fastapi import APIRouter
from pydantic import BaseModel
from app.services.advisor_ai import get_next_action
from app.db import SessionLocal
from app.models.advisor_feedback import AdvisorFeedback
from app.core.signal_updater import update_chapter_signal
from app.core.adaptive_engine import decide_advice_type
from app.models.chapter_signal import ChapterSignal

router = APIRouter(prefix="/advisor", tags=["Advisor"])


# -------- REQUEST MODELS --------

class AdvisorRequest(BaseModel):
    chapter: str
    student_level: str
    priority: str
    months_left: int


class FeedbackRequest(BaseModel):
    chapter: str
    action: str  # "done" | "skipped"


# -------- ROUTES --------

@router.post("/next-action")
def next_action(req: AdvisorRequest):
    db = SessionLocal()
    signal = (
        db.query(ChapterSignal)
        .filter(ChapterSignal.chapter == req.chapter)
        .first()
    )

    advice_type = decide_advice_type(signal) if signal else "new"

    advice = get_next_action(
        chapter=req.chapter,
        student_level=req.student_level,
        priority=req.priority,
        months_left=req.months_left,
        advice_type=advice_type
    )


    return {
        "message": advice,
        "tone": advice_type
    }


@router.post("/feedback")
def submit_feedback(req: FeedbackRequest):
    db = SessionLocal()

    update_chapter_signal(
        db=db,
        chapter=req.chapter,
        action=req.action
    )

    feedback = AdvisorFeedback(
        chapter=req.chapter,
        action=req.action
    )

    db.add(feedback)
    db.commit()

    return {"status": "ok"}
