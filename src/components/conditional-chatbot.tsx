
'use client';

import { usePathname } from 'next/navigation';
import { FloatingChatbot } from './floating-chatbot';

export function ConditionalChatbot() {
  const pathname = usePathname();
  const hideOnPaths = ['/login', '/signup', '/chatbot', '/text-to-speech', '/infographics'];

  if (hideOnPaths.includes(pathname)) {
    return null;
  }

  return <FloatingChatbot />;
}
