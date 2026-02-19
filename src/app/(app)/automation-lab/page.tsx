
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Gauge, BrainCircuit, Zap, ArrowRight, Server, Shuffle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Terminal } from "@/components/terminal";
import { Separator } from "@/components/ui/separator";

const automationBenefits = [
  {
    title: "Increased Efficiency",
    description: "Automate repetitive tasks like data entry, email campaigns, and social media posting to free up your team for more strategic work.",
  },
  {
    title: "Enhanced Customer Experience",
    description: "Use chatbots for 24/7 support, personalize marketing messages, and streamline your sales process to keep customers happy.",
  },
  {
    title: "Data-Driven Decisions",
    description: "Automatically collect and analyze data from various sources to gain actionable insights into your business performance.",
  },
  {
    title: "Reduced Costs",
    description: "Lower operational costs by minimizing manual errors and reducing the need for extensive human intervention in routine processes.",
  },
];

export default function AutomationLabPage() {
  return (
    <div className="w-full space-y-8 animate-in fade-in-50">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Gauge className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight">The Automation Lab</h1>
        </div>
        <p className="text-muted-foreground max-w-3xl">
          Automation is the engine room of your sovereign business. It's where we move beyond manual tasks and build autonomous workflows that scale your operations, marketing, and sales without limits. See how Joshua Andrew uses tools like n8n.io to create these systems.
        </p>
      </div>

      <Card className="bg-gray-900/50 border-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BrainCircuit className="text-primary" />
            What is Business Automation?
          </CardTitle>
          <CardDescription>
            Simply put, it's about using technology to perform repetitive, manual tasks so you don't have to.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-6 text-gray-300">
            From marketing and sales to customer service and operations, automation streamlines your workflows, reduces errors, and frees up valuable time. It allows you to focus on what truly matters: strategy, innovation, and building meaningful relationships with your customers.
          </p>
          <div className="grid gap-6 md:grid-cols-2">
            {automationBenefits.map((benefit) => (
              <div key={benefit.title} className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                <h3 className="font-semibold text-primary">{benefit.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{benefit.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gray-900/50 border-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shuffle className="text-primary" />
            How We Use n8n.io
          </CardTitle>
          <CardDescription>
            Joshua Andrew specializes in designing and implementing bespoke automation systems using n8n.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-300">
            By integrating n8n, a leading source-available workflow automation tool, with the power of the Google Cloud ecosystem and custom AI models, he builds powerful, scalable solutions to automate your unique business processes. Whether you're looking to streamline your lead generation, automate your content pipeline, or create a fully autonomous customer support system, he provides the blueprint and the technical expertise to make it happen.
          </p>
          <p className="text-gray-300">
            His approach is not about providing one-size-fits-all software; it's about understanding your specific challenges and architecting a solution that integrates seamlessly into your existing workflow, saving you time and money while scaling your impact.
          </p>
          <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Link href="/strategy">
              Book a Strategy Session
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
        </CardContent>
      </Card>

      <div className="w-full space-y-4">
        <Separator className="my-4" />
        <div className="flex items-center gap-2">
            <Server className="w-8 h-8 text-primary" />
            <h2 className="text-2xl font-bold tracking-tight">Live Automation Simulation</h2>
        </div>
        <p className="text-muted-foreground max-w-3xl">
          This simulated terminal shows how backend automation tasks run. It visualizes processes like syncing contacts from Google, generating reports, and sending emails—all without manual intervention.
        </p>
        <Terminal />
      </div>

    </div>
  );
}
