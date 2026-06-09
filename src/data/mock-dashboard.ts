import { DashboardMetrics, MetricTrend, RecentActivity } from "../types/dashboard.types";

export const INITIAL_METRICS: DashboardMetrics = {
  mentalHealthScore: 78,
  stressScore: 42,
  burnoutScore: 28,
  focusScore: 84,
  sleepScore: 75,
  happinessScore: 80
};

export const MOCK_METRIC_TRENDS: MetricTrend[] = [
  { date: "Mon", mentalHealthScore: 72, stressScore: 55, burnoutScore: 35, focusScore: 70, sleepScore: 68, happinessScore: 70 },
  { date: "Tue", mentalHealthScore: 74, stressScore: 50, burnoutScore: 32, focusScore: 75, sleepScore: 72, happinessScore: 72 },
  { date: "Wed", mentalHealthScore: 70, stressScore: 60, burnoutScore: 38, focusScore: 80, sleepScore: 65, happinessScore: 68 },
  { date: "Thu", mentalHealthScore: 77, stressScore: 45, burnoutScore: 30, focusScore: 82, sleepScore: 78, happinessScore: 76 },
  { date: "Fri", mentalHealthScore: 79, stressScore: 40, burnoutScore: 25, focusScore: 88, sleepScore: 80, happinessScore: 82 },
  { date: "Sat", mentalHealthScore: 82, stressScore: 30, burnoutScore: 20, focusScore: 60, sleepScore: 85, happinessScore: 88 },
  { date: "Sun", mentalHealthScore: 85, stressScore: 25, burnoutScore: 18, focusScore: 50, sleepScore: 88, happinessScore: 90 }
];

export const MOCK_RECENT_ACTIVITIES: RecentActivity[] = [
  { id: "act-1", type: "mood", title: "Logged Mood: Great", timestamp: "10 mins ago", value: "Great" },
  { id: "act-2", type: "focus", title: "Deep Work Session Completed", timestamp: "2 hours ago", value: "45 mins" },
  { id: "act-3", type: "checkin", title: "Completed Daily Check-In", timestamp: "4 hours ago", value: 78 },
  { id: "act-4", type: "journal", title: "AI Thoughts Analyzed", timestamp: "5 hours ago", value: "Calm" },
  { id: "act-5", type: "habit", title: "Completed: 10m Meditation", timestamp: "9 hours ago" }
];
