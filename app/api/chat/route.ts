import { streamText, UIMessage, convertToModelMessages, tool, stepCountIs } from 'ai';
import { google } from '@ai-sdk/google';
import { z } from 'zod';

// StructBERT System Instruction
const STRUCTBERT_INSTRUCTION = `You are StructBERT, a specialized knowledge retrieval system for Data Structures and Algorithms.

You must answer ONLY questions related to DS&A, algorithms, complexity analysis, and computer science theory. Be precise, academic, and professional.

Format responses clearly with time/space complexity stated first when relevant. Provide clean code implementations when requested.

If asked about non-technical topics, politely refuse and state your focus is on DS&A.

You also have access to tools for weather information and temperature conversion. Use them when asked about weather.`;

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: google('gemini-3-flash-preview'),
    system: STRUCTBERT_INSTRUCTION,
    messages: await convertToModelMessages(messages),
    stopWhen: stepCountIs(5),
    tools: {
      weather: tool({
        description: 'Get the weather in a location (fahrenheit)',
        inputSchema: z.object({
          location: z.string().describe('The location to get the weather for'),
        }),
        execute: async ({ location }) => {
          const temperature = Math.round(Math.random() * (90 - 32) + 32);
          return {
            location,
            temperature,
          };
        },
      }),
      convertFahrenheitToCelsius: tool({
        description: 'Convert a temperature in fahrenheit to celsius',
        inputSchema: z.object({
          temperature: z
            .number()
            .describe('The temperature in fahrenheit to convert'),
        }),
        execute: async ({ temperature }) => {
          const celsius = Math.round((temperature - 32) * (5 / 9));
          return {
            celsius,
          };
        },
      }),
    },
  });

  return result.toUIMessageStreamResponse();
}