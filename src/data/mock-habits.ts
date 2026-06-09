import { Habit } from "../types/habit.types";

export const MOCK_HABITS: Habit[] = [
  {
    id: "habit-1",
    name: "10m Mindfulness Meditation",
    category: "mind",
    streak: 5,
    completedDays: ["2026-06-09", "2026-06-08", "2026-06-07", "2026-06-06", "2026-06-05"],
    active: true,
    frequency: "daily"
  },
  {
    id: "habit-2",
    name: "Screen-Free Hour before Sleep",
    category: "sleep",
    streak: 3,
    completedDays: ["2026-06-09", "2026-06-08", "2026-06-07"],
    active: true,
    frequency: "daily"
  },
  {
    id: "habit-3",
    name: "45-Minute Deep Focus Block",
    category: "focus",
    streak: 1,
    completedDays: ["2026-06-09"],
    active: true,
    frequency: "daily"
  },
  {
    id: "habit-4",
    name: "Physical Stretch / Cardio",
    category: "body",
    streak: 0,
    completedDays: ["2026-06-08"],
    active: true,
    frequency: "daily"
  }
];
