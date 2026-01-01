"use client";
import React, { useState } from 'react';

export default function Onboarding() {
  const [step, setStep] = useState(1);

  return (
    <div className="glass-card p-8 rounded-2xl max-w-md w-full mx-auto shadow-2xl">
      <p className="text-cyan-400 font-mono text-xs mb-4">SYSTEM_CHECK: STEP 0{step}</p>
      
      {step === 1 && (
        <div>
          <h2 className="text-xl font-bold mb-4">What is your main goal?</h2>
          <input 
            type="text" 
            placeholder="e.g. Master Mathematics" 
            className="w-full bg-white/5 border border-white/10 p-3 rounded-lg mb-4 outline-none focus:border-cyan-400"
          />
          <button onClick={() => setStep(2)} className="w-full py-3 bg-cyan-400 text-black font-bold rounded-lg neon-glow">
            NEXT
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="text-center">
          <h2 className="text-xl font-bold mb-4">Calibrating...</h2>
          <div className="w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400">Analyzing your study path...</p>
        </div>
      )}
    </div>
  );
}