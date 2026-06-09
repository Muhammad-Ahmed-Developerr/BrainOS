import { UserProfile } from "./user.types";

export interface LoginCredentials {
  email: string;
  password?: string;
}

export interface SignupOnboarding {
  email: string;
  password?: string;
  fullName: string;
  goals: string[];
  sleepTarget: number;
  workHours: number;
  stressBaseline: number;
}

export interface AuthSession {
  token: string;
  user: UserProfile;
}
