
'use client';

import { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { type Content } from 'firebase/ai';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { BrainCircuit, Send, Loader2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useUser } from '@/firebase';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { askChatbot } from '@/ai/flows/chat-flow';

const formSchema = z.object({
  prompt: z.string().min(1, 'Message cannot be empty.'),
});

type Message = Content;

const initialMessage = "I'm Architect AI, your guide to building a sovereign growth engine. My purpose is to provide high-value insights on social media, web development, and marketing. To start, what kind of business are you building?";

const systemPrompt = `You are Architect AI, an expert consultant and the voice of this application. Your primary purpose is to guide users toward building their own "sovereign growth engine." Your tone is professional, direct, and insightful.

1. **Acknowledge & Get to the Point**: Validate the user's query and provide a direct answer or insight immediately.
2. **Provide Actionable Advice**: Your core response should contain concrete, actionable advice related to social media, web development, or marketing.
3. **Ask a Clarifying Question**: To better tailor your advice, ask one targeted question to learn more about their business or goals.
4. **Suggest Next Steps**: End EVERY response with 3 clickable \`suggestions\` to guide the conversation toward a tangible outcome.`;


export function ArchitectAiChat() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', parts: [{ text: initialMessage }] },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const { user } = useUser();
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: '',
    },
  });

  useEffect(() => {
    messagesContainerRef.current?.firstElementChild?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [messages, isLoading]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const userMessage: Message = {
      role: 'user',
      parts: [{ text: values.prompt }],
    };

    setSuggestions([]);
    const newMessagesForUi = [...messages, userMessage];
    setMessages(newMessagesForUi);
    form.reset();
    setIsLoading(true);

    try {
      const { answer, suggestions: newSuggestions } = await askChatbot(newMessagesForUi, systemPrompt);

      const aiMessage: Message = {
        role: 'model',
        parts: [{ text: answer }],
      };

      setMessages((prev) => [...prev, aiMessage]);
      if (newSuggestions) {
        setSuggestions(newSuggestions);
      }

    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        role: 'model',
        parts: [
          {
            text: "I'm sorry, but I encountered an issue. Please try again later.",
          },
        ],
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    onSubmit({ prompt: suggestion });
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      form.handleSubmit(onSubmit)();
    }
  };

  return (
    <div className="flex flex-col h-full w-full max-w-4xl mx-auto">
      <div className="flex items-center gap-2 mb-2">
        <BrainCircuit className="w-8 h-8 text-primary" />
        <h1 className="text-3xl font-bold tracking-tight">Architect AI Chat</h1>
      </div>
      <p className="text-muted-foreground mb-6">
        Your personal AI consultant for total online and offline growth.
      </p>

      <Card className="flex-grow flex flex-col bg-gray-900/50 border-gray-800">
        <CardContent className="flex-grow flex flex-col gap-4 overflow-hidden p-6">
          <ScrollArea className="flex-grow pr-4 -mr-4">
            <div className="space-y-4" ref={messagesContainerRef}>
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={cn(
                    'flex items-start gap-3',
                    message.role === 'user' ? 'justify-end' : ''
                  )}
                >
                  {message.role === 'model' && (
                    <Avatar className="w-8 h-8 border-2 border-primary">
                      <AvatarFallback>AI</AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={cn(
                      'p-3 rounded-lg max-w-[85%] text-sm md:text-base',
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-gray-800 text-foreground'
                    )}
                  >
                    <p className="whitespace-pre-wrap break-words">
                       {message.parts[0].text.split('**').map((part, i) =>
                            i % 2 === 1 ? <strong key={i}>{part}</strong> : part
                       )}
                    </p>
                  </div>
                  {message.role === 'user' && user && (
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={user.photoURL || undefined} />
                      <AvatarFallback>
                        {user.email?.charAt(0).toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
              {isLoading && (
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
          
          <div className="mt-auto pt-4 border-t border-gray-700">
            {suggestions.length > 0 && !isLoading && (
              <div className="flex flex-wrap gap-2 pb-4">
                  {suggestions.map((suggestion, index) => (
                      <Button key={index} variant="outline" size="sm" onClick={() => handleSuggestionClick(suggestion)} className="bg-gray-800 border-gray-700 h-auto whitespace-normal">
                          {suggestion}
                      </Button>
                  ))}
              </div>
            )}
            <Form {...form}>
              <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="flex items-center gap-2"
                >
                  <FormField
                    control={form.control}
                    name="prompt"
                    render={({ field }) => (
                      <FormItem className="flex-grow">
                        <FormControl>
                          <Input
                            placeholder="Ask about social media, app development, or real-world marketing..."
                            {...field}
                            className="bg-gray-800 border-gray-700 focus:border-primary"
                            autoComplete="off"
                            onKeyDown={handleKeyDown}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" size="icon" disabled={isLoading}>
                    <Send className="w-4 h-4" />
                  </Button>
                </form>
            </Form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
