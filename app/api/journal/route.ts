import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectToDatabase } from '@/lib/mongodb';
import { Journal } from '@/models/Journal';
import { analyzeJournalEntry } from '@/lib/groq-service';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const session = await getServerSession(authOptions);
    const userId = searchParams.get('userId') || (session?.user as any)?.id || session?.user?.email || 'guest';

    await connectToDatabase();
    const journals = await Journal.find({ userId }).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, journals });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const session = await getServerSession(authOptions);
    const userId = searchParams.get('userId') || (session?.user as any)?.id || session?.user?.email || 'guest';

    const { title, content, tags, mood, groqApiKey, preferredModel } = await req.json();

    if (!title || !content) {
      return NextResponse.json({ error: 'Title and content are required' }, { status: 400 });
    }

    const apiKeyToUse = groqApiKey || process.env.NEXT_PUBLIC_GROQ_API_KEY || '';
    const modelToUse = preferredModel || 'llama-3.3-70b-versatile';

    const aiAnalysis = await analyzeJournalEntry(
      apiKeyToUse,
      modelToUse,
      title,
      content
    );

    await connectToDatabase();
    const newJournal = await Journal.create({
      userId,
      date: new Date().toISOString().split('T')[0],
      title,
      content,
      tags: tags || ['Reflection'],
      mood: mood || 'neutral',
      aiAnalysis,
    });

    return NextResponse.json({ success: true, journal: newJournal });
  } catch (error: any) {
    console.error('Journal API error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const session = await getServerSession(authOptions);
    const userId = searchParams.get('userId') || (session?.user as any)?.id || session?.user?.email || 'guest';

    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    await connectToDatabase();
    await Journal.deleteOne({ _id: id, userId });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
