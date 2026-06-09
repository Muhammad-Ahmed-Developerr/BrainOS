import { useBrainStore } from "../store/useBrainStore";
import { StressReading, GuidedMeditation } from "../types/stress.types";
import { MOCK_MEDITATIONS } from "../data/mock-stress";

export const StressService = {
  async getReadings(): Promise<StressReading[]> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return useBrainStore.getState().stressReadings;
  },

  async logStress(score: number, hrv?: number, hr?: number): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 400));
    useBrainStore.getState().addStressReading(score, hrv, hr);
  },

  async getMeditations(): Promise<GuidedMeditation[]> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return MOCK_MEDITATIONS;
  }
};
