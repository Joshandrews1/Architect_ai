
'use client';

import { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Loader2, Zap, AlertTriangle, Upload, X } from 'lucide-react';
import { generateVideo } from '@/ai/flows/video-generation-flow';
import Image from 'next/image';

interface VideoGeneratorProps {
    apiKey: string;
}

export function VideoGenerator({ apiKey }: VideoGeneratorProps) {
    const [prompt, setPrompt] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [generatedVideo, setGeneratedVideo] = useState<string | null>(null);
    const [referenceImage, setReferenceImage] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const canGenerate = !!apiKey;

    const processFile = (file: File) => {
        if (!file.type.startsWith('image/')) {
            setError('Please upload a valid image file.');
            return;
        }
        setError(null);
        const reader = new FileReader();
        reader.onload = (e) => {
            setReferenceImage(e.target?.result as string);
        };
        reader.readAsDataURL(file);
    };

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            processFile(file);
        }
    };

    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
        const file = event.dataTransfer.files?.[0];
        if (file) {
            processFile(file);
        }
    };
    
    const handlePaste = (event: React.ClipboardEvent<HTMLDivElement>) => {
        const file = event.clipboardData.files?.[0];
        if (file && file.type.startsWith('image/')) {
            processFile(file);
        }
    };

    const handleGeneration = async () => {
        if (!prompt || !canGenerate) return;

        setLoading(true);
        setError(null);
        setGeneratedVideo(null);

        try {
            const result = await generateVideo({ prompt, imageDataUri: referenceImage || undefined });
            setGeneratedVideo(result.videoUrl);
        } catch (e: any) {
            setError(e.message || 'An unexpected error occurred during video generation.');
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <Card className="bg-gray-900/50 border-gray-800" onPaste={handlePaste}>
            <CardHeader>
                <CardTitle>Video Prompt & Reference</CardTitle>
                <CardDescription>
                    Describe the video you want to create. You can provide an image to use as a reference. Video generation can take up to a minute.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label>Reference Image (Optional)</Label>
                    {referenceImage ? (
                        <div className="relative aspect-video w-full">
                            <Image src={referenceImage} alt="Reference image" layout="fill" objectFit="contain" className="rounded-md border border-gray-700 bg-black/20" />
                            <Button
                                variant="destructive"
                                size="icon"
                                className="absolute top-2 right-2 h-7 w-7 rounded-full z-10"
                                onClick={() => setReferenceImage(null)}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    ) : (
                        <div
                            className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-700 rounded-lg cursor-pointer bg-gray-800/50 hover:bg-gray-800 transition-colors"
                            onDrop={handleDrop}
                            onDragOver={(e) => e.preventDefault()}
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <Upload className="w-8 h-8 text-gray-500 mb-2" />
                            <p className="text-sm text-gray-500">
                                <span className="font-semibold">Click to upload</span>, drag & drop, or paste an image
                            </p>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileSelect}
                                className="hidden"
                                accept="image/*"
                            />
                        </div>
                    )}
                </div>

                <Textarea 
                    placeholder="e.g., A majestic dragon soaring over a mystical forest at dawn."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="bg-gray-800 border-gray-700 min-h-[100px]"
                    disabled={!canGenerate || loading}
                />

                {!canGenerate && (
                    <div className="p-4 bg-yellow-900/50 border border-yellow-700 text-yellow-300 rounded-lg flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5" />
                        <p>Video generation requires a Gemini API key. Please add one above to begin.</p>
                    </div>
                )}
                
                <Button onClick={handleGeneration} disabled={!prompt || loading || !canGenerate} className="w-full">
                    {loading ? <Loader2 className="animate-spin" /> : <Zap />}
                    {loading ? 'Generating Video (this may take a minute)...' : 'Generate Video'}
                </Button>

                {error && (
                    <div className="p-4 bg-destructive/20 border border-destructive/50 text-destructive-foreground rounded-lg">
                        <p className="font-bold">Generation Failed</p>
                        <p>{error}</p>
                    </div>
                )}

                {generatedVideo && (
                    <div className="mt-6">
                        <h3 className="text-lg font-semibold mb-4">Generated Video</h3>
                        <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-gray-700 bg-black">
                            <video
                                src={generatedVideo}
                                controls
                                autoPlay
                                loop
                                className="w-full h-full"
                            />
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
