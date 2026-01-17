from fastapi import APIRouter

router = APIRouter()

@router.post("/survey")
def submit_survey(survey_data: dict):
    # Later: validate + save to DB
    return {
        "message": "Survey received successfully",
        "next_step": "Timetable generation"
    }
