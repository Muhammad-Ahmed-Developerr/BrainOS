export interface StressReading {
  id: string;
  timestamp: string;
  stressScore: number; // 0 to 100
  hrv?: number; // Heart Rate Variability (ms)
  heartRate?: number; // Beats per minute
  source: 'manual' | 'smartwatch';
}

export interface GuidedMeditation {
  id: string;
  title: string;
  duration: number; // in minutes
  category: 'focus' | 'calm' | 'anxiety' | 'sleep';
  audioUrl?: string;
}
