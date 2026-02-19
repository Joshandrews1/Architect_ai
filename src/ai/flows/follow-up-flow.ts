
'use server';
/**
 * @fileOverview This flow handles follow-up questions to a previously completed growth audit.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { type AuditResult } from './audit-flow';

// Define the schemas locally to avoid exporting them from a 'use server' file.
const AuditScoresSchema = z.object({
    seo: z.number().min(0).max(100).describe("SEO score from 0-100, based on factors like meta tags, headings, and keyword presence."),
    clarity: z.number().min(0).max(100).describe("Clarity of Value Proposition score from 0-100. How clear is the site's purpose?"),
    cta: z.number().min(0).max(100).describe("Call-to-Action (CTA) Effectiveness score from 0-100. Are the CTAs compelling and visible?"),
    mobile: z.number().min(0).max(100).describe("Mobile-Friendliness score from 0-100, based on a visual assessment of the HTML structure."),
});

const AuditUrlOutputSchema = z.object({
  summary: z.string().describe("A concise, one-paragraph summary of the overall analysis."),
  scores: AuditScoresSchema,
  strengths: z.array(z.string()).describe("A list of 2-3 specific, praise-worthy strengths."),
  weaknesses: z.array(z.string()).describe("A list of 2-3 key weaknesses framed as opportunities for growth."),
  blueprint: z.object({
    now: z.string().describe("The single most impactful change to make immediately."),
    next: z.string().describe("The next most important action to take."),
    later: z.string().describe("A longer-term suggestion for future growth."),
  }),
  testing: z.string().describe("A paragraph suggesting a simple, lightweight A/B test or user feedback method the owner can implement based on the weaknesses identified."),
});

// Define the input schema for the follow-up flow
const FollowUpInputSchema = z.object({
  analysis: AuditUrlOutputSchema.describe("The full JSON object of the original audit analysis."),
  question: z.string().describe("The user's follow-up question."),
});

// Define the output schema for the follow-up flow
const FollowUpOutputSchema = z.object({
  answer: z.string().describe("The AI's answer to the follow-up question."),
});
export type FollowUpOutput = z.infer<typeof FollowUpOutputSchema>;


// Define the prompt for the generative model
const followUpPrompt = ai.definePrompt({
    name: 'followUpPrompt',
    input: { schema: FollowUpInputSchema },
    output: { schema: FollowUpOutputSchema },
    prompt: `You are Architect AI, an expert business growth consultant. You previously provided the following analysis for a user's website:

--- ANALYSIS START ---
{{json analysis}}
--- ANALYSIS END ---

The user now has a follow-up question. Provide a concise, helpful, and professional answer based *only* on the context of the analysis you already provided.

User's Question:
"{{{question}}}"
`,
});

// Define the main flow function
const followUpFlow = ai.defineFlow(
  {
    name: 'followUpFlow',
    inputSchema: FollowUpInputSchema,
    outputSchema: FollowUpOutputSchema,
  },
  async (input) => {
    const { output } = await followUpPrompt(input);
    
    if (!output || !output.answer) {
        throw new Error("The AI model could not generate an answer for your follow-up question.");
    }

    return output;
  }
);

// Exported wrapper function for the component to call
export async function askFollowUp(analysis: AuditResult, question: string): Promise<FollowUpOutput> {
  return await followUpFlow({ analysis, question });
}
