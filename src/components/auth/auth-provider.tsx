
"use client";

import { useEffect } from "react";
import { useUser, useAuth } from "@/firebase";
import { AuthContext, type AuthContextType } from "./auth-context";
import { usePathname, useRouter } from "next/navigation";
import { signInAnonymously } from "firebase/auth";

const protectedRoutes = ["/dashboard", "/chatbot", "/ecosystem", "/automation-lab", "/strategy", "/history", "/prompt-ideas", "/social-history", "/profile", "/live-assistant", "/text-to-speech", "/history/[auditId]"];
const publicRoutes = ["/login", "/signup"];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { user, isUserLoading: loading, userError } = useUser();
  const auth = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    // Wait for Firebase to determine auth state
    if (loading || !auth) {
      return;
    }

    if (userError) {
      console.error("Auth error:", userError);
    }

    const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
    const isPublicRoute = publicRoutes.includes(pathname);

    // If user is not logged in (or is anonymous) and trying to access a protected route, redirect to login
    if (isProtectedRoute && (!user || user.isAnonymous)) {
      router.push('/login');
      return;
    }

    // If a logged-in (non-anonymous) user tries to access login/signup, redirect to dashboard
    if (isPublicRoute && user && !user.isAnonymous) {
      router.push('/dashboard');
      return;
    }

    // For any other public page, if there is no user at all, sign them in anonymously
    // This allows guest access to the homepage, audits, etc. without forcing a login.
    if (!isProtectedRoute && !isPublicRoute && !user) {
      signInAnonymously(auth).catch((error) => {
        console.error("Anonymous sign-in failed:", error);
      });
    }
  }, [user, loading, userError, pathname, router, auth]);


  const value: AuthContextType = { user, loading };

  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

  // Show loading screen only for protected routes while auth state is resolving.
  if (loading && isProtectedRoute) {
    return <LoadingScreen />;
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

const LoadingScreen = () => (
    <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
             <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
             <p className="text-lg text-muted-foreground">Loading Architect AI...</p>
        </div>
    </div>
)
