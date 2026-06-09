import { StressReading, GuidedMeditation } from "../types/stress.types";

export const MOCK_STRESS_READINGS: StressReading[] = [
  { id: "str-1", timestamp: "2026-06-09T08:00:00Z", stressScore: 35, hrv: 72, heartRate: 68, source: "smartwatch" },
  { id: "str-2", timestamp: "2026-06-09T11:00:00Z", stressScore: 58, hrv: 55, heartRate: 78, source: "smartwatch" },
  { id: "str-3", timestamp: "2026-06-09T14:00:00Z", stressScore: 65, hrv: 48, heartRate: 84, source: "smartwatch" },
  { id: "str-4", timestamp: "2026-06-09T16:30:00Z", stressScore: 48, hrv: 60, heartRate: 74, source: "manual" },
  { id: "str-5", timestamp: "2026-06-09T18:00:00Z", stressScore: 40, hrv: 65, heartRate: 70, source: "smartwatch" }
];

export const MOCK_MEDITATIONS: GuidedMeditation[] = [
  { id: "med-1", title: "Reducing Meeting Fatigue", duration: 5, category: "calm" },
  { id: "med-2", title: "Cognitive Re-centering", duration: 10, category: "focus" },
  { id: "med-3", title: "Soothing Burnout Relief", duration: 15, category: "anxiety" },
  { id: "med-4", title: "Deep Sleep Induction", duration: 20, category: "sleep" }
];
