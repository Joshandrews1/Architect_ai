import { PromptEngineeringTutor } from "@/components/prompt-engineering-tutor";
import { GraduationCap } from "lucide-react";

export default function PromptIdeasPage() {
  return (
    <div className="w-full">
      <div className="flex items-center gap-2 mb-2">
          <GraduationCap className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight">Prompt Engineering Academy</h1>
      </div>
      <p className="text-muted-foreground mb-6">
        Learn how to craft effective prompts with our AI Tutor. Master the art of prompt engineering from the basics to advanced techniques.
      </p>
      <PromptEngineeringTutor />
    </div>
  );
}
