'use server';

import { createStreamableValue } from 'ai/rsc';
import { CoreMessage, streamText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { google } from '@ai-sdk/google';


import { ReactNode } from 'react';
import { getContext } from '@/utils/context';


export interface Message {
  role: 'user' | 'assistant';
  content: string;
  display?: ReactNode;
}


// Streaming Chat 
export async function continueTextConversation(messages: CoreMessage[]) {
  const result = await streamText({
    model: openai('gpt-4-turbo'),
    messages,
  });

  const stream = createStreamableValue(result.textStream);
  //console.log(stream.value)
  return stream.value;
}

export async function continueTextConversationGemini(messages: CoreMessage[]) {
  
  const result = await streamText({
    model: google('gemini-1.5-flash-latest'),
    messages,
  });

  const stream = createStreamableValue(result.textStream);
  //console.log(stream.value)
  return stream.value;
}
export async function continueTextConversationRAG(messages: CoreMessage[]) {
  console.log("RAG for: ", messages[messages.length - 1].content)
  const context = await getContext(messages[messages.length - 1].content)
  console.log("Context Length: ", context.length)

  const prompt = [
    {
      role: 'system',
      content: `AI assistant is an expert and reliable source of knowledge.
      START CONTEXT BLOCK
      ${context}
      END OF CONTEXT BLOCK
      AI assistant will strictly follow the provided context for responses.
      If the context does not provide an answer, AI will respond with: "I'm sorry, but I don't know the answer to that question."
      `,
    },
  ];

  try {
    const model = "gemini-1.5-flash"
    console.log("RAG model: ", model);
    const result = await streamText({
      model: google(model),
      // model: openai(model),
      messages: [...prompt, ...messages.filter((message) => message.role === 'user')],
    });

    console.log("RAG response streaming...");

    return createStreamableValue(result.textStream).value;
  } catch (error) {
    console.error("Error in RAG conversation:", error);
    throw new Error("Failed to fetch AI response.");
  }
}



// Utils
export async function checkAIAvailability() {
  const envVarExists = !!process.env.OPENAI_API_KEY;
  return envVarExists;
}