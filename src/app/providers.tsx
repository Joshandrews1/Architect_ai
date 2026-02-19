
'use client';

import { ReactNode } from 'react';
import { AuthProvider } from '@/components/auth/auth-provider';
import { ConditionalChatbot } from '@/components/conditional-chatbot';
import { Toaster } from '@/components/ui/toaster';
import { FirebaseClientProvider } from '@/firebase';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <FirebaseClientProvider>
      <AuthProvider>{children}</AuthProvider>
      <Toaster />
      <ConditionalChatbot />
    </FirebaseClientProvider>
  );
}
