import { MentalHealthScores, JournalEntry } from '@/types/brainos';

export const GROQ_MODELS = [
  { id: 'llama-3.3-70b-versatile', name: 'Llama 3.3 70B Versatile', badge: 'Recommended' },
  { id: 'deepseek-r1-distill-llama-70b', name: 'DeepSeek R1 Distill 70B', badge: 'Reasoning' },
  { id: 'gemma2-9b-it', name: 'Gemma 2 9B IT', badge: 'Fast' },
  { id: 'qwen-2.5-32b', name: 'Qwen 2.5 32B', badge: 'Balanced' },
];

export async function queryGroqAPI(
  apiKey: string,
  model: string,
  messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>,
  temperature = 0.7
): Promise<string> {
  if (!apiKey || apiKey.trim() === '') {
    throw new Error('GROQ_KEY_MISSING');
  }

  const endpoint = 'https://api.groq.com/openai/v1/chat/completions';

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey.trim()}`,
    },
    body: JSON.stringify({
      model: model || 'llama-3.3-70b-versatile',
      messages,
      temperature,
      max_tokens: 1024,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    let parsedMsg = `Groq API Error (${response.status})`;
    try {
      const errJson = JSON.parse(errorText);
      if (errJson.error?.message) parsedMsg = errJson.error.message;
    } catch (_) {}
    throw new Error(parsedMsg);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || 'No response generated from Groq.';
}

/**
 * AI Coach response generator with supportive system prompt
 */
export async function generateAICoachResponse(
  apiKey: string,
  model: string,
  userMessage: string,
  chatHistory: Array<{ role: 'user' | 'assistant'; content: string }>,
  currentScores?: MentalHealthScores
): Promise<string> {
  const systemPrompt = `You are BrainOS Neural Coach, an elite AI mental wellness assistant and cognitive performance partner.
You are trained in evidence-based cognitive behavioral techniques, mindfulness, sleep hygiene, and stress mitigation.

CRITICAL MANDATES:
1. NEVER diagnose clinical diseases, disorders, or medical conditions.
2. If the user mentions extreme distress or self-harm, advise professional support gently and immediately.
3. Act as a supportive coach, habit builder, reflection partner, and empathetic mental wellness mentor.
4. Keep answers structured, warm, highly practical, actionable, and visually clean (use bolding and bullet points).

Current User Context:
${currentScores ? `- Mental Health Score: ${currentScores.overallScore}/100
- Stress Score: ${currentScores.stressScore}/100 (${currentScores.stressRiskLevel})
- Burnout Risk: ${currentScores.burnoutRisk}% (${currentScores.burnoutStatus})
- Focus Score: ${currentScores.focusScore}/100
- Sleep Score: ${currentScores.sleepScore}/100` : 'Default baseline mental health metrics.'}`;

  const formattedHistory = chatHistory.slice(-6).map(m => ({
    role: m.role,
    content: m.content
  }));

  const messages = [
    { role: 'system' as const, content: systemPrompt },
    ...formattedHistory,
    { role: 'user' as const, content: userMessage }
  ];

  const effectiveKey = apiKey && apiKey.trim() !== '' 
    ? apiKey.trim() 
    : (process.env.NEXT_PUBLIC_GROQ_API_KEY || '');

  if (!effectiveKey) {
    // Intelligent fallback response when API Key is not set
    await new Promise(res => setTimeout(res, 800)); // Simulate realistic speed
    return `[Demo Neural Core Response — Add your Groq API Key in Settings for live model execution]

Thank you for sharing your thoughts! Based on your recent BrainOS metrics:

• **Neuro-Cognitive Reflection**: It looks like you are maintaining strong awareness of your state.
• **Actionable Micro-Habit**: Try taking 3 slow diaphragmatic breaths before your next task.
• **BrainOS Tip**: You can configure your free Groq API key in the **Settings** tab to enable live Llama 3.3 / DeepSeek R1 model responses!`;
  }

  try {
    return await queryGroqAPI(effectiveKey, model, messages, 0.7);
  } catch (error: any) {
    if (error.message === 'GROQ_KEY_MISSING') {
      return `Please enter your Groq API key in Settings to communicate with ${model}.`;
    }
    return `Neural Connection Notice: ${error.message}. Please check your API key and model selection in Settings.`;
  }
}

/**
 * Generates a real-time Groq LLM summary for the Dashboard banner
 */
export async function generateDashboardInsight(
  apiKey: string,
  model: string,
  scores: MentalHealthScores
): Promise<string> {
  const effectiveKey = apiKey && apiKey.trim() !== ''
    ? apiKey.trim()
    : (process.env.NEXT_PUBLIC_GROQ_API_KEY || '');

  const prompt = `Based on these live user metrics:
- Overall Mental Health Index: ${scores.overallScore}/100
- Stress Score: ${scores.stressScore}/100 (${scores.stressRiskLevel})
- Burnout Risk: ${scores.burnoutRisk}% (${scores.burnoutStatus})
- Focus Score: ${scores.focusScore}/100 (${scores.deepWorkHours}h deep work)
- Sleep Score: ${scores.sleepScore}/100

Write a 2-sentence encouraging and precise neural insight statement summarizing their cognitive state and giving 1 practical tip for today. Do NOT use markdown codeblocks or quotes.`;

  try {
    const response = await queryGroqAPI(
      effectiveKey,
      model || 'llama-3.3-70b-versatile',
      [
        { role: 'system', content: 'You are BrainOS AI Neural Engine. Give concise, highly scientific yet empathetic performance insights in 2 sentences maximum.' },
        { role: 'user', content: prompt }
      ],
      0.6
    );
    return response.trim();
  } catch (e) {
    return `Your Mental Health Index stands at ${scores.overallScore}/100 with ${scores.stressRiskLevel.toLowerCase()} stress levels. Continue balancing deep work sessions with active physiological recovery.`;
  }
}

/**
 * Journal analysis using Groq JSON extraction
 */
export async function analyzeJournalEntry(
  apiKey: string,
  model: string,
  title: string,
  content: string
): Promise<JournalEntry['aiAnalysis']> {
  const systemPrompt = `You are BrainOS Emotion & Sentiment Neural Analyzer. Analyze the user's journal entry and return ONLY a valid JSON object matching this structure:
{
  "primaryEmotion": "string (e.g., Hopeful Determination, Quiet Anxiety, Focused Joy)",
  "sentimentScore": number (-1.0 to 1.0),
  "stressLevel": "Low" | "Moderate" | "High" | "Severe",
  "keywords": ["string", "string", "string"],
  "summary": "1 sentence concise summary",
  "insights": ["insight 1", "insight 2"]
}`;

  const userPrompt = `Title: ${title}\nContent: ${content}`;

  const effectiveKey = apiKey && apiKey.trim() !== ''
    ? apiKey.trim()
    : (process.env.NEXT_PUBLIC_GROQ_API_KEY || '');

  if (!effectiveKey) {
    // Fallback analyzer logic
    const lower = (title + ' ' + content).toLowerCase();
    const isStress = lower.includes('stress') || lower.includes('tired') || lower.includes('busy') || lower.includes('pressure');
    
    return {
      primaryEmotion: isStress ? 'Cognitive Overload' : 'Thoughtful Reflection',
      sentimentScore: isStress ? -0.2 : 0.65,
      stressLevel: isStress ? 'Moderate' : 'Low',
      keywords: ['Reflection', 'BrainOS', 'Journal', 'Mindset'],
      summary: 'Automated local analysis identified key introspective themes and mental energy patterns.',
      insights: [
        'Writing down your thoughts systematically reduces working memory pressure.',
        'Connect your Groq API Key in Settings for deep LLM sentiment parsing.',
      ],
    };
  }

  try {
    const responseText = await queryGroqAPI(
      effectiveKey,
      model,
      [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      0.2
    );

    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return {
        primaryEmotion: parsed.primaryEmotion || 'Reflective',
        sentimentScore: typeof parsed.sentimentScore === 'number' ? parsed.sentimentScore : 0.5,
        stressLevel: parsed.stressLevel || 'Low',
        keywords: Array.isArray(parsed.keywords) ? parsed.keywords : ['Journal'],
        summary: parsed.summary || 'Journal entry successfully processed.',
        insights: Array.isArray(parsed.insights) ? parsed.insights : ['Keep writing daily.'],
      };
    }
  } catch (e) {
    console.error('Journal Groq analysis failed', e);
  }

  return {
    primaryEmotion: 'Introspective',
    sentimentScore: 0.5,
    stressLevel: 'Low',
    keywords: ['Self-Reflection', 'Habit', 'Daily Log'],
    summary: 'Captured daily thoughts and mental reflection.',
    insights: ['Journaling regularly promotes long-term emotional regulation.'],
  };
}
