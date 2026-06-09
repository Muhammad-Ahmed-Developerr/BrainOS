export type HabitCategory = 'mind' | 'body' | 'sleep' | 'focus';

export interface Habit {
  id: string;
  name: string;
  category: HabitCategory;
  streak: number;
  completedDays: string[]; // ISO Strings of dates: "YYYY-MM-DD"
  active: boolean;
  frequency: 'daily' | 'weekly';
}

export interface HabitCompletionToggle {
  habitId: string;
  date: string; // "YYYY-MM-DD"
  completed: boolean;
}
