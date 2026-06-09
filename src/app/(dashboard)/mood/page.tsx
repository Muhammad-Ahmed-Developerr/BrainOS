"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Smile, Tag, PlusCircle } from "lucide-react";
import { MoodService } from "../../../services/mood.service";
import { MoodType } from "../../../types/mood.types";
import { useBrainStore } from "../../../store/useBrainStore";
import { MoodChart } from "../../../components/charts/MoodChart";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Textarea } from "../../../components/ui/textarea";

const MOODS: { type: MoodType; emoji: string; label: string; color: string }[] = [
  { type: "great",   emoji: "🤩", label: "Great",   color: "border-emerald-500/40 bg-emerald-500/10 hover:border-emerald-400/60" },
  { type: "good",    emoji: "😊", label: "Good",    color: "border-cyan-500/40 bg-cyan-500/10 hover:border-cyan-400/60" },
  { type: "neutral", emoji: "😐", label: "Neutral", color: "border-slate-500/40 bg-slate-500/10 hover:border-slate-400/60" },
  { type: "bad",     emoji: "😔", label: "Bad",     color: "border-amber-500/40 bg-amber-500/10 hover:border-amber-400/60" },
  { type: "terrible",emoji: "😰", label: "Terrible",color: "border-rose-500/40 bg-rose-500/10 hover:border-rose-400/60" },
];

const AVAILABLE_TAGS = ["Work", "Sleep", "Exercise", "Social", "Family", "Stress", "Relax", "Focus"];

export default function MoodPage() {
  const moodLogs = useBrainStore((s) => s.moodLogs);
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(null);
  const [notes, setNotes] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const toggleTag = (tag: string) =>
    setSelectedTags((prev) => prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]);

  const handleLog = async () => {
    if (!selectedMood) return;
    setLoading(true);
    await MoodService.logMood(selectedMood, notes, selectedTags);
    setLoading(false);
    setSuccess(true);
    setSelectedMood(null);
    setNotes("");
    setSelectedTags([]);
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="space-y-8 pb-10 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-cyan-600/15 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
          <Smile className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">Mood Tracker</h1>
          <p className="text-xs text-slate-400 font-mono">Log your current emotional frequency</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Mood Logger Card */}
        <Card className="border border-white/5">
          <CardHeader><CardTitle className="text-slate-200 text-base">How are you feeling right now?</CardTitle></CardHeader>
          <CardContent className="space-y-6">
            {/* Mood Grid */}
            <div className="grid grid-cols-5 gap-2">
              {MOODS.map((m) => (
                <button
                  key={m.type}
                  onClick={() => setSelectedMood(m.type)}
                  className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 cursor-pointer transition-all duration-200 ${m.color} ${selectedMood === m.type ? "scale-105 ring-2 ring-white/20" : ""}`}
                >
                  <span className="text-2xl">{m.emoji}</span>
                  <span className="text-[10px] font-mono text-slate-300">{m.label}</span>
                </button>
              ))}
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <label className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-slate-400">
                <Tag className="w-3 h-3" /> Contextual Tags
              </label>
              <div className="flex flex-wrap gap-2">
                {AVAILABLE_TAGS.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold cursor-pointer border transition-all ${selectedTags.includes(tag) ? "bg-violet-600/20 border-violet-500/40 text-white" : "border-white/10 text-slate-400 hover:border-white/20 hover:text-slate-200"}`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Optional Notes</label>
              <Textarea rows={3} placeholder="What's on your mind?" value={notes} onChange={(e) => setNotes(e.target.value)} />
            </div>

            {success && <p className="text-xs text-emerald-400 font-mono text-center animate-pulse">✓ Mood synced to neural log</p>}

            <Button onClick={handleLog} disabled={!selectedMood || loading} variant="default" className="w-full cursor-pointer">
              <PlusCircle className="w-4 h-4 mr-2" />
              {loading ? "Syncing..." : "Log Mood Entry"}
            </Button>
          </CardContent>
        </Card>

        {/* Recent Logs */}
        <Card className="border border-white/5">
          <CardHeader><CardTitle className="text-slate-200 text-base">Recent Logs</CardTitle></CardHeader>
          <CardContent className="space-y-3 max-h-80 overflow-y-auto pr-1">
            {moodLogs.slice(0, 8).map((log) => {
              const moodObj = MOODS.find((m) => m.type === log.mood);
              return (
                <div key={log.id} className="flex items-start gap-3 p-3 rounded-xl bg-white/3 border border-white/5">
                  <span className="text-xl mt-0.5">{moodObj?.emoji ?? "😐"}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-semibold text-slate-200 capitalize">{log.mood}</span>
                      <span className="text-[10px] font-mono text-slate-500 shrink-0">{new Date(log.timestamp).toLocaleDateString()}</span>
                    </div>
                    {log.notes && <p className="text-[11px] text-slate-400 mt-1 truncate">{log.notes}</p>}
                    {log.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {log.tags.map((t) => <span key={t} className="px-1.5 py-0.5 rounded bg-slate-700/50 text-[9px] text-slate-400 font-mono">{t}</span>)}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      {/* Full Chart */}
      <MoodChart />
    </motion.div>
  );
}
