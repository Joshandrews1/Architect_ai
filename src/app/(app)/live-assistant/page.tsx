
'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Phone, Mic, MicOff, PhoneOff, Bot, Loader2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import placeholderImages from "@/lib/placeholder-images.json";
import { cn } from '@/lib/utils';
import type { Content } from 'firebase/ai';

export default function LiveAssistantPage() {
    const assistantAvatar = placeholderImages.placeholderImages.find(p => p.id === "live-assistant-avatar")!;
    const [callStatus, setCallStatus] = useState<'idle' | 'connecting' | 'active' | 'ended'>('idle');
    const [isMicActive, setIsMicActive] = useState(true);
    
    const [isAgentSpeaking, setIsAgentSpeaking] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [audioUrl, setAudioUrl] = useState<string | null>(null);
    const [messages, setMessages] = useState<Content[]>([]);
    const [interimTranscript, setInterimTranscript] = useState('');
    const [isListening, setIsListening] = useState(false);

    const audioRef = useRef<HTMLAudioElement>(null);
    const recognitionRef = useRef<any>(null);

    const handleSpeechResult = async (finalTranscript: string) => {
        if (!finalTranscript.trim()) return;

        if (recognitionRef.current) {
            recognitionRef.current.stop();
        }

        const newUserMessage: Content = { role: 'user', parts: [{ text: finalTranscript }] };
        const newHistory = [...messages, newUserMessage];
        
        setMessages(newHistory);
        setInterimTranscript('');
        setIsGenerating(true);

        try {
            const response = await fetch('/api/live-assistant/conversation', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ history: newHistory }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'API call failed');
            }

            const { text, audioUrl: newAudioUrl } = await response.json();
            
            const newAiMessage: Content = { role: 'model', parts: [{ text }] };
            setMessages(prev => [...prev, newAiMessage]);
            setAudioUrl(newAudioUrl);

        } catch (error) {
            console.error("Live assistant error:", error);
            const errorMsg: Content = { role: 'model', parts: [{ text: "I'm sorry, I encountered an error. Please try again." }] };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setIsGenerating(false);
        }
    };
    
    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            console.error("Speech Recognition API not supported by this browser.");
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';
        recognitionRef.current = recognition;

        recognition.onresult = (event: any) => {
            let final = '';
            let interim = '';
            for (let i = event.resultIndex; i < event.results.length; i++) {
                const transcriptPart = event.results[i][0].transcript;
                if (event.results[i].isFinal) {
                    final += transcriptPart;
                } else {
                    interim += transcriptPart;
                }
            }
            setInterimTranscript(interim);
            if (final) {
                handleSpeechResult(final);
            }
        };
        
        recognition.onerror = (event: any) => {
            console.error("Speech recognition error", event.error);
        };
        
        recognition.onstart = () => {
            setIsListening(true);
        };
        
        recognition.onend = () => {
            setIsListening(false);
        };

        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    // This effect controls the speech recognition based on component state
    useEffect(() => {
        const recognition = recognitionRef.current;
        if (!recognition) return;

        const shouldBeListening = callStatus === 'active' && isMicActive && !isAgentSpeaking && !isGenerating;

        if (shouldBeListening && !isListening) {
            recognition.start();
        } else if (!shouldBeListening && isListening) {
            recognition.stop();
        }

    }, [callStatus, isMicActive, isAgentSpeaking, isGenerating, isListening]);


    const startCall = async () => {
        setCallStatus('connecting');
        setIsGenerating(true);
        setMessages([]);

        try {
            const response = await fetch('/api/live-assistant/conversation', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ history: [] }), // Empty history triggers greeting
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to generate greeting');
            }

            const { text, audioUrl: greetingAudio } = await response.json();
            setMessages([{ role: 'model', parts: [{ text }] }]);
            setAudioUrl(greetingAudio);
            setCallStatus('active');
        } catch (error) {
            console.error("Failed to start call:", error);
            setCallStatus('ended');
        } finally {
            setIsGenerating(false);
        }
    };

    const handleEndCall = () => {
        if(audioRef.current) {
            audioRef.current.pause();
            setAudioUrl(null);
        }
        if (recognitionRef.current) {
            recognitionRef.current.stop();
        }
        setIsAgentSpeaking(false);
        setCallStatus('ended');
        setTimeout(() => {
            setCallStatus('idle');
            setMessages([]);
            setInterimTranscript('');
        }, 2000);
    };

    useEffect(() => {
        if (audioUrl && audioRef.current) {
            audioRef.current.play().catch(e => console.error("Audio playback failed:", e));
        }
    }, [audioUrl]);

    const handleAudioStateChange = () => {
        if (!audioRef.current) return;
        setIsAgentSpeaking(!audioRef.current.paused);
    };

    const getStatusText = () => {
        if (callStatus === 'connecting' || isGenerating) return "Agent is thinking...";
        if (isAgentSpeaking) return "Agent is speaking...";
        if (!isMicActive) return "Mic is muted";
        return "Listening...";
    }

    return (
        <div className="w-full max-w-2xl mx-auto space-y-8 animate-in fade-in-50">
            <div>
                <div className="flex items-center gap-2 mb-2">
                    <Phone className="w-8 h-8 text-primary" />
                    <h1 className="text-3xl font-bold tracking-tight">Live Assistant</h1>
                </div>
                <p className="text-muted-foreground">
                    Connect with a Sovereign Growth Specialist for a real-time voice conversation. Get instant answers and expert guidance.
                </p>
            </div>

            <Card className="bg-gray-900/50 border-gray-800">
                <CardContent className="p-6 min-h-[400px] flex items-center justify-center">
                    <audio 
                        ref={audioRef} 
                        src={audioUrl || undefined} 
                        className="hidden"
                        onPlay={handleAudioStateChange}
                        onPlaying={handleAudioStateChange}
                        onPause={handleAudioStateChange}
                        onEnded={handleAudioStateChange}
                    />
                    {callStatus === 'idle' && (
                        <div className="text-center space-y-4">
                            <p className="text-muted-foreground">Ready to connect?</p>
                            <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white rounded-full px-8 py-6 text-lg" onClick={startCall}>
                                <Phone className="w-6 h-6 mr-2" />
                                Start Voice Call
                            </Button>
                        </div>
                    )}

                    {callStatus === 'connecting' && (
                        <div className="text-center space-y-4 flex flex-col items-center">
                            <Avatar className="w-32 h-32 border-4 border-primary/50 relative flex items-center justify-center">
                                <Loader2 className="w-16 h-16 text-primary animate-spin" />
                            </Avatar>
                            <p className="text-xl font-semibold text-primary animate-pulse">Connecting...</p>
                            <p className="text-muted-foreground">Please wait while we connect you to a specialist.</p>
                        </div>
                    )}
                    
                    {callStatus === 'ended' && (
                        <div className="text-center space-y-4 flex flex-col items-center">
                            <Avatar className="w-32 h-32 border-4 border-red-500">
                                <AvatarImage src={assistantAvatar.imageUrl} alt={assistantAvatar.description} />
                                <AvatarFallback><Bot /></AvatarFallback>
                            </Avatar>
                            <p className="text-xl font-semibold text-red-500">Call Ended</p>
                        </div>
                    )}

                    {callStatus === 'active' && (
                        <div className="text-center space-y-6 flex flex-col items-center w-full">
                             <Avatar className={cn(
                                "w-32 h-32 border-4 transition-all duration-300",
                                isAgentSpeaking ? "border-accent shadow-[0_0_25px_hsl(var(--accent))]" : "border-green-500",
                                isGenerating && "animate-pulse"
                            )}>
                                <AvatarImage src={assistantAvatar.imageUrl} alt={assistantAvatar.description} />
                                <AvatarFallback><Bot /></AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="text-2xl font-bold">Connected with Joshua</p>
                                <p className={cn(
                                    "text-muted-foreground transition-colors",
                                    isAgentSpeaking && "text-accent animate-pulse"
                                )}>
                                    {getStatusText()}
                                </p>
                            </div>
                            <div className="h-12 flex items-center justify-center text-center">
                                <p className="text-lg text-white/80 italic">
                                    {interimTranscript}
                                </p>
                            </div>
                            <div className="flex items-center justify-center gap-4">
                                <Button size="icon" className={cn("rounded-full w-16 h-16", !isMicActive ? "bg-gray-600" : "bg-blue-600 hover:bg-blue-700")} onClick={() => setIsMicActive(!isMicActive)}>
                                    {!isMicActive ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
                                </Button>
                                <Button size="icon" className="rounded-full w-16 h-16 bg-red-600 hover:bg-red-700" onClick={handleEndCall}>
                                    <PhoneOff className="w-8 h-8" />
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
