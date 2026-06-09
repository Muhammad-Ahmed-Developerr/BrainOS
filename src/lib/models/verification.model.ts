import mongoose, { Schema, Document, models, model } from "mongoose";

export interface IVerificationCode extends Document {
  email: string;
  code: string;
  type: "signup" | "forgot-password";
  expiresAt: Date;
}

const VerificationCodeSchema = new Schema<IVerificationCode>({
  email: { type: String, required: true, lowercase: true, trim: true },
  code: { type: String, required: true },
  type: { type: String, enum: ["signup", "forgot-password"], required: true },
  expiresAt: { type: Date, required: true },
});

// Auto-delete documents after they expire via MongoDB TTL index
VerificationCodeSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const VerificationCode =
  (models.VerificationCode as mongoose.Model<IVerificationCode>) ||
  model<IVerificationCode>("VerificationCode", VerificationCodeSchema);
