import { StressReading } from "../../types/stress.types";

export const StressPredictionService = {
  predictNextDayStress(readings: StressReading[], sleepHours: number): { predictedStress: number; advice: string } {
    if (readings.length === 0) {
      return { predictedStress: 40, advice: "Ensure you have logged your subjective stress today to initialize prediction." };
    }

    const avgStress = readings.reduce((acc, curr) => acc + curr.stressScore, 0) / readings.length;
    let predictedStress = avgStress;

    // Sleep impact
    if (sleepHours < 6) {
      predictedStress += 15;
    } else if (sleepHours < 7) {
      predictedStress += 5;
    } else if (sleepHours > 8) {
      predictedStress -= 8;
    }

    predictedStress = Math.max(5, Math.min(98, Math.round(predictedStress)));

    let advice = "Your stress levels are predicted to remain stable. Keep up your focus habits.";
    if (predictedStress > 65) {
      advice = "Warning: Elevated stress predicted for tomorrow. We recommend limiting caffeine after 12 PM and scheduling a breathing session.";
    } else if (predictedStress > 50) {
      advice = "Moderate stress predicted. Take regular breaks and keep your meetings concise.";
    }

    return { predictedStress, advice };
  }
};
