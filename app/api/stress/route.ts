import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectToDatabase } from '@/lib/mongodb';
import { StressLog } from '@/models/StressLog';
import { queryGroqAPI } from '@/lib/groq-service';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const session = await getServerSession(authOptions);
    const userId = searchParams.get('userId') || (session?.user as any)?.id || session?.user?.email || 'guest';

    await connectToDatabase();
    const stressLogs = await StressLog.find({ userId }).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, stressLogs });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const session = await getServerSession(authOptions);
    const userId = searchParams.get('userId') || (session?.user as any)?.id || session?.user?.email || 'guest';

    const { trigger, intensity, symptoms, copingStrategy, groqApiKey, preferredModel } = await req.json();

    const apiKeyToUse = groqApiKey || process.env.NEXT_PUBLIC_GROQ_API_KEY || '';
    const modelToUse = preferredModel || 'llama-3.3-70b-versatile';

    let groqAnalysis = '';
    try {
      const prompt = `User logged a stress trigger: "${trigger}" with intensity ${intensity}/10. Physical symptoms: ${symptoms?.join(', ') || 'None'}. Coping strategy used: "${copingStrategy || 'None'}". Provide 2 scientific physiological regulation techniques to quickly lower cortisol.`;
      groqAnalysis = await queryGroqAPI(
        apiKeyToUse,
        modelToUse,
        [
          { role: 'system', content: 'You are an expert neuro-physiologist. Provide concise, immediate stress-reduction techniques.' },
          { role: 'user', content: prompt }
        ],
        0.7
      );
    } catch (e) {
      groqAnalysis = 'Practice 4-7-8 diaphragmatic breathing for 3 minutes to activate the parasympathetic nervous system.';
    }

    await connectToDatabase();
    const newLog = await StressLog.create({
      userId,
      date: new Date().toISOString().split('T')[0],
      trigger,
      intensity: Number(intensity) || 5,
      symptoms: symptoms || [],
      copingStrategy: copingStrategy || '',
      groqAnalysis,
    });

    return NextResponse.json({ success: true, stressLog: newLog });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
