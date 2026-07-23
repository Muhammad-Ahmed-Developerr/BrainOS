import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectToDatabase } from '@/lib/mongodb';
import { BurnoutMetric } from '@/models/BurnoutMetric';
import { queryGroqAPI } from '@/lib/groq-service';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const session = await getServerSession(authOptions);
    const userId = searchParams.get('userId') || (session?.user as any)?.id || session?.user?.email || 'guest';

    await connectToDatabase();
    const burnoutMetrics = await BurnoutMetric.find({ userId }).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, burnoutMetrics });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const session = await getServerSession(authOptions);
    const userId = searchParams.get('userId') || (session?.user as any)?.id || session?.user?.email || 'guest';

    const { exhaustion, cynicism, inefficacy, overtimeHours, groqApiKey, preferredModel } = await req.json();

    const ex = Number(exhaustion) || 5;
    const cy = Number(cynicism) || 5;
    const ineff = Number(inefficacy) || 5;
    const ot = Number(overtimeHours) || 0;

    // Maslach Burnout Inventory weighted estimate
    const calculatedRisk = Math.min(100, Math.round((ex * 3.5 + cy * 3.0 + ineff * 2.5 + ot * 2.0)));

    const apiKeyToUse = groqApiKey || process.env.NEXT_PUBLIC_GROQ_API_KEY || '';
    const modelToUse = preferredModel || 'llama-3.3-70b-versatile';

    let groqRecommendation = '';
    try {
      const prompt = `Calculated Burnout Risk: ${calculatedRisk}%. Metrics logged: Exhaustion=${ex}/10, Cynicism=${cy}/10, Reduced Efficacy=${ineff}/10, Overtime=${ot} hours. Provide 2 actionable executive boundary & recovery steps for this user.`;
      groqRecommendation = await queryGroqAPI(
        apiKeyToUse,
        modelToUse,
        [
          { role: 'system', content: 'You are an occupational mental health specialist. Give clear, protective burnout intervention advice.' },
          { role: 'user', content: prompt }
        ],
        0.7
      );
    } catch (e) {
      groqRecommendation = 'Set a firm end time for work today and disconnect from digital devices 2 hours before sleep.';
    }

    await connectToDatabase();
    const newMetric = await BurnoutMetric.create({
      userId,
      date: new Date().toISOString().split('T')[0],
      exhaustion: ex,
      cynicism: cy,
      inefficacy: ineff,
      overtimeHours: ot,
      calculatedRisk,
      groqRecommendation,
    });

    return NextResponse.json({ success: true, burnoutMetric: newMetric });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
