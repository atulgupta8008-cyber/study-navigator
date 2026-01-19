"use client";

import { useState } from "react";
import { generateRoadmap, explainChapter } from "@/lib/api";

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

  // 🔹 MODAL STATES
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalContent, setModalContent] = useState<string | null>(null);
  const [modalLoading, setModalLoading] = useState(false);

  // ---------------- GENERATE ROADMAP ----------------
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
    } catch {
      alert("Failed to generate roadmap");
    } finally {
      setLoading(false);
    }
  }

  // ---------------- AI EXPLAIN ----------------
  async function handleExplain(chapter: string) {
    setShowModal(true);
    setModalTitle(chapter);
    setModalContent(null);
    setModalLoading(true);

    try {
      const level =
        physicsStatus[chapter] ||
        mathsStatus[chapter] ||
        chemStatus[chapter] ||
        "weak";

      const res = await explainChapter(chapter, level);
      setModalContent(res.explanation || "No explanation generated.");
    } catch {
      setModalContent("Failed to load explanation.");
    } finally {
      setModalLoading(false);
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

          {/* ================= ROADMAP ================= */}
          {data && data.result && (
            <div className="bg-gray-900 rounded-xl p-6">
              <h2 className="text-2xl font-semibold mb-4">📌 Chapter Priority</h2>

              {data.result.roadmap.map((c: any) => (
                <div key={c.chapter} className="bg-black border border-gray-700 p-3 rounded mb-2">
                  <div className="flex justify-between">
                    <span>{c.chapter}</span>
                    <span className="text-blue-400">{c.priority_label}</span>
                  </div>

                  <button
                    onClick={() => handleExplain(c.chapter)}
                    className="mt-2 text-sm text-blue-300 hover:underline"
                  >
                    Explain this chapter
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

              {/* ================= ADVISOR ================= */}
                    {data?.result?.advice?.message && (
                      <div className="max-w-6xl mx-auto mt-6 bg-blue-950 border border-blue-700 p-4 rounded-xl">
                        <h3 className="font-semibold mb-2">🧭 Advisor</h3>
                        <p className="text-gray-200 whitespace-pre-wrap">
                          {data.result.advice.message}
                        </p>
                      </div>
                    )}



      {/* ================= MODAL ================= */}
      {showModal && (
        <ExplanationModal
          title={modalTitle}
          loading={modalLoading}
          content={modalContent}
          onClose={() => setShowModal(false)}
        />
      )}
    </main>
  );
}

/* ---------------- MODAL COMPONENT ---------------- */

function ExplanationModal({ title, content, loading, onClose }: any) {
  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-gray-900 w-full max-w-3xl max-h-[85vh] rounded-xl p-6 relative flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center border-b border-gray-700 pb-3 mb-3">
          <h2 className="text-xl font-semibold">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-xl"
          >
            ✖
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto pr-2">
          {loading && (
            <p className="text-gray-400 animate-pulse">
              Thinking like a JEE mentor…
            </p>
          )}

          {!loading && content && (
            <div className="whitespace-pre-wrap text-gray-300 leading-relaxed">
              {content}
            </div>
          )}
        </div>
      </div>
    </div>
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

<h1 className="text-red-500 text-sm">
  DEPLOY TEST – CLUTTER REMOVED v2
</h1>
