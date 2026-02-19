
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, XCircle, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUser } from '@/firebase';

const curriculum = [
  {
    id: 'lesson1',
    title: 'Lesson 1: The Core Components',
    concept: 'Understand the fundamental building blocks of any effective prompt: Role, Task, and Context.',
    content: `Welcome to Prompt Engineering 101! I'm your AI tutor, and I'll guide you from a beginner to a prompt master.

Every powerful prompt is built on three pillars:

- **Role:** Tell the AI *who* it should be. An expert copywriter? A friendly tutor? A senior software engineer? Defining a role sets the tone, style, and knowledge base for the response.

- **Task:** Tell the AI *what* to do. Be specific and action-oriented. Instead of "talk about my topic," use "write a 500-word blog post about the benefits of sustainable farming."

- **Context:** Give the AI the necessary background information. This could be data, examples, constraints, or the target audience for the output. The more relevant context you provide, the better the result.`,
    quiz: {
      question: 'Which part of a prompt tells the AI "who it is"?',
      options: ['Task', 'Context', 'Role', 'Format'],
      correctAnswer: 'Role',
      explanation: 'Correct! The "Role" defines the persona the AI should adopt, which is crucial for getting the right tone and style.',
    },
  },
  {
    id: 'lesson2',
    title: 'Lesson 2: Zero-Shot vs. Few-Shot Prompting',
    concept: 'Learn the difference between giving direct instructions and providing examples to guide the AI.',
    content: `Great job on the first lesson! Now, let's explore two powerful techniques.

- **Zero-Shot Prompting:** This is what we've done so far. You give the AI a task it has never seen an explicit example of before, and it uses its general knowledge to complete it. For example: "Translate 'hello' to French."

- **Few-Shot Prompting:** This is where you give the AI a few examples of what you want before you give it the final task. This is incredibly effective for complex or custom formats.

**Example:**
*User:*
Translate to French:
- sea otter => loutre de mer
- peppermint => menthe poivrée
- cheese => fromage
- computer => ?

*AI:*
- computer => ordinateur`,
    quiz: {
      question: 'When you provide the AI with examples before asking it to perform a task, what is this technique called?',
      options: ['Zero-Shot Prompting', 'Contextual Prompting', 'Few-Shot Prompting', 'Role-Based Prompting'],
      correctAnswer: 'Few-Shot Prompting',
      explanation: "Exactly! 'Few-Shot Prompting' is when you provide examples to guide the AI, leading to more accurate and better-formatted responses.",
    },
  },
  {
    id: 'lesson3',
    title: 'Lesson 3: Chain-of-Thought Reasoning',
    concept: "Encourage the AI to 'think step-by-step' to improve its accuracy on complex problems.",
    content: `You're progressing quickly! This next technique is key for solving logic puzzles or math problems.

- **Chain-of-Thought (CoT) Prompting:** Instead of just asking for the final answer, you instruct the AI to explain its reasoning process step-by-step. This simple addition forces the AI to break down the problem, which dramatically reduces errors.

**Standard Prompt:**
*User:* The cafeteria had 23 apples. If they used 20 for lunch and bought 6 more, how many apples do they have?
*AI:* 3 apples. (Incorrect)

**Chain-of-Thought Prompt:**
*User:* The cafeteria had 23 apples. If they used 20 for lunch and bought 6 more, how many apples do they have? Let's think step by step.
*AI:* Okay, let's break it down.
1. The cafeteria starts with 23 apples.
2. They use 20 apples, so 23 - 20 = 3 apples remaining.
3. They buy 6 more apples, so 3 + 6 = 9 apples.
The final answer is 9. (Correct)`,
    quiz: {
      question: 'What is the primary benefit of using Chain-of-Thought prompting?',
      options: ['It makes the AI faster.', 'It forces the AI to break down a problem, improving accuracy.', 'It only works for creative writing.', 'It reduces the cost of the AI.'],
      correctAnswer: 'It forces the AI to break down a problem, improving accuracy.',
      explanation: "You got it! Chain-of-Thought helps the AI 'reason' through a problem, which is especially useful for logic, math, and multi-step tasks.",
    },
  },
  {
    id: 'lesson4',
    title: 'Lesson 4: Structured Output',
    concept: 'Command the AI to provide responses in a specific format, like JSON or Markdown.',
    content: `Now for a pro-level skill: forcing the AI to give you perfectly formatted data. This is essential for building applications on top of AI.

The key is to be explicit in your prompt. Tell the AI **exactly** the format you need and provide an example of the schema.

**Example for JSON output:**
*User:*
Analyze the following sentence and provide the sentiment and main keywords as a JSON object. The JSON object must have two keys: "sentiment" (string) and "keywords" (array of strings).

Sentence: "This new AI platform is incredibly powerful and easy to use."

*AI:*
\`\`\`json
{
  "sentiment": "positive",
  "keywords": ["AI platform", "powerful", "easy to use"]
}
\`\`\`

This technique is crucial when you need reliable, machine-readable output.`,
    quiz: {
      question: 'To get a JSON response, what should your prompt include?',
      options: ['A request for a "list"', 'The exact JSON schema and an instruction to use it', 'The word "data"', 'A question about programming'],
      correctAnswer: 'The exact JSON schema and an instruction to use it',
      explanation: 'Precisely! By providing the schema and instructing the AI to use it, you dramatically increase the reliability of getting structured data back.',
    },
  },
    {
    id: 'lesson5',
    title: 'Lesson 5: Negative Prompts',
    concept: 'Guide the AI by telling it what you *don’t* want to see in the response.',
    content: `Sometimes, the best way to get what you want is to specify what to avoid. This is called **negative prompting**.

It's useful for refining creative work, avoiding common clichés, or steering the AI away from certain topics.

**Standard Prompt:**
*User:* Write a short poem about a sunset.
*AI:*
Golden hues paint the sky,
As the sun says its goodbye.
A fiery kiss to the day,
In a beautiful, grand display. (A bit cliché)

**With a Negative Prompt:**
*User:* Write a short poem about a sunset. **Do not use the words "golden," "fiery," or "kiss."**
*AI:*
The sky bleeds violet and gray,
As daylight quietly slips away.
The world holds its breath, a silent sigh,
Beneath an endless, bruised sky. (More unique)

Negative prompts act as creative constraints that can lead to more original outputs.`,
    quiz: {
      question: 'When would you use a negative prompt?',
      options: ['To make the AI write less text.', 'To ask the AI a question.', 'To prevent the AI from using certain words or concepts.', 'To get a JSON object.'],
      correctAnswer: 'To prevent the AI from using certain words or concepts.',
      explanation: "That's right. Negative prompts are a powerful tool for steering the AI's output and avoiding unwanted results.",
    },
  },
  {
    id: 'lesson6',
    title: 'Lesson 6: The "Act As" Persona',
    concept: "Go beyond 'Role' and command the AI to embody a character for highly specialized outputs.",
    content: `You've learned to set a **Role**, but the **"Act As"** technique is its super-powered version. It's a command that tells the AI to embody a specific character or expert, influencing its entire worldview for the conversation.

This is more than just tone; it's about adopting a specific knowledge base, opinion, and style.

**Role-based prompt:**
*User:* As a historian, tell me about the Roman Empire.
*AI:* The Roman Empire was a period of... (Factual, dry)

**"Act As" prompt:**
*User:* I want you to **act as a Roman Legionary** from the time of Julius Caesar. I will ask you questions, and you will respond from his perspective. Do not break character. Do you understand?
*AI:* Understood. I stand ready. The eagle of the Legion is my honor. What do you wish to know of Rome and its campaigns, citizen?

This unlocks new possibilities for creative writing, simulations, and expert-level Q&A.`,
    quiz: {
      question: 'What is the main difference between setting a "Role" and using "Act As"?',
      options: [
        'They are the same thing.',
        '"Act As" is more powerful because it forces the AI to adopt a complete character and perspective.',
        '"Role" is only for professional personas.',
        '"Act As" makes the AI write longer responses.',
      ],
      correctAnswer: '"Act As" is more powerful because it forces the AI to adopt a complete character and perspective.',
      explanation: 'Excellent! You understand the key difference. "Act As" is a powerful technique for creating immersive and highly specialized AI interactions.',
    },
  },
];

type QuizState = {
  [key: string]: 'unanswered' | 'correct' | 'incorrect';
};

export function PromptEngineeringTutor() {
  const { user } = useUser();
  const quizStatesKey = user ? `prompt-academy-quiz-states-${user.uid}` : 'prompt-academy-quiz-states-guest';
  const selectedAnswersKey = user ? `prompt-academy-selected-answers-${user.uid}` : 'prompt-academy-selected-answers-guest';
  
  const [quizStates, setQuizStates] = useState<QuizState>(() => {
    if (typeof window === 'undefined') {
        return curriculum.reduce((acc, lesson) => ({ ...acc, [lesson.id]: 'unanswered' }), {});
    }
    try {
        const savedState = window.localStorage.getItem(quizStatesKey);
        const initialState = curriculum.reduce((acc, lesson) => ({ ...acc, [lesson.id]: 'unanswered' }), {});
        if (savedState) {
            const parsedState = JSON.parse(savedState);
            return { ...initialState, ...parsedState };
        }
        return initialState;
    } catch (error) {
        console.error("Error reading quiz states from localStorage", error);
        return curriculum.reduce((acc, lesson) => ({ ...acc, [lesson.id]: 'unanswered' }), {});
    }
  });

  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: string]: string }>(() => {
    if (typeof window === 'undefined') return {};
    try {
        const saved = window.localStorage.getItem(selectedAnswersKey);
        return saved ? JSON.parse(saved) : {};
    } catch (error) {
        console.error("Error reading selected answers from localStorage", error);
        return {};
    }
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.setItem(quizStatesKey, JSON.stringify(quizStates));
      } catch (error) {
        console.error("Error writing quiz states to localStorage", error);
      }
    }
  }, [quizStates, quizStatesKey]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.setItem(selectedAnswersKey, JSON.stringify(selectedAnswers));
      } catch (error) {
        console.error("Error writing selected answers to localStorage", error);
      }
    }
  }, [selectedAnswers, selectedAnswersKey]);

  const handleAnswerChange = (lessonId: string, selectedOption: string) => {
    setSelectedAnswers(prev => ({...prev, [lessonId]: selectedOption}));
  };
  
  const checkAnswer = (lessonId: string) => {
      const lesson = curriculum.find(l => l.id === lessonId);
      if (!lesson) return;

      const selectedOption = selectedAnswers[lessonId];
      if (selectedOption === lesson.quiz.correctAnswer) {
          setQuizStates(prev => ({...prev, [lessonId]: 'correct'}));
      } else {
          setQuizStates(prev => ({...prev, [lessonId]: 'incorrect'}));
      }
  };

  const correctAnswersCount = Object.values(quizStates).filter(state => state === 'correct').length;
  const progress = (correctAnswersCount / curriculum.length) * 100;

  return (
    <div className="space-y-6">
      <Card className="bg-gray-900/50 border-gray-800">
        <CardHeader>
            <CardTitle>Your Progress</CardTitle>
        </CardHeader>
        <CardContent>
            <Progress value={progress} className="w-full h-4" />
            <p className="text-right text-sm text-muted-foreground mt-2">{Math.round(progress)}% Complete</p>
        </CardContent>
      </Card>
      <Accordion type="single" collapsible className="w-full">
        {curriculum.map((lesson, index) => {
          const isLocked = index > 0 && quizStates[curriculum[index - 1].id] !== 'correct';
          return (
            <AccordionItem 
              value={lesson.id} 
              key={lesson.id}
              disabled={isLocked}
              className={cn(
                "bg-gray-900/50 border-gray-800 rounded-lg mb-4 px-4 transition-opacity",
                isLocked && "opacity-60 cursor-not-allowed"
              )}
            >
              <AccordionTrigger className="text-lg font-semibold hover:no-underline text-primary disabled:cursor-not-allowed">
                 <div className='flex items-center gap-2'>
                    {isLocked && <Lock className="w-4 h-4" />}
                    {lesson.title}
                 </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-6">
                <p className="text-gray-300 whitespace-pre-wrap">
                  {lesson.content.split('**').map((part, i) =>
                      i % 2 === 1 ? <strong key={i}>{part}</strong> : part
                  )}
                </p>
                
                <div className="p-4 border-t border-gray-700 space-y-4">
                  <h3 className="font-bold text-lg">Knowledge Check</h3>
                  <p>{lesson.quiz.question}</p>
                  <RadioGroup
                      value={selectedAnswers[lesson.id]}
                      onValueChange={(value) => handleAnswerChange(lesson.id, value)}
                      disabled={quizStates[lesson.id] !== 'unanswered'}
                  >
                      {lesson.quiz.options.map(option => (
                          <div key={option} className="flex items-center space-x-2">
                              <RadioGroupItem value={option} id={`${lesson.id}-${option}`} />
                              <Label htmlFor={`${lesson.id}-${option}`}>{option}</Label>
                          </div>
                      ))}
                  </RadioGroup>
                  
                  {quizStates[lesson.id] === 'unanswered' && (
                      <Button onClick={() => checkAnswer(lesson.id)} disabled={!selectedAnswers[lesson.id]}>
                          Submit Answer
                      </Button>
                  )}

                  {quizStates[lesson.id] === 'correct' && (
                      <div className="p-4 rounded-md bg-green-900/50 text-green-300 border border-green-700 flex items-center gap-2">
                          <CheckCircle className="w-5 h-5" />
                          <div>
                              <p className="font-bold">Correct!</p>
                              <p>{lesson.quiz.explanation}</p>
                          </div>
                      </div>
                  )}
                  
                  {quizStates[lesson.id] === 'incorrect' && (
                      <div className="p-4 rounded-md bg-red-900/50 text-red-300 border border-red-700 flex items-center gap-2">
                          <XCircle className="w-5 h-5" />
                          <div>
                            <p className="font-bold">Not quite.</p>
                            <p>Give it another thought or review the lesson material.</p>
                          </div>
                      </div>
                  )}

                </div>
              </AccordionContent>
            </AccordionItem>
          )
        })}
      </Accordion>
    </div>
  );
}
