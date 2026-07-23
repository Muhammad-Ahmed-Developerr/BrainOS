import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectToDatabase } from '@/lib/mongodb';
import { CheckIn } from '@/models/CheckIn';
import { calculateScoresFromCheckIns } from '@/lib/scoring-engine';
import { queryGroqAPI } from '@/lib/groq-service';
import { DailyCheckIn } from '@/types/brainos';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const session = await getServerSession(authOptions);
    const userId = searchParams.get('userId') || (session?.user as any)?.id || session?.user?.email || 'guest';

    await connectToDatabase();
    const checkIns = await CheckIn.find({ userId }).sort({ createdAt: -1 }).limit(60);

    return NextResponse.json({ success: true, checkIns });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const session = await getServerSession(authOptions);
    const userId = searchParams.get('userId') || (session?.user as any)?.id || session?.user?.email || 'guest';

    const body = await req.json();

    // Read ALL fields from the Daily Check-In form
    const {
      date,
      mood,
      moodLabel,
      energy,
      stress,
      sleepHours,
      sleepQuality,
      waterIntakeLiters,
      exerciseMinutes,
      workHours,
      studyHours,
      screenTimeHours,
      socialMinutes,
      meditationMinutes,
      productivity,
      tags,
      customNotes,
      groqApiKey,
      preferredModel,
    } = body;

    const checkInObject: DailyCheckIn = {
      id: `checkin-${Date.now()}`,
      timestamp: Date.now(),
      date: date || new Date().toISOString().split('T')[0],
      mood: Number(mood) || 5,
      moodLabel: moodLabel || '',
      energy: Number(energy) || 5,
      stress: Number(stress) || 5,
      sleepHours: Number(sleepHours) || 7,
      sleepQuality: Number(sleepQuality) || 5,
      waterIntakeLiters: Number(waterIntakeLiters) || 0,
      exerciseMinutes: Number(exerciseMinutes) || 0,
      workHours: Number(workHours) || 0,
      studyHours: Number(studyHours) || 0,
      screenTimeHours: Number(screenTimeHours) || 0,
      socialMinutes: Number(socialMinutes) || 0,
      meditationMinutes: Number(meditationMinutes) || 0,
      productivity: Number(productivity) || 5,
      tags: Array.isArray(tags) ? tags : [],
      customNotes: customNotes || '',
    };

    const scores = calculateScoresFromCheckIns([checkInObject]);

    // Call Groq AI for personalized insight based on ALL the user's real inputs
    let aiAnalysis = '';
    const apiKeyToUse = groqApiKey || process.env.NEXT_PUBLIC_GROQ_API_KEY || '';
    const modelToUse = preferredModel || 'llama-3.3-70b-versatile';

    try {
      const prompt = `Analyze this user's daily check-in data and provide personalized mental health feedback:
- Date: ${checkInObject.date}
- Mood: ${checkInObject.mood}/10 (${checkInObject.moodLabel || ''})
- Energy Level: ${checkInObject.energy}/10
- Stress Level: ${checkInObject.stress}/10
- Sleep: ${checkInObject.sleepHours}h (Quality: ${checkInObject.sleepQuality}/10)
- Water Intake: ${checkInObject.waterIntakeLiters}L
- Exercise: ${checkInObject.exerciseMinutes} minutes
- Work Hours: ${checkInObject.workHours}h
- Study Hours: ${checkInObject.studyHours}h
- Screen Time: ${checkInObject.screenTimeHours}h
- Social Time: ${checkInObject.socialMinutes} minutes
- Meditation: ${checkInObject.meditationMinutes} minutes
- Productivity: ${checkInObject.productivity}/10
- Tags: ${checkInObject.tags.join(', ') || 'None'}
- Notes: ${checkInObject.customNotes || 'None'}

Calculated Scores: Mental Health Index=${scores.overallScore}/100, Stress=${scores.stressScore}/100, Burnout Risk=${scores.burnoutRisk}%, Focus=${scores.focusScore}/100, Sleep=${scores.sleepScore}/100.

Provide 2-3 sentences of specific, actionable neuro-feedback based on this person's EXACT data. Be direct and personalized.`;

      aiAnalysis = await queryGroqAPI(
        apiKeyToUse,
        modelToUse,
        [
          { role: 'system', content: 'You are the BrainOS AI Neural Core. Provide concise, expert, personalized neuro-feedback based strictly on the user\'s real check-in data. Do not be generic.' },
          { role: 'user', content: prompt }
        ],
        0.7
      );
    } catch (e) {
      aiAnalysis = `Your Mental Health Index is ${scores.overallScore}/100. Stress load is ${scores.stressRiskLevel?.toLowerCase() || 'moderate'}. Keep building on today's habits.`;
    }

    await connectToDatabase();
    const newCheckIn = await CheckIn.create({
      userId,
      date: checkInObject.date,
      mood: checkInObject.mood,
      moodLabel: checkInObject.moodLabel,
      energy: checkInObject.energy,
      stress: checkInObject.stress,
      sleepHours: checkInObject.sleepHours,
      sleepQuality: checkInObject.sleepQuality,
      waterIntakeLiters: checkInObject.waterIntakeLiters,
      exerciseMinutes: checkInObject.exerciseMinutes,
      workHours: checkInObject.workHours,
      studyHours: checkInObject.studyHours,
      screenTimeHours: checkInObject.screenTimeHours,
      socialMinutes: checkInObject.socialMinutes,
      meditationMinutes: checkInObject.meditationMinutes,
      productivity: checkInObject.productivity,
      tags: checkInObject.tags,
      customNotes: checkInObject.customNotes,
      scores,
      aiAnalysis,
    });

    return NextResponse.json({
      success: true,
      checkIn: newCheckIn,
      scores,
      aiAnalysis,
    });
  } catch (error: any) {
    console.error('CheckIn API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
