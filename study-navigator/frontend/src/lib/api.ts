const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

/* ---------------- EXPLAIN ---------------- */

export async function explainChapter(
  chapter: string,
  student_level: string
) {
  const res = await fetch(`${API_URL}/explain/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chapter, student_level }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Explain API failed: ${text}`);
  }

  return res.json();
}

/* ---------------- ROADMAP ---------------- */

export async function generateRoadmap(payload: any) {
  const res = await fetch(`${API_URL}/roadmap`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Backend error: ${text}`);
  }

  return res.json();
}

/* ---------------- ADVISOR ---------------- */

export async function getAdvisorAction(payload: {
  chapter: string;
  student_level: string;
  priority: string;
  months_left: number;
}) {
  const res = await fetch(`${API_URL}/advisor/next-action`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error("Advisor API failed");
  }

  return res.json();
}

/* ---------------- ADVISOR FEEDBACK ---------------- */

export type AdvisorFeedbackPayload = {
  chapter: string;
  priority: string;
  action: "done" | "skipped";
};

export async function sendAdvisorFeedback(
  payload: AdvisorFeedbackPayload
) {
  const res = await fetch(`${API_URL}/advisor/feedback`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error("Failed to send advisor feedback");
  }

  return res.json();
}
