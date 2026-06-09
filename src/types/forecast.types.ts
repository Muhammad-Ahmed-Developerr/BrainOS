export interface MentalHealthForecast {
  date: string; // YYYY-MM-DD
  predictedMentalScore: number;
  predictedStressScore: number;
  predictedBurnoutScore: number;
}

export interface WellnessForecast {
  burnoutWarningZone: boolean;
  upcomingStressPeakDate?: string;
  recommendedRecoveryAction: string;
  projectedTrend: 'improving' | 'stable' | 'declining';
  weeklyForecast: MentalHealthForecast[];
  triggerFactors: {
    factor: string;
    impact: 'high' | 'medium' | 'low';
  }[];
}
