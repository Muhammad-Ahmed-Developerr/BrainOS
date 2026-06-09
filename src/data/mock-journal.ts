import { JournalEntry } from "../types/journal.types";

export const MOCK_JOURNAL_ENTRIES: JournalEntry[] = [
  {
    id: "j-1",
    timestamp: "2026-06-09T08:30:00Z",
    title: "Morning Clarity",
    content: "Woke up feeling positive today. I had a clear set of goals and avoided checkin emails immediately. Breathing exercises helped set the mood.",
    analysis: {
      sentiment: "positive",
      score: 85,
      emotions: { calm: 80, anxious: 10, sad: 5, joy: 90, anger: 0 },
      keywords: ["morning", "clarity", "goals", "breathing"],
      cognitiveDistortions: []
    }
  },
  {
    id: "j-2",
    timestamp: "2026-06-08T17:00:00Z",
    title: "Midday Work Stress",
    content: "The presentation went fine but I spent hours worrying about it. I feel like if anything isn't absolutely perfect, it means I failed entirely. My chest feels tight.",
    analysis: {
      sentiment: "negative",
      score: 35,
      emotions: { calm: 20, anxious: 75, sad: 40, joy: 10, anger: 30 },
      keywords: ["presentation", "worrying", "failed", "tight"],
      cognitiveDistortions: ["All-or-nothing thinking", "Catastrophizing"]
    }
  }
];
