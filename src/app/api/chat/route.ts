import { google } from '@ai-sdk/google';
import { streamText } from 'ai';
import { tools } from '@/ai/tools';
import { GoogleGenAI, Type } from '@google/genai';
import { weatherFunctionDeclaration, getWeatherData } from './weatherTool';

export async function POST(request: Request) {
  const { messages } = await request.json();
  console.log('Messages:', messages);

  // console.log("Tools: ", tools);
  // const result = streamText({
  //   model: google('gemini-2.0-flash'),
  //   system: 'You are a friendly assistant! Do not use the icon file returned in tools in the response',
  //   messages,
  //   maxSteps: 5,
  //   tools,
  // });
  // console.log("Result: ", result);
  // return result.toDataStreamResponse();

  let msglength = messages.length;
  const contents = [
    {
      role: 'user',
      parts: [{ text: messages[msglength-1].content }],
    }
  ];
  
  const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY });
  // Send request with function declarations
  const response = await ai.models.generateContent({
    model: 'gemini-2.0-flash',
    contents: contents,
    config: {
      systemInstruction: 'You are a friendly assistant! Do not use the icon file returned in tools in the response',
      tools: [{
        functionDeclarations: [weatherFunctionDeclaration()],
      }],
    },
  });

  // Check for function calls in the response
  if (response.functionCalls && response.functionCalls.length > 0) {
    const functionCall = response.functionCalls[0]; // Assuming one function call
    console.log(`Function to call: ${functionCall.name}`);
    console.log(`Arguments: ${JSON.stringify(functionCall.args)}`);
    
    if (functionCall.name === 'weatherForLocation') {
      if (!process.env.API_KEY) {
        throw new Error('API key is not defined');
      }
      const location = functionCall.args ? String(functionCall?.args.location) : "Mumbai";
      const weatherData = await getWeatherData(location, process.env.API_KEY);
      let out = { weather: weatherData?.current.condition.text, temperature: weatherData?.current.temp_c, location, icon: weatherData?.current.condition.icon };
      console.log(`Function execution result: ${JSON.stringify(out)}`);
    }
  } else {
    console.log("No function call found in the response.");
    console.log(response.text);
  }


}
