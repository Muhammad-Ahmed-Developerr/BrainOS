import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectToDatabase } from '@/lib/mongodb';
import { SleepLog } from '@/models/SleepLog';
import { queryGroqAPI } from '@/lib/groq-service';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const session = await getServerSession(authOptions);
    const userId = searchParams.get('userId') || (session?.user as any)?.id || session?.user?.email || 'guest';

    await connectToDatabase();
    const sleepLogs = await SleepLog.find({ userId }).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, sleepLogs });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const session = await getServerSession(authOptions);
    const userId = searchParams.get('userId') || (session?.user as any)?.id || session?.user?.email || 'guest';

    const {
      sleepHours,
      qualityRating,
      deepSleepMinutes,
      remSleepMinutes,
      disruptions,
      caffeineCutoffHour,
      groqApiKey,
      preferredModel,
    } = await req.json();

    const apiKeyToUse = groqApiKey || process.env.NEXT_PUBLIC_GROQ_API_KEY || '';
    const modelToUse = preferredModel || 'llama-3.3-70b-versatile';

    let groqSleepAdvice = '';
    try {
      const prompt = `Sleep log: Duration=${sleepHours} hours, Self-rated Quality=${qualityRating}/10, Deep Sleep=${deepSleepMinutes}m, REM=${remSleepMinutes}m, Disruptions=${disruptions}, Caffeine Cutoff=${caffeineCutoffHour || 'Not specified'}. Provide 2 sleep architecture optimization tips.`;
      groqSleepAdvice = await queryGroqAPI(
        apiKeyToUse,
        modelToUse,
        [
          { role: 'system', content: 'You are a circadian sleep neuroscientist. Provide precise sleep hygiene recommendations.' },
          { role: 'user', content: prompt }
        ],
        0.7
      );
    } catch (e) {
      groqSleepAdvice = 'Maintain a consistent sleep window and ensure room temperature is kept cool (around 65°F / 18°C) for optimal deep sleep.';
    }

    await connectToDatabase();
    const newSleepLog = await SleepLog.create({
      userId,
      date: new Date().toISOString().split('T')[0],
      sleepHours: Number(sleepHours) || 7,
      qualityRating: Number(qualityRating) || 7,
      deepSleepMinutes: Number(deepSleepMinutes) || 90,
      remSleepMinutes: Number(remSleepMinutes) || 90,
      disruptions: Number(disruptions) || 1,
      caffeineCutoffHour: caffeineCutoffHour || '14:00',
      groqSleepAdvice,
    });

    return NextResponse.json({ success: true, sleepLog: newSleepLog });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
