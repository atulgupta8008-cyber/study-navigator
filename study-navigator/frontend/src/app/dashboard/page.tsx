"use client";

import { useState } from "react";
import {
  generateRoadmap,
  explainChapter,
  getAdvisorAction,
  sendAdvisorFeedback,
} from "@/lib/api";

import {
  levelOptions,
  physicsChapters,
  mathsChapters,
  chemistryChapters,
} from "@/lib/chapters";

export default function Dashboard() {
  const [hours, setHours] = useState(3);
  const [burnout, setBurnout] = useState(2);
  const [monthsLeft, setMonthsLeft] = useState(6);
  const [backlog, setBacklog] = useState("medium");

  const [physicsStatus, setPhysicsStatus] = useState(
    Object.fromEntries(physicsChapters.map((ch) => [ch, "not_started"]))
  );
  const [mathsStatus, setMathsStatus] = useState(
    Object.fromEntries(mathsChapters.map((ch) => [ch, "not_started"]))
  );
  const [chemStatus, setChemStatus] = useState(
    Object.fromEntries(chemistryChapters.map((ch) => [ch, "not_started"]))
  );

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // ---------------- EXPLAIN MODAL ----------------
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalContent, setModalContent] = useState<string | null>(null);
  const [modalLoading, setModalLoading] = useState(false);

  // ---------------- ADVISOR MODAL ----------------
  const [advisorOpen, setAdvisorOpen] = useState(false);
  const [advisorTitle, setAdvisorTitle] = useState("");
  const [advisorContent, setAdvisorContent] = useState<string | null>(null);
  const [advisorLoading, setAdvisorLoading] = useState(false);
  const [advisorPriority, setAdvisorPriority] = useState("");

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
          ...physicsChapters.map((ch) => ({
            name: ch,
            student_level: physicsStatus[ch],
          })),
          ...mathsChapters.map((ch) => ({
            name: ch,
            student_level: mathsStatus[ch],
          })),
          ...chemistryChapters.map((ch) => ({
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

  // ---------------- EXPLAIN ----------------
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

  // ---------------- ADVISOR ----------------
  async function handleAdvisor(chapter: string, priority: string) {
    try {
      setAdvisorOpen(true);
      setAdvisorTitle(`Advisor — ${chapter}`);
      setAdvisorPriority(priority);
      setAdvisorContent(null);
      setAdvisorLoading(true);

      const level =
        physicsStatus[chapter] ||
        mathsStatus[chapter] ||
        chemStatus[chapter] ||
        "weak";

      const res = await getAdvisorAction({
        chapter,
        student_level: level,
        priority,
        months_left: monthsLeft,
      });

      setAdvisorContent(res.message);
    } catch {
      setAdvisorContent("Failed to load advisor guidance.");
    } finally {
      setAdvisorLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white p-10">
      <div className="max-w-6xl mx-auto space-y-10">
        <h1 className="text-4xl font-bold tracking-tight">Study Navigator</h1>
        <p className="text-gray-400">
          AI guidance for what to study & when — not a learning platform
        </p>

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
                <div
                  key={c.chapter}
                  className="bg-black border border-gray-700 p-3 rounded mb-2"
                >
                  <div className="flex justify-between">
                    <span>{c.chapter}</span>
                    <span className="text-blue-400">{c.priority_label}</span>
                  </div>

                  <div className="flex gap-4 mt-2 text-sm">
                    <button
                      onClick={() => handleExplain(c.chapter)}
                      className="text-blue-300 hover:underline"
                    >
                      Explain
                    </button>

                    <button
                      onClick={() => handleAdvisor(c.chapter, c.priority_label)}
                      className="text-green-400 hover:underline"
                    >
                      Get advisor guidance
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
          {/* ================= WEEKLY PLAN ================= */}
          {data?.result?.weekly_plan && (
            <div className="bg-gray-900 rounded-xl p-6 mt-6">
              <h2 className="text-2xl font-semibold mb-4">
                🗓️ Weekly Study Plan
              </h2>

              <div className="space-y-3">
                {data.result.weekly_plan.map((item: any) => (
                  <div
                    key={item.chapter}
                    className="flex justify-between items-center bg-black border border-gray-700 px-4 py-3 rounded"
                  >
                    <div>
                      <div className="text-sm font-medium">{item.chapter}</div>
                      <div className="text-xs text-gray-400">
                        {item.reason}
                      </div>
                    </div>

                    <div className="text-blue-400 font-semibold">
                      {Math.round(item.weekly_minutes / 60)} hrs / week
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}



        </div>
      </div>

      {/* ================= ADVISOR MODAL ================= */}
      {advisorOpen && (
        <ExplanationModal
          title={advisorTitle}
          loading={advisorLoading}
          content={advisorContent}
          onClose={() => setAdvisorOpen(false)}
          footer={
            <div className="flex gap-4 mt-4">
              <button
                onClick={() => {
                  sendAdvisorFeedback({
                    chapter: advisorTitle.replace("Advisor — ", ""),
                    priority: advisorPriority,
                    action: "done",
                  });
                  setAdvisorOpen(false);
                }}
                className="bg-green-700 px-4 py-2 rounded hover:bg-green-800"
              >
                I did this
              </button>

              <button
                onClick={() => {
                  sendAdvisorFeedback({
                    chapter: advisorTitle.replace("Advisor — ", ""),
                    priority: advisorPriority,
                    action: "skipped",
                  });
                  setAdvisorOpen(false);
                }}
                className="bg-red-700 px-4 py-2 rounded hover:bg-red-800"
              >
                Skipped
              </button>
            </div>
          }
        />
      )}

      {/* ================= EXPLAIN MODAL ================= */}
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

/* ---------------- MODAL ---------------- */

function ExplanationModal({ title, content, loading, onClose, footer }: any) {
  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-gray-900 w-full max-w-3xl max-h-[85vh] rounded-xl p-6 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center border-b border-gray-700 pb-3 mb-3">
          <h2 className="text-xl font-semibold">{title}</h2>
          <button onClick={onClose}>✖</button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {loading && <p className="text-gray-400">Thinking…</p>}
          {!loading && content && (
            <div className="whitespace-pre-wrap text-gray-300">
              {content}
            </div>
          )}
        </div>

        {footer}
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
          <div
            key={ch}
            className="flex justify-between items-center bg-black border border-gray-700 p-2 rounded"
          >
            <span className="text-sm">{ch}</span>
            <select
              value={status[ch]}
              onChange={(e) =>
                setStatus({ ...status, [ch]: e.target.value })
              }
              className="bg-gray-800 text-sm p-1 rounded"
            >
              {levelOptions.map((lvl: string) => (
                <option key={lvl} value={lvl}>
                  {lvl}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>
    </div>
  );
}

function Section({ title, items }: any) {
  if (!items || items.length === 0) return null;

  return (
    <div className="mb-4">
      <h3 className="font-semibold mb-2">{title}</h3>
      {items.map((i: any) => (
        <div
          key={i.chapter}
          className="bg-black border border-gray-700 p-2 rounded mb-2 text-sm"
        >
          <span className="font-medium">{i.chapter}</span>
          <div className="text-gray-400">{i.reason}</div>
        </div>
      ))}
    </div>
  );
}

