
'use server';
/**
 * @fileOverview A flow to generate a video from a text prompt using Veo,
 * optionally using a reference image.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { googleAI } from '@genkit-ai/google-genai';

const VideoGenerationInputSchema = z.object({
  prompt: z.string().describe('The text prompt to generate a video from.'),
  imageDataUri: z.string().optional().describe(
    "An optional reference image as a data URI. If provided, the model will use this image as a starting point. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
  ),
});

const VideoGenerationOutputSchema = z.object({
  videoUrl: z.string().describe('The generated video as a data URI.'),
});

export type VideoGenerationOutput = z.infer<typeof VideoGenerationOutputSchema>;

const videoGenerationFlow = ai.defineFlow(
  {
    name: 'videoGenerationFlow',
    inputSchema: VideoGenerationInputSchema,
    outputSchema: VideoGenerationOutputSchema,
  },
  async ({ prompt, imageDataUri }) => {
    const veoPrompt: any = imageDataUri
      ? [
          { text: prompt },
          { media: { url: imageDataUri } },
        ]
      : prompt;

    // Veo generation is an async operation.
    let { operation } = await ai.generate({
      model: googleAI.model('veo-2.0-generate-001'),
      prompt: veoPrompt,
      config: {
        durationSeconds: 5,
        aspectRatio: '16:9',
      },
    });

    if (!operation) {
      throw new Error('Expected the model to return an operation.');
    }

    // Poll for completion. This can take a while.
    while (!operation.done) {
      await new Promise((resolve) => setTimeout(resolve, 5000)); // Wait 5 seconds
      operation = await ai.checkOperation(operation);
    }

    if (operation.error) {
      console.error('Video generation failed:', operation.error);
      throw new Error(`Video generation failed: ${operation.error.message}`);
    }

    const videoPart = operation.output?.message?.content.find((p) => !!p.media);
    if (!videoPart || !videoPart.media?.url) {
      throw new Error('Failed to find the generated video in the operation result.');
    }

    // The URL is temporary and requires the API key to access.
    // The server must fetch it and return it to the client.
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not configured on the server.');
    }

    const downloadUrl = `${videoPart.media.url}&key=${apiKey}`;

    const response = await fetch(downloadUrl);
    if (!response.ok) {
        throw new Error(`Failed to download the generated video. Status: ${response.status}`);
    }

    // Read the video into a buffer and convert to a data URI
    const videoBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(videoBuffer);
    const contentType = response.headers.get('content-type') || 'video/mp4';
    const videoDataUri = `data:${contentType};base64,${buffer.toString('base64')}`;

    return { videoUrl: videoDataUri };
  }
);

// Exported wrapper function
export async function generateVideo(input: z.infer<typeof VideoGenerationInputSchema>): Promise<VideoGenerationOutput> {
  return await videoGenerationFlow(input);
}
