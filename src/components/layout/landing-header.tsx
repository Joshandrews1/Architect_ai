
"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import {
  Bot,
  Gauge,
  Mail,
  Network,
  Menu,
  FileText,
  BrainCircuit,
  GraduationCap,
  User,
  LogOut,
  UserCircle,
  Mic,
  DraftingCompass,
  Phone,
  Image as LucideImage,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth as useUserAuthContext } from "@/components/auth/auth-context";
import { useAuth } from "@/firebase";
import { signOut } from "firebase/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";

const navLinks = [
  { href: "/dashboard", icon: Bot, label: "AI Audit" },
  { href: "/chatbot", icon: BrainCircuit, label: "Architect AI" },
  { href: "/text-to-speech", icon: Mic, label: "Text-to-Speech" },
  { href: "/live-assistant", icon: Phone, label: "Live Assistant" },
  { href: "/infographics", icon: LucideImage, label: "Infographics Lab" },
  { href: "/ecosystem", icon: Network, label: "Google Ecosystem" },
  { href: "/automation-lab", icon: Gauge, label: "Automation Lab" },
  { href: "/strategy", icon: Mail, label: "Strategy Portal" },
  { href: "/history", icon: FileText, label: "Audit History" },
  { href: "/prompt-ideas", icon: GraduationCap, label: "Prompt Academy" },
  { href: "/about", icon: DraftingCompass, label: "About The Architect" },
];

export function LandingHeader() {
  const { user } = useUserAuthContext();
  const auth = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    if (!auth) return;
    await signOut(auth);
    router.push("/login");
  };

  return (
    <header className="fixed top-0 w-full z-50 border-b border-white/10 bg-background-dark/80 backdrop-blur-md px-6 lg:px-20 py-4">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
                <Logo className="size-8"/>
                <h2 className="text-xl font-bold tracking-tighter uppercase italic">Architect <span className="text-primary">AI</span></h2>
            </Link>
            
            <div className="flex items-center gap-4">
              {/* User Dropdown - shown on desktop if user exists */}
              {user && (
                <div className="hidden md:block">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="secondary" size="icon" className="rounded-full bg-gray-800 border-gray-700">
                        <Avatar>
                          <AvatarImage src={user?.photoURL || undefined} alt="User avatar" />
                          <AvatarFallback>{user?.isAnonymous ? 'A' : user?.email?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
                        </Avatar>
                        <span className="sr-only">Toggle user menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-gray-900 border-gray-800 text-foreground">
                      <DropdownMenuLabel>{user?.isAnonymous ? 'Guest Account' : 'My Account'}</DropdownMenuLabel>
                      <DropdownMenuSeparator className="bg-gray-700" />
                      {user?.isAnonymous ? (
                        <DropdownMenuItem onClick={() => router.push('/login')} className="cursor-pointer">
                          <User className="mr-2 h-4 w-4" />
                          <span>Login / Sign Up</span>
                        </DropdownMenuItem>
                      ) : (
                        <>
                          <DropdownMenuItem onClick={() => router.push('/profile')} className="cursor-pointer">
                            <UserCircle className="mr-2 h-4 w-4" />
                            <span>Profile</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem disabled>Settings</DropdownMenuItem>
                          <DropdownMenuSeparator className="bg-gray-700" />
                          <DropdownMenuItem onClick={handleSignOut} className="focus:bg-destructive/50 cursor-pointer">
                            <LogOut className="mr-2 h-4 w-4" />
                            <span>Logout</span>
                          </DropdownMenuItem>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}
              
              <Sheet>
                  <SheetTrigger asChild>
                      <Button variant="ghost" size="icon">
                          <Menu className="h-6 w-6" />
                          <span className="sr-only">Toggle navigation menu</span>
                      </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="bg-background-dark border-l-gray-800 flex flex-col p-0">
                      <SheetHeader className="p-6 border-b border-gray-700">
                        <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                        <Link href="/" className="flex items-center gap-3">
                            <Logo />
                            <span className="text-xl font-bold tracking-tighter uppercase italic">Architect <span className="text-primary">AI</span></span>
                        </Link>
                      </SheetHeader>
                      <ScrollArea className="flex-1">
                        <nav className="flex flex-col gap-2 p-6">
                            {user && !user.isAnonymous && (
                                <Link href="/profile" className="flex items-center gap-3 rounded-lg px-3 py-2 text-base font-medium text-muted-foreground transition-all hover:text-primary">
                                    <UserCircle className="h-5 w-5" />
                                    My Profile
                                </Link>
                            )}
                            {navLinks.map((link) => (
                                <Link 
                                  key={link.label} 
                                  href={link.href} 
                                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-base font-medium text-muted-foreground transition-all hover:text-primary"
                                >
                                    <link.icon className="h-5 w-5" />
                                    {link.label}
                                </Link>
                            ))}
                        </nav>
                      </ScrollArea>
                      <div className="flex-shrink-0 border-t border-gray-700 p-6 space-y-4">
                        {user && (
                            <div className="flex items-center gap-3">
                                <Avatar>
                                    <AvatarImage src={user.photoURL || undefined} alt="User avatar" />
                                    <AvatarFallback>{user.isAnonymous ? 'A' : user.email?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col truncate">
                                    <span className="text-sm font-semibold truncate">{user.isAnonymous ? 'Guest User' : user.displayName || user.email}</span>
                                    {!user.isAnonymous && user.email && <span className="text-xs text-muted-foreground truncate">{user.email}</span>}
                                </div>
                            </div>
                        )}
                        {user ? (
                           user.isAnonymous ? (
                            <Button variant="outline" className="w-full" onClick={() => router.push('/login')}>Login / Sign Up</Button>
                           ) : (
                            <Button variant="outline" className="w-full" onClick={handleSignOut}>Logout</Button>
                           )
                        ) : (
                           <Button variant="outline" className="w-full" onClick={() => router.push('/login')}>Login</Button>
                        )}
                        <Button asChild className="w-full bg-primary text-black px-6 py-3 rounded font-bold text-sm uppercase tracking-widest">
                            <Link href="/dashboard">Start Audit</Link>
                        </Button>
                      </div>
                  </SheetContent>
              </Sheet>
            </div>
        </div>
    </header>
  );
}

    