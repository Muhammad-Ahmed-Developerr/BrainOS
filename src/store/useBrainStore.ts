import { create } from "zustand";
import { UserProfile, UserPreferences } from "../types/user.types";
import { DashboardMetrics, MetricTrend, FocusStats, RecentActivity } from "../types/dashboard.types";
import { MoodLog, MoodType } from "../types/mood.types";
import { JournalEntry, SentimentAnalysisResult } from "../types/journal.types";
import { StressReading } from "../types/stress.types";
import { BurnoutMetrics } from "../types/burnout.types";
import { WellnessForecast } from "../types/forecast.types";
import { Habit } from "../types/habit.types";

import { MOCK_USER } from "../data/mock-users";
import { INITIAL_METRICS, MOCK_METRIC_TRENDS, MOCK_RECENT_ACTIVITIES } from "../data/mock-dashboard";
import { MOCK_MOOD_LOGS } from "../data/mock-mood";
import { MOCK_JOURNAL_ENTRIES } from "../data/mock-journal";
import { MOCK_HABITS } from "../data/mock-habits";
import { MOCK_STRESS_READINGS } from "../data/mock-stress";
import { MOCK_BURNOUT_METRICS } from "../data/mock-burnout";
import { MOCK_WELLNESS_FORECAST } from "../data/mock-forecast";

interface BrainState {
  // Data State
  user: UserProfile | null;
  metrics: DashboardMetrics;
  metricTrends: MetricTrend[];
  moodLogs: MoodLog[];
  recentActivities: RecentActivity[];
  journalEntries: JournalEntry[];
  habits: Habit[];
  stressReadings: StressReading[];
  burnoutMetrics: BurnoutMetrics;
  wellnessForecast: WellnessForecast;
  focusStats: FocusStats;
  isAuthenticated: boolean;

  // Actions
  setUser: (user: UserProfile) => void;
  clearUser: () => void;
  login: (email: string) => Promise<boolean>;
  signup: (fullName: string, email: string, goals: string[]) => Promise<boolean>;
  logout: () => void;
  addMoodLog: (mood: MoodType, notes?: string, tags?: string[]) => void;
  addJournalEntry: (title: string, content: string, analysis: SentimentAnalysisResult) => void;
  toggleHabit: (habitId: string, date: string) => void;
  addStressReading: (score: number, hrv?: number, hr?: number) => void;
  addFocusSession: (minutes: number) => void;
  addHabit: (name: string, category: Habit["category"]) => void;
  updatePreferences: (prefs: Partial<UserPreferences>) => void;
  updateProfile: (fullName: string, goals: string[]) => void;
}

export const useBrainStore = create<BrainState>((set, get) => ({
  user: null,
  metrics: INITIAL_METRICS,
  metricTrends: MOCK_METRIC_TRENDS,
  moodLogs: MOCK_MOOD_LOGS,
  recentActivities: MOCK_RECENT_ACTIVITIES,
  journalEntries: MOCK_JOURNAL_ENTRIES,
  habits: MOCK_HABITS,
  stressReadings: MOCK_STRESS_READINGS,
  burnoutMetrics: MOCK_BURNOUT_METRICS,
  wellnessForecast: MOCK_WELLNESS_FORECAST,
  focusStats: {
    completedSessions: 3,
    totalFocusTime: 115,
    dailyGoal: 120,
    streakDays: 4
  },
  isAuthenticated: false,

  // Set real user from API response
  setUser: (user: UserProfile) => {
    set({ isAuthenticated: true, user });
  },

  // Clear user on logout
  clearUser: () => {
    set({ isAuthenticated: false, user: null });
  },

  login: async (email: string) => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    set({ isAuthenticated: true, user: { ...MOCK_USER, email } });
    return true;
  },

  signup: async (fullName: string, email: string, goals: string[]) => {
    await new Promise((resolve) => setTimeout(resolve, 1200));
    set({ isAuthenticated: true, user: { ...MOCK_USER, fullName, email, goals } });
    return true;
  },

  logout: () => {
    set({ isAuthenticated: false, user: null });
  },

  addMoodLog: (mood: MoodType, notes?: string, tags: string[] = []) => {
    const scoreMap: Record<MoodType, number> = {
      great: 95,
      good: 75,
      neutral: 50,
      bad: 30,
      terrible: 10
    };

    const newLog: MoodLog = {
      id: `mood-${Date.now()}`,
      timestamp: new Date().toISOString(),
      mood,
      score: scoreMap[mood],
      notes,
      tags
    };

    const updatedMoodLogs = [newLog, ...get().moodLogs];
    
    // Recalculate average happiness and mental health index
    const happinessAvg = Math.round(
      updatedMoodLogs.slice(0, 7).reduce((acc, curr) => acc + curr.score, 0) / 
      Math.min(updatedMoodLogs.length, 7)
    );

    const currentMetrics = get().metrics;
    const newMentalHealth = Math.round((happinessAvg + (100 - currentMetrics.stressScore) + currentMetrics.focusScore + currentMetrics.sleepScore) / 4);

    const newActivity: RecentActivity = {
      id: `act-${Date.now()}`,
      type: "mood",
      title: `Logged Mood: ${mood.charAt(0).toUpperCase() + mood.slice(1)}`,
      timestamp: "Just now",
      value: mood.charAt(0).toUpperCase() + mood.slice(1)
    };

    set({
      moodLogs: updatedMoodLogs,
      metrics: {
        ...currentMetrics,
        happinessScore: happinessAvg,
        mentalHealthScore: newMentalHealth
      },
      recentActivities: [newActivity, ...get().recentActivities.slice(0, 4)]
    });
  },

  addJournalEntry: (title: string, content: string, analysis: SentimentAnalysisResult) => {
    const newEntry: JournalEntry = {
      id: `j-${Date.now()}`,
      timestamp: new Date().toISOString(),
      title,
      content,
      analysis
    };

    const currentMetrics = get().metrics;
    const stressAdjustment = Math.max(10, Math.min(95, currentMetrics.stressScore + (analysis.sentiment === 'negative' ? 5 : -10)));
    const happinessAdjustment = Math.max(10, Math.min(95, currentMetrics.happinessScore + (analysis.sentiment === 'positive' ? 10 : -5)));

    const newActivity: RecentActivity = {
      id: `act-${Date.now()}`,
      type: "journal",
      title: `Wrote Journal: ${title}`,
      timestamp: "Just now",
      value: analysis.sentiment.charAt(0).toUpperCase() + analysis.sentiment.slice(1)
    };

    set({
      journalEntries: [newEntry, ...get().journalEntries],
      metrics: {
        ...currentMetrics,
        stressScore: Math.round(stressAdjustment),
        happinessScore: Math.round(happinessAdjustment)
      },
      recentActivities: [newActivity, ...get().recentActivities.slice(0, 4)]
    });
  },

  toggleHabit: (habitId: string, date: string) => {
    const updatedHabits = get().habits.map((habit) => {
      if (habit.id === habitId) {
        const isCompleted = habit.completedDays.includes(date);
        let completedDays = [...habit.completedDays];
        let streak = habit.streak;

        if (isCompleted) {
          completedDays = completedDays.filter((d) => d !== date);
          streak = Math.max(0, streak - 1);
        } else {
          completedDays.push(date);
          streak += 1;
        }

        return {
          ...habit,
          completedDays,
          streak
        };
      }
      return habit;
    });

    const newActivity: RecentActivity = {
      id: `act-${Date.now()}`,
      type: "habit",
      title: "Updated wellness habit",
      timestamp: "Just now"
    };

    set({
      habits: updatedHabits,
      recentActivities: [newActivity, ...get().recentActivities.slice(0, 4)]
    });
  },

  addStressReading: (score: number, hrv?: number, hr?: number) => {
    const newReading: StressReading = {
      id: `str-${Date.now()}`,
      timestamp: new Date().toISOString(),
      stressScore: score,
      hrv: hrv || Math.round(75 - score * 0.4),
      heartRate: hr || Math.round(65 + score * 0.3),
      source: "manual"
    };

    const currentMetrics = get().metrics;
    
    // Calculate new burnout based on stress and sleep
    const burnoutAdjust = Math.round((score * 0.6) + (100 - currentMetrics.sleepScore) * 0.4);

    const newActivity: RecentActivity = {
      id: `act-${Date.now()}`,
      type: "checkin",
      title: `Logged Stress Score`,
      timestamp: "Just now",
      value: `${score}/100`
    };

    set({
      stressReadings: [newReading, ...get().stressReadings],
      metrics: {
        ...currentMetrics,
        stressScore: score,
        burnoutScore: burnoutAdjust
      },
      recentActivities: [newActivity, ...get().recentActivities.slice(0, 4)]
    });
  },

  addFocusSession: (minutes: number) => {
    const currentStats = get().focusStats;
    const currentMetrics = get().metrics;

    const newFocusTime = currentStats.totalFocusTime + minutes;
    const completedSessions = currentStats.completedSessions + 1;
    const dailyGoal = currentStats.dailyGoal;
    
    // Focus score scale
    const focusRatio = Math.min(100, Math.round((newFocusTime / dailyGoal) * 100));

    const newActivity: RecentActivity = {
      id: `act-${Date.now()}`,
      type: "focus",
      title: `Focused for ${minutes} mins`,
      timestamp: "Just now",
      value: `${minutes}m`
    };

    set({
      focusStats: {
        ...currentStats,
        totalFocusTime: newFocusTime,
        completedSessions
      },
      metrics: {
        ...currentMetrics,
        focusScore: focusRatio
      },
      recentActivities: [newActivity, ...get().recentActivities.slice(0, 4)]
    });
  },

  addHabit: (name: string, category: Habit["category"]) => {
    const newHabit: Habit = {
      id: `habit-${Date.now()}`,
      name,
      category,
      streak: 0,
      completedDays: [],
      active: true,
      frequency: "daily",
    };
    set({ habits: [...get().habits, newHabit] });
  },

  updatePreferences: (prefs: Partial<UserPreferences>) => {
    const currentUser = get().user;
    if (!currentUser) return;

    set({
      user: {
        ...currentUser,
        preferences: {
          ...currentUser.preferences,
          ...prefs
        }
      }
    });
  },

  updateProfile: (fullName: string, goals: string[]) => {
    const currentUser = get().user;
    if (!currentUser) return;

    set({
      user: {
        ...currentUser,
        fullName,
        goals
      }
    });
  }
}));
