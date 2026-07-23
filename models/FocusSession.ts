import mongoose, { Schema, model, models, Model } from 'mongoose';

export interface IFocusSession {
  _id?: string;
  userId: string;
  date: string;
  taskTitle: string;
  durationMinutes: number;
  distractions: number;
  flowStateRating: number; // 1-10
  groqFocusTip?: string;
  createdAt?: Date;
}

const FocusSessionSchema = new Schema<IFocusSession>(
  {
    userId: { type: String, required: true, index: true },
    date: { type: String, required: true },
    taskTitle: { type: String, required: true },
    durationMinutes: { type: Number, required: true },
    distractions: { type: Number, required: true },
    flowStateRating: { type: Number, required: true },
    groqFocusTip: { type: String },
  },
  { timestamps: true }
);

export const FocusSession = (models.FocusSession || model<IFocusSession>('FocusSession', FocusSessionSchema)) as Model<IFocusSession>;
