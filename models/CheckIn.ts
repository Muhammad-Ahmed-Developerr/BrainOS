import mongoose, { Schema, model, models, Model } from 'mongoose';

export interface ICheckIn {
  _id?: string;
  userId: string;
  date: string;
  // Core emotional metrics
  mood: number;
  moodLabel?: string;
  energy: number;
  stress: number;
  productivity: number;
  // Sleep
  sleepHours: number;
  sleepQuality: number;
  // Physical habits
  waterIntakeLiters: number;
  exerciseMinutes: number;
  // Work/study
  workHours: number;
  studyHours: number;
  screenTimeHours: number;
  socialMinutes: number;
  meditationMinutes: number;
  // Tags & notes
  tags: string[];
  customNotes?: string;
  // Computed scores saved alongside the entry
  scores: {
    overallScore: number;
    stressScore: number;
    burnoutRisk: number;
    focusScore: number;
    sleepScore: number;
  };
  aiAnalysis?: string;
  createdAt?: Date;
}

const CheckInSchema = new Schema<ICheckIn>(
  {
    userId: { type: String, required: true, index: true },
    date: { type: String, required: true },
    mood: { type: Number, required: true },
    moodLabel: { type: String },
    energy: { type: Number, required: true },
    stress: { type: Number, required: true },
    productivity: { type: Number, required: true },
    sleepHours: { type: Number, required: true },
    sleepQuality: { type: Number, required: true },
    waterIntakeLiters: { type: Number, default: 0 },
    exerciseMinutes: { type: Number, default: 0 },
    workHours: { type: Number, default: 0 },
    studyHours: { type: Number, default: 0 },
    screenTimeHours: { type: Number, default: 0 },
    socialMinutes: { type: Number, default: 0 },
    meditationMinutes: { type: Number, default: 0 },
    tags: { type: [String], default: [] },
    customNotes: { type: String },
    scores: {
      overallScore: { type: Number, required: true },
      stressScore: { type: Number, required: true },
      burnoutRisk: { type: Number, required: true },
      focusScore: { type: Number, required: true },
      sleepScore: { type: Number, required: true },
    },
    aiAnalysis: { type: String },
  },
  { timestamps: true }
);

export const CheckIn = (models.CheckIn || model<ICheckIn>('CheckIn', CheckInSchema)) as Model<ICheckIn>;
