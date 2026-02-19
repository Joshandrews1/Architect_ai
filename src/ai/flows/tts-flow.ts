
'use server';
/**
 * @fileOverview A flow to generate speech from text using Gemini 2.5 Pro Preview TTS.
 * It supports both single-speaker and multi-speaker generation.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { googleAI } from '@genkit-ai/google-genai';
import wav from 'wav';

// Define the schema for a single speaker's configuration
const SpeakerConfigSchema = z.object({
  speaker: z.string().describe('The identifier for the speaker, e.g., "Speaker1".'),
  voice: z.string().describe('The prebuilt voice name to use for this speaker.'),
  pitch: z.number().optional().describe('The pitch of the voice. Range: [-20.0, 20.0]. Default is 0.'),
  speed: z.number().optional().describe('The speaking rate. Range: [0.25, 4.0]. Default is 1.0.'),
});

// Define the input schema for the TTS flow
const TTSInputSchema = z.object({
  script: z.string().describe('The text script to be converted to speech. For multi-speaker, format as "Speaker1: Hello. Speaker2: Hi there."'),
  mode: z.enum(['single-speaker', 'multi-speaker']).describe('The generation mode.'),
  speakerConfigs: z.array(SpeakerConfigSchema).optional().describe('Configuration for each speaker in multi-speaker mode.'),
  singleVoice: z.string().optional().describe('The voice to use in single-speaker mode.'),
  pitch: z.number().optional().describe('The pitch for single-speaker mode.'),
  speed: z.number().optional().describe('The speaking rate for single-speaker mode.'),
});

// Define the output schema for the TTS flow
const TTSOutputSchema = z.object({
  audioUrl: z.string().describe('The generated audio as a WAV data URI.'),
});

export type TTSOutput = z.infer<typeof TTSOutputSchema>;

// Helper function to convert raw PCM audio buffer to a WAV base64 string
async function toWav(pcmData: Buffer, channels = 1, rate = 24000, sampleWidth = 2): Promise<string> {
  return new Promise((resolve, reject) => {
    const writer = new wav.Writer({
      channels,
      sampleRate: rate,
      bitDepth: sampleWidth * 8,
    });

    const bufs: any[] = [];
    writer.on('error', reject);
    writer.on('data', (d) => bufs.push(d));
    writer.on('end', () => {
      resolve(Buffer.concat(bufs).toString('base64'));
    });

    writer.write(pcmData);
    writer.end();
  });
}

// Define the main TTS flow
const ttsFlow = ai.defineFlow(
  {
    name: 'ttsFlow',
    inputSchema: TTSInputSchema,
    outputSchema: TTSOutputSchema,
  },
  async ({ script, mode, speakerConfigs, singleVoice, pitch, speed }) => {
    
    let speechConfig;
    if (mode === 'multi-speaker' && speakerConfigs && speakerConfigs.length > 0) {
      speechConfig = {
        multiSpeakerVoiceConfig: {
          speakerVoiceConfigs: speakerConfigs.map(sc => ({
            speaker: sc.speaker,
            voiceConfig: { 
                prebuiltVoiceConfig: { voiceName: sc.voice },
                // Pitch and Speed are not supported per-speaker in multi-speaker mode by the API.
            },
          })),
        },
      };
    } else {
      speechConfig = {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName: singleVoice || 'Algenib' },
          pitch: pitch,
          speakingRate: speed,
        },
      };
    }

    const { media } = await ai.generate({
      model: googleAI.model('gemini-2.5-flash-preview-tts'),
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: speechConfig,
      },
      prompt: script,
    });

    if (!media || !media.url) {
      throw new Error('Text-to-Speech generation failed to return audio.');
    }

    // Convert PCM to WAV
    const audioBuffer = Buffer.from(media.url.substring(media.url.indexOf(',') + 1), 'base64');
    const wavBase64 = await toWav(audioBuffer);

    return {
      audioUrl: `data:audio/wav;base64,${wavBase64}`,
    };
  }
);

// Exported wrapper function for the component to call
export async function generateSpeech(input: z.infer<typeof TTSInputSchema>): Promise<TTSOutput> {
  return await ttsFlow(input);
}
