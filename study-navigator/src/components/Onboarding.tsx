"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation'; // Step 1: Import the router

export default function Onboarding() {
  const [step, setStep] = useState(1);
  const router = useRouter(); // Step 2: Initialize the router

  // Step 3: This function handles the "Loading" fake-out and then moves to the dashboard
  const handleFinalStep = () => {
    setStep(3);
    setTimeout(() => {
      router.push('/dashboard');
    }, 2000);
  };

  return (
    <div className="bg-white/5 border border-white/10 p-8 rounded-2xl max-w-md w-full backdrop-blur-xl shadow-2xl">
      <p className="text-[#00F2FF] font-mono text-xs mb-4 uppercase tracking-widest">
        System Calibrating: Step 0{step}
      </p>
      
      {step === 1 && (
        <div className="animate-in fade-in duration-500">
          <h2 className="text-xl font-bold mb-4 text-white">Target Objective?</h2>
          <input 
            type="text" 
            placeholder="e.g. Advanced Physics" 
            className="w-full bg-white/5 border border-white/10 p-3 rounded-lg mb-6 text-white outline-none focus:border-[#00F2FF]" 
          />
          <button 
            onClick={() => setStep(2)} 
            className="w-full py-3 bg-[#00F2FF] text-black font-bold rounded-lg shadow-[0_0_15px_rgba(0,242,255,0.3)] hover:scale-105 transition-transform"
          >
            NEXT PHASE
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="animate-in fade-in duration-500 text-center">
          <h2 className="text-xl font-bold mb-4 text-white">Daily Bandwidth?</h2>
          <p className="text-slate-400 text-sm mb-6">Select your daily focus hours</p>
          <input type="range" min="1" max="12" className="w-full accent-[#00F2FF] mb-8" />
          <button 
            onClick={handleFinalStep} // Step 4: Call our new function here
            className="w-full py-3 bg-[#00F2FF] text-black font-bold rounded-lg shadow-[0_0_15px_rgba(0,242,255,0.3)]"
          >
            GENERATE MY MAP
          </button>
        </div>
      )}

      {step === 3 && (
        <div className="text-center animate-in zoom-in duration-500 py-10">
          <h2 className="text-xl font-bold mb-4 text-white uppercase tracking-tighter">Neural Mapping...</h2>
          <div className="w-12 h-12 border-4 border-[#00F2FF] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400 font-mono text-[10px]">UPDATING TRAJECTORY...</p>
        </div>
      )}
    </div>
  );
}