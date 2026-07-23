'use client';

import React, { useState } from 'react';
import { useBrainOS } from '@/context/BrainOSContext';
import GlassCard from '@/components/ui/GlassCard';
import { JournalEntry } from '@/types/brainos';
import { analyzeJournalEntry } from '@/lib/groq-service';
import {
  BookOpen,
  Plus,
  Search,
  Sparkles,
  Tag,
  Trash2,
  Calendar,
  Smile,
  Cpu,
  Loader2,
  CheckCircle2,
} from 'lucide-react';

export default function JournalView() {
  const { journals, addJournal, updateJournal, deleteJournal, settings } = useBrainOS();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isCreating, setIsCreating] = useState(false);

  // New Journal Form state
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<JournalEntry['category']>('Reflection');
  const [moodRating, setMoodRating] = useState<number>(8);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzingId, setAnalyzingId] = useState<string | null>(null);

  const categories = ['All', 'Reflection', 'Gratitude', 'Stress Release', 'Goal Setting', 'Idea', 'General'];

  const filteredJournals = journals.filter((j) => {
    const matchesSearch =
      j.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'All' || j.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const handleCreateEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    setIsAnalyzing(true);

    // Call Groq AI or local fallback analysis
    const aiResult = await analyzeJournalEntry(
      settings.groqApiKey,
      settings.preferredModel,
      title,
      content
    );

    addJournal({
      date: new Date().toISOString().split('T')[0],
      title,
      content,
      category,
      moodRating,
      aiAnalysis: aiResult,
    });

    setIsAnalyzing(false);
    setTitle('');
    setContent('');
    setIsCreating(false);
  };

  const handleReanalyze = async (entry: JournalEntry) => {
    setAnalyzingId(entry.id);
    const aiResult = await analyzeJournalEntry(
      settings.groqApiKey,
      settings.preferredModel,
      entry.title,
      entry.content
    );
    updateJournal({ ...entry, aiAnalysis: aiResult });
    setAnalyzingId(null);
  };

  return (
    <div className="py-8 px-4 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 text-xs font-semibold">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Neural Emotion & Introspection Ledger</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white mt-1">Neural Journal</h1>
        </div>

        <button
          onClick={() => setIsCreating(!isCreating)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-400 hover:to-cyan-400 text-white font-bold text-xs shadow-[0_0_20px_rgba(168,85,247,0.3)] transition-all cursor-pointer"
          id="new-journal-entry-btn"
        >
          <Plus className="w-4 h-4" />
          <span>{isCreating ? 'Close Form' : 'New Journal Entry'}</span>
        </button>
      </div>

      {/* NEW ENTRY FORM */}
      {isCreating && (
        <GlassCard glowColor="purple" className="space-y-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-400" />
            <span>Write Neural Journal Entry</span>
          </h3>

          <form onSubmit={handleCreateEntry} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-slate-300">Title</label>
                <input
                  type="text"
                  placeholder="e.g., Reflections on Afternoon Flow State..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 mt-1"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500 mt-1"
                >
                  {categories.filter((c) => c !== 'All').map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300">Journal Content</label>
              <textarea
                rows={5}
                placeholder="Express your current thoughts, reflections, or cognitive pressure..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full bg-slate-900 border border-white/10 rounded-xl p-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 mt-1"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isAnalyzing}
              className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all cursor-pointer flex items-center gap-2"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-cyan-300" />
                  <span>Groq AI Extracting Emotion & Sentiment...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Save Entry & Analyze with Groq</span>
                </>
              )}
            </button>
          </form>
        </GlassCard>
      )}

      {/* SEARCH & CATEGORY FILTER */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search entries..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900/80 border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
          />
        </div>

        {/* Categories */}
        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                selectedCategory === cat
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 font-bold'
                  : 'bg-slate-900/60 text-slate-400 border border-white/10 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* JOURNAL ENTRIES LIST */}
      <div className="space-y-6">
        {filteredJournals.length === 0 ? (
          <GlassCard glowColor="purple" className="p-8 text-center text-slate-400 text-xs">
            No journal entries found. Click &quot;New Journal Entry&quot; above to write your first entry!
          </GlassCard>
        ) : (
          filteredJournals.map((j) => (
            <GlassCard key={j.id} glowColor="purple" className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20">
                      {j.category}
                    </span>
                    <h3 className="text-lg font-bold text-white">{j.title}</h3>
                  </div>
                  <div className="text-[11px] text-slate-400 flex items-center gap-2">
                    <Calendar className="w-3 h-3 text-slate-500" />
                    <span>{j.date}</span>
                  </div>
                </div>

                <button
                  onClick={() => deleteJournal(j.id)}
                  className="p-2 rounded-lg bg-slate-900 border border-white/10 text-slate-400 hover:text-rose-400 hover:border-rose-500/30 transition-all self-end sm:self-auto"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Entry Content */}
              <p className="text-sm text-slate-200 leading-relaxed whitespace-pre-wrap">
                {j.content}
              </p>

              {/* AI Analysis Result Card */}
              {j.aiAnalysis && (
                <div className="p-4 rounded-xl bg-slate-900/80 border border-purple-500/20 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 text-cyan-400 font-bold">
                      <Cpu className="w-4 h-4" />
                      <span>Groq AI Sentiment Analysis</span>
                    </div>

                    <button
                      onClick={() => handleReanalyze(j)}
                      disabled={analyzingId === j.id}
                      className="text-[10px] text-slate-400 hover:text-cyan-300 flex items-center gap-1"
                    >
                      {analyzingId === j.id ? (
                        <Loader2 className="w-3 h-3 animate-spin text-cyan-400" />
                      ) : (
                        <Sparkles className="w-3 h-3 text-cyan-400" />
                      )}
                      <span>Re-analyze</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                    <div>
                      <span className="text-slate-400 text-[10px]">Primary Emotion</span>
                      <div className="font-bold text-white">{j.aiAnalysis.primaryEmotion}</div>
                    </div>

                    <div>
                      <span className="text-slate-400 text-[10px]">Stress Level</span>
                      <div className="font-bold text-purple-300">{j.aiAnalysis.stressLevel}</div>
                    </div>

                    <div>
                      <span className="text-slate-400 text-[10px]">Sentiment Score</span>
                      <div className="font-bold text-emerald-400">
                        {j.aiAnalysis.sentimentScore > 0 ? `+${j.aiAnalysis.sentimentScore}` : j.aiAnalysis.sentimentScore}
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 border-t border-white/5 pt-2 italic">
                    &quot;{j.aiAnalysis.summary}&quot;
                  </p>
                </div>
              )}
            </GlassCard>
          ))
        )}
      </div>
    </div>
  );
}
