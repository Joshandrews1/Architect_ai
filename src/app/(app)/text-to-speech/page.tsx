
'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { useUser } from '@/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Code, Copy, FilePenLine, SlidersHorizontal, User, Users, ChevronUp, ChevronDown, PlusCircle, Play, Pause, Download, RefreshCw, Loader2, Volume2, History, Trash2, AlertTriangle } from 'lucide-react';
import { generateSpeech } from '@/ai/flows/tts-flow';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from '@/components/ui/sheet';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from "@/components/ui/checkbox";

const availableVoices = [
    { name: 'Algenib', description: 'Calm, authoritative' },
    { name: 'Achird', description: 'Clear, youthful' },
    { name: 'Algieba', description: 'Warm, engaging' },
    { name: 'Alnilam', description: 'Deep, resonant' },
    { name: 'Aoede', description: 'Light, melodic' },
    { name: 'Autonoe', description: 'Smooth, professional' },
    { name: 'Callirrhoe', description: 'Bright, energetic' },
    { name: 'Despina', description: 'Gentle, soothing' },
    { name: 'Enceladus', description: 'Strong, direct' },
    { name: 'Erinome', description: 'Crisp, formal' },
    { name: 'Gacrux', description: 'Steady, trustworthy' },
    { name: 'Iapetus', description: 'Rich, expressive' },
    { name: 'Kale', description: 'Pleasant, neutral' },
    { name: 'Laomedeia', description: 'Elegant, refined' },
    { name: 'Leda', description: 'Soft, conversational' },
    { name: 'Orus', description: 'Bold, commanding' },
    { name: 'Puck', description: 'Playful, whimsical' },
    { name: 'Pulcherrima', description: 'Warm, friendly' },
    { name: 'Rasalgethi', description: 'Deep, thoughtful' },
    { name: 'Salacia', description: 'Clear, articulate' },
    { name: 'Sadaltager', description: 'Mature, reassuring' },
    { name: 'Schedar', description: 'Bright, cheerful' },
    { name: 'Sulafat', description: 'Gravelly, wise' },
    { name: 'Umbriel', description: 'Mysterious, low-pitched' },
    { name: 'Vindemiatrix', description: 'Sharp, professional' },
    { name: 'Zubenelgenubi', description: 'Unique, resonant' },
];

const speakerUiConfig = [
    { colorClass: 'primary', borderColor: 'border-primary', bgColor: 'bg-primary' },
    { colorClass: 'purple-500', borderColor: 'border-purple-500', bgColor: 'bg-purple-500' },
    { colorClass: 'pink-500', borderColor: 'border-pink-500', bgColor: 'bg-pink-500' },
    { colorClass: 'blue-500', borderColor: 'border-blue-500', bgColor: 'bg-blue-500' },
    { colorClass: 'orange-500', borderColor: 'border-orange-500', bgColor: 'bg-orange-500' },
    { colorClass: 'green-500', borderColor: 'border-green-500', bgColor: 'bg-green-500' },
    { colorClass: 'teal-500', borderColor: 'border-teal-500', bgColor: 'bg-teal-500' },
    { colorClass: 'red-500', borderColor: 'border-red-500', bgColor: 'bg-red-500' },
];

type Speaker = {
    id: number;
    name: string;
    voice: string;
    text: string;
    pitch: number;
    speed: number;
};

type GenerationConfig = {
    speakers: Speaker[];
    mode: 'single-speaker' | 'multi-speaker';
    styleInstructions: string;
};

type Generation = {
    id: number;
    audioUrl: string;
    config: GenerationConfig;
};

const SoundWave = () => (
    <div className="sound-wave flex items-center justify-center gap-0.5 w-24 h-6">
      <div style={{ animationDelay: '0s' }} className="w-1 h-full bg-black/80 rounded-full origin-center"></div>
      <div style={{ animationDelay: '0.1s' }} className="w-1 h-full bg-black/80 rounded-full origin-center"></div>
      <div style={{ animationDelay: '0.2s' }} className="w-1 h-full bg-black/80 rounded-full origin-center"></div>
      <div style={{ animationDelay: '0.3s' }} className="w-1 h-full bg-black/80 rounded-full origin-center"></div>
      <div style={{ animationDelay: '0.4s' }} className="w-1 h-full bg-black/80 rounded-full origin-center"></div>
      <div style={{ animationDelay: '0.5s' }} className="w-1 h-full bg-black/80 rounded-full origin-center"></div>
      <div style={{ animationDelay: '0.6s' }} className="w-1 h-full bg-black/80 rounded-full origin-center"></div>
      <div style={{ animationDelay: '0.7s' }} className="w-1 h-full bg-black/80 rounded-full origin-center"></div>
      <div style={{ animationDelay: '0.8s' }} className="w-1 h-full bg-black/80 rounded-full origin-center"></div>
      <div style={{ animationDelay: '0.9s' }} className="w-1 h-full bg-black/80 rounded-full origin-center"></div>
    </div>
);


const AudioHistoryPlayer = ({
    generation,
    index,
    onPlay,
    currentlyPlayingId,
}: {
    generation: Generation;
    index: number;
    onPlay: (id: number | null) => void;
    currentlyPlayingId: number | null;
}) => {
    const audioRef = useRef<HTMLAudioElement>(null);
    const isPlaying = currentlyPlayingId === generation.id;

    useEffect(() => {
        const audioElement = audioRef.current;
        if (!audioElement) return;
    
        if (isPlaying) {
            audioElement.play().catch(e => {
                console.error("Audio playback error:", e);
                onPlay(null); // Reset state if play fails
            });
        } else {
            audioElement.pause();
        }

        const handleCanPlay = () => {
            if (isPlaying) {
                audioElement.play().catch(e => console.error("Error playing on canplay", e));
            }
        };

        audioElement.addEventListener('canplay', handleCanPlay);
        return () => audioElement.removeEventListener('canplay', handleCanPlay);
    }, [isPlaying, onPlay]);
    
    const handlePlayClick = () => {
        onPlay(isPlaying ? null : generation.id);
    };

    return (
        <div className="bg-surface-dark/50 p-4 rounded-lg border border-border-dark flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex-1">
                <p className="font-bold text-white">Take {index}</p>
                <p className="text-xs text-muted-foreground truncate max-w-xs">
                    {generation.config.mode === 'single-speaker' 
                        ? generation.config.speakers[0].voice 
                        : generation.config.speakers.map(s => s.voice).join(', ')}
                </p>
            </div>
            <div className="bg-primary text-black px-2 py-2 rounded-2xl flex items-center gap-2 shadow-2xl w-full sm:w-auto justify-between">
                <Button onClick={handlePlayClick} size="icon" variant="ghost" className="hover:bg-black/10 h-8 w-8">
                    {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                </Button>
                <div className="w-px h-8 bg-black/20"></div>
                {isPlaying ? (
                    <SoundWave />
                ) : (
                    <div className="w-24 h-6 flex items-center justify-center">
                        <p className="text-sm font-bold uppercase tracking-wider">Ready</p>
                    </div>
                )}
                <div className="w-px h-8 bg-black/20"></div>
                <Button asChild size="icon" variant="ghost" className="hover:bg-black/10 h-8 w-8">
                    <a href={generation.audioUrl} download={`architect-ai-speech-take-${index}.wav`}>
                        <Download className="w-6 h-6" />
                    </a>
                </Button>
            </div>
            <audio ref={audioRef} src={generation.audioUrl} onEnded={() => onPlay(null)} className="hidden" preload="auto" />
        </div>
    );
};


export default function TextToSpeechPage() {
    const { user, isUserLoading } = useUser();
    const { toast } = useToast();

    const [speakers, setSpeakers] = useState<Speaker[]>([
        { id: 1, name: 'Alnilam', voice: 'Alnilam', text: "Hello! We're excited to show you our native speech capabilities.", pitch: 0, speed: 1.15 },
        { id: 2, name: 'Aoede', voice: 'Aoede', text: "Where you can direct a voice, create realistic dialog, and so much more. Edit these placeholders to get started.", pitch: 0, speed: 1.15 },
    ]);
    const [styleInstructions, setStyleInstructions] = useState('Read aloud in a warm, welcoming tone');
    const [mode, setMode] = useState<'single-speaker' | 'multi-speaker'>('multi-speaker');
    const [openSettings, setOpenSettings] = useState<{[key: string]: boolean}>({'1': true, '2': false, model: true});
    const [isConfigSheetOpen, setConfigSheetOpen] = useState(false);

    const [isVoiceDialogOpen, setVoiceDialogOpen] = useState(false);
    const [isHistoryDialogOpen, setHistoryDialogOpen] = useState(false);
    const [editingSpeakerId, setEditingSpeakerId] = useState<number | null>(null);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    const [generationHistory, setGenerationHistory] = useState<Generation[]>([]);
    const [historyLoaded, setHistoryLoaded] = useState(false);
    const [currentlyPlayingId, setCurrentlyPlayingId] = useState<number | null>(null);
    const [lastGeneratedConfig, setLastGeneratedConfig] = useState<GenerationConfig | null>(null);
    const [showLatestInPlayer, setShowLatestInPlayer] = useState(false);

    const [isDeleteMode, setIsDeleteMode] = useState(false);
    const [selectedToDelete, setSelectedToDelete] = useState<number[]>([]);

    // Load history from localStorage
    useEffect(() => {
        if (isUserLoading || typeof window === 'undefined') {
            return;
        }
    
        const historyKey = user ? `tts-history-${user.uid}` : 'tts-history-guest';
        
        try {
            const savedHistory = window.localStorage.getItem(historyKey);
            if (savedHistory) {
                const parsedHistory = JSON.parse(savedHistory);
                if (Array.isArray(parsedHistory)) {
                    setGenerationHistory(parsedHistory);
                }
            }
        } catch (err) {
            console.error("Error reading generation history from localStorage", err);
        }
        
        setHistoryLoaded(true);
    }, [user, isUserLoading]);

    // Save history to localStorage
    useEffect(() => {
        if (!historyLoaded || typeof window === 'undefined') {
            return;
        }
    
        const historyKey = user ? `tts-history-${user.uid}` : 'tts-history-guest';
        try {
            window.localStorage.setItem(historyKey, JSON.stringify(generationHistory));
        } catch (err) {
            console.error("Error saving generation history to localStorage", err);
        }
    }, [generationHistory, historyLoaded, user]);

    const [previewLoading, setPreviewLoading] = useState<{[key: string]: boolean}>({});
    const previewAudioRef = useRef<HTMLAudioElement | null>(null);
    const [playingVoice, setPlayingVoice] = useState<string | null>(null);
    
    const latestAudioRef = useRef<HTMLAudioElement>(null);
    const latestGeneration = showLatestInPlayer ? generationHistory[0] : null;
    const isPlayingLatest = latestGeneration && currentlyPlayingId === latestGeneration.id;

    useEffect(() => {
        const audioElement = latestAudioRef.current;
        if (!audioElement) return;

        if (isPlayingLatest) {
            audioElement.play().catch(e => {
                console.error("Audio playback error:", e);
                setCurrentlyPlayingId(null);
            });
        } else {
            audioElement.pause();
        }
    }, [isPlayingLatest]);

    const handleLatestPlayClick = () => {
        if (!latestGeneration) return;
        setCurrentlyPlayingId(isPlayingLatest ? null : latestGeneration.id);
    };

    const scriptForApi = useMemo(() => {
        let script = '';
        if (styleInstructions) {
            script += styleInstructions + '\n\n';
        }
        if (mode === 'single-speaker') {
            script += speakers[0]?.text || '';
        } else {
            script += speakers.map((s, i) => `Speaker${i + 1}: ${s.text}`).join('\n');
        }
        return script;
    }, [speakers, mode, styleInstructions]);

    const hasChanges = useMemo(() => {
        if (!lastGeneratedConfig) {
            return true;
        }
        const currentConfig = { speakers, mode, styleInstructions };
        return JSON.stringify(currentConfig) !== JSON.stringify(lastGeneratedConfig);
    }, [speakers, mode, styleInstructions, lastGeneratedConfig]);

    const handleModeChange = (newMode: 'single-speaker' | 'multi-speaker') => {
        setMode(newMode);
        if (newMode === 'single-speaker') {
            // Keep the first speaker's text if it exists, otherwise provide a default.
            const firstSpeaker = speakers[0] || { id: 1, name: 'Alnilam', voice: 'Alnilam', text: "Hello! Edit this text to get started.", pitch: 0, speed: 1.15 };
            setSpeakers([firstSpeaker]);
        } else { // newMode is 'multi-speaker'
            setSpeakers(prev => {
                if (prev.length < 2) {
                    const existingSpeaker = prev[0] || { id: 1, name: 'Alnilam', voice: 'Alnilam', text: "Hello! We're excited to show you our native speech capabilities.", pitch: 0, speed: 1.15 };
                    const newId = prev.length > 0 ? Math.max(...prev.map(s => s.id)) + 1 : 2;
                    return [
                        existingSpeaker,
                        { id: newId, name: 'Aoede', voice: 'Aoede', text: "Where you can direct a voice, create realistic dialog, and so much more.", pitch: 0, speed: 1.15 }
                    ];
                }
                return prev;
            });
        }
    };

    const handleAddSpeaker = () => {
        const newId = speakers.length > 0 ? Math.max(...speakers.map(s => s.id)) + 1 : 1;
        setSpeakers([...speakers, { id: newId, name: `Algenib`, voice: 'Algenib', text: '', pitch: 0, speed: 1.15 }]);
    };
    
    const handleRemoveSpeaker = (idToRemove: number) => {
        setSpeakers(prev => prev.filter(speaker => speaker.id !== idToRemove));
    };

    const handleSpeakerChange = (id: number, field: keyof Speaker, value: string | number) => {
        setSpeakers(speakers.map(s => {
            if (s.id === id) {
                const newSpeaker = { ...s, [field]: value };
                if (field === 'voice') {
                    newSpeaker.name = value as string;
                }
                return newSpeaker;
            }
            return s;
        }));
    };

    const handleGenerate = async () => {
        if (!scriptForApi.trim()) {
            toast({
                variant: 'destructive',
                title: "Empty Script",
                description: "Please write something to generate audio.",
            });
            return;
        }

        if (!hasChanges) {
            toast({
                title: "No Changes Detected",
                description: "Modify the script, voice, or settings to generate new audio.",
            });
            return;
        }

        setLoading(true);
        setError(null);
        setCurrentlyPlayingId(null);

        try {
            const result = await generateSpeech({
                script: scriptForApi,
                mode: mode,
                speakerConfigs: mode === 'multi-speaker' 
                    ? speakers.map((s, i) => ({ 
                        speaker: `Speaker${i + 1}`, 
                        voice: s.voice,
                        pitch: s.pitch,
                        speed: s.speed,
                      })) 
                    : undefined,
                singleVoice: mode === 'single-speaker' && speakers[0] ? speakers[0].voice : undefined,
                pitch: mode === 'single-speaker' && speakers[0] ? speakers[0].pitch : undefined,
                speed: mode === 'single-speaker' && speakers[0] ? speakers[0].speed : undefined,
            });
            
            const currentConfig = { speakers, mode, styleInstructions };
            const newGeneration: Generation = {
                id: Date.now(),
                audioUrl: result.audioUrl,
                config: currentConfig,
            };

            setGenerationHistory(prev => [newGeneration, ...prev]);
            setLastGeneratedConfig(currentConfig);
            setShowLatestInPlayer(true);
        } catch (e: any) {
            setError(e.message || "An unexpected error occurred during audio generation.");
        } finally {
            setLoading(false);
        }
    };
    
    const handleRegenerate = () => {
        handleGenerate();
    }

    const handlePreviewVoice = async (voiceName: string) => {
        const audio = previewAudioRef.current;
        if (!audio) return;
    
        if (!audio.paused) {
            audio.pause();
            if (playingVoice === voiceName) {
                setPlayingVoice(null);
                return;
            }
        }
    
        try {
            await audio.play();
            audio.pause();
        } catch {}
    
        setPreviewLoading(prev => ({ ...prev, [voiceName]: true }));
        setPlayingVoice(voiceName);
    
        try {
            const result = await generateSpeech({
                script: "Hello, this is a preview of my voice.",
                mode: 'single-speaker',
                singleVoice: voiceName,
            });
            
            if (audio) {
                audio.src = result.audioUrl;
                audio.play().catch(e => {
                    console.error("Audio playback failed:", e);
                    toast({
                        variant: "destructive",
                        title: "Playback Error",
                        description: "Could not play audio. Your browser may have blocked it.",
                    });
                    setPlayingVoice(null);
                });
            }
    
        } catch (err: any) {
            toast({
                variant: "destructive",
                title: "Voice Preview Failed",
                description: err.message || "Could not generate voice preview.",
            });
            setPlayingVoice(null);
        } finally {
             setPreviewLoading(prev => ({ ...prev, [voiceName]: false }));
        }
    };

    const handleToggleSelection = (id: number) => {
        setSelectedToDelete(prev =>
            prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
        );
    };

    const handleDeleteSelected = () => {
        const numDeleted = selectedToDelete.length;
        
        if (currentlyPlayingId && selectedToDelete.includes(currentlyPlayingId)) {
            setCurrentlyPlayingId(null);
        }
        
        if (latestGeneration && selectedToDelete.includes(latestGeneration.id)) {
            setShowLatestInPlayer(false);
        }
        
        setGenerationHistory(prev => prev.filter(gen => !selectedToDelete.includes(gen.id)));
        
        setSelectedToDelete([]);
        setIsDeleteMode(false);
        toast({
            title: `${numDeleted} take(s) deleted.`,
            description: 'Your history has been updated.',
        });
    };
    
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            e.preventDefault();
            handleGenerate();
        }
    };

    const CoreSettingsUI = (
        <div className="space-y-4">
             <div className="space-y-4">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Mode</Label>
                    <div className="grid grid-cols-2 gap-2">
                    <button onClick={() => handleModeChange('single-speaker')} className={cn("flex flex-col items-center gap-2 p-4 border bg-background-dark rounded hover:border-primary transition-all", mode === 'single-speaker' ? 'border-primary bg-primary/5' : 'border-border-dark' )}>
                        <User className={cn("text-slate-400", mode === 'single-speaker' && 'text-primary')} />
                        <span className={cn("text-[9px] font-bold uppercase", mode === 'single-speaker' && 'text-primary')}>Single-speaker</span>
                    </button>
                    <button onClick={() => handleModeChange('multi-speaker')} className={cn("flex flex-col items-center gap-2 p-4 border bg-background-dark rounded hover:border-primary transition-all", mode === 'multi-speaker' ? 'border-primary bg-primary/5' : 'border-border-dark' )}>
                        <Users className={cn("text-slate-400", mode === 'multi-speaker' && 'text-primary')} />
                        <span className={cn("text-[9px] font-bold uppercase", mode === 'multi-speaker' && 'text-primary')}>Multi-speaker</span>
                    </button>
                </div>
            </div>

            {mode === 'multi-speaker' ? (
                speakers.map((speaker, index) => {
                    const config = speakerUiConfig[index % speakerUiConfig.length];
                    const isOpen = !!openSettings[speaker.id];
                    return (
                    <div key={speaker.id} className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className={cn("w-1.5 h-1.5 rounded-full", config.bgColor)}></div>
                                <span className="text-[10px] font-bold uppercase tracking-widest">Speaker {index + 1} Settings</span>
                            </div>
                            <button onClick={() => setOpenSettings(s => ({...s, [speaker.id]: !isOpen}))}>
                                {isOpen ? <ChevronUp className="text-sm text-slate-500 cursor-pointer" /> : <ChevronDown className="text-sm text-slate-500 cursor-pointer" />}
                            </button>
                        </div>
                        {isOpen && (
                        <div className="space-y-4 pl-3.5 border-l border-border-dark">
                            <div className="space-y-1">
                                <Label className="text-[9px] font-mono text-slate-500 uppercase">Voice Profile</Label>
                                <div className="flex items-center justify-between p-2 rounded-md border border-border-dark bg-background-dark">
                                    <span className="text-sm">{speaker.voice}</span>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => {
                                            setEditingSpeakerId(speaker.id);
                                            setVoiceDialogOpen(true);
                                        }}
                                    >
                                        Change
                                    </Button>
                                </div>
                            </div>
                        </div>
                        )}
                    </div>
                )})
            ) : (
                speakers.length > 0 && (
                    <div className="space-y-4">
                    {openSettings.model && (
                    <div className="space-y-4">
                        <div className="space-y-1">
                            <Label className="text-[9px] font-mono text-slate-500 uppercase">Voice</Label>
                            <div className="flex items-center justify-between p-2 rounded-md border border-border-dark bg-background-dark">
                                <span className="text-sm">{speakers[0].voice}</span>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => {
                                            setEditingSpeakerId(speakers[0].id);
                                            setVoiceDialogOpen(true);
                                        }}
                                    >
                                        Change
                                    </Button>
                            </div>
                        </div>
                        <div className="space-y-1">
                            <div className="flex justify-between">
                                <Label className="text-[9px] font-mono text-slate-500 uppercase">Pitch</Label>
                                <span className="text-[9px] font-mono text-primary">{speakers[0].pitch >= 0 ? '+' : ''}{speakers[0].pitch.toFixed(1)}</span>
                            </div>
                            <input className="w-full h-1 bg-border-dark rounded-lg appearance-none cursor-pointer accent-primary" type="range" min="-4" max="4" step="0.5" value={speakers[0].pitch} onChange={(e) => handleSpeakerChange(speakers[0].id, 'pitch', parseFloat(e.target.value))} />
                        </div>
                        <div className="space-y-1">
                            <div className="flex justify-between">
                                <Label className="text-[9px] font-mono text-slate-500 uppercase">Speed</Label>
                                <span className="text-[9px] font-mono text-primary">{speakers[0].speed.toFixed(2)}x</span>
                            </div>
                            <input className="w-full h-1 bg-border-dark rounded-lg appearance-none cursor-pointer accent-primary" type="range" min="0.5" max="2" step="0.05" value={speakers[0].speed} onChange={(e) => handleSpeakerChange(speakers[0].id, 'speed', parseFloat(e.target.value))} />
                        </div>
                    </div>
                    )}
                </div>
                )
            )}
        </div>
    );
    
    const historyToDisplay = showLatestInPlayer ? generationHistory.slice(1, 4) : generationHistory.slice(0, 3);

    return (
        <Dialog open={isVoiceDialogOpen || isHistoryDialogOpen} onOpenChange={(isOpen) => {
            if (!isOpen) {
                setVoiceDialogOpen(false);
                setHistoryDialogOpen(false);
                setIsDeleteMode(false);
                setSelectedToDelete([]);
            }
        }}>
            <Sheet open={isConfigSheetOpen} onOpenChange={setConfigSheetOpen}>
                <div className="flex flex-col h-full bg-background text-slate-100 font-display">
                <audio ref={previewAudioRef} onEnded={() => setPlayingVoice(null)} onError={() => setPlayingVoice(null)} className="hidden" preload="none" />
                {latestGeneration && <audio ref={latestAudioRef} src={latestGeneration.audioUrl} onEnded={() => setCurrentlyPlayingId(null)} className="hidden" preload="auto" />}

                    <main className="flex-1 flex overflow-hidden">
                        <aside className="hidden md:flex w-80 bg-surface-dark/50 border-r border-border-dark flex-col">
                            <div className="p-4 border-b border-border-dark flex items-center justify-between flex-shrink-0">
                                <div className="flex items-center gap-2">
                                    <Code className="text-sm text-accent" />
                                    <span className="text-xs font-bold uppercase tracking-widest">Raw Structure</span>
                                </div>
                                <button onClick={() => {
                                    navigator.clipboard.writeText(scriptForApi);
                                    toast({ title: 'Copied to clipboard!' });
                                }}>
                                    <Copy className="text-sm text-slate-400" />
                                </button>
                            </div>
                            <div className="p-6 text-sm overflow-y-auto flex-1">
                                <p className="mb-4 text-slate-500 text-xs">
                                    This shows what the AI will read.
                                </p>
                                <div className="p-4 rounded-md bg-black/30 space-y-2 text-slate-300 whitespace-pre-wrap text-sm">
                                    {scriptForApi}
                                </div>
                            </div>
                        </aside>

                        <section className="bg-background-dark flex-1 flex flex-col overflow-hidden">
                            <div className="p-4 border-b border-border-dark flex items-center justify-between flex-shrink-0">
                                <div className="flex items-center gap-2">
                                    <FilePenLine className="text-sm text-primary" />
                                    <span className="text-xs font-bold uppercase tracking-widest">Script builder</span>
                                </div>
                                <div className="flex items-center gap-2 md:hidden">
                                    <Button variant="ghost" size="icon" onClick={() => {
                                        navigator.clipboard.writeText(scriptForApi);
                                        toast({ title: 'Raw script copied!' });
                                    }} className="h-8 w-8">
                                        <Copy className="w-4 h-4" />
                                    </Button>
                                    <SheetTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                                            <SlidersHorizontal className="w-4 h-4" />
                                        </Button>
                                    </SheetTrigger>
                                </div>
                            </div>
                            <ScrollArea className="flex-1">
                                <div className="p-4 md:p-8 max-w-4xl mx-auto w-full space-y-8">
                                    <div className="space-y-2">
                                        <h3 className="text-sm text-muted-foreground font-medium">Style instructions</h3>
                                        <Textarea 
                                            className="w-full bg-transparent text-base leading-relaxed resize-none border-none focus-visible:ring-0 text-slate-300 p-0"
                                            placeholder="e.g., Read aloud in a warm, welcoming tone..."
                                            value={styleInstructions}
                                            onChange={(e) => setStyleInstructions(e.target.value)}
                                            onKeyDown={handleKeyDown}
                                            rows={1}
                                        />
                                    </div>
                                    <div className="space-y-6 pt-4">
                                        {speakers.map((speaker, index) => {
                                            const config = speakerUiConfig[index % speakerUiConfig.length];
                                            return (
                                            <div key={speaker.id} className="space-y-2">
                                                <div className="flex items-center justify-between">
                                                    <button
                                                        onClick={() => {
                                                            setEditingSpeakerId(speaker.id);
                                                            setVoiceDialogOpen(true);
                                                        }}
                                                        className="inline-flex items-center gap-2 rounded-full bg-gray-800/80 px-3 py-1 text-sm font-medium text-left hover:bg-gray-700/80 transition-colors"
                                                    >
                                                        <div className={cn("w-2 h-2 rounded-full", config.bgColor)} />
                                                        {mode === 'multi-speaker' ? `Speaker ${index + 1}`: 'Dialogue'}
                                                        <span className="text-[10px] text-slate-500 font-mono">({speaker.name})</span>
                                                        <ChevronDown className="w-4 h-4 text-slate-500" />
                                                    </button>
                                                    {mode === 'multi-speaker' && speakers.length > 1 && (
                                                        <Button variant="ghost" size="icon" onClick={() => handleRemoveSpeaker(speaker.id)} className="text-muted-foreground hover:text-destructive h-7 w-7">
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                    )}
                                                </div>

                                                <Textarea 
                                                    className="w-full bg-transparent text-base leading-relaxed resize-none border-none focus-visible:ring-0 text-slate-300 p-0" 
                                                    placeholder="Type dialogue here..." 
                                                    rows={mode === 'single-speaker' ? 5 : 2}
                                                    value={speaker.text}
                                                    onChange={(e) => handleSpeakerChange(speaker.id, 'text', e.target.value)}
                                                    onKeyDown={handleKeyDown}
                                                />
                                            </div>
                                        )})}
                                        {mode === 'multi-speaker' && (
                                            <Button variant="ghost" onClick={handleAddSpeaker} className="justify-start gap-2 text-muted-foreground hover:text-foreground">
                                                <PlusCircle className="w-5 h-5" />
                                                <span>Add dialog</span>
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </ScrollArea>
                        </section>

                        <aside className="hidden md:flex w-80 bg-surface-dark/50 flex-col border-l border-border-dark">
                            <div className="p-4 border-b border-border-dark flex items-center gap-2 flex-shrink-0">
                                <SlidersHorizontal className="text-sm text-primary" />
                                <span className="text-xs font-bold uppercase tracking-widest">System Config</span>
                            </div>
                            <ScrollArea className="flex-grow p-6">
                               {CoreSettingsUI}
                            </ScrollArea>
                        </aside>
                    </main>
                    <footer className="relative z-10 flex flex-col items-center justify-center flex-shrink-0 bg-background-dark/80 md:bg-transparent backdrop-blur-sm border-t border-border-dark/50">
                        {error && (
                            <div className="w-full max-w-4xl mx-auto px-6 pt-4">
                                <div className="p-3 bg-destructive/20 border border-destructive/50 text-destructive-foreground rounded-xl flex items-start gap-2 text-sm">
                                    <AlertTriangle className="h-5 w-5 mt-0.5 flex-shrink-0"/>
                                    <p>{error}</p>
                                </div>
                            </div>
                        )}
                        <div className="h-24 flex items-center justify-center w-full px-6">
                            {loading ? (
                                <Button disabled className="w-full sm:w-auto flex items-center gap-3 px-4 sm:px-8 py-3 bg-yellow-400 text-black rounded-xl font-bold uppercase tracking-tighter text-sm cursor-not-allowed opacity-50">
                                    <Loader2 className="animate-spin" />
                                    Generating...
                                </Button>
                            ) : !latestGeneration || !showLatestInPlayer ? (
                                <Button onClick={handleGenerate} className={cn("w-full sm:w-auto flex items-center gap-3 px-4 sm:px-8 py-3 bg-primary text-black rounded-xl hover:scale-105 active:scale-95 transition-all font-bold uppercase tracking-tighter text-sm", hasChanges && "animate-pulse")}>
                                    Generate Audio
                                    <Play className="text-lg"/>
                                </Button>
                            ) : (
                                <div className="bg-primary text-black px-2 py-2 rounded-2xl flex items-center gap-2 shadow-2xl">
                                    <Button onClick={handleLatestPlayClick} size="icon" variant="ghost" className="hover:bg-black/10 h-8 w-8">
                                        {isPlayingLatest ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                                    </Button>
                                    <div className="w-px h-8 bg-black/20"></div>
                                    {isPlayingLatest ? (
                                        <SoundWave />
                                    ) : (
                                        <div className="w-24 h-6 flex items-center justify-center">
                                            <p className="text-sm font-bold uppercase tracking-wider">Take {generationHistory.length}</p>
                                        </div>
                                    )}
                                    <div className="w-px h-8 bg-black/20"></div>
                                    <Button onClick={handleRegenerate} size="icon" variant="ghost" className={cn("hover:bg-black/10 h-8 w-8", hasChanges && "animate-pulse text-blue-600")}>
                                        <RefreshCw className="w-6 h-6" />
                                    </Button>
                                    <Button asChild size="icon" variant="ghost" className="hover:bg-black/10 h-8 w-8">
                                        <a href={latestGeneration.audioUrl} download={`architect-ai-speech-take-${generationHistory.length}.wav`}>
                                            <Download className="w-6 h-6" />
                                        </a>
                                    </Button>
                                </div>
                            )}
                        </div>
                        {generationHistory.length > 0 && (
                            <div className="w-full border-t border-border-dark p-4">
                                <div className="space-y-4 max-w-4xl mx-auto">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 py-2">
                                            <History className="text-primary"/>
                                            <h3 className="text-lg font-bold tracking-tight">Recent Takes</h3>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {generationHistory.length > 3 && (
                                                <Button variant="ghost" onClick={() => setHistoryDialogOpen(true)}>View All</Button>
                                            )}
                                            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive h-8 w-8" onClick={() => {
                                                setHistoryDialogOpen(true);
                                                setIsDeleteMode(true);
                                            }}>
                                                <Trash2 className="w-4 h-4" />
                                                <span className="sr-only">Delete history</span>
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        {historyToDisplay.map((gen) => {
                                            const historyIndex = generationHistory.findIndex(g => g.id === gen.id);
                                            return (
                                                <AudioHistoryPlayer
                                                    key={gen.id}
                                                    generation={gen}
                                                    index={generationHistory.length - historyIndex}
                                                    onPlay={(id) => {
                                                        if (id !== null && currentlyPlayingId !== id) {
                                                            setCurrentlyPlayingId(id);
                                                        } else {
                                                            setCurrentlyPlayingId(null);
                                                        }
                                                    }}
                                                    currentlyPlayingId={currentlyPlayingId}
                                                />
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        )}

                    </footer>
                </div>
                <SheetContent className="w-[85%] max-w-xs sm:max-w-sm bg-surface-dark/95 p-0 border-l border-border-dark backdrop-blur-md md:hidden flex flex-col">
                     <SheetHeader className="p-4 border-b border-border-dark text-left flex-shrink-0">
                        <div className="flex items-center gap-2">
                            <SlidersHorizontal className="text-sm text-primary" />
                        </div>
                    </SheetHeader>
                    <ScrollArea className="flex-grow p-6">
                        {CoreSettingsUI}
                    </ScrollArea>
                </SheetContent>
            </Sheet>

            <DialogContent className="sm:max-w-[625px]">
                {isHistoryDialogOpen ? (
                    <>
                        <DialogHeader>
                            <div className="flex justify-between items-center pr-8">
                                <DialogTitle>Full Generation History</DialogTitle>
                                {generationHistory.length > 0 && (
                                    <Button variant="outline" size="sm" onClick={() => {
                                        setIsDeleteMode(!isDeleteMode);
                                        setSelectedToDelete([]);
                                    }}>
                                        {isDeleteMode ? 'Cancel' : 'Select'}
                                    </Button>
                                )}
                            </div>
                            <DialogDescription>Review all your previously generated audio takes.</DialogDescription>
                        </DialogHeader>
                        <ScrollArea className="h-[60vh] -mx-6">
                            <div className="space-y-2 px-6 py-4">
                                {generationHistory.map((gen, i) => {
                                    const isLatest = latestGeneration && gen.id === latestGeneration.id;
                                    return (
                                        <div key={gen.id} className="flex items-center gap-4">
                                            {isDeleteMode && (
                                                <Checkbox
                                                    checked={selectedToDelete.includes(gen.id)}
                                                    onCheckedChange={() => handleToggleSelection(gen.id)}
                                                    id={`select-${gen.id}`}
                                                />
                                            )}
                                            <div className="flex-1 relative">
                                                {isLatest && showLatestInPlayer && (
                                                    <span className="absolute -top-1 -left-2 bg-secondary text-secondary-foreground text-[9px] font-bold px-1.5 py-0.5 rounded-full z-10 uppercase tracking-wider">
                                                        Latest
                                                    </span>
                                                )}
                                                <AudioHistoryPlayer
                                                    generation={gen}
                                                    index={generationHistory.length - i}
                                                    onPlay={(id) => {
                                                        if (id !== null && currentlyPlayingId !== id) {
                                                            setCurrentlyPlayingId(id);
                                                        } else {
                                                            setCurrentlyPlayingId(null);
                                                        }
                                                    }}
                                                    currentlyPlayingId={currentlyPlayingId}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </ScrollArea>
                        {isDeleteMode && (
                            <DialogFooter>
                                <Button
                                    variant="destructive"
                                    disabled={selectedToDelete.length === 0}
                                    onClick={handleDeleteSelected}
                                >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Delete ({selectedToDelete.length})
                                </Button>
                            </DialogFooter>
                        )}
                    </>
                ) : (
                    <>
                        <DialogHeader>
                            <DialogTitle>Select a Voice</DialogTitle>
                            <DialogDescription>
                                Preview voices and select one for the speaker.
                            </DialogDescription>
                        </DialogHeader>
                        <ScrollArea className="h-[60vh] pr-4">
                            <div className="space-y-2 py-4">
                                {availableVoices.map(v => (
                                    <div key={v.name} className="flex items-center justify-between p-2 rounded-md hover:bg-muted">
                                        <div className="flex items-center gap-3">
                                            <div onMouseDown={(e) => e.preventDefault()}>
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    onClick={() => handlePreviewVoice(v.name)}
                                                    className="h-8 w-8"
                                                >
                                                    {previewLoading[v.name] ? (
                                                        <Loader2 className="h-4 w-4 animate-spin" />
                                                    ) : playingVoice === v.name ? (
                                                        <Volume2 className="h-4 w-4 text-primary" />
                                                    ) : (
                                                        <Play className="h-4 w-4 text-muted-foreground" />
                                                    )}
                                                </Button>
                                            </div>
                                            <div>
                                                <p className="font-semibold">{v.name}</p>
                                                <p className="text-xs text-muted-foreground">{v.description}</p>
                                            </div>
                                        </div>
                                        <Button
                                            size="sm"
                                            onClick={() => {
                                                if (editingSpeakerId !== null) {
                                                    handleSpeakerChange(editingSpeakerId, 'voice', v.name);
                                                }
                                                setVoiceDialogOpen(false);
                                            }}
                                        >
                                            Select
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
}
