export type ViewType = 
  | 'landing'
  | 'dashboard'
  | 'checkin'
  | 'mood'
  | 'stress'
  | 'burnout'
  | 'focus'
  | 'sleep'
  | 'journal'
  | 'coach'
  | 'architecture'
  | 'reports'
  | 'research'
  | 'settings'
  | 'about'
  | '404';

export interface DailyCheckIn {
  id: string;
  date: string; // YYYY-MM-DD
  timestamp: number;
  mood: number; // 1 to 10
  moodLabel?: string;
  energy: number; // 1 to 10
  stress: number; // 1 to 10
  sleepHours: number; // e.g. 7.5
  sleepQuality: number; // 1 to 10
  waterIntakeLiters: number; // e.g. 2.5
  exerciseMinutes: number; // e.g. 45
  workHours: number; // e.g. 8
  studyHours: number; // e.g. 2
  screenTimeHours: number; // e.g. 6.5
  socialMinutes: number; // e.g. 60
  meditationMinutes: number; // e.g. 15
  productivity: number; // 1 to 10
  tags: string[];
  customNotes: string;
}

export interface JournalEntry {
  id: string;
  date: string;
  timestamp: number;
  title: string;
  content: string;
  category: 'Reflection' | 'Gratitude' | 'Stress Release' | 'Goal Setting' | 'Idea' | 'General';
  moodRating: number;
  aiAnalysis?: {
    primaryEmotion: string;
    sentimentScore: number; // -1.0 to 1.0
    stressLevel: 'Low' | 'Moderate' | 'High' | 'Severe';
    keywords: string[];
    summary: string;
    insights: string[];
  };
}

export interface MentalHealthScores {
  overallScore: number; // 0-100
  stressScore: number; // 0-100
  stressRiskLevel: 'Optimal' | 'Mild' | 'Moderate' | 'High' | 'Critical';
  burnoutRisk: number; // 0-100%
  burnoutStatus: 'Low Risk' | 'Moderate Caution' | 'High Warning' | 'Imminent Burnout';
  focusScore: number; // 0-100
  deepWorkHours: number;
  sleepScore: number; // 0-100
  energyScore: number; // 0-100
  moodStability: number; // 0-100
  lastUpdated: string;
}

export interface AIRecommendation {
  id: string;
  title: string;
  description: string;
  category: 'Stress' | 'Sleep' | 'Focus' | 'Burnout' | 'Mindfulness' | 'Lifestyle';
  priority: 'High' | 'Medium' | 'Low';
  estimatedTimeMinutes?: number;
  completed?: boolean;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: number;
  modelUsed?: string;
  isStreaming?: boolean;
}

export interface UserSettings {
  groqApiKey: string;
  preferredModel: string;
  accentColor: 'cyan' | 'purple' | 'emerald' | 'blue';
  enableAnimations: boolean;
  soundEffects: boolean;
  dailyReminderTime: string;
  userName: string;
  targetSleepHours: number;
  targetWaterLiters: number;
  targetExerciseMinutes: number;
  targetDeepWorkHours: number;
}

export interface HistoricalTrendPoint {
  date: string;
  displayDate: string;
  overallScore: number;
  stressScore: number;
  burnoutRisk: number;
  focusScore: number;
  sleepScore: number;
  mood: number;
  energy: number;
}
