'use client';

import React, { useState } from 'react';
import { useBrainOS } from '@/context/BrainOSContext';
import GlassCard from '@/components/ui/GlassCard';
import {
  CalendarCheck,
  Smile,
  Zap,
  Activity,
  Moon,
  Droplet,
  Dumbbell,
  Briefcase,
  Monitor,
  Users,
  Sparkles,
  CheckCircle2,
  Tag,
  PenTool,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { motion } from 'motion/react';

export default function DailyCheckInView() {
  const { addCheckIn, setActiveView } = useBrainOS();

  const [dateStr, setDateStr] = useState(new Date().toISOString().split('T')[0]);
  const [mood, setMood] = useState<number>(7);
  const [energy, setEnergy] = useState<number>(7);
  const [stress, setStress] = useState<number>(4);
  const [sleepHours, setSleepHours] = useState<number>(7.5);
  const [sleepQuality, setSleepQuality] = useState<number>(8);
  const [waterIntakeLiters, setWaterIntakeLiters] = useState<number>(2.5);
  const [exerciseMinutes, setExerciseMinutes] = useState<number>(30);
  const [workHours, setWorkHours] = useState<number>(8);
  const [studyHours, setStudyHours] = useState<number>(1);
  const [screenTimeHours, setScreenTimeHours] = useState<number>(6);
  const [socialMinutes, setSocialMinutes] = useState<number>(45);
  const [meditationMinutes, setMeditationMinutes] = useState<number>(15);
  const [productivity, setProductivity] = useState<number>(8);
  const [selectedTags, setSelectedTags] = useState<string[]>(['Focused', 'Deep Work']);
  const [customNotes, setCustomNotes] = useState<string>('');
  const [submitted, setSubmitted] = useState<boolean>(false);

  const availableTags = [
    'Focused',
    'Deep Work',
    'Caffeine High',
    'Gym',
    'Nature Walk',
    'Late Night',
    'Stressed',
    'Social Event',
    'Meditated',
    'Flow State',
    'Fatigued',
    'Optimistic',
  ];

  const moodEmojis: { [key: number]: string } = {
    1: '😭 Extreme Distress',
    2: '😔 Very Low',
    3: '🙁 Below Average',
    4: '😐 Neutral',
    5: '🙂 Fair',
    6: '😊 Good',
    7: '😄 Great',
    8: '🚀 High Energy',
    9: '🌟 Peak Clarity',
    10: '✨ Optimal Harmony',
  };

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addCheckIn({
      date: dateStr,
      mood,
      moodLabel: moodEmojis[mood],
      energy,
      stress,
      sleepHours,
      sleepQuality,
      waterIntakeLiters,
      exerciseMinutes,
      workHours,
      studyHours,
      screenTimeHours,
      socialMinutes,
      meditationMinutes,
      productivity,
      tags: selectedTags,
      customNotes,
    });

    // Fire celebratory confetti!
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#06b6d4', '#3b82f6', '#a855f7'],
    });

    setSubmitted(true);
    setTimeout(() => {
      setActiveView('dashboard');
    }, 1800);
  };

  return (
    <div className="py-8 px-4 lg:px-8 max-w-4xl mx-auto space-y-8">
      {/* HEADER */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-semibold">
          <CalendarCheck className="w-3.5 h-3.5" />
          <span>Neural Daily Calibration</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">Daily Check-In</h1>
        <p className="text-slate-400 text-sm max-w-lg mx-auto">
          Log today&apos;s cognitive, physical, and emotional metrics to recalibrate your BrainOS scores.
        </p>
      </div>

      {submitted ? (
        <GlassCard glowColor="emerald" className="p-12 text-center space-y-4">
          <div className="p-4 w-fit mx-auto rounded-full bg-emerald-500/20 text-emerald-400">
            <CheckCircle2 className="w-12 h-12 animate-bounce" />
          </div>
          <h2 className="text-2xl font-bold text-white">Daily Check-In Saved!</h2>
          <p className="text-slate-300 text-sm">
            Recalculating Mental Health Index, Stress Score, and Burnout Risk in real time...
          </p>
        </GlassCard>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* DATE SELECTOR */}
          <GlassCard glowColor="cyan" className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Check-In Date
              </label>
              <input
                type="date"
                value={dateStr}
                onChange={(e) => setDateStr(e.target.value)}
                className="bg-slate-900 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
          </GlassCard>

          {/* MOOD & ENERGY SLIDERS */}
          <GlassCard glowColor="cyan" className="space-y-6">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Smile className="w-5 h-5 text-cyan-400" />
              <span>Emotional Baseline & Energy</span>
            </h3>

            {/* Mood */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-300">Mood Index: {mood} / 10</span>
                <span className="text-cyan-300 font-bold">{moodEmojis[mood]}</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={mood}
                onChange={(e) => setMood(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* Energy */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-300">Energy Level: {energy} / 10</span>
                <span className="text-amber-300 font-bold">{energy >= 7 ? 'High' : energy >= 4 ? 'Moderate' : 'Low'}</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={energy}
                onChange={(e) => setEnergy(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* Stress */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-300">Subjective Stress: {stress} / 10</span>
                <span className="text-blue-400 font-bold">{stress >= 7 ? 'Elevated' : stress >= 4 ? 'Moderate' : 'Low'}</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={stress}
                onChange={(e) => setStress(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </GlassCard>

          {/* SLEEP & LIFESTYLE */}
          <GlassCard glowColor="purple" className="space-y-6">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Moon className="w-5 h-5 text-purple-400" />
              <span>Sleep & Physical Habits</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Sleep Hours */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300">Sleep Duration (Hours)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    step="0.5"
                    min="1"
                    max="16"
                    value={sleepHours}
                    onChange={(e) => setSleepHours(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500"
                  />
                  <span className="text-xs text-slate-400">hrs</span>
                </div>
              </div>

              {/* Sleep Quality */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300">Sleep Quality (1-10)</label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={sleepQuality}
                  onChange={(e) => setSleepQuality(Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer mt-3"
                />
              </div>

              {/* Water Intake */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300">Water Intake (Liters)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    step="0.25"
                    min="0"
                    max="8"
                    value={waterIntakeLiters}
                    onChange={(e) => setWaterIntakeLiters(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500"
                  />
                  <span className="text-xs text-slate-400">L</span>
                </div>
              </div>

              {/* Exercise */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300">Exercise (Minutes)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    step="5"
                    min="0"
                    max="300"
                    value={exerciseMinutes}
                    onChange={(e) => setExerciseMinutes(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500"
                  />
                  <span className="text-xs text-slate-400">min</span>
                </div>
              </div>
            </div>
          </GlassCard>

          {/* WORK, STUDY & SCREEN TIME */}
          <GlassCard glowColor="blue" className="space-y-6">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-blue-400" />
              <span>Work, Screen Time & Social</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-300">Work Hours</label>
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  max="18"
                  value={workHours}
                  onChange={(e) => setWorkHours(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 mt-1"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300">Screen Time (Hours)</label>
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  max="20"
                  value={screenTimeHours}
                  onChange={(e) => setScreenTimeHours(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 mt-1"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300">Productivity (1-10)</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={productivity}
                  onChange={(e) => setProductivity(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 mt-1"
                />
              </div>
            </div>
          </GlassCard>

          {/* TAGS & NOTES */}
          <GlassCard glowColor="emerald" className="space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Tag className="w-5 h-5 text-emerald-400" />
              <span>Contextual Tags & Daily Notes</span>
            </h3>

            {/* Quick Tags */}
            <div className="flex flex-wrap gap-2">
              {availableTags.map((tag) => {
                const isSelected = selectedTags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                      isSelected
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold'
                        : 'bg-slate-900 text-slate-400 border border-white/10 hover:text-white'
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>

            {/* Custom Notes */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Daily Reflections / Notes</label>
              <textarea
                rows={3}
                placeholder="Write any additional observations about today..."
                value={customNotes}
                onChange={(e) => setCustomNotes(e.target.value)}
                className="w-full bg-slate-900 border border-white/10 rounded-xl p-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </GlassCard>

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-extrabold text-base shadow-[0_0_30px_rgba(6,182,212,0.4)] hover:shadow-[0_0_45px_rgba(6,182,212,0.8)] transition-all cursor-pointer flex items-center justify-center gap-2"
            id="daily-checkin-submit-btn"
          >
            <Sparkles className="w-5 h-5" />
            <span>Save & Recalibrate BrainOS</span>
          </button>
        </form>
      )}
    </div>
  );
}
