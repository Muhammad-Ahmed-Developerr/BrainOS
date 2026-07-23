import { DailyCheckIn, JournalEntry, UserSettings, ChatMessage } from '@/types/brainos';

const STORAGE_KEYS = {
  CHECKINS: 'brainos_checkins_v1',
  JOURNALS: 'brainos_journals_v1',
  SETTINGS: 'brainos_settings_v1',
  CHAT_HISTORY: 'brainos_chat_history_v1',
};

const DEFAULT_GROQ_KEY = process.env.NEXT_PUBLIC_GROQ_API_KEY || '';

export const DEFAULT_SETTINGS: UserSettings = {
  groqApiKey: DEFAULT_GROQ_KEY,
  preferredModel: 'llama-3.3-70b-versatile',
  accentColor: 'cyan',
  enableAnimations: true,
  soundEffects: false,
  dailyReminderTime: '21:00',
  userName: 'User',
  targetSleepHours: 8,
  targetWaterLiters: 2.5,
  targetExerciseMinutes: 30,
  targetDeepWorkHours: 5,
};

// No seed/dummy data — everything comes from real user input saved to MongoDB
export const DEFAULT_CHECKINS: DailyCheckIn[] = [];
export const DEFAULT_JOURNALS: JournalEntry[] = [];

export const DEFAULT_CHAT_HISTORY: ChatMessage[] = [
  {
    id: 'welcome-msg-1',
    sender: 'assistant',
    text: "Welcome to BrainOS Neural Coach! I am your personal mental health and cognitive optimization partner. Start by completing your first Daily Check-In so I can analyze your real data and provide personalized AI insights. How can I help you today?",
    timestamp: Date.now() - 3600000,
    modelUsed: 'BrainOS Neural Core',
  },
];

/* Helper functions */

export function loadSettings(): UserSettings {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw);
    if (!parsed.groqApiKey || parsed.groqApiKey.trim() === '') {
      parsed.groqApiKey = DEFAULT_GROQ_KEY;
    }
    return { ...DEFAULT_SETTINGS, ...parsed };
  } catch (e) {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: UserSettings): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save settings to localStorage', e);
  }
}

export function loadCheckIns(): DailyCheckIn[] {
  if (typeof window === 'undefined') return DEFAULT_CHECKINS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CHECKINS);
    return raw ? JSON.parse(raw) : DEFAULT_CHECKINS;
  } catch (e) {
    return DEFAULT_CHECKINS;
  }
}

export function saveCheckIns(checkIns: DailyCheckIn[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.CHECKINS, JSON.stringify(checkIns));
  } catch (e) {
    console.error('Failed to save checkins to localStorage', e);
  }
}

export function loadJournals(): JournalEntry[] {
  if (typeof window === 'undefined') return DEFAULT_JOURNALS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.JOURNALS);
    return raw ? JSON.parse(raw) : DEFAULT_JOURNALS;
  } catch (e) {
    return DEFAULT_JOURNALS;
  }
}

export function saveJournals(journals: JournalEntry[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.JOURNALS, JSON.stringify(journals));
  } catch (e) {
    console.error('Failed to save journals to localStorage', e);
  }
}

export function loadChatHistory(): ChatMessage[] {
  if (typeof window === 'undefined') return DEFAULT_CHAT_HISTORY;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CHAT_HISTORY);
    return raw ? JSON.parse(raw) : DEFAULT_CHAT_HISTORY;
  } catch (e) {
    return DEFAULT_CHAT_HISTORY;
  }
}

export function saveChatHistory(history: ChatMessage[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.CHAT_HISTORY, JSON.stringify(history));
  } catch (e) {
    console.error('Failed to save chat history to localStorage', e);
  }
}
