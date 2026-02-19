"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot, Zap } from "lucide-react";
import { useUser, useFirestore } from "@/firebase";
import { Skeleton } from "@/components/ui/skeleton";
import { auditUrl, type AuditResult } from "@/ai/flows/audit-flow";
import { auditSocialUrl, type SocialAuditResult } from "@/ai/flows/social-audit-flow";
import { AuditResultDisplay } from "./audit-result-display";
import { SocialAuditResultDisplay } from "./social-audit-result-display";
import { HeroAuditForm } from "@/components/hero-audit-form";

const socialMediaDomains = ['instagram.com', 'twitter.com', 'x.com', 'facebook.com', 'linkedin.com', 'tiktok.com'];


export function WebAudit() {
  const [result, setResult] = useState<AuditResult | SocialAuditResult | null>(null);
  const [auditedUrl, setAuditedUrl] = useState<string>(""); // State to hold the URL for the results display
  const [auditType, setAuditType] = useState<'web' | 'social' | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useUser();
  const firestore = useFirestore();
  const resultsRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();
  const router = useRouter();

  const handleAudit = useCallback(async (url: string) => {
    if (!url || !url.trim()) {
        setError("Please enter a URL.");
        setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
        return;
    }

    let fullUrl = url.trim();
    if (!fullUrl.startsWith('http')) {
        fullUrl = `https://${fullUrl}`;
    }
    
    try {
        new URL(fullUrl);
    } catch {
        setError("Please enter a valid URL.");
        setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
        return;
    }

    setIsLoading(true);
    setResult(null);
    setError(null);
    setAuditType(null);
    setAuditedUrl(fullUrl); // Save the URL being audited

    setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);

    const isSocial = socialMediaDomains.some(domain => {
        try {
            const hostname = new URL(fullUrl).hostname;
            return hostname.includes(domain);
        } catch {
            return false;
        }
    });
    
    setAuditType(isSocial ? 'social' : 'web');
    
    try {
        if (isSocial) {
            const auditResult = await auditSocialUrl(fullUrl);
            if (!auditResult || !auditResult.summary) {
                throw new Error("The AI model returned an unexpected response. Please try again.");
            }
            setResult(auditResult);

            if (user && firestore) {
                const historyCollection = collection(firestore, 'users', user.uid, 'socialMediaAudits');
                addDoc(historyCollection, { url: fullUrl, auditResult, timestamp: serverTimestamp() })
                    .catch(e => console.error("Error saving social audit:", e));
            }
        } else {
            const auditResult = await auditUrl(fullUrl);
            if (!auditResult || !auditResult.summary) {
                throw new Error("The AI model returned an unexpected response. Please try again.");
            }
            setResult(auditResult);

            if (user && firestore) {
                const historyCollection = collection(firestore, 'users', user.uid, 'webAudits');
                addDoc(historyCollection, { url: fullUrl, auditResult, timestamp: serverTimestamp() })
                    .catch(e => console.error("Error saving web audit:", e));
            }
        }
    } catch (e: any) {
      console.error("Audit Error:", e);
      setError(e.message || "An unexpected error occurred during the analysis.");
    } finally {
      setIsLoading(false);
    }
  }, [firestore, user]);

  useEffect(() => {
    const urlFromQuery = searchParams.get('url');
    if (urlFromQuery && !isLoading && !result && !error) {
        handleAudit(urlFromQuery);
        router.replace(window.location.pathname, {scroll: false});
    }
  }, [searchParams, handleAudit, router, isLoading, result, error]);

  return (
    <div className="w-full">
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Bot className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight">AI Audit</h1>
        </div>
        <p className="text-muted-foreground mb-6">
          Enter any website or social media URL for a real-time AI-powered analysis.
        </p>
      </div>

      <Card className="max-w-2xl w-full mx-auto bg-gray-900/50 border-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Zap className="text-primary" /> Start Your Analysis</CardTitle>
          <CardDescription>Our AI will provide an analysis and strategy based on your URL.</CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
            <HeroAuditForm onAudit={handleAudit} isLoading={isLoading} />
        </CardContent>
      </Card>

      <div className="mt-8 w-full max-w-4xl mx-auto" ref={resultsRef}>
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
            {auditType === 'web' && <AuditResultDisplay audit={result as AuditResult} url={auditedUrl} />}
            {auditType === 'social' && <SocialAuditResultDisplay audit={result as SocialAuditResult} url={auditedUrl} />}
          </div>
        )}
      </div>
    </div>
  );
}
