
import Link from "next/link";
import { Logo } from "@/components/logo";
import { Facebook, Instagram, Linkedin, Cloud, BrainCircuit, Database, Network, Workflow } from "lucide-react";

export function LandingFooter() {
    return (
        <footer className="bg-background-dark border-t border-white/10 pt-20 pb-10 px-6 lg:px-20">
            <div className="max-w-[1440px] mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
                    <div className="col-span-1">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="size-6 bg-primary flex items-center justify-center rounded">
                                <Logo className="text-black size-4" />
                            </div>
                            <h2 className="text-lg font-bold tracking-tighter uppercase italic">Architect <span className="text-primary">AI</span></h2>
                        </div>
                        <p className="text-white/40 text-sm leading-relaxed mb-6">
                            We don't build websites, we build sovereign growth engines. This is the blueprint for your company's digital autonomy.
                        </p>
                        <div className="flex items-center gap-4">
                            <a href="https://x.com/joshandrews_17?s=21" target="_blank" rel="noopener noreferrer" aria-label="X social media link" className="text-white/40 transition-colors hover:text-primary">
                                <svg xmlns="http://www.w3.org/2000/svg" className="size-5" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865z"/>
                                </svg>
                            </a>
                            <a href="https://www.facebook.com/share/1GCrZWvCif/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" aria-label="Facebook social media link" className="text-white/40 transition-colors hover:text-primary">
                                <Facebook className="size-5" />
                            </a>
                            <a href="https://www.instagram.com/joshandrew.design?igsh=MXIzam53Mjd6NjRtdw==" target="_blank" rel="noopener noreferrer" aria-label="Instagram social media link" className="text-white/40 transition-colors hover:text-primary">
                                <Instagram className="size-5" />
                            </a>
                            <a href="https://ng.linkedin.com/in/joshua-andrew-4b401a1a5" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn social media link" className="text-white/40 transition-colors hover:text-primary">
                                <Linkedin className="size-5" />
                            </a>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <h5 className="text-xs font-bold uppercase tracking-widest text-white/80">Systems</h5>
                        <ul className="text-sm text-white/40 space-y-2">
                            <li><Link className="hover:text-primary" href="/dashboard">AI Audit</Link></li>
                            <li><Link className="hover:text-primary" href="/growth">Growth Tracking</Link></li>
                            <li><Link className="hover:text-primary" href="/automation-lab">Automation Lab</Link></li>
                            <li><Link className="hover:text-primary" href="/chatbot">Web Architect</Link></li>
                            <li><Link className="hover:text-primary" href="/ecosystem">Google Ecosystem</Link></li>
                        </ul>
                    </div>
                    <div className="space-y-4">
                        <h5 className="text-xs font-bold uppercase tracking-widest text-white/80">Agency</h5>
                        <ul className="text-sm text-white/40 space-y-2">
                            <li><Link className="hover:text-primary" href="/about">About The Architect</Link></li>
                            <li><Link className="hover:text-primary" href="/strategy">Strategy Portal</Link></li>
                            <li><Link className="hover:text-primary" href="/prompt-ideas">Prompt Academy</Link></li>
                            <li><Link className="hover:text-primary" href="/history">Audit History</Link></li>
                        </ul>
                    </div>
                    <div className="space-y-4">
                        <h5 className="text-xs font-bold uppercase tracking-widest text-white/80">Tech Stack</h5>
                        <div className="grid grid-cols-2 gap-2">
                            <div className="flex items-center gap-2 p-2 border border-white/5 rounded bg-white/5">
                                <Cloud size={14} className="text-primary flex-shrink-0" />
                                <span className="text-[10px] font-bold uppercase">G-CLOUD</span>
                            </div>
                            <div className="flex items-center gap-2 p-2 border border-white/5 rounded bg-white/5">
                                <BrainCircuit size={14} className="text-primary flex-shrink-0" />
                                <span className="text-[10px] font-bold uppercase">Gemini</span>
                            </div>
                            <div className="flex items-center gap-2 p-2 border border-white/5 rounded bg-white/5">
                                <Database size={14} className="text-primary flex-shrink-0" />
                                <span className="text-[10px] font-bold uppercase">Firestore</span>
                            </div>
                            <div className="flex items-center gap-2 p-2 border border-white/5 rounded bg-white/5">
                                <Network size={14} className="text-primary flex-shrink-0" />
                                <span className="text-[10px] font-bold uppercase">Headless</span>
                            </div>
                             <div className="flex items-center gap-2 p-2 border border-white/5 rounded bg-white/5">
                                <Workflow size={14} className="text-primary flex-shrink-0" />
                                <span className="text-[10px] font-bold uppercase">n8n</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] uppercase tracking-[0.2em] text-white/20">
                    <p>© {new Date().getFullYear()} ARCHITECT AI STUDIO. ALL PROTOCOLS RESERVED.</p>
                    <div className="flex gap-8">
                        <span>Lat: 34.0522° N, Long: 118.2437° W</span>
                        <span>System v9.2.0</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
