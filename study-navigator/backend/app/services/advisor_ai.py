import os
import requests
from dotenv import load_dotenv

load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
API_URL = "https://api.groq.com/openai/v1/chat/completions"

HEADERS = {
    "Authorization": f"Bearer {GROQ_API_KEY}",
    "Content-Type": "application/json",
}


def get_next_action(
    chapter: str,
    student_level: str,
    priority: str,
    months_left: int,
    advice_type: str = "new"   # ✅ ADD THIS
):
    tone_map = {
        "new": "Guide the student clearly.",
        "followup": "Give sharper follow-up advice assuming basics are known.",
        "warning": "Be strict. Student is wasting time. Correct them firmly."
    }

    prompt = f"""
You are a strict JEE mentor.

Chapter: {chapter}
Level: {student_level}
Priority: {priority}
Months left: {months_left}

Instruction: {tone_map.get(advice_type, tone_map["new"])}

Rules:
- Max 5 bullet points
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
    return data["choices"][0]["message"]["content"]
