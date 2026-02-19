
'use server';
/**
 * @fileOverview A flow to generate an image from a text prompt using Imagen,
 * or generate/edit an image based on a reference image.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const ImageGenerationInputSchema = z.object({
  prompt: z.string().describe('The text prompt to generate or modify an image.'),
  imageDataUri: z.string().optional().describe(
    "An optional reference image as a data URI. If provided, the model will modify this image based on the prompt. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
  ),
});

const ImageGenerationOutputSchema = z.object({
  imageUrl: z.string().describe('The generated image as a data URI.'),
});

export type ImageGenerationOutput = z.infer<typeof ImageGenerationOutputSchema>;

const imageGenerationFlow = ai.defineFlow(
  {
    name: 'imageGenerationFlow',
    inputSchema: ImageGenerationInputSchema,
    outputSchema: ImageGenerationOutputSchema,
  },
  async ({ prompt, imageDataUri }) => {
    let media;

    if (imageDataUri) {
      // Image-to-image generation
      const { media: generatedMedia } = await ai.generate({
        model: 'googleai/gemini-2.5-flash-image-preview',
        prompt: [
          { media: { url: imageDataUri } },
          // A default prompt is useful if the user only uploads an image without text.
          { text: prompt || 'Slightly enhance the image, making it more vibrant and clear.' },
        ],
        config: {
          responseModalities: ['TEXT', 'IMAGE'],
        },
      });
      media = generatedMedia;

    } else {
      // Text-to-image generation
      if (!prompt) {
        throw new Error('A text prompt is required for text-to-image generation.');
      }
      const { media: generatedMedia } = await ai.generate({
        model: 'googleai/imagen-4.0-fast-generate-001',
        prompt: prompt,
      });
      media = generatedMedia;
    }

    if (!media || !media.url) {
      throw new Error('Image generation failed to return an image.');
    }

    return { imageUrl: media.url };
  }
);

// Exported wrapper function
export async function generateImage(input: z.infer<typeof ImageGenerationInputSchema>): Promise<ImageGenerationOutput> {
  return await imageGenerationFlow(input);
}
