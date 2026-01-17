"use client";

import { useState } from "react";
import { generateRoadmap } from "@/lib/api";

import {
  levelOptions,
  physicsChapters,
  mathsChapters,
  chemistryChapters
} from "@/lib/chapters";

export default function Dashboard() {
  const [hours, setHours] = useState(3);
  const [burnout, setBurnout] = useState(2);
  const [monthsLeft, setMonthsLeft] = useState(6);
  const [backlog, setBacklog] = useState("medium");

  const [physicsStatus, setPhysicsStatus] = useState(
    Object.fromEntries(physicsChapters.map(ch => [ch, "not_started"]))
  );
  const [mathsStatus, setMathsStatus] = useState(
    Object.fromEntries(mathsChapters.map(ch => [ch, "not_started"]))
  );
  const [chemStatus, setChemStatus] = useState(
    Object.fromEntries(chemistryChapters.map(ch => [ch, "not_started"]))
  );

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  async function handleGenerate() {
    try {
      setLoading(true);

      const payload = {
        survey: {
          daily_self_study_hours: hours,
          burnout_level: burnout,
        },
        chapters: [
          ...physicsChapters.map(ch => ({
            name: ch,
            student_level: physicsStatus[ch],
          })),
          ...mathsChapters.map(ch => ({
            name: ch,
            student_level: mathsStatus[ch],
          })),
          ...chemistryChapters.map(ch => ({
            name: ch,
            student_level: chemStatus[ch],
          })),
        ],
        context: {
          months_left: monthsLeft,
          backlog_size: backlog,
        },
      };

      const result = await generateRoadmap(payload);
      setData(result);
    } catch (err) {
      console.error(err);
      alert("Failed to generate roadmap");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white p-10">
      <div className="max-w-6xl mx-auto space-y-10">
        <h1 className="text-4xl font-bold tracking-tight">Study Navigator</h1>
        <p className="text-gray-400">Your personal AI mentor for JEE preparation</p>

        <div className="grid md:grid-cols-2 gap-6">
          {/* ================= SURVEY ================= */}
          <div className="bg-gray-900 rounded-xl p-6 space-y-6">
            <h2 className="text-2xl font-semibold">📋 Your Status</h2>

            <InputSection label="Daily study hours" value={hours} onChange={setHours} />
            <InputSection label="Burnout level (1–5)" value={burnout} onChange={setBurnout} />
            <InputSection label="Months left for JEE" value={monthsLeft} onChange={setMonthsLeft} />

            <div>
              <label className="text-sm text-gray-400">Backlog size</label>
              <select
                value={backlog}
                onChange={(e) => setBacklog(e.target.value)}
                className="w-full mt-1 p-2 bg-black border border-gray-700 rounded"
              >
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
              </select>
            </div>

            <ChapterBlock title="📘 Physics" chapters={physicsChapters} status={physicsStatus} setStatus={setPhysicsStatus} />
            <ChapterBlock title="📐 Maths" chapters={mathsChapters} status={mathsStatus} setStatus={setMathsStatus} />
            <ChapterBlock title="🧪 Chemistry" chapters={chemistryChapters} status={chemStatus} setStatus={setChemStatus} />

            <button
              onClick={handleGenerate}
              className="w-full bg-blue-600 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              {loading ? "Generating..." : "Generate My Roadmap"}
            </button>
          </div>

          {/* ================= OUTPUT ================= */}
          {data && data.result && (
            <div className="space-y-6">
              {/* ROADMAP */}
              <div className="bg-gray-900 rounded-xl p-6">
                <h2 className="text-2xl font-semibold mb-4">📌 Chapter Priority</h2>
                {data.result.roadmap.map((c: any) => (
                  <div key={c.chapter} className="flex justify-between bg-black border border-gray-700 p-3 rounded mb-2">
                    <span>{c.chapter}</span>
                    <span className="text-blue-400">{c.priority_label}</span>
                  </div>
                ))}
              </div>

              {/* DAILY PLAN */}
              <div className="bg-gray-900 rounded-xl p-6">
                <h2 className="text-2xl font-semibold mb-4">⏰ Today’s Plan</h2>
                {data.result.daily_plan.plan.map((b: any) => (
                  <div key={b.block} className="bg-black border border-gray-700 p-3 rounded mb-2">
                    Block {b.block}: {b.subject} ({b.duration_min} min)
                  </div>
                ))}
              </div>

              {/* ANALYTICS */}
              {data.result.analytics && (
                <div className="bg-gray-900 rounded-xl p-6">
                  <h2 className="text-2xl font-semibold mb-4">📊 Insights</h2>

                  <p className="text-gray-300 mb-4">
                    {data.result.analytics.suggestion}
                  </p>

                  <h3 className="font-semibold mb-2">🔥 Weakest Areas</h3>
                  {data.result.analytics.weak_chapters.map((c: any) => (
                    <div key={c.chapter} className="bg-black border border-gray-700 p-2 rounded mb-1">
                      {c.chapter} ({c.priority_label})
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

/* ---------------- HELPERS ---------------- */

function InputSection({ label, value, onChange }: any) {
  return (
    <div>
      <label className="text-sm text-gray-400">{label}</label>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full mt-1 p-2 bg-black border border-gray-700 rounded"
      />
    </div>
  );
}

function ChapterBlock({ title, chapters, status, setStatus }: any) {
  return (
    <div>
      <h3 className="text-lg font-semibold mt-2 mb-2">{title}</h3>
      <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
        {chapters.map((ch: string) => (
          <div key={ch} className="flex justify-between items-center bg-black border border-gray-700 p-2 rounded">
            <span className="text-sm">{ch}</span>
            <select
              value={status[ch]}
              onChange={(e) => setStatus({ ...status, [ch]: e.target.value })}
              className="bg-gray-800 text-sm p-1 rounded"
            >
              {levelOptions.map((lvl: string) => (
                <option key={lvl} value={lvl}>{lvl}</option>
              ))}
            </select>
          </div>
        ))}
      </div>
    </div>
  );
}
