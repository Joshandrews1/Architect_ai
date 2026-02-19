
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import placeholderImages from "@/lib/placeholder-images.json";
import { LandingFooter } from '@/components/layout/landing-footer';
import { LandingHeader } from '@/components/layout/landing-header';
import { BarChartBig, BrainCircuit, Cloud, Cog, Database, DraftingCompass, Network, Quote } from 'lucide-react';


export default function AboutPage() {
    const heroPortrait = placeholderImages.placeholderImages.find(p => p.id === "about-hero-portrait")!;
    const highTechVision = placeholderImages.placeholderImages.find(p => p.id === "about-vision-image")!;

    const ecosystemTools = [
        {
            name: 'Gemini 2.5 Flash',
            icon: BrainCircuit,
            description: 'Cognition Engine',
            color: 'secondary',
            gridPosition: 'md:col-start-1 md:row-start-2',
        },
        {
            name: 'Vertex AI',
            icon: Cog,
            description: 'Production Engine',
            color: 'secondary',
            gridPosition: 'md:col-start-2 md:row-start-2',
        },
        {
            name: 'Firebase Hub',
            icon: Database,
            description: 'State Control',
            color: 'secondary',
            gridPosition: 'md:col-start-3 md:row-start-2',
        },
        {
            name: 'n8n Automation',
            icon: Network,
            description: 'Execution Engine',
            color: 'secondary',
            gridPosition: 'md:col-start-1 md:row-start-3',
        },
        {
            name: 'BigQuery',
            icon: BarChartBig,
            description: 'Analytics Engine',
            color: 'primary',
            gridPosition: 'md:col-start-2 md:row-start-3',
        },
        {
            name: 'Cloud Run',
            icon: Cloud,
            description: 'Serverless Scale',
            color: 'primary',
            gridPosition: 'md:col-start-3 md:row-start-3',
        },
    ];

    return (
        <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-background-dark">
            <LandingHeader />

            <section id="architect" className="relative min-h-screen grid items-center pt-20 monolith-gradient overflow-hidden">
                <div className="container mx-auto lg:px-6 grid lg:grid-cols-2 gap-12 items-center relative z-10">
                    <div className="flex flex-col justify-center px-6 lg:px-0">
                        <div className="inline-flex items-center gap-2 border-l-2 border-primary bg-primary/5 px-4 py-1 text-[10px] font-bold tracking-[0.4em] text-primary uppercase mb-8">
                            SUBJECT: ID-7729-ARCHITECT
                        </div>
                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black leading-[0.9] tracking-tighter uppercase mb-8">
                            ARCHITECTING <br />THE <span className="text-primary yellow-glow">SOVEREIGN</span> <br />FUTURE
                        </h1>
                        <p className="max-w-xl text-gray-400 text-lg md:text-xl leading-relaxed terminal-font border-l border-white/10 pl-6">
                            Engineering total commerce autonomy. Where elite strategy meets zero-friction machine intelligence.
                        </p>
                        <div className="mt-16 flex gap-12">
                            <div className="flex flex-col gap-2">
                                <span className="text-primary font-bold text-2xl">01</span>
                                <span className="text-[9px] uppercase tracking-[0.3em] text-gray-500 font-bold">Autonomous Core</span>
                            </div>
                            <div className="flex flex-col gap-2">
                                <span className="text-primary font-bold text-2xl">02</span>
                                <span className="text-[9px] uppercase tracking-[0.3em] text-gray-500 font-bold">Total Sovereignty</span>
                            </div>
                            <div className="flex flex-col gap-2">
                                <span className="text-primary font-bold text-2xl">03</span>
                                <span className="text-[9px] uppercase tracking-[0.3em] text-gray-500 font-bold">Machine Scale</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center justify-center lg:justify-end">
                        <div className="relative w-full max-w-sm aspect-[4/5] overflow-hidden border border-primary/20 shadow-2xl shadow-primary/10">
                            <Image src={heroPortrait.imageUrl} alt={heroPortrait.description} fill className="object-cover absolute inset-0" />
                            <div className="absolute inset-0 bg-primary/5 mix-blend-overlay"></div>
                            <div className="absolute inset-0 border-[1px] border-primary/20"></div>
                            <div className="scan-line"></div>
                            <div className="absolute top-8 left-8 p-4 glass-panel text-[9px] terminal-font text-primary border-primary/30">
                                <p className="mb-1 opacity-70">BIOMETRIC_SCAN: 100%</p>
                                <p className="mb-1 text-white">RECOGNITION: JOSH_ANDREW</p>
                                <p className="text-secondary">SYSTEM: OPTIMIZED</p>
                            </div>
                            <div className="absolute bottom-8 right-8 p-4 glass-panel text-[9px] terminal-font text-white/70 border-primary/30">
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="w-1.5 h-1.5 bg-secondary animate-pulse"></div>
                                    <span className="tracking-widest">LIVE_INTEL_FEED</span>
                                </div>
                                <div className="grid grid-cols-6 gap-1 items-end">
                                    <div className="h-4 w-1 bg-primary/20"></div>
                                    <div className="h-8 w-1 bg-primary/40"></div>
                                    <div className="h-12 w-1 bg-primary"></div>
                                    <div className="h-6 w-1 bg-secondary"></div>
                                    <div className="h-10 w-1 bg-primary/60"></div>
                                    <div className="h-5 w-1 bg-primary/30"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section id="genesis" className="py-32 px-6 border-y border-primary/10 relative">
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-12 gap-16">
                        <div className="lg:col-span-4">
                            <h2 className="text-[11px] font-black text-secondary uppercase tracking-[0.5em] mb-8 flex items-center gap-4">
                                <span className="w-8 h-px bg-secondary"></span> THE GENESIS
                            </h2>
                            <h3 className="text-5xl font-black leading-[0.9] uppercase tracking-tighter text-white">
                                Eliminating the <br /><span className="text-primary italic">Human Bottleneck</span>
                            </h3>
                        </div>
                        <div className="lg:col-span-8 space-y-12">
                            <p className="text-2xl text-gray-300 leading-relaxed font-light">
                                The traditional agency model is broken. It scales by adding more people, which creates friction, delays, and limits potential. We build <span className="text-white font-bold border-b border-secondary/50">intelligent, autonomous systems</span> instead.
                            </p>
                            <div className="grid md:grid-cols-2 gap-12 pt-8 border-t border-white/5">
                                <div className="space-y-4">
                                    <h4 className="text-primary font-bold uppercase tracking-widest text-xs">The Discovery</h4>
                                    <p className="text-gray-400 leading-relaxed terminal-font text-sm">
                                        Years within traditional agency frameworks revealed a recurring flaw: human execution is the ultimate bottleneck. Vision is infinite; bandwidth is not.
                                    </p>
                                </div>
                                <div className="space-y-4">
                                    <h4 className="text-secondary font-bold uppercase tracking-widest text-xs">The Evolution</h4>
                                    <p className="text-gray-400 leading-relaxed terminal-font text-sm">
                                        By architecting a sovereign system on Google's high-tier infrastructure, Josh created a model where brands are empowered with their own Autonomous Engines that never sleep, learn from data, and execute flawlessly at machine scale.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-32 lg:px-6 bg-black">
                <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-20">
                    <div className="lg:w-1/2 order-2 lg:order-1 px-6 lg:px-0">
                        <div className="p-10 border border-primary/20 bg-primary/5 relative">
                            <div className="absolute -top-3 -left-3 w-6 h-6 border-t-2 border-l-2 border-primary"></div>
                            <div className="absolute -bottom-3 -right-3 w-6 h-6 border-b-2 border-r-2 border-primary"></div>
                            <h2 className="text-xs font-black text-primary uppercase tracking-[0.4em] mb-6">The Digital Architect</h2>
                            <p className="text-xl text-gray-300 leading-relaxed mb-8">
                                Joshua Andrew is not a manager; he is an <span className="text-white font-bold">Architect</span>. He views commerce as a series of interconnected nodes—data, strategy, and execution—that must be optimized through code and intelligence.
                            </p>
                            <p className="text-gray-500 terminal-font text-sm">
                                "I chose to stop building agencies and start building engines. An agency is limited by its headcount. An engine is limited only by its processing power."
                            </p>
                        </div>
                    </div>
                    <div className="lg:w-1/2 order-1 lg:order-2 w-full">
                        <Image alt="High Tech Vision" className="w-full grayscale brightness-75 hover:grayscale-0 transition-all duration-700 lg:border border-white/10" src={highTechVision.imageUrl} width={600} height={400} />
                    </div>
                </div>
            </section>

            <section id="ecosystem" className="py-40 px-6 relative overflow-hidden bg-[#020202]">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-24">
                        <h2 className="text-[10px] font-black text-secondary uppercase tracking-[0.6em] mb-4">Core Ecosystem</h2>
                        <h3 className="text-5xl md:text-6xl font-black uppercase tracking-tighter">Sovereign Intelligence</h3>
                    </div>
                    <div className="relative max-w-5xl mx-auto">
                        {/* SVG Lines for Desktop */}
                        <svg className="absolute top-0 left-0 w-full h-full hidden md:block" preserveAspectRatio="none" viewBox="0 0 500 500">
                            <defs>
                                <linearGradient id="line-gradient-vertical" x1="0%" y1="0%" x2="0%" y2="100%">
                                    <stop offset="0%" stopColor="rgba(255,255,0,0)" />
                                    <stop offset="50%" stopColor="rgba(255,255,0,0.3)" />
                                    <stop offset="100%" stopColor="rgba(255,255,0,0)" />
                                </linearGradient>
                                <linearGradient id="line-gradient-diagonal-1" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="rgba(255,255,0,0)" />
                                    <stop offset="50%" stopColor="rgba(255,255,0,0.2)" />
                                    <stop offset="100%" stopColor="rgba(255,255,0,0)" />
                                </linearGradient>
                                <linearGradient id="line-gradient-diagonal-2" x1="100%" y1="0%" x2="0%" y2="100%">
                                    <stop offset="0%" stopColor="rgba(255,255,0,0)" />
                                    <stop offset="50%" stopColor="rgba(255,255,0,0.2)" />
                                    <stop offset="100%" stopColor="rgba(255,255,0,0)" />
                                </linearGradient>
                            </defs>
                            {/* Architect to Row 2 */}
                            <line x1="50%" y1="15%" x2="16.66%" y2="50%" stroke="rgba(255,255,0,0.2)" strokeWidth="1" />
                            <line x1="50%" y1="15%" x2="50%" y2="50%" stroke="rgba(255,255,0,0.2)" strokeWidth="1" />
                            <line x1="50%" y1="15%" x2="83.33%" y2="50%" stroke="rgba(255,255,0,0.2)" strokeWidth="1" />

                            {/* Row 2 to Row 3 connections */}
                            <line x1="16.66%" y1="50%" x2="16.66%" y2="85%" stroke="url(#line-gradient-vertical)" strokeWidth="0.5" />
                            <line x1="50%" y1="50%" x2="50%" y2="85%" stroke="url(#line-gradient-vertical)" strokeWidth="0.5" />
                            <line x1="83.33%" y1="50%" x2="83.33%" y2="85%" stroke="url(#line-gradient-vertical)" strokeWidth="0.5" />
                            
                            {/* Architect to Row 3 (diagonals) */}
                            <line x1="50%" y1="15%" x2="16.66%" y2="85%" stroke="url(#line-gradient-diagonal-2)" strokeWidth="1" />
                            <line x1="50%" y1="15%" x2="50%" y2="85%" stroke="rgba(255,255,0,0.2)" strokeWidth="1" />
                            <line x1="50%" y1="15%" x2="83.33%" y2="85%" stroke="url(#line-gradient-diagonal-1)" strokeWidth="1" />

                        </svg>

                        {/* SVG Lines for Mobile */}
                        <svg className="absolute top-0 left-0 w-full h-full md:hidden" preserveAspectRatio="none" viewBox="0 0 500 600">
                             <defs>
                                <linearGradient id="line-gradient-vertical-mobile" x1="0%" y1="0%" x2="0%" y2="100%">
                                    <stop offset="0%" stopColor="rgba(255,255,0,0)" />
                                    <stop offset="50%" stopColor="rgba(255,255,0,0.3)" />
                                    <stop offset="100%" stopColor="rgba(255,255,0,0)" />
                                </linearGradient>
                            </defs>
                            {/* Architect to Row 1 */}
                            <line x1="250" y1="60" x2="140" y2="200" stroke="rgba(255,255,0,0.2)" strokeWidth="1" />
                            <line x1="250" y1="60" x2="360" y2="200" stroke="rgba(255,255,0,0.2)" strokeWidth="1" />

                            {/* Verticals */}
                            <line x1="140" y1="200" x2="140" y2="340" stroke="url(#line-gradient-vertical-mobile)" strokeWidth="0.5" />
                            <line x1="360" y1="200" x2="360" y2="340" stroke="url(#line-gradient-vertical-mobile)" strokeWidth="0.5" />
                            <line x1="140" y1="340" x2="140" y2="480" stroke="url(#line-gradient-vertical-mobile)" strokeWidth="0.5" />
                            <line x1="360" y1="340" x2="360" y2="480" stroke="url(#line-gradient-vertical-mobile)" strokeWidth="0.5" />
                        </svg>

                        <div className="flex flex-col items-center gap-y-12 md:grid md:grid-cols-3 md:grid-rows-3 md:gap-y-16 md:items-start md:justify-items-center relative z-10">
                            <div className="md:col-start-2 md:row-start-1 flex justify-center">
                                <div className="diagram-node z-30 size-48 md:size-56 border-2 border-primary shadow-[0_0_60px_rgba(255,255,0,0.15)]">
                                    <DraftingCompass className="text-5xl md:text-6xl text-primary mb-3 yellow-glow" />
                                    <p className="text-[10px] md:text-xs font-black uppercase tracking-[0.3em] text-white text-center">THE ARCHITECT</p>
                                    <p className="text-[8px] md:text-[9px] terminal-font text-secondary mt-2 tracking-widest">JOSHUA_ANDREW.CORE</p>
                                </div>
                            </div>
                            
                            <div className="w-full grid grid-cols-2 gap-8 md:contents">
                                {ecosystemTools.map((tool) => (
                                    <div key={tool.name} className={`${tool.gridPosition} flex justify-center`}>
                                        <div className={`diagram-node size-40 md:size-48 ${tool.color === 'primary' ? 'bg-primary/10 border-primary/50' : ''}`}>
                                            <tool.icon className={`text-3xl md:text-4xl mb-3 ${tool.color === 'primary' ? 'text-primary yellow-glow' : 'text-secondary lime-glow'}`} />
                                            <p className="text-[9px] md:text-[10px] font-black uppercase tracking-wider text-center">{tool.name}</p>
                                            <span className="text-[8px] text-gray-500 uppercase tracking-widest mt-1">{tool.description}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section id="mission" className="py-48 px-6 bg-primary">
                <div className="max-w-6xl mx-auto text-center">
                    <Quote className="text-7xl text-black mb-12 mx-auto" />
                    <h2 className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-snug text-black">
                        WE DO NOT COMPETE WITH <br />HUMAN CREATIVITY. <br />
                        WE PROVIDE THE <span className="italic underline decoration-4 underline-offset-[12px]">AUTONOMOUS ENGINE</span> <br />
                        FOR IT TO RUN UPON.
                    </h2>
                    <div className="mt-20 h-[2px] w-32 bg-black mx-auto"></div>
                    <p className="mt-10 text-[12px] font-black uppercase tracking-[0.6em] text-black">The Sovereign Mission Protocol</p>
                </div>
            </section>
            
            <LandingFooter />
        </div>
    );
}

    

    




