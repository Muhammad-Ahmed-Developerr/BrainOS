import mongoose, { Schema, model, models, Model } from 'mongoose';

export interface IStressLog {
  _id?: string;
  userId: string;
  date: string;
  trigger: string;
  intensity: number; // 1-10
  symptoms: string[];
  copingStrategy?: string;
  groqAnalysis?: string;
  createdAt?: Date;
}

const StressLogSchema = new Schema<IStressLog>(
  {
    userId: { type: String, required: true, index: true },
    date: { type: String, required: true },
    trigger: { type: String, required: true },
    intensity: { type: Number, required: true },
    symptoms: [{ type: String }],
    copingStrategy: { type: String },
    groqAnalysis: { type: String },
  },
  { timestamps: true }
);

export const StressLog = (models.StressLog || model<IStressLog>('StressLog', StressLogSchema)) as Model<IStressLog>;
