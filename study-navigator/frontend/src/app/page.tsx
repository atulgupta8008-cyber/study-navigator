"use client";

import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-black via-[#050b1f] to-[#12091e] text-white overflow-hidden">
      {/* Ambient background glow */}
      <div className="pointer-events-none fixed inset-0">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 3 }}
          className="absolute top-[-20%] left-[-20%] w-[60vw] h-[60vw] bg-purple-600/10 rounded-full blur-[120px]"
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 3, delay: 0.5 }}
          className="absolute bottom-[-30%] right-[-20%] w-[60vw] h-[60vw] bg-blue-600/10 rounded-full blur-[120px]"
        />
      </div>

      <div className="relative max-w-6xl mx-auto px-6 py-28 space-y-32">

        {/* ================= HERO ================= */}
        <motion.section
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="text-center space-y-10"
        >
          <h1 className="text-5xl md:text-7xl font-semibold tracking-tight">
            Preparation has gravity.
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
              We remove it.
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-lg md:text-xl text-gray-400 leading-relaxed">
            Study Navigator is an AI system that decides
            <br />
            <span className="text-gray-300">
              what to study, when to study, and what you can safely ignore.
            </span>
          </p>

          <div className="flex justify-center pt-6">
            <a
              href="/start"
              className="px-8 py-4 rounded-xl bg-white text-black font-medium hover:bg-gray-200 transition"
            >
              Begin Navigation
            </a>
          </div>
        </motion.section>

        {/* ================= NOT A COURSE ================= */}
        <motion.section
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="max-w-4xl mx-auto text-center space-y-10"
        >
          <h2 className="text-3xl md:text-4xl font-medium">
            This is not a course.
          </h2>

          <div className="grid md:grid-cols-2 gap-6 text-gray-400 text-lg">
            {[
              "No recorded lectures",
              "No daily motivation",
              "No topper worship",
              "No fake productivity",
            ].map((text) => (
              <motion.div
                key={text}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.3 }}
                className="border border-white/10 rounded-xl p-6"
              >
                {text}
              </motion.div>
            ))}
          </div>

          <p className="text-2xl text-gray-300 pt-4">
            Just decisions.
          </p>
        </motion.section>

        {/* ================= SYSTEM PIPELINE ================= */}
        <motion.section
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="max-w-5xl mx-auto space-y-16"
        >
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-medium">
              A system, not advice
            </h2>
            <p className="text-gray-400">
              Everything works as a pipeline.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 text-center">
            {[
              {
                title: "Input",
                text: "Your syllabus.\nYour time.\nYour burnout.",
              },
              {
                title: "Engine",
                text: "Priority logic.\nAdaptive feedback.\nMemory tracking.",
              },
              {
                title: "Output",
                text: "Weekly clarity.\nFewer chapters.\nLess anxiety.",
              },
            ].map((item) => (
              <motion.div
                key={item.title}
                whileHover={{ y: -6 }}
                transition={{ duration: 0.4 }}
                className="border border-white/10 rounded-2xl p-8 space-y-3"
              >
                <h3 className="text-xl font-medium">{item.title}</h3>
                <p className="text-gray-400 whitespace-pre-line">
                  {item.text}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* ================= FINAL CTA ================= */}
        <motion.section
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="text-center pt-10"
        >
          <a
            href="/start"
            className="inline-block px-10 py-4 rounded-xl border border-white/20 text-lg hover:bg-white hover:text-black transition"
          >
            Start with where you are
          </a>
        </motion.section>

      </div>
    </main>
  );
}
