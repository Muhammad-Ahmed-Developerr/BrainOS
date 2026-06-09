import { WellnessForecast } from "../types/forecast.types";

export const MOCK_WELLNESS_FORECAST: WellnessForecast = {
  burnoutWarningZone: true,
  upcomingStressPeakDate: "2026-06-11",
  projectedTrend: "declining",
  recommendedRecoveryAction: "Schedule a 1-hour mindfulness meditation and limit afternoon meetings to prevent burnout peak.",
  triggerFactors: [
    { factor: "High meeting density (4+ hours/day)", impact: "high" },
    { factor: "Sleep deficiency (< 6.5 hours/night)", impact: "high" },
    { factor: "Consecutive over-time hours worked", impact: "medium" }
  ],
  weeklyForecast: [
    { date: "Mon (Actual)", predictedMentalScore: 72, predictedStressScore: 55, predictedBurnoutScore: 35 },
    { date: "Tue (Actual)", predictedMentalScore: 74, predictedStressScore: 50, predictedBurnoutScore: 32 },
    { date: "Wed (Today)", predictedMentalScore: 70, predictedStressScore: 60, predictedBurnoutScore: 38 },
    { date: "Thu (Forecast)", predictedMentalScore: 65, predictedStressScore: 68, predictedBurnoutScore: 48 },
    { date: "Fri (Forecast)", predictedMentalScore: 62, predictedStressScore: 75, predictedBurnoutScore: 55 },
    { date: "Sat (Forecast)", predictedMentalScore: 75, predictedStressScore: 40, predictedBurnoutScore: 30 },
    { date: "Sun (Forecast)", predictedMentalScore: 82, predictedStressScore: 28, predictedBurnoutScore: 22 }
  ]
};
