"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, Sparkles, Brain, AlertTriangle } from "lucide-react";
import { JournalService } from "../../../services/journal.service";
import { useBrainStore } from "../../../store/useBrainStore";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Textarea } from "../../../components/ui/textarea";
import { JournalEntry } from "../../../types/journal.types";

export default function JournalPage() {
  const journalEntries = useBrainStore((s) => s.journalEntries);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [latestEntry, setLatestEntry] = useState<JournalEntry | null>(null);

  const handleAnalyze = async () => {
    if (!title.trim() || !content.trim()) return;
    setLoading(true);
    const entry = await JournalService.createEntry(title, content);
    setLatestEntry(entry);
    setTitle("");
    setContent("");
    setLoading(false);
  };

  const getSentimentColor = (sentiment: string) => {
    if (sentiment === "positive") return "text-emerald-400 border-emerald-500/20 bg-emerald-500/5";
    if (sentiment === "negative") return "text-rose-400 border-rose-500/20 bg-rose-500/5";
    if (sentiment === "mixed") return "text-amber-400 border-amber-500/20 bg-amber-500/5";
    return "text-slate-400 border-slate-500/20 bg-slate-500/5";
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="space-y-8 pb-10 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-violet-600/15 border border-violet-500/20 flex items-center justify-center text-violet-400">
          <BookOpen className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">Journal Analysis</h1>
          <p className="text-xs text-slate-400 font-mono">Write thoughts — AI extracts cognitive patterns</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Write Journal */}
        <Card className="border border-white/5">
          <CardHeader><CardTitle className="text-slate-200 text-base flex items-center gap-2"><Brain className="w-4 h-4 text-violet-400" /> New Journal Entry</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Entry Title</label>
              <Input placeholder="Morning thoughts, work stress..." value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Journal Content</label>
              <Textarea rows={8} placeholder="Write freely. The AI will detect emotions, keywords, and cognitive patterns..." value={content} onChange={(e) => setContent(e.target.value)} className="resize-none" />
            </div>
            <Button onClick={handleAnalyze} disabled={!title || !content || loading} variant="default" className="w-full cursor-pointer">
              <Sparkles className="w-4 h-4 mr-2" />
              {loading ? "AI Analyzing..." : "Analyze with AI"}
            </Button>
          </CardContent>
        </Card>

        {/* AI Analysis Results */}
        <div className="space-y-4">
          {latestEntry?.analysis ? (
            <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
              <Card className={`border ${getSentimentColor(latestEntry.analysis.sentiment)}`}>
                <CardContent className="p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-slate-200">AI Sentiment Result</h4>
                    <span className={`text-xs font-mono font-bold capitalize px-2 py-1 rounded border ${getSentimentColor(latestEntry.analysis.sentiment)}`}>
                      {latestEntry.analysis.sentiment}
                    </span>
                  </div>

                  {/* Positivity score bar */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[10px] font-mono text-slate-400">
                      <span>Positivity Index</span><span>{latestEntry.analysis.score}%</span>
                    </div>
                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-violet-600 to-cyan-500 rounded-full transition-all duration-700" style={{ width: `${latestEntry.analysis.score}%` }} />
                    </div>
                  </div>

                  {/* Emotion breakdown */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500">Emotion Profile</span>
                    {Object.entries(latestEntry.analysis.emotions).map(([emotion, value]) => (
                      <div key={emotion} className="space-y-1">
                        <div className="flex justify-between text-[10px] font-mono text-slate-400 capitalize">
                          <span>{emotion}</span><span>{value}%</span>
                        </div>
                        <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-violet-500/60 to-cyan-500/60 rounded-full" style={{ width: `${value}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Keywords */}
                  {latestEntry.analysis.keywords.length > 0 && (
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500">Key Terms Detected</span>
                      <div className="flex flex-wrap gap-1.5">
                        {latestEntry.analysis.keywords.map((kw) => (
                          <span key={kw} className="px-2 py-0.5 rounded bg-violet-600/15 border border-violet-500/20 text-[10px] text-violet-300 font-mono">{kw}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Cognitive Distortions */}
                  {latestEntry.analysis.cognitiveDistortions.length > 0 && (
                    <div className="p-3 rounded-lg bg-amber-500/8 border border-amber-500/20 space-y-1.5">
                      <div className="flex items-center gap-1.5 text-amber-400 text-[10px] font-mono uppercase tracking-wider">
                        <AlertTriangle className="w-3 h-3" /> Cognitive Distortions Detected
                      </div>
                      {latestEntry.analysis.cognitiveDistortions.map((d) => (
                        <p key={d} className="text-xs text-amber-200/70 font-sans">• {d}</p>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <div className="h-full flex items-center justify-center glassmorphism rounded-2xl border border-white/5 p-8 text-center min-h-[300px]">
              <div className="space-y-3">
                <Sparkles className="w-8 h-8 text-violet-400/50 mx-auto" />
                <p className="text-sm text-slate-400">Write a journal entry and run AI analysis to see your sentiment breakdown here.</p>
              </div>
            </div>
          )}

          {/* Past entries */}
          <Card className="border border-white/5">
            <CardHeader><CardTitle className="text-slate-200 text-sm">Past Entries</CardTitle></CardHeader>
            <CardContent className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {journalEntries.map((entry) => (
                <div key={entry.id} className="p-3 rounded-xl border border-white/5 hover:border-white/10 transition-all space-y-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-semibold text-slate-200">{entry.title}</h4>
                    <span className={`text-[9px] font-mono capitalize px-1.5 py-0.5 rounded border ${entry.analysis ? getSentimentColor(entry.analysis.sentiment) : "text-slate-500 border-slate-700"}`}>
                      {entry.analysis?.sentiment ?? "unanalyzed"}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-2 font-sans">{entry.content}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}
