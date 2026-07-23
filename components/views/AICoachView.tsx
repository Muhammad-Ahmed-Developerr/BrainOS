'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useBrainOS } from '@/context/BrainOSContext';
import GlassCard from '@/components/ui/GlassCard';
import { generateAICoachResponse, GROQ_MODELS } from '@/lib/groq-service';
import { Bot, Send, User, Sparkles, RefreshCw, Trash2, Cpu, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';

export default function AICoachView() {
  const { chatHistory, addChatMessage, clearChatHistory, settings, scores, updateSettings } = useBrainOS();

  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const quickPrompts = [
    'How can I lower my stress level after an intense work day?',
    'What micro-habits improve sleep quality consistently?',
    'I feel cognitive fatigue coming on. How can I recover?',
    'Guide me through a 3-minute mental clarity exercise.',
  ];

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, isTyping]);

  const handleSend = async (messageText?: string) => {
    const textToSend = messageText || input;
    if (!textToSend.trim() || isTyping) return;

    // Add user message
    addChatMessage({
      sender: 'user',
      text: textToSend,
    });

    setInput('');
    setIsTyping(true);

    // Context formatting
    const historyForAI = chatHistory.map((m) => ({
      role: m.sender,
      content: m.text,
    }));

    try {
      const response = await generateAICoachResponse(
        settings.groqApiKey,
        settings.preferredModel,
        textToSend,
        historyForAI,
        scores
      );

      addChatMessage({
        sender: 'assistant',
        text: response,
        modelUsed: settings.preferredModel,
      });
    } catch (e: any) {
      addChatMessage({
        sender: 'assistant',
        text: 'Connection Notice: Unable to query Groq model. Please check your API key in Settings.',
      });
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="py-8 px-4 lg:px-8 max-w-5xl mx-auto space-y-6">
      {/* HEADER & MODEL SELECTOR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-semibold">
            <Bot className="w-3.5 h-3.5" />
            <span>Supportive Reflection Partner</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white mt-1">Groq Neural Coach</h1>
        </div>

        {/* Model Dropdown */}
        <div className="flex items-center gap-2">
          <Cpu className="w-4 h-4 text-cyan-400" />
          <select
            value={settings.preferredModel}
            onChange={(e) => updateSettings({ preferredModel: e.target.value })}
            className="bg-slate-900 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500"
          >
            {GROQ_MODELS.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
          <button
            onClick={clearChatHistory}
            title="Clear Chat History"
            className="p-2 rounded-xl bg-slate-900 border border-white/10 text-slate-400 hover:text-rose-400 transition-all cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* QUICK PROMPT PILLS */}
      <div className="flex flex-wrap items-center gap-2">
        {quickPrompts.map((qp, i) => (
          <button
            key={i}
            onClick={() => handleSend(qp)}
            className="px-3 py-1.5 rounded-xl bg-slate-900/80 border border-white/10 hover:border-cyan-500/40 text-slate-300 hover:text-white text-xs font-medium transition-all cursor-pointer"
          >
            {qp}
          </button>
        ))}
      </div>

      {/* CHAT CONTAINER */}
      <GlassCard glowColor="cyan" className="p-4 sm:p-6 min-h-[480px] flex flex-col justify-between">
        {/* Messages List */}
        <div className="space-y-4 overflow-y-auto max-h-[500px] pr-2 mb-4">
          {chatHistory.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''}`}
              >
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                    isUser
                      ? 'bg-cyan-500 text-slate-950 font-bold'
                      : 'bg-gradient-to-br from-blue-500 to-purple-600 text-white'
                  }`}
                >
                  {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                <div
                  className={`p-4 rounded-2xl max-w-[85%] text-xs leading-relaxed ${
                    isUser
                      ? 'bg-cyan-500/10 border border-cyan-500/30 text-white rounded-tr-none'
                      : 'bg-slate-900/90 border border-white/10 text-slate-200 rounded-tl-none'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                  {!isUser && msg.modelUsed && (
                    <div className="text-[9px] text-cyan-400 font-mono mt-2 pt-1 border-t border-white/5">
                      Model: {msg.modelUsed}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {isTyping && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 text-white flex items-center justify-center">
                <Bot className="w-4 h-4" />
              </div>
              <div className="p-3 rounded-2xl bg-slate-900 border border-white/10 text-xs text-cyan-400 flex items-center gap-2">
                <Sparkles className="w-4 h-4 animate-spin text-cyan-400" />
                <span>Neural Core Generating Response...</span>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* INPUT BOX */}
        <div className="relative pt-2 border-t border-white/10">
          <input
            type="text"
            placeholder="Ask your BrainOS Neural Coach..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            className="w-full bg-slate-900 border border-white/10 rounded-xl pl-4 pr-12 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
          <button
            onClick={() => handleSend()}
            disabled={isTyping || !input.trim()}
            className="absolute right-2 top-3.5 p-2 rounded-lg bg-cyan-500 text-slate-950 font-bold hover:bg-cyan-400 disabled:opacity-40 transition-all cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </GlassCard>

      {/* NON-DIAGNOSTIC NOTICE */}
      <div className="flex items-center gap-2 text-[11px] text-slate-400 bg-slate-900/40 p-3 rounded-xl border border-white/5">
        <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
        <span>
          Non-Diagnostic Policy: BrainOS AI Coach is designed for reflection, habit building, and wellness support. It does not diagnose clinical conditions.
        </span>
      </div>
    </div>
  );
}
