import { MoodLog } from "../types/mood.types";

export const MOCK_MOOD_LOGS: MoodLog[] = [
  { id: "mood-1", timestamp: "2026-06-09T09:00:00Z", mood: "great", score: 90, notes: "Felt very refreshed after a full night's sleep.", tags: ["Sleep", "Relaxed"] },
  { id: "mood-2", timestamp: "2026-06-08T14:30:00Z", mood: "neutral", score: 50, notes: "A bit overwhelmed by work meetings, but managed okay.", tags: ["Work", "Meetings"] },
  { id: "mood-3", timestamp: "2026-06-07T18:00:00Z", mood: "good", score: 75, notes: "Great workout session in the evening.", tags: ["Fitness", "Energetic"] },
  { id: "mood-4", timestamp: "2026-06-06T10:00:00Z", mood: "bad", score: 30, notes: "High anxiety levels due to project deadlines.", tags: ["Work", "Anxious"] },
  { id: "mood-5", timestamp: "2026-06-05T22:00:00Z", mood: "great", score: 85, notes: "Friday night relaxation with friends.", tags: ["Social", "Peaceful"] }
];
