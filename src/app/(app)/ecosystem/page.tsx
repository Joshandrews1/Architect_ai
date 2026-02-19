
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Network, BrainCircuit, Blocks, Database, Rocket, Table, Mail, Shuffle } from "lucide-react";

const ecosystemTools = [
  {
    name: "Gemini 2.5 Flash",
    icon: BrainCircuit,
    description: "The core intelligence engine. We leverage Google's most advanced generative models for analysis, content generation, and strategic recommendations.",
    color: "from-purple-500 to-indigo-500",
  },
  {
    name: "Vertex AI",
    icon: Blocks,
    description: "The unified platform to build, deploy, and scale machine learning models. This is where we fine-tune AI for your specific business context.",
    color: "from-blue-500 to-cyan-500",
  },
  {
    name: "Firestore",
    icon: Database,
    description: "A flexible, hyper-scalable NoSQL database that securely stores all application data, from user accounts to audit results.",
    color: "from-pink-500 to-red-500",
  },
  {
    name: "Google Cloud Run",
    icon: Rocket,
    description: "The serverless execution environment for our backend logic and automation tasks. Scales instantly from zero to infinity, ensuring peak performance.",
    color: "from-green-500 to-teal-500",
  },
  {
    name: "BigQuery",
    icon: Table,
    description: "A serverless data warehouse for running lightning-fast queries on massive datasets. The foundation for deep analytics and trend prediction.",
    color: "from-orange-500 to-amber-500",
  },
  {
    name: "n8n.io",
    icon: Shuffle,
    description: "The core workflow automation engine. We use n8n's source-available platform to connect disparate systems and orchestrate complex, multi-step processes.",
    color: "from-red-500 to-orange-500",
  },
];

export default function EcosystemPage() {
  return (
    <div className="w-full">
        <div className="flex items-center gap-2 mb-2">
            <Network className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold tracking-tight">The Sovereign Engine</h1>
        </div>
        <p className="text-muted-foreground mb-8 max-w-3xl">
          This is the engine room. An interactive overview of the sovereign Google Cloud infrastructure that powers Architect AI, ensuring scalability, security, and intelligence at every layer.
        </p>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {ecosystemTools.map((tool) => (
                <div key={tool.name} className="relative group">
                    <div className={`absolute -inset-0.5 bg-gradient-to-r ${tool.color} rounded-lg blur opacity-50 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt`}></div>
                    <Card className="relative bg-gray-900 border border-gray-800 h-full flex flex-col">
                        <CardHeader className="flex-row items-center gap-4">
                            <tool.icon className="w-10 h-10 text-primary" />
                            <CardTitle className="text-2xl text-white">{tool.name}</CardTitle>
                        </CardHeader>
                        <CardContent className="flex-grow">
                            <p className="text-gray-400">{tool.description}</p>
                        </CardContent>
                    </Card>
                </div>
            ))}
        </div>
    </div>
  );
}
