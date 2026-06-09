export interface DashboardMetrics {
  mentalHealthScore: number;
  stressScore: number;
  burnoutScore: number;
  focusScore: number;
  sleepScore: number;
  happinessScore: number;
}

export interface MetricTrend {
  date: string;
  mentalHealthScore: number;
  stressScore: number;
  burnoutScore: number;
  focusScore: number;
  sleepScore: number;
  happinessScore: number;
}

export interface FocusStats {
  completedSessions: number;
  totalFocusTime: number; // in minutes
  dailyGoal: number; // in minutes
  streakDays: number;
}

export interface RecentActivity {
  id: string;
  type: 'checkin' | 'mood' | 'journal' | 'focus' | 'habit';
  title: string;
  timestamp: string;
  value?: string | number;
}
