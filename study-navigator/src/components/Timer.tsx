"use client";
import React, { useState, useEffect } from 'react';

export default function Timer({ topic, onClose }: { topic: string, onClose: () => void }) {
  const [seconds, setSeconds] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);

  // The logic that makes the clock tick
  useEffect(() => {
    let interval: any = null;
    if (isActive && seconds > 0) {
      interval = setInterval(() => {
        setSeconds((s) => s - 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, seconds]);

  // Converts seconds into MM:SS format
  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    /* This main div is what "hijacks" the screen */
    <div className="fixed inset-0 bg-[#050505] z-[999] flex flex-col items-center justify-center p-6">
      
      {/* Futuristic Background Glow */}
      <div className="absolute w-[500px] h-[500px] bg-[#00F2FF]/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="z-10 text-center">
        <p className="text-[#00F2FF] font-mono text-[10px] tracking-[0.5em] mb-4 uppercase opacity-60">
          Neural Session Active
        </p>
        
        <h2 className="text-3xl md:text-5xl font-bold mb-12 text-white tracking-tight">
          {topic}
        </h2>
        
        {/* The Big Clock */}
        <div className="text-[120px] md:text-[180px] font-black mb-12 font-mono text-white tracking-tighter leading-none shadow-[0_0_50px_rgba(255,255,255,0.05)]">
          {formatTime(seconds)}
        </div>

        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <button 
            onClick={() => setIsActive(!isActive)}
            className="px-12 py-4 bg-[#00F2FF] text-black font-bold rounded-full hover:shadow-[0_0_30px_rgba(0,242,255,0.4)] transition-all min-w-[220px]"
          >
            {isActive ? "PAUSE MISSION" : "RESUME MISSION"}
          </button>
          
          <button 
            onClick={onClose}
            className="px-12 py-4 bg-white/5 border border-white/10 text-white font-bold rounded-full hover:bg-white/10 transition-all"
          >
            ABORT SYSTEM
          </button>
        </div>
      </div>
    </div>
  );
}