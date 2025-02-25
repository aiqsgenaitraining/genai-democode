import { google } from '@ai-sdk/google';
import { generateText } from 'ai';

export async function POST(req: Request) {
  const promptText = await req.json();

  const result = generateText({
    model: google('gemini-1.5-flash-latest'),
    prompt: promptText.prompt,
  });

  return Response.json((await result).text);
}