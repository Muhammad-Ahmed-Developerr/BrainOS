'use client';

import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import { useSession } from 'next-auth/react';
import {
  ViewType,
  DailyCheckIn,
  JournalEntry,
  MentalHealthScores,
  AIRecommendation,
  ChatMessage,
  UserSettings,
} from '@/types/brainos';
import {
  loadSettings,
  saveSettings,
  loadCheckIns,
  saveCheckIns,
  loadJournals,
  saveJournals,
  loadChatHistory,
  saveChatHistory,
  DEFAULT_SETTINGS,
  DEFAULT_CHECKINS,
  DEFAULT_JOURNALS,
  DEFAULT_CHAT_HISTORY,
} from '@/lib/storage';
import { calculateScoresFromCheckIns, generateRecommendations } from '@/lib/scoring-engine';

interface BrainOSContextType {
  activeView: ViewType;
  setActiveView: (view: ViewType) => void;
  checkIns: DailyCheckIn[];
  addCheckIn: (checkIn: Omit<DailyCheckIn, 'id' | 'timestamp'>) => void;
  journals: JournalEntry[];
  addJournal: (entry: Omit<JournalEntry, 'id' | 'timestamp'>) => JournalEntry;
  updateJournal: (entry: JournalEntry) => void;
  deleteJournal: (id: string) => void;
  chatHistory: ChatMessage[];
  addChatMessage: (msg: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  clearChatHistory: () => void;
  settings: UserSettings;
  updateSettings: (newSettings: Partial<UserSettings>) => void;
  scores: MentalHealthScores;
  recommendations: AIRecommendation[];
  resetAllData: () => void;
  exportDataJSON: () => string;
  importDataJSON: (jsonStr: string) => boolean;
  isLoaded: boolean;
  userId: string;
}

const BrainOSContext = createContext<BrainOSContextType | undefined>(undefined);

export function BrainOSProvider({ children }: { children: ReactNode }) {
  const [activeView, setActiveView] = useState<ViewType>('landing');
  const [checkIns, setCheckIns] = useState<DailyCheckIn[]>(() => loadCheckIns());
  const [journals, setJournals] = useState<JournalEntry[]>(() => loadJournals());
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>(() => loadChatHistory());
  const [settings, setSettings] = useState<UserSettings>(() => loadSettings());
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  // Compute scores and recommendations live whenever checkIns change
  const scores = useMemo(() => {
    return calculateScoresFromCheckIns(checkIns);
  }, [checkIns]);

  const recommendations = useMemo(() => {
    return generateRecommendations(scores, checkIns);
  }, [scores, checkIns]);

  const { data: session, status } = useSession();
  const userId = useMemo(() => {
    return session?.user?.email || 'guest';
  }, [session]);

  // Sync real data from MongoDB when session status is loaded — replaces cached localStorage data with DB truth
  useEffect(() => {
    if (status === 'loading') return;

    async function syncFromMongoDB() {
      try {
        const [checkInRes, journalRes] = await Promise.all([
          fetch(`/api/checkin?userId=${encodeURIComponent(userId)}`),
          fetch(`/api/journal?userId=${encodeURIComponent(userId)}`),
        ]);

        if (checkInRes.ok) {
          const data = await checkInRes.json();
          if (data.checkIns && data.checkIns.length > 0) {
            // Map ALL fields from the enriched MongoDB schema
            const mapped: DailyCheckIn[] = data.checkIns.map((c: any) => ({
              id: c._id || `checkin-${Date.now()}-${Math.random()}`,
              timestamp: new Date(c.createdAt || c.date).getTime(),
              date: c.date,
              mood: c.mood ?? 5,
              moodLabel: c.moodLabel || '',
              energy: c.energy ?? 5,
              stress: c.stress ?? 5,
              sleepHours: c.sleepHours ?? 7,
              sleepQuality: c.sleepQuality ?? 5,
              waterIntakeLiters: c.waterIntakeLiters ?? 0,
              exerciseMinutes: c.exerciseMinutes ?? 0,
              workHours: c.workHours ?? 0,
              studyHours: c.studyHours ?? 0,
              screenTimeHours: c.screenTimeHours ?? 0,
              socialMinutes: c.socialMinutes ?? 0,
              meditationMinutes: c.meditationMinutes ?? 0,
              productivity: c.productivity ?? 5,
              tags: c.tags || [],
              customNotes: c.customNotes || c.notes || '',
            }));
            setCheckIns(mapped);
            saveCheckIns(mapped);
          } else {
            // DB returned no check-ins — clear any stale localStorage
            setCheckIns([]);
            saveCheckIns([]);
          }
        }

        if (journalRes.ok) {
          const data = await journalRes.json();
          if (data.journals && data.journals.length > 0) {
            const mapped: JournalEntry[] = data.journals.map((j: any) => ({
              id: j._id || `journal-${Date.now()}-${Math.random()}`,
              timestamp: new Date(j.createdAt || j.date).getTime(),
              date: j.date,
              title: j.title,
              content: j.content,
              tags: j.tags || [],
              mood: j.mood || 'neutral',
              aiAnalysis: j.aiAnalysis,
            }));
            setJournals(mapped);
            saveJournals(mapped);
          } else {
            setJournals([]);
            saveJournals([]);
          }
        }
      } catch (e) {
        console.warn('MongoDB sync warning (using local fallback):', e);
      } finally {
        setIsLoaded(true);
      }
    }

    syncFromMongoDB();
  }, [status, userId]);

  // Actions
  const handleAddCheckIn = async (newCheckIn: Omit<DailyCheckIn, 'id' | 'timestamp'>) => {
    const fullCheckIn: DailyCheckIn = {
      ...newCheckIn,
      id: `checkin-${Date.now()}`,
      timestamp: Date.now(),
    };
    const updated = [fullCheckIn, ...checkIns];
    setCheckIns(updated);
    saveCheckIns(updated);

    // Sync to MongoDB — pass ALL fields
    try {
      await fetch(`/api/checkin?userId=${encodeURIComponent(userId)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: newCheckIn.date,
          mood: newCheckIn.mood,
          moodLabel: newCheckIn.moodLabel,
          energy: newCheckIn.energy,
          stress: newCheckIn.stress,
          sleepHours: newCheckIn.sleepHours,
          sleepQuality: newCheckIn.sleepQuality,
          waterIntakeLiters: newCheckIn.waterIntakeLiters,
          exerciseMinutes: newCheckIn.exerciseMinutes,
          workHours: newCheckIn.workHours,
          studyHours: newCheckIn.studyHours,
          screenTimeHours: newCheckIn.screenTimeHours,
          socialMinutes: newCheckIn.socialMinutes,
          meditationMinutes: newCheckIn.meditationMinutes,
          productivity: newCheckIn.productivity,
          tags: newCheckIn.tags,
          customNotes: newCheckIn.customNotes,
          groqApiKey: settings.groqApiKey,
          preferredModel: settings.preferredModel,
        }),
      });
    } catch (e) {
      console.warn('Failed to sync check-in to MongoDB:', e);
    }
  };

  const handleAddJournal = (entry: Omit<JournalEntry, 'id' | 'timestamp'>): JournalEntry => {
    const fullEntry: JournalEntry = {
      ...entry,
      id: `journal-${Date.now()}`,
      timestamp: Date.now(),
    };
    const updated = [fullEntry, ...journals];
    setJournals(updated);
    saveJournals(updated);

    // Sync to MongoDB in background
    fetch(`/api/journal?userId=${encodeURIComponent(userId)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...entry,
        groqApiKey: settings.groqApiKey,
        preferredModel: settings.preferredModel,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.journal && data.journal.aiAnalysis) {
          const analyzedEntry = { ...fullEntry, aiAnalysis: data.journal.aiAnalysis };
          setJournals((prev) => prev.map((j) => (j.id === fullEntry.id ? analyzedEntry : j)));
        }
      })
      .catch((e) => console.warn('Failed to sync journal to MongoDB:', e));

    return fullEntry;
  };

  const handleUpdateJournal = (updatedEntry: JournalEntry) => {
    const updated = journals.map(j => (j.id === updatedEntry.id ? updatedEntry : j));
    setJournals(updated);
    saveJournals(updated);
  };

  const handleDeleteJournal = (id: string) => {
    const updated = journals.filter(j => j.id !== id);
    setJournals(updated);
    saveJournals(updated);

    // Sync to MongoDB in background
    fetch(`/api/journal?id=${id}&userId=${encodeURIComponent(userId)}`, {
      method: 'DELETE',
    }).catch((e) => console.warn('Failed to delete journal from MongoDB:', e));
  };

  const handleAddChatMessage = (msg: Omit<ChatMessage, 'id' | 'timestamp'>) => {
    const fullMsg: ChatMessage = {
      ...msg,
      id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: Date.now(),
    };
    const updated = [...chatHistory, fullMsg];
    setChatHistory(updated);
    saveChatHistory(updated);
  };

  const handleClearChatHistory = () => {
    setChatHistory([]);
    saveChatHistory([]);
  };

  const handleUpdateSettings = (partial: Partial<UserSettings>) => {
    const updated = { ...settings, ...partial };
    setSettings(updated);
    saveSettings(updated);
  };

  const handleResetAllData = () => {
    setSettings(DEFAULT_SETTINGS);
    setCheckIns(DEFAULT_CHECKINS);
    setJournals(DEFAULT_JOURNALS);
    setChatHistory(DEFAULT_CHAT_HISTORY);

    saveSettings(DEFAULT_SETTINGS);
    saveCheckIns(DEFAULT_CHECKINS);
    saveJournals(DEFAULT_JOURNALS);
    saveChatHistory(DEFAULT_CHAT_HISTORY);
  };

  const handleExportDataJSON = () => {
    const payload = {
      settings,
      checkIns,
      journals,
      chatHistory,
      exportedAt: new Date().toISOString(),
      version: '2.0',
    };
    return JSON.stringify(payload, null, 2);
  };

  const handleImportDataJSON = (jsonStr: string): boolean => {
    try {
      const data = JSON.parse(jsonStr);
      if (data.checkIns) {
        setCheckIns(data.checkIns);
        saveCheckIns(data.checkIns);
      }
      if (data.journals) {
        setJournals(data.journals);
        saveJournals(data.journals);
      }
      if (data.settings) {
        setSettings(data.settings);
        saveSettings(data.settings);
      }
      if (data.chatHistory) {
        setChatHistory(data.chatHistory);
        saveChatHistory(data.chatHistory);
      }
      return true;
    } catch (e) {
      console.error('Import failed', e);
      return false;
    }
  };

  return (
    <BrainOSContext.Provider
      value={{
        activeView,
        setActiveView,
        checkIns,
        addCheckIn: handleAddCheckIn,
        journals,
        addJournal: handleAddJournal,
        updateJournal: handleUpdateJournal,
        deleteJournal: handleDeleteJournal,
        chatHistory,
        addChatMessage: handleAddChatMessage,
        clearChatHistory: handleClearChatHistory,
        settings,
        updateSettings: handleUpdateSettings,
        scores,
        recommendations,
        resetAllData: handleResetAllData,
        exportDataJSON: handleExportDataJSON,
        importDataJSON: handleImportDataJSON,
        isLoaded,
        userId,
      }}
    >
      {children}
    </BrainOSContext.Provider>
  );
}

export function useBrainOS() {
  const context = useContext(BrainOSContext);
  if (!context) {
    throw new Error('useBrainOS must be used within a BrainOSProvider');
  }
  return context;
}
