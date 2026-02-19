
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Search, ArrowRight } from 'lucide-react';

export function HeroAuditForm({ onAudit, isLoading }: { onAudit: (url: string) => void, isLoading: boolean }) {
    const [url, setUrl] = useState('');

    const handleAudit = () => {
        onAudit(url);
    };
    
    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            handleAudit();
        }
    };

    return (
        <div className="glass-panel relative flex items-center overflow-hidden rounded-2xl p-2 shadow-2xl md:rounded-full">
            <div className="laser-line"></div>
            <div className="flex-1 flex items-center px-4 gap-3">
                <Search className="text-primary" />
                <input 
                    className="bg-transparent border-none focus:ring-0 focus:outline-none text-white placeholder:text-white/30 w-full py-3 text-base font-medium" 
                    placeholder="Web or Social Link" 
                    type="text"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={isLoading}
                />
            </div>
            <Button 
                onClick={handleAudit} 
                className="group relative flex items-center gap-2 overflow-hidden bg-primary text-black px-4 md:px-8 py-3 rounded-xl font-bold transition-all hover:scale-105 active:scale-95 md:rounded-full shadow-[0_0_30px_rgba(255,255,0,0.2)]"
                disabled={isLoading || !url}
            >
                {isLoading ? (
                    <>
                        <Loader2 className="animate-spin" />
                        <span className="hidden md:inline">Analyzing...</span>
                        <span className="md:hidden">...</span>
                    </>
                ) : (
                    <>
                        <span>Analyze</span>
                        <ArrowRight className="transition-transform group-hover:translate-x-1" />
                    </>
                )}
            </Button>
        </div>
    );
}
