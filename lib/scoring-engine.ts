import { DailyCheckIn, MentalHealthScores, AIRecommendation } from '@/types/brainos';

/**
 * Calculates comprehensive mental health scores based on recent check-ins
 */
export function calculateScoresFromCheckIns(checkIns: DailyCheckIn[]): MentalHealthScores {
  if (!checkIns || checkIns.length === 0) {
    return {
      overallScore: 0,
      stressScore: 0,
      stressRiskLevel: 'Optimal',
      burnoutRisk: 0,
      burnoutStatus: 'Low Risk',
      focusScore: 0,
      deepWorkHours: 0,
      sleepScore: 0,
      energyScore: 0,
      moodStability: 0,
      lastUpdated: new Date().toLocaleDateString(),
    };
  }

  // Focus on recent 7 checkins max
  const recent = checkIns.slice(-7);
  const latest = recent[recent.length - 1];

  // Averages
  const avgMood = recent.reduce((sum, c) => sum + c.mood, 0) / recent.length;
  const avgEnergy = recent.reduce((sum, c) => sum + c.energy, 0) / recent.length;
  const avgStress = recent.reduce((sum, c) => sum + c.stress, 0) / recent.length;
  const avgSleep = recent.reduce((sum, c) => sum + c.sleepHours, 0) / recent.length;
  const avgSleepQuality = recent.reduce((sum, c) => sum + c.sleepQuality, 0) / recent.length;
  const avgWorkHours = recent.reduce((sum, c) => sum + c.workHours + c.studyHours, 0) / recent.length;
  const avgScreenTime = recent.reduce((sum, c) => sum + c.screenTimeHours, 0) / recent.length;
  const avgMeditation = recent.reduce((sum, c) => sum + c.meditationMinutes, 0) / recent.length;
  const avgExercise = recent.reduce((sum, c) => sum + c.exerciseMinutes, 0) / recent.length;
  const avgProductivity = recent.reduce((sum, c) => sum + c.productivity, 0) / recent.length;

  // 1. Stress Score (0 = no stress, 100 = extreme stress)
  // Base stress from user rating (1-10 -> 10-100)
  let stressScore = avgStress * 10;
  // Adjust for screen time (>8 hrs adds stress)
  if (avgScreenTime > 8) stressScore += (avgScreenTime - 8) * 3;
  // Adjust for lack of sleep (<7 hrs adds stress)
  if (avgSleep < 7) stressScore += (7 - avgSleep) * 5;
  // Meditation reduces stress
  if (avgMeditation >= 15) stressScore -= 8;
  // Exercise reduces stress
  if (avgExercise >= 30) stressScore -= 8;

  stressScore = Math.max(5, Math.min(98, Math.round(stressScore)));

  let stressRiskLevel: MentalHealthScores['stressRiskLevel'] = 'Optimal';
  if (stressScore > 75) stressRiskLevel = 'Critical';
  else if (stressScore > 60) stressRiskLevel = 'High';
  else if (stressScore > 40) stressRiskLevel = 'Moderate';
  else if (stressScore > 20) stressRiskLevel = 'Mild';

  // 2. Burnout Risk %
  // Factors: High work hours, high stress, low sleep, low energy, high screen time
  let burnoutIndex = 0;
  // Overwork factor
  if (avgWorkHours > 9) burnoutIndex += (avgWorkHours - 9) * 12;
  // Chronic stress factor
  if (stressScore > 50) burnoutIndex += (stressScore - 50) * 0.9;
  // Sleep deprivation factor
  if (avgSleep < 6.5) burnoutIndex += (6.5 - avgSleep) * 15;
  // Low energy factor
  if (avgEnergy < 5) burnoutIndex += (5 - avgEnergy) * 8;
  // Screen exhaustion factor
  if (avgScreenTime > 10) burnoutIndex += (avgScreenTime - 10) * 5;
  // Meditation / exercise buffer
  if (avgExercise >= 30) burnoutIndex -= 10;
  if (avgMeditation >= 10) burnoutIndex -= 8;

  const burnoutRisk = Math.max(5, Math.min(95, Math.round(burnoutIndex)));

  let burnoutStatus: MentalHealthScores['burnoutStatus'] = 'Low Risk';
  if (burnoutRisk >= 75) burnoutStatus = 'Imminent Burnout';
  else if (burnoutRisk >= 50) burnoutStatus = 'High Warning';
  else if (burnoutRisk >= 30) burnoutStatus = 'Moderate Caution';

  // 3. Sleep Score (0-100)
  // Optimal sleep duration = 7.5 to 8.5 hrs
  let sleepScore = (avgSleepQuality * 8); // Base quality (1-10 -> 8-80)
  const durationDiff = Math.abs(avgSleep - 8);
  if (durationDiff <= 0.5) sleepScore += 20;
  else if (durationDiff <= 1.5) sleepScore += 12;
  else sleepScore += Math.max(0, 10 - durationDiff * 4);

  sleepScore = Math.max(10, Math.min(100, Math.round(sleepScore)));

  // 4. Focus Score (0-100)
  // High productivity, good sleep, reasonable screen time, low stress
  let focusScore = (avgProductivity * 6) + (avgEnergy * 3);
  if (stressScore > 60) focusScore -= 15;
  if (avgSleep < 6) focusScore -= 15;
  if (avgMeditation > 10) focusScore += 10;

  focusScore = Math.max(10, Math.min(99, Math.round(focusScore)));

  const deepWorkHours = Math.round((avgWorkHours * (focusScore / 100)) * 10) / 10;

  // 5. Energy Score (0-100)
  const energyScore = Math.min(100, Math.max(10, Math.round(avgEnergy * 10)));

  // 6. Mood Stability (Variance in mood across recent days)
  const moodVariance = recent.length > 1 
    ? recent.reduce((sum, c) => sum + Math.pow(c.mood - avgMood, 2), 0) / (recent.length - 1)
    : 0;
  const moodStability = Math.round(Math.max(20, 100 - moodVariance * 12));

  // 7. Overall Mental Health Score (Composite Index)
  // Weights: Mood (25%), Stress (inverted 25%), Sleep (20%), Focus (15%), Energy (15%)
  const moodContribution = avgMood * 10 * 0.25;
  const stressContribution = (100 - stressScore) * 0.25;
  const sleepContribution = sleepScore * 0.20;
  const focusContribution = focusScore * 0.15;
  const energyContribution = energyScore * 0.15;

  const overallScore = Math.round(
    moodContribution + stressContribution + sleepContribution + focusContribution + energyContribution
  );

  return {
    overallScore: Math.max(10, Math.min(100, overallScore)),
    stressScore,
    stressRiskLevel,
    burnoutRisk,
    burnoutStatus,
    focusScore,
    deepWorkHours,
    sleepScore,
    energyScore,
    moodStability,
    lastUpdated: new Date().toLocaleDateString(),
  };
}

/**
 * Generates personalized rule-based recommendations
 */
export function generateRecommendations(
  scores: MentalHealthScores,
  checkIns: DailyCheckIn[]
): AIRecommendation[] {
  const recommendations: AIRecommendation[] = [];

  if (scores.stressScore > 50) {
    recommendations.push({
      id: 'rec-stress-1',
      title: 'Conduct a 4-7-8 Parasympathetic Reset',
      description: 'Your stress levels are currently elevated. Perform 4 cycles of diaphragmatic breathing to trigger vagal nerve relaxation.',
      category: 'Stress',
      priority: scores.stressScore > 70 ? 'High' : 'Medium',
      estimatedTimeMinutes: 5,
    });
  }

  if (scores.burnoutRisk > 40) {
    recommendations.push({
      id: 'rec-burnout-1',
      title: 'Mandatory Digital Disconnect Period',
      description: 'High workload and screen density detected. Block 45 minutes of complete screen-free downtime before 8 PM.',
      category: 'Burnout',
      priority: 'High',
      estimatedTimeMinutes: 45,
    });
  }

  if (scores.sleepScore < 75) {
    recommendations.push({
      id: 'rec-sleep-1',
      title: 'Optimize Sleep Hygiene Window',
      description: 'Sleep recovery index is below optimal threshold. Avoid caffeine after 2 PM and dim ambient blue light 90 minutes before sleep.',
      category: 'Sleep',
      priority: 'High',
      estimatedTimeMinutes: 15,
    });
  }

  if (scores.focusScore < 70) {
    recommendations.push({
      id: 'rec-focus-1',
      title: 'Execute Pomodoro Focus Blocks',
      description: 'Cognitive focus is experiencing friction. Structure your work into 25-minute uninterrupted deep work sprints.',
      category: 'Focus',
      priority: 'Medium',
      estimatedTimeMinutes: 25,
    });
  }

  // Always offer a mindfulness recommendation
  recommendations.push({
    id: 'rec-mindfulness-1',
    title: 'Daily Evening Cognitive Reflection',
    description: 'Log 3 gratitude items or record a short journal entry to process subconscious cognitive stress before sleep.',
    category: 'Mindfulness',
    priority: 'Low',
    estimatedTimeMinutes: 10,
  });

  return recommendations;
}
