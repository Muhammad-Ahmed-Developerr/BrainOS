import mongoose, { Schema, Document, models, model } from "mongoose";

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  email: string;
  passwordHash?: string;          // undefined for OAuth-only users
  fullName: string;
  avatarUrl: string;
  goals: string[];
  sleepTarget: number;
  workHours: number;
  stressBaseline: number;
  emailVerified: boolean;
  provider: "email" | "google" | "github";
  googleId?: string;
  githubId?: string;
  preferences: {
    theme: string;
    smartwatchConnected: boolean;
    smartwatchBrand: string;
    notificationsEnabled: boolean;
    dailyReminderTime: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String },
    fullName: { type: String, required: true, trim: true },
    avatarUrl: { type: String, default: "" },
    goals: { type: [String], default: [] },
    sleepTarget: { type: Number, default: 8 },
    workHours: { type: Number, default: 8 },
    stressBaseline: { type: Number, default: 5 },
    emailVerified: { type: Boolean, default: false },
    provider: { type: String, enum: ["email", "google", "github"], default: "email" },
    googleId: { type: String },
    githubId: { type: String },
    preferences: {
      theme: { type: String, default: "dark" },
      smartwatchConnected: { type: Boolean, default: false },
      smartwatchBrand: { type: String, default: "none" },
      notificationsEnabled: { type: Boolean, default: true },
      dailyReminderTime: { type: String, default: "08:00" },
    },
  },
  { timestamps: true }
);

// Avoid model recompilation during hot-reloads
export const User = (models.User as mongoose.Model<IUser>) || model<IUser>("User", UserSchema);
