import { BurnoutMetrics } from "../types/burnout.types";

export const MOCK_BURNOUT_METRICS: BurnoutMetrics = {
  burnoutRisk: 28,
  cognitiveLoad: 42,
  overtimeHoursThisWeek: 6.5,
  meetingDensityScore: 64,
  insomniaIndex: 38,
  historicalData: [
    { day: "Mon", workedHours: 8.5, meetingHours: 2.0, cognitiveFatigue: 35 },
    { day: "Tue", workedHours: 9.0, meetingHours: 3.5, cognitiveFatigue: 45 },
    { day: "Wed", workedHours: 8.0, meetingHours: 4.5, cognitiveFatigue: 58 },
    { day: "Thu", workedHours: 8.5, meetingHours: 2.0, cognitiveFatigue: 40 },
    { day: "Fri", workedHours: 7.5, meetingHours: 1.5, cognitiveFatigue: 30 },
    { day: "Sat", workedHours: 0.0, meetingHours: 0.0, cognitiveFatigue: 15 },
    { date: "Sun", workedHours: 0.0, meetingHours: 0.0, cognitiveFatigue: 10 } as any // Handle fallback compatibility
  ]
};
