import { useBrainStore } from "../store/useBrainStore";
import { MoodLog, MoodType } from "../types/mood.types";

export const MoodService = {
  async getLogs(): Promise<MoodLog[]> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return useBrainStore.getState().moodLogs;
  },

  async logMood(mood: MoodType, notes?: string, tags: string[] = []): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    useBrainStore.getState().addMoodLog(mood, notes, tags);
  }
};
