export interface OvertimeStat {
  day: string; // e.g. "Mon"
  workedHours: number;
  meetingHours: number;
  cognitiveFatigue: number; // 0 to 100
}

export interface BurnoutMetrics {
  burnoutRisk: number; // 0 to 100
  cognitiveLoad: number; // 0 to 100
  overtimeHoursThisWeek: number;
  meetingDensityScore: number; // 0 to 100
  insomniaIndex: number; // 0 to 100
  historicalData: OvertimeStat[];
}
