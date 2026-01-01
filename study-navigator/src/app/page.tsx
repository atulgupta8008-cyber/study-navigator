"use client";
import { useState } from 'react';
import Onboarding from "../components/Onboarding";

export default function Home() {
  const [isStarted, setIsStarted] = useState(false);

  return (
    <main className="relative min-h-screen flex items-center justify-center p-6">
      {/* Blue Glow Effect */}
      <div className="absolute w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[100px]"></div>

      {!isStarted ? (
        <div className="text-center z-10">
          <h1 className="text-6xl font-black tracking-tighter mb-4">
            STUDY <span className="text-cyan-400">NAVIGATOR</span>
          </h1>
          <p className="text-slate-400 mb-8 max-w-sm mx-auto">
            The futuristic way to plan your study missions.
          </p>
          <button 
            onClick={() => setIsStarted(true)}
            className="px-12 py-4 bg-white text-black font-bold rounded-full hover:bg-cyan-400 transition-all"
          >
            INITIALIZE
          </button>
        </div>
      ) : (
        <div className="z-10 w-full flex justify-center">
          <Onboarding />
        </div>
      )}
    </main>
  );
}