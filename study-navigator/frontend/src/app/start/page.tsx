"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function StartPage() {
  const router = useRouter();

  const [hours, setHours] = useState(3);
  const [burnout, setBurnout] = useState(2);
  const [monthsLeft, setMonthsLeft] = useState(6);

  function handleContinue() {
    const survey = {
      daily_self_study_hours: hours,
      burnout_level: burnout,
      months_left: monthsLeft,
    };

    localStorage.setItem("study_navigator_survey", JSON.stringify(survey));

    router.push("/dashboard");
  }


  return (
    <main className="min-h-screen bg-gradient-to-br from-black via-[#050b1f] to-[#12091e] text-white">
      <div className="max-w-3xl mx-auto px-6 py-28 space-y-20">

        {/* ================= HEADER ================= */}
        <motion.section
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ duration: 1 }}
          className="space-y-6 text-center"
        >
          <h1 className="text-4xl md:text-5xl font-medium">
            Let’s understand your situation
          </h1>
          <p className="text-gray-400 text-lg">
            No judgment. No expectations.  
            Just reality.
          </p>
        </motion.section>

        {/* ================= INPUTS ================= */}
        <motion.section
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ duration: 1, delay: 0.2 }}
          className="space-y-12"
        >

          {/* Daily hours */}
          <div className="space-y-2">
            <label className="text-lg">
              How many hours can you realistically study daily?
            </label>
            <p className="text-sm text-gray-400">
              Not your ideal routine. Your honest one.
            </p>
            <input
              type="number"
              min={1}
              max={12}
              value={hours}
              onChange={(e) => setHours(Number(e.target.value))}
              className="w-full bg-black border border-white/20 rounded-lg p-3 mt-2"
            />
          </div>

          {/* Burnout */}
          <div className="space-y-2">
            <label className="text-lg">
              How mentally tired do you feel right now?
            </label>
            <p className="text-sm text-gray-400">
              1 = fresh, 5 = exhausted
            </p>
            <input
              type="range"
              min={1}
              max={5}
              value={burnout}
              onChange={(e) => setBurnout(Number(e.target.value))}
              className="w-full"
            />
            <div className="text-gray-300">
              Burnout level: {burnout}
            </div>
          </div>

          {/* Months left */}
          <div className="space-y-2">
            <label className="text-lg">
              How many months are left for your exam?
            </label>
            <p className="text-sm text-gray-400">
              Approximate is fine.
            </p>
            <input
              type="number"
              min={1}
              max={24}
              value={monthsLeft}
              onChange={(e) => setMonthsLeft(Number(e.target.value))}
              className="w-full bg-black border border-white/20 rounded-lg p-3 mt-2"
            />
          </div>
        </motion.section>

        {/* ================= CTA ================= */}
        <motion.section
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ duration: 1, delay: 0.4 }}
          className="text-center"
        >
          <button
            onClick={handleContinue}
            className="px-10 py-4 rounded-xl bg-white text-black text-lg hover:bg-gray-200 transition"
          >
            Continue to planning
          </button>

          <p className="text-sm text-gray-400 mt-4">
            You can change these later.
          </p>
        </motion.section>

      </div>
    </main>
  );
}
