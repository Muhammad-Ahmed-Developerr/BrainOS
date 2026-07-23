'use client';

import React, { useState } from 'react';
import { useBrainOS } from '@/context/BrainOSContext';
import GlassCard from '@/components/ui/GlassCard';
import { GROQ_MODELS } from '@/lib/groq-service';
import {
  Settings as SettingsIcon,
  Key,
  Cpu,
  Palette,
  Download,
  Upload,
  RotateCcw,
  CheckCircle2,
  Lock,
  Eye,
  EyeOff,
} from 'lucide-react';

export default function SettingsView() {
  const {
    settings,
    updateSettings,
    exportDataJSON,
    importDataJSON,
    resetAllData,
  } = useBrainOS();

  const [showApiKey, setShowApiKey] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState(settings.groqApiKey || '');
  const [importJsonText, setImportJsonText] = useState('');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const handleSaveApiKey = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({ groqApiKey: apiKeyInput.trim() });
    setStatusMessage('Groq API Key saved securely to local storage.');
    setTimeout(() => setStatusMessage(null), 3000);
  };

  const handleExport = () => {
    const jsonStr = exportDataJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `brainos_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    if (!importJsonText.trim()) return;
    const ok = importDataJSON(importJsonText);
    if (ok) {
      setStatusMessage('Data imported successfully!');
      setImportJsonText('');
    } else {
      setStatusMessage('Invalid JSON backup file.');
    }
    setTimeout(() => setStatusMessage(null), 3000);
  };

  return (
    <div className="py-8 px-4 lg:px-8 max-w-4xl mx-auto space-y-8">
      {/* HEADER */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-semibold">
          <SettingsIcon className="w-3.5 h-3.5" />
          <span>System Configuration & AI Credentials</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white">BrainOS Settings</h1>
        <p className="text-slate-400 text-sm">
          Manage your free Groq API key, model choices, data backups, and local storage.
        </p>
      </div>

      {statusMessage && (
        <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* GROQ API KEY CONFIGURATION */}
      <GlassCard glowColor="cyan" className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Key className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base font-bold text-white">Groq API Key</h3>
          </div>
          <span className="text-[10px] font-bold text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded-full border border-cyan-500/20">
            Stored Locally Only
          </span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          BrainOS queries Groq LLMs directly from your browser. Paste your free key from{' '}
          <a
            href="https://console.groq.com/keys"
            target="_blank"
            rel="noreferrer"
            className="text-cyan-400 underline font-semibold"
          >
            console.groq.com
          </a>
          .
        </p>

        <form onSubmit={handleSaveApiKey} className="space-y-3">
          <div className="relative">
            <input
              type={showApiKey ? 'text' : 'password'}
              placeholder="gsk_..."
              value={apiKeyInput}
              onChange={(e) => setApiKeyInput(e.target.value)}
              className="w-full bg-slate-900 border border-white/10 rounded-xl pl-4 pr-10 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
            />
            <button
              type="button"
              onClick={() => setShowApiKey(!showApiKey)}
              className="absolute right-3 top-3 text-slate-400 hover:text-white"
            >
              {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all cursor-pointer"
          >
            Save Groq Key
          </button>
        </form>
      </GlassCard>

      {/* PREFERRED MODEL SELECTOR */}
      <GlassCard glowColor="purple" className="space-y-4">
        <div className="flex items-center gap-2">
          <Cpu className="w-5 h-5 text-purple-400" />
          <h3 className="text-base font-bold text-white">Default Neural Model</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {GROQ_MODELS.map((m) => (
            <div
              key={m.id}
              onClick={() => updateSettings({ preferredModel: m.id })}
              className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                settings.preferredModel === m.id
                  ? 'bg-purple-500/20 border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.2)]'
                  : 'bg-slate-900/60 border-white/10 hover:border-purple-500/30'
              }`}
            >
              <div className="flex justify-between items-center text-xs font-bold text-white">
                <span>{m.name}</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-purple-300">
                  {m.badge}
                </span>
              </div>
              <div className="text-[10px] text-slate-400 font-mono mt-1">{m.id}</div>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* BACKUP, EXPORT & RESET */}
      <GlassCard glowColor="emerald" className="space-y-6">
        <h3 className="text-base font-bold text-white">Data Management & Privacy</h3>

        <div className="flex flex-wrap items-center gap-4">
          <button
            onClick={handleExport}
            className="px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 hover:border-emerald-500/40 text-slate-200 font-bold text-xs flex items-center gap-2 cursor-pointer"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span>Export Backup JSON</span>
          </button>

          <button
            onClick={() => {
              if (confirm('Are you sure you want to reset all BrainOS data to default demo state?')) {
                resetAllData();
                setStatusMessage('Data reset to default.');
              }
            }}
            className="px-4 py-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 hover:bg-rose-500/20 text-rose-300 font-bold text-xs flex items-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Demo Data</span>
          </button>
        </div>

        {/* Import JSON */}
        <div className="space-y-2 pt-4 border-t border-white/10">
          <label className="text-xs font-bold text-slate-300">Import Data JSON</label>
          <textarea
            rows={3}
            placeholder="Paste raw BrainOS JSON backup text here..."
            value={importJsonText}
            onChange={(e) => setImportJsonText(e.target.value)}
            className="w-full bg-slate-900 border border-white/10 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
          <button
            onClick={handleImport}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs cursor-pointer flex items-center gap-1"
          >
            <Upload className="w-4 h-4" />
            <span>Restore Backup</span>
          </button>
        </div>
      </GlassCard>
    </div>
  );
}
