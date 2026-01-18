from sqlalchemy.orm import Session
from datetime import datetime
from app.models.explanation import Explanation
from app.db import SessionLocal
import requests, os
from dotenv import load_dotenv

load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
API_URL = "https://api.groq.com/openai/v1/chat/completions"

HEADERS = {
    "Authorization": f"Bearer {GROQ_API_KEY}",
    "Content-Type": "application/json",
}

def explain_chapter(chapter: str, student_level: str):
    db: Session = SessionLocal()

    # 🔁 CACHE CHECK
    record = db.query(Explanation).filter(
        Explanation.chapter == chapter,
        Explanation.student_level == student_level
    ).first()

    if record:
        record.times_requested += 1
        record.last_requested_at = datetime.utcnow()
        db.commit()

        return {
            "explanation": record.explanation,
            "memory": {
                "type": "revision",
                "times_requested": record.times_requested
            }
        }

    # 🧠 NEW AI CALL
    prompt = f"""
You are a JEE mentor.

Explain the chapter "{chapter}" for a student who is "{student_level}".

Rules:
- NCERT + JEE PYQ focused
- Simple intuition
- Structured
- No fluff

Format:
1. Intuition
2. Key concepts
3. PYQ focus
4. Common mistakes
5. How to study
"""

    payload = {
        "model": "llama-3.1-8b-instant",
        "messages": [
            {"role": "system", "content": "You are a JEE mentor."},
            {"role": "user", "content": prompt}
        ],
        "temperature": 0.3,
        "max_tokens": 700
    }

    response = requests.post(API_URL, headers=HEADERS, json=payload)
    response.raise_for_status()

    explanation_text = response.json()["choices"][0]["message"]["content"]

    new_record = Explanation(
        chapter=chapter,
        student_level=student_level,
        explanation=explanation_text
    )

    db.add(new_record)
    db.commit()

    return {
        "explanation": explanation_text,
        "memory": {"type": "new"}
    }
