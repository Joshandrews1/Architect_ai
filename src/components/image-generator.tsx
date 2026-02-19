
'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Loader2, Zap, AlertTriangle, Upload, X } from 'lucide-react';
import Image from 'next/image';
import { generateImage } from '@/ai/flows/image-generation-flow';

interface ImageGeneratorProps {
    apiKey: string;
}

const FREE_ATTEMPTS_LIMIT = 2;

export function ImageGenerator({ apiKey }: ImageGeneratorProps) {
    const [prompt, setPrompt] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [freeAttempts, setFreeAttempts] = useState(FREE_ATTEMPTS_LIMIT);
    const [referenceImage, setReferenceImage] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const storedAttempts = localStorage.getItem('image_gen_attempts');
        if (storedAttempts) {
            setFreeAttempts(parseInt(storedAttempts, 10));
        } else {
            setFreeAttempts(FREE_ATTEMPTS_LIMIT);
        }
    }, []);

    const canGenerate = freeAttempts > 0 || !!apiKey;
    const isApiRequired = freeAttempts <= 0 && !apiKey;

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
        if ((!prompt && !referenceImage) || !canGenerate) return;

        setLoading(true);
        setError(null);
        setGeneratedImage(null);

        try {
            const result = await generateImage({ prompt, imageDataUri: referenceImage || undefined });
            setGeneratedImage(result.imageUrl);

            if (freeAttempts > 0 && !apiKey) {
                const newAttempts = freeAttempts - 1;
                setFreeAttempts(newAttempts);
                localStorage.setItem('image_gen_attempts', newAttempts.toString());
            }

        } catch (e: any) {
            setError(e.message || 'An unexpected error occurred.');
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <Card className="bg-gray-900/50 border-gray-800" onPaste={handlePaste}>
            <CardHeader>
                <CardTitle>Image Prompt & Reference</CardTitle>
                <CardDescription>
                    Describe the image you want to create, or upload a reference image to modify. 
                    {!apiKey && ` You have ${freeAttempts} free generation${freeAttempts !== 1 ? 's' : ''} left.`}
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
                    placeholder="e.g., A cinematic shot of a majestic dragon soaring over a mystical forest at dawn."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="bg-gray-800 border-gray-700 min-h-[100px]"
                    disabled={!canGenerate || loading}
                />

                {isApiRequired && (
                    <div className="p-4 bg-yellow-900/50 border border-yellow-700 text-yellow-300 rounded-lg flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5" />
                        <p>You've used all your free attempts. Please add an API key above to continue.</p>
                    </div>
                )}
                
                <Button onClick={handleGeneration} disabled={(!prompt && !referenceImage) || loading || !canGenerate} className="w-full">
                    {loading ? <Loader2 className="animate-spin" /> : <Zap />}
                    {loading ? 'Generating...' : 'Generate Image'}
                </Button>

                {error && (
                    <div className="p-4 bg-destructive/20 border border-destructive/50 text-destructive-foreground rounded-lg">
                        <p className="font-bold">Generation Failed</p>
                        <p>{error}</p>
                    </div>
                )}

                {generatedImage && (
                    <div className="mt-6">
                        <h3 className="text-lg font-semibold mb-4">Generated Image</h3>
                        <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-gray-700">
                            <Image src={generatedImage} alt={prompt} layout="fill" objectFit="contain" />
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
