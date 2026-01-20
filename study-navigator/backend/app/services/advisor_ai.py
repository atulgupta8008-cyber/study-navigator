import os
import requests
from dotenv import load_dotenv
from sqlalchemy.orm import Session

from app.db import SessionLocal
from app.models.advisor_feedback import AdvisorFeedback

load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
API_URL = "https://api.groq.com/openai/v1/chat/completions"

HEADERS = {
    "Authorization": f"Bearer {GROQ_API_KEY}",
    "Content-Type": "application/json",
}

# -------- Step 3.2 --------
def get_skip_count(chapter: str) -> int:
    db: Session = SessionLocal()
    return (
        db.query(AdvisorFeedback)
        .filter(
            AdvisorFeedback.chapter == chapter,
            AdvisorFeedback.action == "skipped"
        )
        .count()
    )


# -------- Step 3.3 --------
def get_next_action(
    chapter: str,
    student_level: str,
    priority: str,
    months_left: int,
):
    skip_count = get_skip_count(chapter)

    if skip_count >= 2:
        advice_type = "warning"
    elif skip_count == 1:
        advice_type = "followup"
    else:
        advice_type = "new"

    tone_map = {
        "new": "Guide the student clearly.",
        "followup": "Give sharper follow-up advice assuming basics are known.",
        "warning": "Be strict. Student is wasting time. Correct immediately."
    }

    prompt = f"""
You are a strict JEE mentor.

Chapter: {chapter}
Level: {student_level}
Priority: {priority}
Months left: {months_left}

Instruction: {tone_map[advice_type]}

Rules:
- Max 5 bullets
- No theory
- No motivation
- Action only
"""

    payload = {
        "model": "llama-3.1-8b-instant",
        "messages": [
            {"role": "system", "content": "You are a JEE study strategist."},
            {"role": "user", "content": prompt}
        ],
        "temperature": 0.2,
        "max_tokens": 150
    }

    response = requests.post(API_URL, headers=HEADERS, json=payload, timeout=30)
    response.raise_for_status()

    data = response.json()

    return {
        "message": data["choices"][0]["message"]["content"],
        "type": advice_type
    }
