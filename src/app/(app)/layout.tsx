
"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { LandingFooter } from "@/components/layout/landing-footer";
import { LandingHeader } from "@/components/layout/landing-header";

export default function AppLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const noFooterPaths = ['/chatbot', '/text-to-speech', '/infographics'];
  const showFooter = !noFooterPaths.includes(pathname);

  return (
    <div className="bg-background-dark font-display text-white flex flex-col min-h-screen">
      <LandingHeader />
      <main className="flex-grow pt-24">
        <div className="p-4 lg:p-6 w-full h-full">
            {children}
        </div>
      </main>
      {showFooter && <LandingFooter />}
    </div>
  );
}
