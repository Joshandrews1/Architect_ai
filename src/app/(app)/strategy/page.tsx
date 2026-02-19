"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useFirestore, errorEmitter, FirestorePermissionError } from "@/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Mail, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StrategySessionChat } from "@/components/strategy-session-chat";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Invalid email address."),
  company: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters."),
});

export default function StrategyPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const firestore = useFirestore();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      company: "",
      message: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);

    const growthRoadmapRequestsRef = collection(firestore, "growthRoadmapRequests");

    addDoc(growthRoadmapRequestsRef, {
        ...values,
        timestamp: serverTimestamp(),
    }).then(() => {
        toast({
            title: "Request Sent!",
            description: "We've received your message and will be in touch shortly.",
        });
        form.reset();
    }).catch(async (serverError) => {
        const permissionError = new FirestorePermissionError({
          path: growthRoadmapRequestsRef.path,
          operation: 'create',
          requestResourceData: values,
        });
        errorEmitter.emit('permission-error', permissionError);
        toast({
            variant: "destructive",
            title: "Submission Failed",
            description: "Could not send your message. Please try again later.",
          });
    }).finally(() => {
        setLoading(false);
    });
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      <div>
        <div className="flex items-center gap-2 mb-2">
            <Mail className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold tracking-tight">Strategy Portal</h1>
        </div>
        <p className="text-muted-foreground">
          Your path to a sovereign growth engine starts with a clear strategy. Use our AI strategist to define your objectives, then book your session with The Architect to design your custom blueprint.
        </p>
      </div>

      {/* AI Strategist Chat */}
      <StrategySessionChat />
      
      <div className="mt-6 flex justify-center">
        <Button asChild size="lg" className="bg-[#25D366] text-white hover:bg-[#128C7E]">
          <Link href="https://wa.me/message/J35JUIIPENRGP1" target="_blank" rel="noopener noreferrer">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 258" className="w-6 h-6 mr-2"><defs><linearGradient id="SVGBRLHCcSy" x1="50%" x2="50%" y1="100%" y2="0%"><stop offset="0%" stopColor="#1faf38"/><stop offset="100%" stopColor="#60d669"/></linearGradient><linearGradient id="SVGHW6lecxh" x1="50%" x2="50%" y1="100%" y2="0%"><stop offset="0%" stopColor="#f9f9f9"/><stop offset="100%" stopColor="#fff"/></linearGradient></defs><path fill="url(#SVGBRLHCcSy)" d="M5.463 127.456c-.006 21.677 5.658 42.843 16.428 61.499L4.433 252.697l65.232-17.104a123 123 0 0 0 58.8 14.97h.054c67.815 0 123.018-55.183 123.047-123.01c.013-32.867-12.775-63.773-36.009-87.025c-23.23-23.25-54.125-36.061-87.043-36.076c-67.823 0-123.022 55.18-123.05 123.004"/><path fill="url(#SVGHW6lecxh)" d="M1.07 127.416c-.007 22.457 5.86 44.38 17.014 63.704L0 257.147l67.571-17.717c18.618 10.151 39.58 15.503 60.91 15.511h.055c70.248 0 127.434-57.168 127.464-127.423c.012-34.048-13.236-66.065-37.3-90.15C194.633 13.286 162.633.014 128.536 0C58.276 0 1.099 57.16 1.071 127.416m40.24 60.376l-2.523-4.005c-10.606-16.864-16.204-36.352-16.196-56.363C22.614 69.029 70.138 21.52 128.576 21.52c28.3.012 54.896 11.044 74.9 31.06c20.003 20.018 31.01 46.628 31.003 74.93c-.026 58.395-47.551 105.91-105.943 105.91h-.042c-19.013-.01-37.66-5.116-53.922-14.765l-3.87-2.295l-40.098 10.513z"/><path fill="#fff" d="M96.678 74.148c-2.386-5.303-4.897-5.41-7.166-5.503c-1.858-.08-3.982-.074-6.104-.074c-2.124 0-5.575.799-8.492 3.984c-2.92 3.188-11.148 10.892-11.148 26.561s11.413 30.813 13.004 32.94c1.593 2.123 22.033 35.307 54.405 48.073c26.904 10.609 32.379 8.499 38.218 7.967c5.84-.53 18.844-7.702 21.497-15.139c2.655-7.436 2.655-13.81 1.859-15.142c-.796-1.327-2.92-2.124-6.105-3.716s-18.844-9.298-21.763-10.361c-2.92-1.062-5.043-1.592-7.167 1.597c-2.124 3.184-8.223 10.356-10.082 12.48c-1.857 2.129-3.716 2.394-6.9.801c-3.187-1.598-13.444-4.957-25.613-15.806c-9.468-8.442-15.86-18.867-17.718-22.056c-1.858-3.184-.199-4.91 1.398-6.497c1.431-1.427 3.186-3.719 4.78-5.578c1.588-1.86 2.118-3.187 3.18-5.311c1.063-2.126.531-3.986-.264-5.579c-.798-1.593-6.987-17.343-9.819-23.64"/></svg>
              <span>Chat on WhatsApp</span>
          </Link>
        </Button>
      </div>

      <div className="relative my-8">
        <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-gray-700" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
                Or
            </span>
        </div>
      </div>

      {/* Contact Form */}
      <Card className="w-full bg-gray-900/50 border-gray-800">
          <CardHeader>
              <CardTitle>Step 2: Book Your Session</CardTitle>
              <CardDescription>Once you're clear on your vision, fill out the form below to get started.</CardDescription>
          </CardHeader>
          <CardContent>
              <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <FormField control={form.control} name="name" render={({ field }) => (
                              <FormItem>
                                  <FormLabel>Full Name</FormLabel>
                                  <FormControl><Input placeholder="John Doe" {...field} className="bg-gray-800 border-gray-700" /></FormControl>
                                  <FormMessage />
                              </FormItem>
                          )} />
                          <FormField control={form.control} name="email" render={({ field }) => (
                              <FormItem>
                                  <FormLabel>Email Address</FormLabel>
                                  <FormControl><Input type="email" placeholder="john.doe@example.com" {...field} className="bg-gray-800 border-gray-700" /></FormControl>
                                  <FormMessage />
                              </FormItem>
                          )} />
                      </div>
                      <FormField control={form.control} name="company" render={({ field }) => (
                          <FormItem>
                              <FormLabel>Company Name (Optional)</FormLabel>
                              <FormControl><Input placeholder="Your Company Inc." {...field} className="bg-gray-800 border-gray-700" /></FormControl>
                              <FormMessage />
                          </FormItem>
                      )} />
                      <FormField control={form.control} name="message" render={({ field }) => (
                          <FormItem>
                              <FormLabel>Your Message</FormLabel>
                              <FormControl><Textarea placeholder="Tell us about your project and goals... (You can paste the summary from the AI chat above)" {...field} className="bg-gray-800 border-gray-700 min-h-[120px]" /></FormControl>
                              <FormDescription>Briefly describe your business and what you're looking to achieve.</FormDescription>
                              <FormMessage />
                          </FormItem>
                      )} />
                      <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90" disabled={loading || !firestore}>
                          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Submit Request"}
                      </Button>
                  </form>
              </Form>
          </CardContent>
      </Card>
    </div>
  );
}
