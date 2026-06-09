export interface UserPreferences {
  theme: 'dark' | 'light' | 'system';
  smartwatchConnected: boolean;
  smartwatchBrand: 'apple' | 'garmin' | 'fitbit' | 'oura' | 'none';
  notificationsEnabled: boolean;
  dailyReminderTime: string;
}

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  avatarUrl: string;
  createdAt: string;
  goals: string[];
  preferences: UserPreferences;
}
