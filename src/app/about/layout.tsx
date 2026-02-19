
import { ReactNode } from "react";

export default function AboutLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  // This layout previously contained <html> and <body> tags, which caused a Next.js
  // hydration error. The root layout at src/app/layout.tsx is responsible for these tags.
  // The necessary font styles and links have been moved to the root layout and the about page.
  return <>{children}</>;
}
