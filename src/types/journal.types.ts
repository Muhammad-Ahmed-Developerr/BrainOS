export interface SentimentAnalysisResult {
  sentiment: 'positive' | 'neutral' | 'negative' | 'mixed';
  score: number; // 0 to 100 representing positive energy
  emotions: {
    calm: number;
    anxious: number;
    sad: number;
    joy: number;
    anger: number;
  };
  keywords: string[];
  cognitiveDistortions: string[]; // e.g. "Catastrophizing", "All-or-nothing thinking"
}

export interface JournalEntry {
  id: string;
  timestamp: string;
  title: string;
  content: string;
  analysis?: SentimentAnalysisResult;
}
