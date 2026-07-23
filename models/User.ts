import mongoose, { Schema, model, models, Model } from 'mongoose';

export interface IUser {
  _id?: string;
  name?: string;
  email: string;
  password?: string;
  image?: string;
  provider?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: false },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: false },
    image: { type: String, required: false },
    provider: { type: String, default: 'credentials' },
  },
  { timestamps: true }
);

export const User = (models.User || model<IUser>('User', UserSchema)) as Model<IUser>;
