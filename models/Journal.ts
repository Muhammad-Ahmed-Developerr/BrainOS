import mongoose, { Schema, model, models, Model } from 'mongoose';

export interface IJournal {
  _id?: string;
  userId: string;
  date: string;
  title: string;
  content: string;
  tags: string[];
  mood: string;
  aiAnalysis?: {
    sentiment: string;
    dominantEmotion: string;
    summary: string;
    actionableAdvice: string[];
  };
  createdAt?: Date;
}

const JournalSchema = new Schema<IJournal>(
  {
    userId: { type: String, required: true, index: true },
    date: { type: String, required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    tags: [{ type: String }],
    mood: { type: String, required: true },
    aiAnalysis: {
      sentiment: { type: String },
      dominantEmotion: { type: String },
      summary: { type: String },
      actionableAdvice: [{ type: String }],
    },
  },
  { timestamps: true }
);

export const Journal = (models.Journal || model<IJournal>('Journal', JournalSchema)) as Model<IJournal>;
