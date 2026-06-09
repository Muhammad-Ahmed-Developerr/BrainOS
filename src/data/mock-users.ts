import { UserProfile } from "../types/user.types";

export const MOCK_USER: UserProfile = {
  id: "user-brainos-01",
  email: "alex.wellness@brainos.ai",
  fullName: "Alex Rivera",
  avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&h=256&q=80",
  createdAt: "2026-01-15T08:00:00Z",
  goals: [
    "Reduce cognitive burnout",
    "Track and improve stress levels",
    "Improve daily focus blocks",
    "Develop consistent sleep routines"
  ],
  preferences: {
    theme: "dark",
    smartwatchConnected: true,
    smartwatchBrand: "apple",
    notificationsEnabled: true,
    dailyReminderTime: "21:30"
  }
};
