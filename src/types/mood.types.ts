export type MoodType = 'great' | 'good' | 'neutral' | 'bad' | 'terrible';

export interface MoodLog {
  id: string;
  timestamp: string;
  mood: MoodType;
  score: number; // 0 to 100 for graph plotting
  notes?: string;
  tags: string[]; // e.g. "Work", "Family", "Health", "Sleep"
}

export interface MoodTrendPoint {
  date: string;
  averageScore: number;
}
