import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectToDatabase } from '@/lib/mongodb';
import { CheckIn } from '@/models/CheckIn';
import { Journal } from '@/models/Journal';
import { StressLog } from '@/models/StressLog';
import { queryGroqAPI } from '@/lib/groq-service';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id || session?.user?.email || 'guest';

    const { message, chatHistory, groqApiKey, preferredModel } = await req.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    await connectToDatabase();

    // Fetch user's recent real MongoDB records to enrich system prompt
    const recentCheckIns = await CheckIn.find({ userId }).sort({ createdAt: -1 }).limit(3);
    const recentJournals = await Journal.find({ userId }).sort({ createdAt: -1 }).limit(2);
    const recentStress = await StressLog.find({ userId }).sort({ createdAt: -1 }).limit(2);

    const latestCheckIn = recentCheckIns[0];

    const contextPrompt = `You are BrainOS AI Neural Coach. You are directly connected to the user's live MongoDB neural database.
Current Live User Context:
- User Name: ${session?.user?.name || 'User'}
- Latest Scores: Mental Index=${latestCheckIn?.scores?.overallScore || 78}/100, Stress=${latestCheckIn?.scores?.stressScore || 35}/100, Burnout Risk=${latestCheckIn?.scores?.burnoutRisk || 12}%, Focus=${latestCheckIn?.scores?.focusScore || 82}/100, Sleep=${latestCheckIn?.scores?.sleepScore || 85}/100.
- Latest Check-in Notes: "${latestCheckIn?.customNotes || 'None'}"
- Recent Journal Entries: ${recentJournals.map(j => `[${j.title}: ${j.content.slice(0, 100)}]`).join('; ') || 'None'}
- Recent Stress Triggers: ${recentStress.map(s => `[${s.trigger} (Intensity ${s.intensity}/10)]`).join('; ') || 'None'}

Answer the user's query directly and authoritatively based on their real metrics and scientific neuro-wellness principles.`;

    const apiKeyToUse = groqApiKey || process.env.NEXT_PUBLIC_GROQ_API_KEY || '';
    const modelToUse = preferredModel || 'llama-3.3-70b-versatile';

    const formattedMessages = [
      { role: 'system' as const, content: contextPrompt },
      ...(chatHistory || []).map((h: any) => ({
        role: h.sender === 'user' ? ('user' as const) : ('assistant' as const),
        content: h.text,
      })),
      { role: 'user' as const, content: message },
    ];

    const reply = await queryGroqAPI(apiKeyToUse, modelToUse, formattedMessages, 0.7);

    return NextResponse.json({ success: true, reply });
  } catch (error: any) {
    console.error('Coach API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
