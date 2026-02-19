
'use client';

import React, { useState, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { LandingFooter } from "@/components/layout/landing-footer";
import { LandingHeader } from "@/components/layout/landing-header";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import placeholderImages from "@/lib/placeholder-images.json";
import { HeroAuditForm } from "@/components/hero-audit-form";
import Autoplay from "embla-carousel-autoplay";
import { useInView } from "@/hooks/use-in-view";
import { cn } from "@/lib/utils";
import { GraduationCap, ChevronsDown, Shield, ArrowRight } from "lucide-react";

import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useUser, useFirestore } from "@/firebase";
import { Skeleton } from "@/components/ui/skeleton";
import { auditUrl, type AuditResult } from "@/ai/flows/audit-flow";
import { auditSocialUrl, type SocialAuditResult } from "@/ai/flows/social-audit-flow";
import { AuditResultDisplay } from "@/components/audit-result-display";
import { SocialAuditResultDisplay } from "@/components/social-audit-result-display";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";


const socialMediaDomains = ['instagram.com', 'twitter.com', 'x.com', 'facebook.com', 'linkedin.com', 'tiktok.com'];


export default function Home() {
  const [featuresRef, featuresInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const bentoAuditBg = placeholderImages.placeholderImages.find(p => p.id === "hp-bento-audit")!;
  const bentoChatAvatar = placeholderImages.placeholderImages.find(p => p.id === "hp-bento-chat-avatar")!;
  
  const blogPostsData = [
    {
      slug: 'ai-in-2026',
      topic: 'Analysis',
      title: 'AI in 2026: The Shift to Autonomous Commerce',
      imageUrl: placeholderImages.placeholderImages.find(p => p.id === "hp-blog-1")!.imageUrl,
      description: placeholderImages.placeholderImages.find(p => p.id === "hp-blog-1")!.description,
      imageHint: placeholderImages.placeholderImages.find(p => p.id === "hp-blog-1")!.imageHint,
    },
    {
      slug: 'google-cloud-scaling',
      topic: 'Infrastructure',
      title: 'Google Cloud Scaling for Global Dominance',
      imageUrl: placeholderImages.placeholderImages.find(p => p.id === "hp-blog-2")!.imageUrl,
      description: placeholderImages.placeholderImages.find(p => p.id === "hp-blog-2")!.description,
      imageHint: placeholderImages.placeholderImages.find(p => p.id === "hp-blog-2")!.imageHint,
    },
    {
      slug: 'headless-vs-monolith',
      topic: 'Architecture',
      title: 'Headless vs. Monolith: Deciding Sovereignty',
      imageUrl: placeholderImages.placeholderImages.find(p => p.id === "hp-blog-3")!.imageUrl,
      description: placeholderImages.placeholderImages.find(p => p.id === "hp-blog-3")!.description,
      imageHint: placeholderImages.placeholderImages.find(p => p.id === "hp-blog-3")!.imageHint,
    },
    {
      slug: 'automating-workflow',
      topic: 'Efficiency',
      title: 'Automating Your Workflow: A Guide to Peak Efficiency',
      imageUrl: placeholderImages.placeholderImages.find(p => p.id === "hp-blog-4")!.imageUrl,
      description: placeholderImages.placeholderImages.find(p => p.id === "hp-blog-4")!.description,
      imageHint: placeholderImages.placeholderImages.find(p => p.id === "hp-blog-4")!.imageHint,
    },
    {
      slug: 'sovereign-brand',
      topic: 'Branding',
      title: 'Building a Sovereign Brand in the AI Era',
      imageUrl: placeholderImages.placeholderImages.find(p => p.id === "hp-blog-5")!.imageUrl,
      description: placeholderImages.placeholderImages.find(p => p.id === "hp-blog-5")!.description,
      imageHint: placeholderImages.placeholderImages.find(p => p.id === "hp-blog-5")!.imageHint,
    },
    {
      slug: 'leveraging-analytics',
      topic: 'Data',
      title: 'From Data to Dominance: Leveraging Analytics',
      imageUrl: placeholderImages.placeholderImages.find(p => p.id === "hp-blog-6")!.imageUrl,
      description: placeholderImages.placeholderImages.find(p => p.id === "hp-blog-6")!.description,
      imageHint: placeholderImages.placeholderImages.find(p => p.id === "hp-blog-6")!.imageHint,
    },
  ];

  const plugin = React.useRef(
    Autoplay({ delay: 3000, stopOnInteraction: true })
  );

  const [result, setResult] = useState<AuditResult | SocialAuditResult | null>(null);
  const [auditType, setAuditType] = useState<'web' | 'social' | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useUser();
  const firestore = useFirestore();
  const resultsRef = useRef<HTMLDivElement>(null);

  const handleAudit = useCallback(async (url: string) => {
    if (!url) {
      setError("Please enter a website or social media URL.");
      setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
      return;
    }

    setIsLoading(true);
    setResult(null);
    setError(null);
    setAuditType(null);

    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);

    let fullUrl = url;
    if (!/^https?:\/\//i.test(fullUrl)) {
      fullUrl = 'https://' + fullUrl;
    }

    let urlObject;
    try {
      urlObject = new URL(fullUrl);
    } catch {
      setError("Invalid URL. Please check and try again.");
      setIsLoading(false);
      return;
    }

    const isSocial = socialMediaDomains.some(domain => urlObject.hostname.includes(domain));
    setAuditType(isSocial ? 'social' : 'web');

    try {
      const auditResult = isSocial
        ? await auditSocialUrl(fullUrl)
        : await auditUrl(fullUrl);

      if (!auditResult || !auditResult.summary) {
        throw new Error("The AI model returned an unexpected response. Please try again.");
      }

      setResult(auditResult);

      if (user && firestore) {
        const collectionName = isSocial ? 'socialMediaAudits' : 'webAudits';
        const historyCollection = collection(firestore, 'users', user.uid, collectionName);
        addDoc(historyCollection, { url: fullUrl, auditResult, timestamp: serverTimestamp() })
          .catch(e => console.error(`Error saving ${collectionName} audit:`, e));
      }
    } catch (e: any) {
      console.error("Audit Error:", e);
      setError(e.message || "An unexpected error occurred during the analysis.");
    } finally {
      setIsLoading(false);
    }
  }, [firestore, user]);


  return (
    <div className="bg-background-dark font-display text-white">
      <LandingHeader />
      <main>
        <section className="relative flex flex-col items-center justify-center px-6 text-center pb-12 pt-24">
          <div className="absolute inset-0 bg-radial-gradient pointer-events-none"></div>
          <div className="relative z-10 max-w-6xl mx-auto pb-10">
            <h1 className="text-5xl md:text-8xl font-black leading-none tracking-tighter mb-6 uppercase">
              BUILD YOUR<br/>
              <span className="inline-flex text-primary">
                {'SOVEREIGN'.split('').map((char, i) => (
                    <span
                        key={i}
                        className="animate-text-wave"
                        style={{ animationDelay: `${i * 0.1}s` }}
                    >
                        {char}
                    </span>
                ))}
              </span> GROWTH ENGINE
            </h1>
            <p className="text-lg md:text-xl text-white/60 max-w-3xl mx-auto mb-12 font-light leading-relaxed">
              This isn't an agency. This is the blueprint for your company's digital autonomy. Use our AI to instantly audit your brand and discover your path to a self-scaling future, architected by Joshua Andrew.
            </p>
            <div className="max-w-2xl mx-auto w-full">
              <HeroAuditForm onAudit={handleAudit} isLoading={isLoading} />
              <p className="mt-4 text-[10px] uppercase tracking-[0.3em] text-white/30">ENTER A URL TO BEGIN YOUR AUTONOMOUS JOURNEY</p>
            </div>
          </div>
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-30">
            <span className="text-[10px] uppercase tracking-widest">Technical Specifications</span>
            <ChevronsDown className="animate-bounce" />
          </div>
        </section>

        <div className="px-6 lg:px-20 pb-24 max-w-4xl mx-auto" ref={resultsRef}>
          {isLoading && (
            <div className="relative animate-in fade-in-50 duration-500">
              <div className="absolute -inset-1 bg-gradient-to-r from-accent to-primary rounded-lg blur opacity-75 animate-pulse"></div>
              <Card className="relative bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-accent">AI is Processing...</CardTitle>
                  <CardDescription>Analyzing your digital footprint. This may take a moment.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Skeleton className="w-full h-4" />
                    <Skeleton className="w-5/6 h-4" />
                    <Skeleton className="w-3/4 h-4" />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {error && (
            <div className="mt-8 p-4 bg-destructive/10 border border-destructive/50 rounded-lg text-destructive-foreground animate-in fade-in-50">
              <p className="font-bold">Analysis Failed</p>
              <p className="text-sm">{error}</p>
            </div>
          )}

          {result && !isLoading && (
            <div className="animate-in fade-in-50 duration-500">
              {auditType === 'web' && <AuditResultDisplay audit={result as AuditResult} url={result && 'url' in result ? (result as any).url : ''} />}
              {auditType === 'social' && <SocialAuditResultDisplay audit={result as SocialAuditResult} url={result && 'url' in result ? (result as any).url : ''}/>}
            </div>
          )}
        </div>

        <section ref={featuresRef} id="features" className="max-w-[1440px] mx-auto px-6 lg:px-20 pb-24 overflow-hidden">
          <div className={cn(
              "flex flex-col md:flex-row justify-between items-end mb-12 gap-6",
              featuresInView ? "animate-in fade-in-0 slide-in-from-top-5 duration-700" : "opacity-0"
            )}>
            <div>
              <h4 className="text-primary text-xs font-bold uppercase tracking-[0.5em] mb-2 block">{'//'} CAPABILITIES</h4>
              <h2 className="text-4xl font-bold tracking-tight">The Sovereign Stack</h2>
            </div>
            <p className="text-white/40 text-sm max-w-sm text-right">A multi-layered architectural approach to digital scaling and automation.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 h-auto md:h-[700px]">
            <div className={cn(
                "md:col-span-8 bg-card-dark border border-white/10 rounded-xl overflow-hidden group relative",
                featuresInView ? "animate-in fade-in-0 zoom-in-95 duration-500" : "opacity-0"
              )}>
              <Image src={bentoAuditBg.imageUrl} alt={bentoAuditBg.description} data-ai-hint={bentoAuditBg.imageHint} fill className="absolute inset-0 object-cover opacity-30 group-hover:scale-110 transition-transform duration-700"/>
              <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-background-dark/40 to-transparent"></div>
              <div className="relative h-full p-8 flex flex-col justify-end">
                <span className="bg-primary/20 text-primary text-[10px] font-bold px-3 py-1 rounded-full w-fit mb-4 border border-primary/30 uppercase tracking-widest">Module 01</span>
                <h3 className="text-2xl font-bold mb-2">AI-Powered Audits</h3>
                <p className="text-white/50 max-w-md text-sm">Deep-scan reports of your digital footprint across 48 critical commerce vectors.</p>
              </div>
            </div>

            <div className={cn(
                "md:col-span-4 bg-card-dark border border-white/10 rounded-xl p-8 flex flex-col justify-between group",
                featuresInView ? "animate-in fade-in-0 slide-in-from-right-10 duration-500 anim-delay-200" : "opacity-0"
              )}>
              <div className="size-20 rounded-full border-2 border-primary/50 overflow-hidden mb-6 mx-auto group-hover:shadow-[0_0_20px_rgba(255,255,0,0.3)] transition-all relative">
                <Image src={bentoChatAvatar.imageUrl} alt={bentoChatAvatar.description} data-ai-hint={bentoChatAvatar.imageHint} fill className="object-cover" />
              </div>
              <div className="text-center">
                <h3 className="text-xl font-bold mb-2">Interactive AI Chat</h3>
                <p className="text-white/50 text-sm mb-6">Consult with our Web Architect avatar for real-time strategy adjustments.</p>
                <Button asChild variant="outline" className="w-full py-3 rounded border border-white/10 hover:bg-primary hover:text-primary-foreground text-xs font-bold uppercase tracking-widest transition-all bg-transparent text-white">
                  <Link href="/chatbot">CHAT ARCHITECT AI</Link>
                </Button>
              </div>
            </div>

            <div className={cn(
                "md:col-span-4 bg-black border border-white/10 rounded-xl p-6 font-mono text-xs overflow-hidden relative",
                featuresInView ? "animate-in fade-in-0 slide-in-from-left-10 duration-500 anim-delay-300" : "opacity-0"
              )}>
              <div className="flex gap-1.5 mb-4">
                <div className="size-2 rounded-full bg-red-500/50"></div>
                <div className="size-2 rounded-full bg-yellow-500/50"></div>
                <div className="size-2 rounded-full bg-green-500/50"></div>
              </div>
              <div className="space-y-2">
                <p className="text-white/40 italic">{'//'} Electric Lime Automation v4.2</p>
                <p className="text-electric-lime">{'>'} architect init --project "SovereignEngine"</p>
                <p className="text-white">{'>'} Deploying Google Cloud infrastructure...</p>
                <p className="text-white">{'>'} Optimizing headless API nodes [98%]</p>
                <p className="text-electric-lime">{'>'} SUCCESS: Blueprint Active</p>
                <div className="h-4 w-2 bg-electric-lime animate-pulse inline-block"></div>
              </div>
              <div className="absolute bottom-6 left-6">
                <h3 className="text-lg font-display font-bold text-white">Automation Showcase</h3>
              </div>
            </div>
            
            <div className={cn(
                "md:col-span-8 bg-card-dark border border-white/10 rounded-xl overflow-hidden group relative",
                featuresInView ? "animate-in fade-in-0 slide-in-from-bottom-10 duration-500 anim-delay-400" : "opacity-0"
              )}>
              <div className="absolute inset-0 opacity-20 blueprint-grid"></div>
              <div className="p-8 h-full flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <h3 className="text-2xl font-bold">Strategy &amp; Contact</h3>
                  <Shield className="text-primary" size={32} />
                </div>
                <div className="flex flex-col md:flex-row justify-between items-end gap-6">
                  <p className="text-white/50 text-sm max-w-sm">Secure connections for strategic scaling. We don't just build, we architect for sovereignty.</p>
                  <Button asChild className="bg-white text-black px-6 py-3 rounded font-bold text-xs uppercase tracking-widest flex items-center gap-2 group-hover:bg-primary transition-colors">
                    <Link href="/strategy">Contact The Architect <ArrowRight /></Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white/5 py-24 border-y border-white/10">
          <Carousel
            plugins={[plugin.current]}
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full max-w-[1440px] mx-auto px-6 lg:px-20"
            onMouseEnter={plugin.current.stop}
            onMouseLeave={plugin.current.reset}
          >
            <div className="flex justify-between items-end mb-12">
              <div>
                <h4 className="text-primary text-xs font-bold uppercase tracking-[0.5em] mb-2 block">{'//'} PROTOCOLS</h4>
                <h2 className="text-4xl font-bold tracking-tight">Strategic Protocols</h2>
              </div>
              <div className="flex items-center gap-4">
                <CarouselPrevious className="!relative !inset-auto !transform-none border-primary text-primary hover:bg-primary hover:text-black bg-background-dark/50" />
                <CarouselNext className="!relative !inset-auto !transform-none border-primary text-primary hover:bg-primary hover:text-black bg-background-dark/50" />
              </div>
            </div>

            <CarouselContent>
              {blogPostsData.map((post) => (
                <CarouselItem key={post.slug} className="md:basis-1/2 lg:basis-1/3">
                  <div className="p-1 h-full">
                    <Link href={`/protocol/${post.slug}`} className="block aspect-[4/5] bg-card-dark border border-white/10 rounded-xl overflow-hidden relative group h-full">
                      <Image src={post.imageUrl} alt={post.description} data-ai-hint={post.imageHint} fill className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-1000" />
                      <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-transparent to-transparent"></div>
                      <div className="absolute bottom-0 left-0 p-8 w-full">
                        <p className="text-primary text-[10px] font-bold uppercase tracking-widest mb-2">{post.topic}</p>
                        <h4 className="text-2xl font-bold mb-4">
                          {post.title}
                        </h4>
                        <div className="flex items-center gap-2 text-primary font-bold text-[10px] uppercase tracking-widest group-hover:text-primary transition-colors group-hover/btn:text-primary">
                          Read Protocol <ArrowRight className="group-hover:translate-x-2 transition-transform group-hover/btn:translate-x-2" />
                        </div>
                      </div>
                    </Link>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </section>

        <section className="py-24 px-6 text-center">
            <div className="max-w-4xl mx-auto">
                <h4 className="text-primary text-xs font-bold uppercase tracking-[0.5em] mb-4 block">{'//'} Master The AI</h4>
                <h2 className="text-4xl font-bold tracking-tight mb-4">Prompt Engineering Academy</h2>
                <p className="text-lg text-white/60 max-w-2xl mx-auto mb-8 font-light leading-relaxed">
                    Unlock the full potential of generative AI. Join our academy to learn how to craft perfect prompts, from basic commands to advanced techniques that drive results.
                </p>
                <Button asChild className="bg-primary text-black px-8 py-4 rounded-lg font-black text-sm uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-[0_0_30px_rgba(255,255,0,0.2)]">
                    <Link href="/prompt-ideas">
                        Begin Your Training
                        <GraduationCap />
                    </Link>
                </Button>
            </div>
        </section>
      </main>
      <LandingFooter />
    </div>
  );
}
