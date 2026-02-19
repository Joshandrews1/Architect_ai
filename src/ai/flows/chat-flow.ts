
'use server';
/**
 * @fileOverview This flow handles the server-side logic for the conversational chatbot.
 * It is designed to be reusable for different AI personas and to provide structured,
 * interactive responses.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import {type Content} from 'firebase/ai';

// Define the Zod schema for a single chat message, mirroring the 'Content' type from 'firebase/ai'
const MessageSchema = z.object({
  role: z.enum(['user', 'model']),
  parts: z.array(z.object({
    text: z.string(),
  })),
});

// This is the input for the prompt itself. It now includes the user's message.
const InteractiveChatPromptInputSchema = z.object({
  persona: z.string().describe("The system prompt or persona for the AI."),
  message: z.string().describe("The user's most recent message."),
});

// This is the input for the overall flow, which remains unchanged.
const ChatInputSchema = z.object({
  history: z.array(MessageSchema).describe("The conversation history between the user and the model."),
  persona: z.string().describe("The system prompt or persona for the AI."),
});

// Define the structured output schema for the chat flow
const ChatOutputSchema = z.object({
  answer: z.string().describe("The AI's response to the user's last message. Keep it conversational and not too long."),
  suggestions: z.array(z.string()).optional().describe("A list of 2-4 short, relevant follow-up questions or topics the user can click on to continue the conversation. Frame them as if the user is asking them.")
});

export type ChatOutput = z.infer<typeof ChatOutputSchema>;


// Define the prompt object outside the flow for reusability.
// The prompt now explicitly includes the user's message to ensure it's addressed.
const interactiveChatPrompt = ai.definePrompt({
    name: 'interactiveChatPrompt',
    input: { schema: InteractiveChatPromptInputSchema },
    output: { schema: ChatOutputSchema },
    prompt: `{{{persona}}}

The user's latest message is: "{{{message}}}"

Based on the persona instructions and the user's message, provide your response.`,
});


// Define the main chat flow function
const chatFlow = ai.defineFlow(
  {
    name: 'chatFlow',
    inputSchema: ChatInputSchema,
    outputSchema: ChatOutputSchema,
  },
  async ({ history, persona }) => {
    
    // Extract the last message from the history to be used in the prompt.
    const lastMessage = history.length > 0 ? history[history.length - 1] : null;
    const userMessage = lastMessage && lastMessage.role === 'user' ? lastMessage.parts[0].text : '';

    // The history for the API should not include the last message, as it's now part of the prompt.
    let historyForApi = history.length > 1 ? history.slice(0, -1) : [];

    // The Gemini API works best when history starts with a 'user' message.
    // We will slice off the first message if it's from the model (the initial greeting).
    if (historyForApi[0]?.role === 'model') {
      historyForApi = historyForApi.slice(1);
    }
    
    // Map `parts` to `content` for the Genkit `generate` function
    const contentHistory = historyForApi.map(msg => ({
        role: msg.role,
        content: msg.parts,
    }));

    // Call our structured prompt, passing the dynamic persona and the specific user message as input,
    // and the rest of the conversation history as context.
    const { output } = await interactiveChatPrompt(
        { persona, message: userMessage },
        { history: contentHistory }
    );

    if (!output || !output.answer) {
        throw new Error("The AI model could not generate an answer.");
    }
    
    return output;
  }
);

// Exported wrapper function for the component to call
export async function askChatbot(history: Content[], persona: string): Promise<ChatOutput> {
  // Zod validation on the server side before calling the flow
  const validatedInput = ChatInputSchema.parse({ history, persona });
  return await chatFlow(validatedInput);
}
