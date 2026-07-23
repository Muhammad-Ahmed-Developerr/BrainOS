import mongoose, { Schema, model, models, Model } from 'mongoose';

export interface IBurnoutMetric {
  _id?: string;
  userId: string;
  date: string;
  exhaustion: number; // 1-10
  cynicism: number; // 1-10
  inefficacy: number; // 1-10
  overtimeHours: number;
  calculatedRisk: number;
  groqRecommendation?: string;
  createdAt?: Date;
}

const BurnoutMetricSchema = new Schema<IBurnoutMetric>(
  {
    userId: { type: String, required: true, index: true },
    date: { type: String, required: true },
    exhaustion: { type: Number, required: true },
    cynicism: { type: Number, required: true },
    inefficacy: { type: Number, required: true },
    overtimeHours: { type: Number, required: true },
    calculatedRisk: { type: Number, required: true },
    groqRecommendation: { type: String },
  },
  { timestamps: true }
);

export const BurnoutMetric = (models.BurnoutMetric || model<IBurnoutMetric>('BurnoutMetric', BurnoutMetricSchema)) as Model<IBurnoutMetric>;
