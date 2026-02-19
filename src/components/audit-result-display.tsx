
'use client';

import { useState, useRef, useEffect } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { type Content } from "firebase/ai";
import { useUser } from "@/firebase";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Loader2, CheckCircle, XCircle, Lightbulb, Target, Send, Sparkles } from "lucide-react";
import { askFollowUp } from "@/ai/flows/follow-up-flow";
import { Textarea } from "@/components/ui/textarea";

import { PolarGrid, PolarAngleAxis, Radar, RadarChart } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { Progress } from "@/components/ui/progress";
import { type AuditResult } from '@/ai/flows/audit-flow';

const followUpFormSchema = z.object({
  question: z.string().min(3, "Question must be at least 3 characters."),
});

type Message = Content;

type AuditResultDisplayProps = {
  audit: AuditResult;
  url: string;
};

function getDomainName(url: string) {    
    try {
        let fullUrl = url;
        if (!/^https?:\/\//i.test(fullUrl)) {
            fullUrl = 'https://' + fullUrl;
        }
        const hostname = new URL(fullUrl).hostname;
        return hostname.replace(/^www\./, '');
    } catch (e) {
        return url; // fallback to full url if parsing fails
    }
}

export function AuditResultDisplay({ audit, url }: AuditResultDisplayProps) {
  const { user } = useUser();
  const getInitialMessage = (url: string) => `Hello! I'm ready for your follow-up question regarding the ${getDomainName(url)} analysis.`;
  
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', parts: [{ text: getInitialMessage(url) }] }
  ]);
  const [isFollowUpLoading, setIsFollowUpLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const followUpForm = useForm<z.infer<typeof followUpFormSchema>>({
    resolver: zodResolver(followUpFormSchema),
    defaultValues: { question: "" },
  });

  useEffect(() => {
    if (messagesContainerRef.current) {
        messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages, isFollowUpLoading]);

  async function onFollowUpSubmit(values: z.infer<typeof followUpFormSchema>) {
    if (!audit) return;

    const userMessage: Message = {
      role: 'user',
      parts: [{ text: values.question }],
    };
    setMessages(prev => [...prev, userMessage]);
    
    setIsFollowUpLoading(true);
    setError(null);
    followUpForm.reset();

    try {
      const { answer } = await askFollowUp(audit, values.question);
      const aiMessage: Message = {
        role: "model",
        parts: [{ text: answer }],
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (e: any) {
      console.error("Follow-up error:", e);
      const errorMessage: Message = {
        role: 'model',
        parts: [{ text: "Sorry, I couldn't answer that question. Please try again." }],
      };
      setMessages(prev => [...prev, errorMessage]);
      setError("Sorry, I couldn't answer that question. Please try again.");
    } finally {
      setIsFollowUpLoading(false);
    }
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      followUpForm.handleSubmit(onFollowUpSubmit)();
    }
  };

  const chartData = audit ? [
    { metric: "SEO", score: audit.scores.seo, fill: "hsl(var(--chart-1))" },
    { metric: "Clarity", score: audit.scores.clarity, fill: "hsl(var(--chart-2))" },
    { metric: "CTA", score: audit.scores.cta, fill: "hsl(var(--chart-3))" },
    { metric: "Mobile", score: audit.scores.mobile, fill: "hsl(var(--chart-4))" },
  ] : [];

  const chartConfig = {
    score: { label: "Score" },
    seo: { label: "SEO", color: "hsl(var(--chart-1))" },
    clarity: { label: "Clarity", color: "hsl(var(--chart-2))" },
    cta: { label: "CTA", color: "hsl(var(--chart-3))" },
    mobile: { label: "Mobile", color: "hsl(var(--chart-4))" },
  } satisfies ChartConfig;

  return (
    <div className="animate-in fade-in-50 duration-500 space-y-6">
        <Card className="bg-gray-900/80 border-gray-800 backdrop-blur-sm">
            <CardHeader>
                <CardTitle className="text-primary">Analysis Overview</CardTitle>
                <CardDescription>{audit.summary}</CardDescription>
            </CardHeader>
            <CardContent className="pt-4 space-y-6">
                <ChartContainer config={chartConfig} className="w-full aspect-square h-64 mx-auto">
                    <RadarChart data={chartData}>
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <PolarGrid />
                        <PolarAngleAxis dataKey="metric" />
                        <Radar dataKey="score" fill="hsl(var(--primary))" fillOpacity={0.6} stroke="hsl(var(--primary))" strokeWidth={2} />
                    </RadarChart>
                </ChartContainer>
                <div className="space-y-4 px-2">
                    {chartData.map((item) => (
                        <div key={item.metric}>
                            <div className="flex justify-between text-sm mb-1">
                                <span className="font-medium text-muted-foreground">{item.metric}</span>
                                <span className="font-semibold text-foreground">{item.score}%</span>
                            </div>
                            <Progress value={item.score} className="h-2" />
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-gray-900/50 border-gray-800">
                <CardHeader><CardTitle className="flex items-center gap-2"><CheckCircle className="text-green-500"/>Strengths</CardTitle></CardHeader>
                <CardContent>
                    <ul className="list-disc pl-5 space-y-2 text-gray-300">
                        {audit.strengths.map((item, i) => <li key={i}>{item}</li>)}
                    </ul>
                </CardContent>
            </Card>
            <Card className="bg-gray-900/50 border-gray-800">
                <CardHeader><CardTitle className="flex items-center gap-2"><XCircle className="text-orange-500"/>Weaknesses & Opportunities</CardTitle></CardHeader>
                <CardContent>
                    <ul className="list-disc pl-5 space-y-2 text-gray-300">
                        {audit.weaknesses.map((item, i) => <li key={i}>{item}</li>)}
                    </ul>
                </CardContent>
            </Card>
        </div>

        <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader><CardTitle className="flex items-center gap-2"><Target className="text-primary"/>Actionable Blueprint</CardTitle></CardHeader>
            <CardContent>
                <Accordion type="single" collapsible defaultValue="item-1">
                    <AccordionItem value="item-1">
                        <AccordionTrigger className="text-lg font-semibold">Priority 1: Now</AccordionTrigger>
                        <AccordionContent className="text-gray-300">{audit.blueprint.now}</AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                        <AccordionTrigger className="text-lg font-semibold">Priority 2: Next</AccordionTrigger>
                        <AccordionContent className="text-gray-300">{audit.blueprint.next}</AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-3">
                        <AccordionTrigger className="text-lg font-semibold">Priority 3: Later</AccordionTrigger>
                        <AccordionContent className="text-gray-300">{audit.blueprint.later}</AccordionContent>
                    </AccordionItem>
                </Accordion>
            </CardContent>
        </Card>

         <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader><CardTitle className="flex items-center gap-2"><Lightbulb className="text-yellow-400"/>Lightweight Testing Idea</CardTitle></CardHeader>
            <CardContent><p className="text-gray-300">{audit.testing}</p></CardContent>
        </Card>

        <Card className="bg-gray-900/80 border-gray-800 backdrop-blur-sm">
            <CardHeader><CardTitle className="flex items-center gap-2"><Sparkles className="text-primary"/>Ask a Follow-up</CardTitle></CardHeader>
            <CardContent>
                {error && (
                    <div className="mb-4 p-4 bg-destructive/10 border border-destructive/50 rounded-lg text-destructive-foreground">
                        <p>{error}</p>
                    </div>
                )}
                <ScrollArea className="h-72 w-full pr-4">
                    <div className="space-y-4" ref={messagesContainerRef}>
                        {messages.map((message, index) => (
                            <div
                                key={index}
                                className={cn(
                                    "flex items-start gap-3",
                                    message.role === "user" ? "justify-end" : ""
                                )}
                            >
                                {message.role === 'model' && (
                                    <Avatar className="w-8 h-8 border-2 border-primary">
                                        <AvatarFallback>AI</AvatarFallback>
                                    </Avatar>
                                )}
                                <div
                                    className={cn(
                                        "p-3 rounded-lg max-w-[85%]",
                                        message.role === "user"
                                            ? "bg-primary text-primary-foreground"
                                            : "bg-gray-800 text-foreground"
                                    )}
                                >
                                    <p className="whitespace-pre-wrap break-words">
                                        {message.parts[0].text}
                                    </p>
                                </div>
                                {message.role === 'user' && user && (
                                    <Avatar className="w-8 h-8">
                                        <AvatarImage src={user.photoURL || undefined} />
                                        <AvatarFallback>
                                            {user.isAnonymous ? 'A' : user.email?.charAt(0).toUpperCase() || 'U'}
                                        </AvatarFallback>
                                    </Avatar>
                                )}
                            </div>
                        ))}
                        {isFollowUpLoading && (
                            <div className="flex items-start gap-3">
                                <Avatar className="w-8 h-8 border-2 border-primary">
                                    <AvatarFallback>AI</AvatarFallback>
                                </Avatar>
                                <div className="flex items-center gap-1.5 bg-gray-800 px-4 py-3.5 rounded-lg">
                                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                                </div>
                            </div>
                        )}
                    </div>
                </ScrollArea>
                <Form {...followUpForm}>
                    <form onSubmit={followUpForm.handleSubmit(onFollowUpSubmit)} className="mt-4 flex items-start gap-2 border-t border-gray-700 pt-4">
                        <FormField control={followUpForm.control} name="question" render={({ field }) => (
                            <FormItem className="flex-grow">
                                <FormControl>
                                    <Textarea
                                      placeholder="e.g., Can you elaborate on the SEO weaknesses?"
                                      {...field}
                                      className="bg-gray-800 border-gray-700 focus:border-primary"
                                      onKeyDown={handleKeyDown}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}/>
                        <Button type="submit" size="icon" disabled={isFollowUpLoading}>
                            {isFollowUpLoading ? <Loader2 className="animate-spin"/> : <Send />}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
      </div>
  );
}
