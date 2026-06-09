import { useBrainStore } from "../store/useBrainStore";
import { JournalEntry } from "../types/journal.types";
import { SentimentAnalysisService } from "./ai/sentiment-analysis.service";

export const JournalService = {
  async getEntries(): Promise<JournalEntry[]> {
    await new Promise((resolve) => setTimeout(resolve, 400));
    return useBrainStore.getState().journalEntries;
  },

  async createEntry(title: string, content: string): Promise<JournalEntry> {
    await new Promise((resolve) => setTimeout(resolve, 800));
    
    // Perform simulated AI sentiment analysis on entry text
    const analysis = SentimentAnalysisService.analyzeText(content);
    
    useBrainStore.getState().addJournalEntry(title, content, analysis);
    
    const entries = useBrainStore.getState().journalEntries;
    return entries[0];
  }
};
