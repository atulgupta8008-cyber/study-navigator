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

def explain_chapter(chapter: str, student_level: str):
    prompt = f"""
You are a JEE Physics mentor.

Explain the chapter "{chapter}" for a student who is "{student_level}".

Rules:
- NCERT + JEE PYQ focused
- Simple intuition
- Structured explanation
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
        {"role": "system", "content": "You are a JEE Physics mentor."},
        {"role": "user", "content": prompt}
    ],
    "temperature": 0.3,
    "max_tokens": 700
}


    response = requests.post(API_URL, headers=HEADERS, json=payload, timeout=60)

    print("Groq status:", response.status_code)
    print("Groq raw response:", response.text)

    if not response.ok:
        return {
        "error": response.json().get("error", {}).get("message", "Groq error")
    }

    data = response.json()

    return {
        "explanation": data["choices"][0]["message"]["content"]
    }
