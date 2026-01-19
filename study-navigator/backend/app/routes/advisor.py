from fastapi import APIRouter
from pydantic import BaseModel
from app.services.advisor_ai import get_next_action

router = APIRouter(prefix="/advisor", tags=["Advisor"])

class AdvisorRequest(BaseModel):
    chapter: str
    student_level: str
    priority: str
    months_left: int

@router.post("/next-action")
def next_action(req: AdvisorRequest):
    advice = get_next_action(
        chapter=req.chapter,
        student_level=req.student_level,
        priority=req.priority,
        months_left=req.months_left
    )

    return {
        "advice": advice
    }
