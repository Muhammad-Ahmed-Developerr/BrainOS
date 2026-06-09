"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Compass, Play, Pause, RotateCcw, Volume2, Check } from "lucide-react";
import { useBrainStore } from "../../../store/useBrainStore";
import { FocusChart } from "../../../components/charts/FocusChart";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";

const SOUNDS = [
  { id: "none",     label: "Silent",         emoji: "🔇" },
  { id: "lofi",     label: "Lo-Fi Beats",    emoji: "🎵" },
  { id: "rain",     label: "Rainfall",       emoji: "🌧️" },
  { id: "binaural", label: "Binaural Theta", emoji: "🧠" },
  { id: "forest",   label: "Forest Ambience",emoji: "🌲" },
];

const DURATIONS = [15, 25, 45, 60]; // minutes

export default function FocusPage() {
  const addFocusSession = useBrainStore((s) => s.addFocusSession);
  const focusStats = useBrainStore((s) => s.focusStats);

  const [selectedDuration, setSelectedDuration] = useState(25);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedSound, setSelectedSound] = useState("none");
  const [completed, setCompleted] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      setCompleted(true);
      addFocusSession(selectedDuration);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isRunning, timeLeft]);

  const handleStart = () => { setIsRunning(true); setCompleted(false); };
  const handlePause = () => setIsRunning(false);
  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(selectedDuration * 60);
    setCompleted(false);
  };
  const handleDurationSelect = (mins: number) => {
    setSelectedDuration(mins);
    setTimeLeft(mins * 60);
    setIsRunning(false);
    setCompleted(false);
  };

  const minutes = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const seconds = String(timeLeft % 60).padStart(2, "0");
  const progress = ((selectedDuration * 60 - timeLeft) / (selectedDuration * 60)) * 100;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="space-y-8 pb-10 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-cyan-600/15 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
          <Compass className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">Focus Blocks</h1>
          <p className="text-xs text-slate-400 font-mono">Deep work sessions with ambient neuro-audio</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pomodoro Timer */}
        <Card className="border border-white/5">
          <CardContent className="p-8 flex flex-col items-center space-y-8">
            {/* Circular progress ring */}
            <div className="relative w-48 h-48">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="44" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="4" />
                <circle
                  cx="50" cy="50" r="44" fill="none"
                  stroke="url(#timerGradient)" strokeWidth="4"
                  strokeDasharray={`${2 * Math.PI * 44}`}
                  strokeDashoffset={`${2 * Math.PI * 44 * (1 - progress / 100)}`}
                  strokeLinecap="round"
                  className="transition-all duration-1000"
                />
                <defs>
                  <linearGradient id="timerGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#7C3AED" />
                    <stop offset="100%" stopColor="#06B6D4" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                {completed ? (
                  <div className="text-center">
                    <Check className="w-10 h-10 text-emerald-400 mx-auto" />
                    <p className="text-xs text-emerald-400 font-mono mt-1">COMPLETE</p>
                  </div>
                ) : (
                  <>
                    <span className="text-5xl font-mono font-bold text-white tracking-tighter">{minutes}:{seconds}</span>
                    <span className="text-[10px] font-mono text-slate-500 mt-1 uppercase">
                      {isRunning ? "FOCUSING" : "READY"}
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Duration selector */}
            <div className="flex gap-2">
              {DURATIONS.map((d) => (
                <button
                  key={d}
                  onClick={() => handleDurationSelect(d)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold cursor-pointer border transition-all ${
                    selectedDuration === d
                      ? "bg-violet-600/20 border-violet-500/40 text-white"
                      : "border-white/10 text-slate-400 hover:border-white/20 hover:text-slate-200"
                  }`}
                >
                  {d}m
                </button>
              ))}
            </div>

            {/* Controls */}
            <div className="flex items-center gap-3">
              <button onClick={handleReset} className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer">
                <RotateCcw className="w-4 h-4" />
              </button>
              {isRunning ? (
                <button onClick={handlePause} className="w-16 h-16 rounded-full bg-gradient-to-br from-violet-600 to-cyan-600 flex items-center justify-center text-white shadow-lg shadow-violet-900/30 hover:brightness-110 transition-all cursor-pointer">
                  <Pause className="w-6 h-6 fill-current" />
                </button>
              ) : (
                <button onClick={handleStart} className="w-16 h-16 rounded-full bg-gradient-to-br from-violet-600 to-cyan-600 flex items-center justify-center text-white shadow-lg shadow-violet-900/30 hover:brightness-110 transition-all cursor-pointer">
                  <Play className="w-6 h-6 fill-current" />
                </button>
              )}
              <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400">
                <Volume2 className="w-4 h-4" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Right panel: Stats + Ambient sounds */}
        <div className="space-y-4">
          {/* Session stats */}
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "Sessions Today",  value: focusStats.completedSessions },
              { label: "Focus Minutes",   value: `${focusStats.totalFocusTime}m` },
              { label: "Daily Goal",      value: `${focusStats.dailyGoal}m` },
              { label: "Streak",          value: `${focusStats.streakDays}d` },
            ].map((s) => (
              <Card key={s.label} className="border border-white/5">
                <CardContent className="p-4">
                  <p className="text-[10px] font-mono uppercase text-slate-500 tracking-wider">{s.label}</p>
                  <p className="text-2xl font-bold text-cyan-400 mt-1">{s.value}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Ambient sounds */}
          <Card className="border border-white/5">
            <CardHeader><CardTitle className="text-slate-200 text-sm">Ambient Neuro-Audio</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {SOUNDS.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSelectedSound(s.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold cursor-pointer border transition-all ${
                    selectedSound === s.id
                      ? "bg-violet-600/15 border-violet-500/30 text-white"
                      : "border-white/5 text-slate-400 hover:border-white/10 hover:text-slate-200 bg-white/2"
                  }`}
                >
                  <span className="text-base">{s.emoji}</span>
                  <span>{s.label}</span>
                  {selectedSound === s.id && <Check className="w-3.5 h-3.5 text-cyan-400 ml-auto" />}
                </button>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      <FocusChart />
    </motion.div>
  );
}
