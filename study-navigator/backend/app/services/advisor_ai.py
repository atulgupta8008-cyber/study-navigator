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

def get_next_action(chapter: str, student_level: str, priority: str, months_left: int):
    prompt = f"""
You are a strict JEE mentor.

Student status:
- Chapter: {chapter}
- Level: {student_level}
- Priority: {priority}
- Months left: {months_left}

Give ONLY actionable study advice.
Rules:
- Max 5 bullet points
- No theory
- No motivation
- No explanation
- Focus on efficiency & marks
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
