"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Leaf, Plus, Check, Flame, Trophy } from "lucide-react";
import { useBrainStore } from "../../../store/useBrainStore";
import { HabitChart } from "../../../components/charts/HabitChart";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { HabitCategory } from "../../../types/habit.types";

const CATEGORY_COLORS: Record<HabitCategory, string> = {
  mind:  "bg-violet-500/10 border-violet-500/25 text-violet-300",
  body:  "bg-orange-500/10 border-orange-500/25 text-orange-300",
  sleep: "bg-indigo-500/10 border-indigo-500/25 text-indigo-300",
  focus: "bg-cyan-500/10 border-cyan-500/25 text-cyan-300",
};

const CATEGORY_EMOJIS: Record<HabitCategory, string> = {
  mind: "🧘", body: "🏃", sleep: "🌙", focus: "💼",
};

export default function HabitsPage() {
  const habits = useBrainStore((s) => s.habits);
  const toggleHabit = useBrainStore((s) => s.toggleHabit);
  const addHabit = useBrainStore((s) => s.addHabit);

  const [newHabitName, setNewHabitName] = useState("");
  const [newCategory, setNewCategory] = useState<HabitCategory>("mind");
  const [adding, setAdding] = useState(false);

  const today = new Date().toISOString().split("T")[0];

  const completedToday = habits.filter((h) => h.completedDays.includes(today)).length;
  const completionRate = habits.length > 0 ? Math.round((completedToday / habits.length) * 100) : 0;

  const handleAdd = () => {
    if (!newHabitName.trim()) return;
    setAdding(true);
    addHabit(newHabitName.trim(), newCategory);
    setNewHabitName("");
    setAdding(false);
  };

  const isCompletedToday = (completedDays: string[]) => completedDays.includes(today);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="space-y-8 pb-10 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-emerald-600/15 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
          <Leaf className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">Habit Stack</h1>
          <p className="text-xs text-slate-400 font-mono">Build cognitive resilience through daily micro-habits</p>
        </div>
      </div>

      {/* Top stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Done Today", value: `${completedToday}/${habits.length}`, icon: <Check className="w-4 h-4" />, color: "text-emerald-400" },
          { label: "Completion Rate", value: `${completionRate}%`, icon: <Trophy className="w-4 h-4" />, color: "text-cyan-400" },
          { label: "Longest Streak", value: `${Math.max(...habits.map((h) => h.streak), 0)}d`, icon: <Flame className="w-4 h-4" />, color: "text-orange-400" },
        ].map((s) => (
          <Card key={s.label} className="border border-white/5">
            <CardContent className="p-5 flex items-center gap-3">
              <div className={`w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center ${s.color}`}>{s.icon}</div>
              <div>
                <p className="text-[10px] font-mono uppercase text-slate-500 tracking-wider">{s.label}</p>
                <p className={`text-2xl font-bold mt-0.5 ${s.color}`}>{s.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Habit List */}
        <div className="lg:col-span-2 space-y-3">
          {habits.map((habit) => {
            const done = isCompletedToday(habit.completedDays);
            const catColor = CATEGORY_COLORS[habit.category];
            return (
              <motion.div
                key={habit.id}
                layout
                className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${
                  done ? "border-emerald-500/20 bg-emerald-500/5" : "border-white/5 bg-white/2 hover:border-white/10"
                }`}
              >
                <button
                  onClick={() => toggleHabit(habit.id, today)}
                  className={`w-7 h-7 rounded-full border-2 flex items-center justify-center cursor-pointer transition-all ${
                    done ? "border-emerald-500 bg-emerald-500 text-white" : "border-white/20 hover:border-emerald-500/50"
                  }`}
                >
                  {done && <Check className="w-3.5 h-3.5" />}
                </button>
                <span className="text-xl">{CATEGORY_EMOJIS[habit.category] ?? "⚡"}</span>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-semibold ${done ? "text-slate-400 line-through" : "text-slate-200"}`}>{habit.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded border capitalize ${catColor}`}>{habit.category}</span>
                    <span className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
                      <Flame className="w-2.5 h-2.5" /> {habit.streak}d streak
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-slate-300">{habit.completedDays.length}</p>
                  <p className="text-[10px] text-slate-500 font-mono">days</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Add Habit */}
        <Card className="border border-white/5 self-start">
          <CardHeader><CardTitle className="text-slate-200 text-sm flex items-center gap-2"><Plus className="w-4 h-4 text-emerald-400" /> Add New Habit</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Habit Name</label>
              <Input placeholder="e.g., Morning walk, Meditation..." value={newHabitName} onChange={(e) => setNewHabitName(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleAdd()} />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Category</label>
              <div className="grid grid-cols-2 gap-1.5">
                {(Object.keys(CATEGORY_COLORS) as HabitCategory[]).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setNewCategory(cat)}
                    className={`px-2 py-1.5 rounded-lg text-[10px] font-mono font-bold cursor-pointer border transition-all capitalize ${
                      newCategory === cat ? CATEGORY_COLORS[cat] : "border-white/10 text-slate-500 hover:border-white/20"
                    }`}
                  >
                    {CATEGORY_EMOJIS[cat]} {cat}
                  </button>
                ))}
              </div>
            </div>
            <Button onClick={handleAdd} disabled={!newHabitName.trim() || adding} variant="default" className="w-full cursor-pointer">
              <Plus className="w-4 h-4 mr-1" /> {adding ? "Adding..." : "Add Habit"}
            </Button>
          </CardContent>
        </Card>
      </div>

      <HabitChart />
    </motion.div>
  );
}
