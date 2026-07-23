import mongoose, { Schema, model, models, Model } from 'mongoose';

export interface ISleepLog {
  _id?: string;
  userId: string;
  date: string;
  sleepHours: number;
  qualityRating: number; // 1-10
  deepSleepMinutes: number;
  remSleepMinutes: number;
  disruptions: number;
  caffeineCutoffHour?: string;
  groqSleepAdvice?: string;
  createdAt?: Date;
}

const SleepLogSchema = new Schema<ISleepLog>(
  {
    userId: { type: String, required: true, index: true },
    date: { type: String, required: true },
    sleepHours: { type: Number, required: true },
    qualityRating: { type: Number, required: true },
    deepSleepMinutes: { type: Number, required: true },
    remSleepMinutes: { type: Number, required: true },
    disruptions: { type: Number, required: true },
    caffeineCutoffHour: { type: String },
    groqSleepAdvice: { type: String },
  },
  { timestamps: true }
);

export const SleepLog = (models.SleepLog || model<ISleepLog>('SleepLog', SleepLogSchema)) as Model<ISleepLog>;
