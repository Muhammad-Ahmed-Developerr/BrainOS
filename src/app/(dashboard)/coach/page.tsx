"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BrainCircuit, Send, Sparkles, User } from "lucide-react";
import { AiCoachService, ChatMessage } from "../../../services/ai/ai-coach.service";
import { Textarea } from "../../../components/ui/textarea";
import { Button } from "../../../components/ui/button";

const QUICK_PROMPTS = [
  "Why am I burning out?",
  "How can I improve sleep?",
  "Tips to reduce stress now",
  "Help me build focus habits",
  "Explain my mood patterns",
];

export default function CoachPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      sender: "ai",
      text: "Hi! I'm your BrainOS AI Coach. I've analyzed your neural metrics, mood patterns, stress readings, and burnout indicators. Ask me anything about your mental health, or let me guide your personalized recovery plan. 🧠",
      timestamp: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (text?: string) => {
    const content = text ?? input.trim();
    if (!content) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: "user",
      text: content,
      timestamp: new Date().toISOString(),
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    const reply = await AiCoachService.sendMessage(content, updatedMessages);
    setMessages((prev) => [...prev, reply]);
    setLoading(false);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="flex flex-col h-[calc(100vh-10rem)] max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-violet-600/15 border border-violet-500/20 flex items-center justify-center text-violet-400">
          <BrainCircuit className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">AI Mental Health Coach</h1>
          <p className="text-xs text-slate-400 font-mono">Personalized guidance powered by your neural metrics</p>
        </div>
        <div className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/8">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[10px] font-mono text-emerald-400">ONLINE</span>
        </div>
      </div>

      {/* Quick Prompts */}
      <div className="flex flex-wrap gap-2 mb-4">
        {QUICK_PROMPTS.map((p) => (
          <button
            key={p}
            onClick={() => handleSend(p)}
            className="px-3 py-1.5 rounded-full text-[11px] font-semibold cursor-pointer border border-violet-500/20 bg-violet-600/8 text-violet-300 hover:bg-violet-600/15 hover:border-violet-400/30 transition-all"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-2 pb-4 scrollbar-thin">
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex items-start gap-3 ${msg.sender === "user" ? "flex-row-reverse" : ""}`}
            >
              {/* Avatar */}
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                msg.sender === "ai"
                  ? "bg-violet-600/20 border border-violet-500/20 text-violet-400"
                  : "bg-cyan-600/20 border border-cyan-500/20 text-cyan-400"
              }`}>
                {msg.sender === "ai" ? <Sparkles className="w-4 h-4" /> : <User className="w-4 h-4" />}
              </div>

              {/* Bubble */}
              <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed font-sans ${
                msg.sender === "ai"
                  ? "bg-white/5 border border-white/8 text-slate-200 rounded-tl-sm"
                  : "bg-gradient-to-br from-violet-600/25 to-cyan-600/15 border border-violet-500/20 text-slate-100 rounded-tr-sm"
              }`}>
                {msg.text}
              </div>
            </motion.div>
          ))}

          {/* Typing indicator */}
          {loading && (
            <motion.div key="typing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-violet-600/20 border border-violet-500/20 text-violet-400 flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="flex items-center gap-1 px-4 py-3 bg-white/5 border border-white/8 rounded-2xl rounded-tl-sm">
                {[0, 0.2, 0.4].map((d, i) => (
                  <span key={i} className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: `${d}s` }} />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="pt-4 border-t border-white/5">
        <div className="flex gap-3 items-end">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Ask your AI coach anything about your mental health..."
            rows={2}
            className="resize-none flex-1"
          />
          <Button onClick={() => handleSend()} disabled={!input.trim() || loading} variant="default" size="lg" className="cursor-pointer shrink-0">
            <Send className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-[10px] text-slate-500 font-mono mt-2 text-center">
          Enter to send · Shift+Enter for new line
        </p>
      </div>
    </motion.div>
  );
}
