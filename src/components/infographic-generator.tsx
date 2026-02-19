'use client';

import { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Loader2, AlertTriangle, Download, Plus, Send, Image as ImageIcon, X } from 'lucide-react';
import { generateInfographicContent, type InfographicData } from '@/ai/flows/infographic-content-flow';
import { Skeleton } from '@/components/ui/skeleton';
import DynamicIcon from '@/components/dynamic-icon';
import { useToast } from '@/hooks/use-toast';
import NextImage from 'next/image';

export function InfographicGenerator() {
    const [textContent, setTextContent] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [generatedData, setGeneratedData] = useState<InfographicData | null>(null);
    const [referenceImage, setReferenceImage] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const infographicRef = useRef<HTMLDivElement>(null);
    const { toast } = useToast();

    const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        const textarea = event.target;
        setTextContent(textarea.value);
        
        textarea.style.height = 'auto';

        const computedStyle = window.getComputedStyle(textarea);
        const lineHeight = parseFloat(computedStyle.lineHeight) || 24;
        const maxHeight = 7 * lineHeight;
        
        const scrollHeight = textarea.scrollHeight;

        if (scrollHeight > maxHeight) {
            textarea.style.height = `${maxHeight}px`;
            textarea.style.overflowY = 'auto';
        } else {
            textarea.style.height = `${scrollHeight}px`;
            textarea.style.overflowY = 'hidden';
        }
    };

    const processFile = (file: File) => {
        setError(null);
        if (file.type.startsWith('text/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setTextContent(e.target?.result as string);
            };
            reader.readAsText(file);
        } else if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setReferenceImage(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        } else {
            setError('Please upload a valid text or image file.');
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
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
            event.preventDefault();
            processFile(file);
        }
    };

    const handleGeneration = async () => {
        if (!textContent && !referenceImage) {
            setError('Please provide some text or an image to generate an infographic.');
            return;
        }

        setLoading(true);
        setError(null);
        setGeneratedData(null);

        try {
            const result = await generateInfographicContent({ 
                textContent, 
                imageDataUri: referenceImage || undefined 
            });
            setGeneratedData(result);
        } catch (e: any) {
            setError(e.message || 'An unexpected error occurred during generation.');
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = () => {
        toast({
            title: "Coming Soon!",
            description: "PDF download functionality is currently under development.",
        });
    };
    
    const resetState = () => {
        setGeneratedData(null); 
        setTextContent(''); 
        setReferenceImage(null);
        setError(null);
    };

    if (loading || generatedData) {
        return (
            <div className="w-full max-w-4xl mx-auto">
                 <Card className="bg-gray-900/50 border-gray-800 animate-in fade-in-50">
                    <CardHeader>
                        <CardTitle>Your Generated Infographic</CardTitle>
                        <CardDescription>
                           Review the AI-generated content below.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="space-y-6 p-8 border border-dashed border-gray-700 rounded-lg">
                                <Skeleton className="h-8 w-3/4 mx-auto" />
                                <Skeleton className="h-4 w-full mx-auto" />
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="flex flex-col items-center text-center gap-2">
                                            <Skeleton className="w-12 h-12 rounded-full" />
                                            <Skeleton className="h-6 w-24" />
                                            <Skeleton className="h-4 w-40" />
                                            <Skeleton className="h-4 w-32" />
                                        </div>
                                    ))}
                                </div>
                                <Skeleton className="h-20 w-full" />
                            </div>
                        ) : (
                            generatedData && (
                                <div ref={infographicRef} className="bg-background p-8 rounded-lg border border-primary/20 poster-gradient">
                                    <div className="text-center mb-12">
                                        <h2 className="text-4xl font-black text-primary tracking-tight uppercase">{generatedData.title}</h2>
                                        <p className="text-lg text-white/80 mt-2">{generatedData.subtitle}</p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                                        {generatedData.keyPoints.map((point, index) => (
                                            <div key={index} className="flex flex-col items-center text-center">
                                                <div className="flex items-center justify-center size-16 bg-primary/10 border-2 border-primary/30 rounded-full mb-4">
                                                    <DynamicIcon name={point.icon} className="text-primary size-8"/>
                                                </div>
                                                <h3 className="text-xl font-bold text-white">{point.title}</h3>
                                                <p className="text-white/70">{point.description}</p>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="bg-black/20 p-6 rounded-lg border border-white/10">
                                         <h3 className="font-bold text-lg text-primary mb-2">In Summary</h3>
                                         <p className="text-white/80 leading-relaxed">{generatedData.summary}</p>
                                    </div>
                                </div>
                            )
                        )}
                    </CardContent>
                    {generatedData && (
                        <div className="p-6 pt-0 space-y-2">
                             <Button onClick={handleDownload} className="w-full">
                                <Download className="mr-2"/>
                                Download as PDF (Coming Soon)
                            </Button>
                            <Button variant="outline" onClick={resetState} className="w-full">Start Over</Button>
                        </div>
                    )}
                </Card>
            </div>
        )
    }

    return (
        <div className="w-full max-w-3xl mx-auto space-y-4">
            <div className="text-center">
                <div className="inline-flex items-center justify-center gap-2 mb-2 bg-primary/10 text-primary p-3 rounded-full border border-primary/20">
                  <ImageIcon className="w-6 h-6" />
                </div>
                <h1 className="text-3xl font-bold tracking-tight">Infographics Lab</h1>
                <p className="text-muted-foreground mt-1">Transform content into a shareable infographic.</p>
            </div>

            {error && (
                <div className="p-3 bg-destructive/20 border border-destructive/50 text-destructive-foreground rounded-xl flex items-start gap-2 text-sm">
                    <AlertTriangle className="h-5 w-5 mt-0.5 flex-shrink-0"/>
                    <p>{error}</p>
                </div>
            )}
            
            <div
                className="w-full flex flex-col justify-end"
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                onPaste={handlePaste}
            >
                <div className="p-3 bg-[#1f1f1f] border border-gray-700/50 rounded-3xl w-full">
                    <div className="flex flex-col">
                        <div className="flex-grow"></div>
                        <div>
                            {referenceImage && (
                                <div className="relative w-20 h-20 mb-2">
                                    <NextImage src={referenceImage} alt="Reference" layout="fill" objectFit="contain" className="rounded-md" />
                                    <Button
                                        variant="destructive"
                                        size="icon"
                                        className="absolute -top-2 -right-2 h-6 w-6 rounded-full z-10"
                                        onClick={() => setReferenceImage(null)}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            )}
                            <div className="flex items-end gap-2">
                                <Button variant="ghost" size="icon" className="text-muted-foreground hover:bg-gray-700/50 rounded-full h-9 w-9" onClick={() => fileInputRef.current?.click()}>
                                    <Plus className="w-5 h-5" />
                                </Button>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                    className="hidden"
                                    accept="text/*,.md,image/*"
                                />
                                <Textarea
                                    placeholder="Enter a topic, paste content, or drop a file to generate an infographic..."
                                    value={textContent}
                                    onChange={handleTextChange}
                                    className="flex-1 bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0 text-white/90 text-base resize-none py-2.5 custom-scrollbar"
                                    disabled={loading}
                                    rows={1}
                                />
                                <Button onClick={handleGeneration} disabled={(!textContent && !referenceImage) || loading} className="bg-primary hover:bg-primary/90 text-black rounded-full p-3 h-auto w-auto disabled:bg-gray-600 disabled:cursor-not-allowed">
                                    {loading ? <Loader2 className="animate-spin w-5 h-5" /> : <Send className="w-5 h-5" />}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <p className="text-xs text-center text-muted-foreground">Architect AI is experimental and can make mistakes.</p>
        </div>
    );
}
