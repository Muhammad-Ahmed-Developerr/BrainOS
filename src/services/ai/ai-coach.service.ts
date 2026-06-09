import { useBrainStore } from "../../store/useBrainStore";

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

export const AiCoachService = {
  async sendMessage(messageText: string, chatHistory: ChatMessage[]): Promise<ChatMessage> {
    await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate thinking latency

    const store = useBrainStore.getState();
    const stress = store.metrics.stressScore;
    const mood = store.moodLogs[0]?.mood || "neutral";

    let aiReply = "Thank you for sharing that with me. As your BrainOS wellness coach, I'm analyzing your neural patterns. Could you tell me more about how you've slept lately?";

    const lowerMessage = messageText.toLowerCase();

    if (lowerMessage.includes("stress") || lowerMessage.includes("burnout") || lowerMessage.includes("tired") || lowerMessage.includes("exhausted")) {
      if (stress > 60) {
        aiReply = `I notice your stress index is elevated at ${stress}/100. Based on your work logs, your meeting density has increased by 15% this week. I highly recommend pausing for a 5-minute Cognitive Re-centering block. Shall we start a breathing cycle?`;
      } else {
        aiReply = "You've been tracking moderate stress today. Let's make sure to block out some screen-free focus time before your cognitive load gets overloaded. What's your top priority right now?";
      }
    } else if (lowerMessage.includes("sad") || lowerMessage.includes("anxious") || lowerMessage.includes("down") || lowerMessage.includes("mood")) {
      aiReply = `I see your last registered mood was "${mood}". Emotional waves are a natural operating response of the brain. Journaling about this can help. Let's write down three things you are grateful for right now.`;
    } else if (lowerMessage.includes("sleep") || lowerMessage.includes("insomnia")) {
      aiReply = "Your sleep metrics indicate an average efficiency of 75%. Let's activate the screen-free hour habit tonight to improve sleep onset latency. Would you like a sleep meditation audio recommendation?";
    } else if (lowerMessage.includes("hello") || lowerMessage.includes("hi") || lowerMessage.includes("help")) {
      aiReply = "Hello! I am your BrainOS AI Advisor. I monitor your stress, sleep, focus, and burnout metrics to optimize your mental performance and mental health. How are you feeling today?";
    }

    return {
      id: `ai-${Date.now()}`,
      sender: 'ai',
      text: aiReply,
      timestamp: new Date().toISOString()
    };
  }
};
