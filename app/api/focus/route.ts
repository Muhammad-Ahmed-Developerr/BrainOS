import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectToDatabase } from '@/lib/mongodb';
import { FocusSession } from '@/models/FocusSession';
import { queryGroqAPI } from '@/lib/groq-service';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const session = await getServerSession(authOptions);
    const userId = searchParams.get('userId') || (session?.user as any)?.id || session?.user?.email || 'guest';

    await connectToDatabase();
    const sessions = await FocusSession.find({ userId }).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, focusSessions: sessions });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const session = await getServerSession(authOptions);
    const userId = searchParams.get('userId') || (session?.user as any)?.id || session?.user?.email || 'guest';

    const { taskTitle, durationMinutes, distractions, flowStateRating, groqApiKey, preferredModel } = await req.json();

    const apiKeyToUse = groqApiKey || process.env.NEXT_PUBLIC_GROQ_API_KEY || '';
    const modelToUse = preferredModel || 'llama-3.3-70b-versatile';

    let groqFocusTip = '';
    try {
      const prompt = `Focus Session Logged: Task="${taskTitle}", Duration=${durationMinutes} minutes, Distractions count=${distractionCount(distractions)}, Flow State Rating=${flowStateRating}/10. Provide 2 cognitive enhancement tips to sustain flow state in subsequent sessions.`;
      groqFocusTip = await queryGroqAPI(
        apiKeyToUse,
        modelToUse,
        [
          { role: 'system', content: 'You are a cognitive focus coach. Provide actionable strategies to deepen focus.' },
          { role: 'user', content: prompt }
        ],
        0.7
      );
    } catch (e) {
      groqFocusTip = 'Use 50-minute ultradian rhythm cycles followed by 10 minutes of non-sleep deep rest (NSDR).';
    }

    await connectToDatabase();
    const newSession = await FocusSession.create({
      userId,
      date: new Date().toISOString().split('T')[0],
      taskTitle: taskTitle || 'Deep Focus Session',
      durationMinutes: Number(durationMinutes) || 45,
      distractions: Number(distractions) || 0,
      flowStateRating: Number(flowStateRating) || 8,
      groqFocusTip,
    });

    return NextResponse.json({ success: true, focusSession: newSession });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

function distractionCount(val: any): number {
  return typeof val === 'number' ? val : 0;
}
