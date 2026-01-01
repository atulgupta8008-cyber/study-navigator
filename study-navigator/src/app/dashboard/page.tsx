"use client";
import React, { useState, useEffect } from 'react';
import Timer from '@/components/Timer';

export default function Dashboard() {
  const [activeMission, setActiveMission] = useState<string | null>(null);
  const [newTopic, setNewTopic] = useState("");
  
  // State initialization
  const [missions, setMissions] = useState<{id: number, topic: string, time: string}[]>([]);
  const [log, setLog] = useState<{id: number, action: string, time: string}[]>([]);
  const [streak, setStreak] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  // --- PERSISTENCE LOGIC: LOAD DATA ON START ---
  useEffect(() => {
    const savedMissions = localStorage.getItem('nav_missions');
    const savedLog = localStorage.getItem('nav_log');
    const savedStreak = localStorage.getItem('nav_streak');

    if (savedMissions) setMissions(JSON.parse(savedMissions));
    if (savedLog) setLog(JSON.parse(savedLog));
    if (savedStreak) setStreak(parseInt(savedStreak));
    
    setIsLoaded(true); // Prevents "Save" from running before "Load"
  }, []);

  // --- PERSISTENCE LOGIC: SAVE DATA ON CHANGE ---
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('nav_missions', JSON.stringify(missions));
      localStorage.setItem('nav_log', JSON.stringify(log));
      localStorage.setItem('nav_streak', streak.toString());
    }
  }, [missions, log, streak, isLoaded]);

  const addMission = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTopic.trim()) return;
    const topicName = newTopic;
    setMissions([{ id: Date.now(), topic: topicName, time: "45m" }, ...missions]);
    setNewTopic("");
    addLog(`Deployed: ${topicName}`);
  };

  const archiveMission = (id: number, topic: string) => {
    setMissions(missions.filter(m => m.id !== id));
    setStreak(s => s + 1);
    addLog(`Accomplished: ${topic}`);
  };

  const addLog = (action: string) => {
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setLog(prev => [{ id: Date.now(), action, time: timestamp }, ...prev].slice(0, 8));
  };

  if (!isLoaded) return <div className="min-h-screen bg-[#050505] flex items-center justify-center text-[#00F2FF] font-mono animate-pulse">SYNCHRONIZING...</div>;

  return (
    <div className="min-h-screen bg-[#050505] text-white p-4 md:p-8 font-sans">
      {activeMission && <Timer topic={activeMission} onClose={() => setActiveMission(null)} />}

      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* SIDEBAR */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white/[0.03] border border-white/10 p-6 rounded-3xl text-center shadow-2xl">
             <div className="text-4xl mb-2">🔥</div>
             <div className="text-3xl font-black">{streak}</div>
             <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">Daily Streak</p>
          </div>

          <div className="bg-white/[0.01] border border-white/5 p-4 rounded-2xl">
            <h2 className="text-[10px] font-mono text-cyan-500 uppercase mb-4 border-b border-white/5 pb-2">System History</h2>
            <div className="space-y-3">
              {log.map(l => (
                <div key={l.id} className="text-[9px] font-mono opacity-50">
                  [{l.time}] {l.action}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* MAIN HUD */}
        <div className="lg:col-span-3">
          <header className="mb-8">
             <h1 className="text-[#00F2FF] font-black tracking-[0.4em] text-2xl">STUDY_NAVIGATOR</h1>
             <div className="h-1 w-full bg-white/5 rounded-full mt-6 overflow-hidden">
                <div className="h-full bg-cyan-400 shadow-[0_0_15px_#00F2FF] transition-all duration-1000" 
                     style={{ width: `${Math.min(100, streak * 10)}%` }}></div>
             </div>
          </header>

          <form onSubmit={addMission} className="mb-10 flex gap-4">
            <input 
              value={newTopic}
              onChange={(e) => setNewTopic(e.target.value)}
              placeholder="Define next objective..."
              className="flex-1 bg-white/5 border border-white/10 p-4 rounded-2xl text-white outline-none focus:border-[#00F2FF] transition-all"
            />
            <button type="submit" className="px-8 bg-white text-black font-black rounded-2xl hover:bg-[#00F2FF] transition-all text-[10px]">DEPLOY</button>
          </form>

          <div className="grid grid-cols-1 gap-4">
            {missions.map((m) => (
              <div key={m.id} className="bg-white/5 border border-white/10 p-6 rounded-3xl flex justify-between items-center group hover:border-cyan-500/50 transition-all">
                <div onClick={() => setActiveMission(m.topic)} className="flex-1 cursor-pointer">
                  <h3 className="text-xl font-bold group-hover:text-[#00F2FF] transition-colors">{m.topic}</h3>
                  <p className="text-[10px] text-slate-500 uppercase mt-1 tracking-widest">Priority: Alpha</p>
                </div>
                <button onClick={() => archiveMission(m.id, m.topic)} className="bg-cyan-500/10 p-3 rounded-xl text-cyan-500 hover:bg-cyan-500 hover:text-black transition-all">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}