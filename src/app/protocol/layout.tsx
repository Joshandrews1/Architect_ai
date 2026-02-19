
import { LandingFooter } from "@/components/layout/landing-footer";
import { LandingHeader } from "@/components/layout/landing-header";

export default function ProtocolLayout({ children }: { children: React.ReactNode }) {
  
  return (
    <div className="bg-background-dark font-display text-white">
      <LandingHeader />
      <main className="pt-24 blueprint-grid">
        {children}
      </main>
      <LandingFooter />
    </div>
  );
}
