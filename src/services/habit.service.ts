import { useBrainStore } from "../store/useBrainStore";
import { Habit } from "../types/habit.types";

export const HabitService = {
  async getHabits(): Promise<Habit[]> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return useBrainStore.getState().habits;
  },

  async toggleHabit(habitId: string, date: string): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    useBrainStore.getState().toggleHabit(habitId, date);
  }
};
