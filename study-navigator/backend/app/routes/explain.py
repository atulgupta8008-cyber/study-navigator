from fastapi import APIRouter
from pydantic import BaseModel
from app.services.ai_engine import explain_chapter

router = APIRouter(prefix="/explain", tags=["AI"])

class ExplainRequest(BaseModel):
    chapter: str
    student_level: str

@router.post("/")
def explain(req: ExplainRequest):
    return explain_chapter(req.chapter, req.student_level)
