import { google } from '@ai-sdk/google';
import { streamText } from 'ai';
import { tools } from '@/ai/tools';

export async function POST(request: Request) {
  const { messages } = await request.json();

  const result = streamText({
    model: google('gemini-2.0-flash'),
    system: 'You are a friendly assistant! Do not use the icon file returned in tools in the response',
    messages,
    maxSteps: 5,
    tools,
  });

  return result.toDataStreamResponse();
}