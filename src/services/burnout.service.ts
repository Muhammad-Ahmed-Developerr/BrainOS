import { useBrainStore } from "../store/useBrainStore";
import { BurnoutMetrics } from "../types/burnout.types";

export const BurnoutService = {
  async getMetrics(): Promise<BurnoutMetrics> {
    await new Promise((resolve) => setTimeout(resolve, 400));
    return useBrainStore.getState().burnoutMetrics;
  }
};
