from fastapi import APIRouter
from sqlalchemy.orm import Session
from app.core.roadmap import generate_roadmap
from app.db import SessionLocal
from app.models.student import Student

router = APIRouter()

@router.post("/roadmap")
def create_roadmap(data: dict):
    db: Session = SessionLocal()

    result = generate_roadmap(
        survey=data["survey"],
        chapters=data["chapters"],
        context=data["context"]
    )

    student = Student(
        survey_data=data,
        roadmap_data=result
    )

    db.add(student)
    db.commit()
    db.refresh(student)

    return {
        "student_id": student.id,
        "result": result
    }
