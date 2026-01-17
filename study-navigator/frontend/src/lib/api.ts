export async function generateRoadmap(payload: any) {
  const res = await fetch("http://127.0.0.1:8000/roadmap", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    throw new Error("Backend error");
  }

  return res.json();
}
