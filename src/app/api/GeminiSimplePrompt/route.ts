import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(req: Request) {

  const promptText = (await req.json()).prompt;

  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: "API key is missing" }), { status: 500 });
  }
  const genAI = new GoogleGenerativeAI(apiKey);

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const result = await model.generateContent(promptText);

  return Response.json((await result.response.text()));
}