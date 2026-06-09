import { SentimentAnalysisResult } from "../../types/journal.types";

export const SentimentAnalysisService = {
  analyzeText(text: string): SentimentAnalysisResult {
    const textLower = text.toLowerCase();
    
    // Heuristic sentiment scoring
    let score = 60; // neutral default
    let sentiment: 'positive' | 'neutral' | 'negative' | 'mixed' = 'neutral';
    
    const positiveWords = ["happy", "good", "great", "excellent", "clarity", "calm", "relax", "productive", "peace", "joy", "excited"];
    const negativeWords = ["sad", "bad", "stress", "anxious", "worry", "panic", "tired", "burnout", "exhausted", "failed", "fear", "hate"];

    let posCount = 0;
    let negCount = 0;

    positiveWords.forEach(w => {
      if (textLower.includes(w)) posCount++;
    });
    negativeWords.forEach(w => {
      if (textLower.includes(w)) negCount++;
    });

    if (posCount > negCount) {
      sentiment = 'positive';
      score = Math.min(95, 60 + (posCount - negCount) * 10);
    } else if (negCount > posCount) {
      sentiment = 'negative';
      score = Math.max(10, 60 - (negCount - posCount) * 10);
    } else if (posCount > 0 && negCount > 0) {
      sentiment = 'mixed';
      score = 50;
    }

    // Extract emotions
    const calm = sentiment === 'positive' ? 70 : 30;
    const anxious = textLower.includes("worry") || textLower.includes("stress") || textLower.includes("anxious") ? 80 : 20;
    const sad = textLower.includes("sad") || textLower.includes("down") || textLower.includes("lonely") ? 60 : 15;
    const joy = sentiment === 'positive' ? 80 : 25;
    const anger = textLower.includes("angry") || textLower.includes("hate") || textLower.includes("mad") ? 70 : 10;

    // Collect keywords
    const keywords: string[] = [];
    const tokens = textLower.split(/\W+/);
    const stopWords = ["the", "a", "an", "and", "or", "but", "i", "my", "of", "to", "for", "with", "at", "on", "in", "woke", "went", "feel", "feeling"];
    
    tokens.forEach(token => {
      if (token.length > 3 && !stopWords.includes(token) && !keywords.includes(token)) {
        if (keywords.length < 5) keywords.push(token);
      }
    });

    // Cognitive Distortions
    const cognitiveDistortions: string[] = [];
    if (textLower.includes("never") || textLower.includes("always") || textLower.includes("every time")) {
      cognitiveDistortions.push("Overgeneralization");
    }
    if (textLower.includes("perfect") || textLower.includes("fail") || textLower.includes("ruined")) {
      cognitiveDistortions.push("All-or-nothing thinking");
    }
    if (textLower.includes("worst") || textLower.includes("disaster") || textLower.includes("unbearable")) {
      cognitiveDistortions.push("Catastrophizing");
    }

    return {
      sentiment,
      score,
      emotions: { calm, anxious, sad, joy, anger },
      keywords,
      cognitiveDistortions
    };
  }
};
