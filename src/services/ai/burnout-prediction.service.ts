import { OvertimeStat } from "../../types/burnout.types";

export const BurnoutPredictionService = {
  calculateRisk(overtimeHours: number, sleepHours: number, meetingDensity: number): { riskScore: number; riskLevel: 'low' | 'moderate' | 'high' | 'critical' } {
    let baseRisk = 15; // standard baseline
    
    // Add weights
    if (overtimeHours > 5) baseRisk += (overtimeHours - 5) * 4;
    if (sleepHours < 7) baseRisk += (7 - sleepHours) * 12;
    if (meetingDensity > 50) baseRisk += (meetingDensity - 50) * 0.5;

    const riskScore = Math.max(0, Math.min(99, Math.round(baseRisk)));

    let riskLevel: 'low' | 'moderate' | 'high' | 'critical' = 'low';
    if (riskScore >= 75) riskLevel = 'critical';
    else if (riskScore >= 50) riskLevel = 'high';
    else if (riskScore >= 25) riskLevel = 'moderate';

    return { riskScore, riskLevel };
  },

  projectFatigueTrend(historical: OvertimeStat[]): OvertimeStat[] {
    // Project 3 future days based on historical slope
    const avgFatigue = historical.reduce((acc, curr) => acc + curr.cognitiveFatigue, 0) / historical.length;
    
    const futureDays = ["Mon (F)", "Tue (F)", "Wed (F)"];
    const projections = futureDays.map((day, idx) => ({
      day,
      workedHours: Math.round((8.0 + Math.sin(idx) * 0.5) * 10) / 10,
      meetingHours: Math.round((2.5 + Math.cos(idx) * 0.8) * 10) / 10,
      cognitiveFatigue: Math.max(10, Math.min(95, Math.round(avgFatigue + (idx + 1) * 3)))
    }));

    return [...historical, ...projections];
  }
};
