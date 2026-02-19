
'use server';
/**
 * @fileOverview An AI flow to analyze content and generate a comprehensive, 
 * multi-section report, which can include text summaries or data visualizations like charts.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const InfographicContentInputSchema = z.object({
  textContent: z.string().describe('The raw text content to be analyzed and structured for a report.'),
  imageDataUri: z.string().optional().describe(
    "An optional reference image as a data URI. If provided, the model will use this image as additional context. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
  ),
});

// --- Schemas for Report Sections ---

const ChartDataSchema = z.array(z.record(z.union([z.string(), z.number()])));

const ChartConfigSchema = z.object({
    type: z.enum(['bar', 'line', 'pie', 'ring', 'area']).describe("The type of chart to render. Choose the best one for the data: 'bar' for comparisons, 'line' for time-series/trends, 'pie' or 'ring' for proportions, and 'area' for visualizing volume trends over time."),
    dataKey: z.string().describe("The key in the data objects that holds the primary numerical value to be plotted."),
    categoryKey: z.string().describe("The key in the data objects that represents the labels/categories for the chart."),
    layout: z.enum(['horizontal', 'vertical']).optional().describe("For bar charts, the orientation. Use 'vertical' for a standard column chart and 'horizontal' for a horizontal bar chart."),
});

// A flattened section schema to avoid nesting depth errors
const SectionSchema = z.object({
    type: z.enum(['text', 'keyPoints', 'chart']).describe("The type of this section."),
    title: z.string().describe("A title for this section."),
    
    // Fields for 'text' type
    content: z.string().optional().describe("The main paragraph or body of this section. Use when type is 'text'."),
    
    // Fields for 'keyPoints' type
    points: z.array(z.object({
        icon: z.string().describe('A single, relevant icon name from lucide-react (e.g., "Shield", "Users"). Use PascalCase.'),
        title: z.string().describe('A short, impactful title for the key point (3 words max).'),
        description: z.string().describe('A concise one-sentence description of the key point.')
    })).min(1).max(3).optional().describe("A list of key points. Used when type is 'keyPoints'."),

    // Fields for 'chart' type
    chart: ChartConfigSchema.optional().describe("Configuration for the chart. Used when type is 'chart'."),
    data: ChartDataSchema.optional().describe("The data for the chart. Used when type is 'chart'."),
    analysis: z.string().optional().describe("A detailed analysis of what the chart shows. Used when type is 'chart'."),
});


// --- Main Report Schema ---

const MultiSectionReportSchema = z.object({
  mainTitle: z.string().describe("The main, overarching title for the entire document."),
  mainSubtitle: z.string().describe("A brief, one-sentence subtitle that summarizes the document's theme."),
  sections: z.array(SectionSchema).min(1).describe("An array of content sections. Create as many sections as needed to fully document the input content. Use a mix of text, key points, and multiple charts if the data allows."),
  documentation: z.string().describe('A concluding summary that explains what the report represents and what source data was used.'),
});

export type MultiSectionReport = z.infer<typeof MultiSectionReportSchema>;

const infographicPrompt = ai.definePrompt({
  name: 'infographicPrompt',
  input: { schema: InfographicContentInputSchema },
  output: { schema: MultiSectionReportSchema },
  prompt: `You are an expert data analyst and information designer. Your task is to transform the provided content into a comprehensive, multi-section documentation report.

**Instructions:**
1.  **Analyze Content:** Examine the provided text content (and image, if available).
2.  **Structure the Report:** Break down the information into logical sections. Your output MUST be a single JSON object that strictly adheres to the 'MultiSectionReportSchema'.
3.  **Generate Multiple Sections:** You MUST create an array of sections. Use 'text' sections for introductions and explanations. Use 'keyPoints' for high-level summaries.
4.  **Create Charts for Data:** If you find any structured, visualizable data, you MUST create a 'chart' section for it. If there are multiple distinct datasets, create a separate chart section for each one. Choose the best chart type ('bar', 'line', 'pie', 'ring', 'area') for each dataset. For data that represents parts of a whole, strongly prefer using a 'pie' or 'ring' chart. An 'area' chart is a combination area and line chart.
5.  **Provide a Title and Subtitle:** Create a main title and subtitle for the overall report.
6.  **Write Documentation:** Conclude with a 'documentation' field that summarizes what the report is about and what source data was used.

{{#if imageDataUri}}
The user has also provided an image. Use it as additional context.
Image: {{media url=imageDataUri}}
{{/if}}

Text Content to Analyze:
---
{{{textContent}}}
---
`,
});

const infographicContentFlow = ai.defineFlow(
  {
    name: 'infographicContentFlow',
    inputSchema: InfographicContentInputSchema,
    outputSchema: MultiSectionReportSchema,
  },
  async (input) => {
    const { output } = await infographicPrompt(input);
    if (!output || !output.sections || output.sections.length === 0) {
      throw new Error('The AI model failed to generate a valid report structure.');
    }
    return output;
  }
);

// Exported wrapper function
export async function generateInfographicContent(input: z.infer<typeof InfographicContentInputSchema>): Promise<MultiSectionReport> {
  return await infographicContentFlow(input);
}
