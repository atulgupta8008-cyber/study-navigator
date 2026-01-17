const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://127.0.0.1:8000";

export async function explainChapter(chapter: string, student_level: string) {
  const res = await fetch(
    "https://study-navigator-backend.onrender.com/explain/",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chapter,
        student_level,
      }),
    }
  );

  if (!res.ok) {
    throw new Error("Explain API failed");
  }

  return res.json();
}

export async function generateRoadmap(payload: any) {
  const res = await fetch(`${API_URL}/roadmap`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Backend error: ${text}`);
  }

  return res.json();
}
