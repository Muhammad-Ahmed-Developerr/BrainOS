import { useBrainStore } from "../store/useBrainStore";
import { DashboardMetrics, MetricTrend, FocusStats, RecentActivity } from "../types/dashboard.types";

export const DashboardService = {
  async getMetrics(): Promise<DashboardMetrics> {
    await new Promise((resolve) => setTimeout(resolve, 400));
    return useBrainStore.getState().metrics;
  },

  async getTrends(): Promise<MetricTrend[]> {
    await new Promise((resolve) => setTimeout(resolve, 400));
    return useBrainStore.getState().metricTrends;
  },

  async getFocusStats(): Promise<FocusStats> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return useBrainStore.getState().focusStats;
  },

  async getRecentActivities(): Promise<RecentActivity[]> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return useBrainStore.getState().recentActivities;
  }
};
