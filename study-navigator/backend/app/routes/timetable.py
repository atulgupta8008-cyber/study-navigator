from fastapi import APIRouter
from app.core.planner import generate_daily_plan

router = APIRouter()

@router.post("/timetable")
def create_timetable(survey_data: dict):
    timetable = generate_daily_plan(survey_data)
    return timetable
