
'use client';

import { useUser } from '@/firebase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { UserCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  if (isUserLoading) {
    return (
      <div className="w-full max-w-2xl mx-auto space-y-6">
        <div className="flex items-center gap-2">
            <UserCircle className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
        </div>
        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader className="flex flex-row items-center gap-4">
            <Skeleton className="w-20 h-20 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-64" />
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
            </div>
             <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
            </div>
            <Skeleton className="h-10 w-40" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!user || user.isAnonymous) {
    return (
      <div className="w-full max-w-2xl mx-auto">
        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>You need to be logged in to view your profile.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push('/login')}>Go to Login</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6 animate-in fade-in-50">
      <div className="flex items-center gap-2">
        <UserCircle className="w-8 h-8 text-primary" />
        <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
      </div>
      <p className="text-muted-foreground">
        View and manage your account details.
      </p>

      <Card className="bg-gray-900/50 border-gray-800">
        <CardHeader className="flex flex-col md:flex-row items-center gap-4">
          <Avatar className="w-24 h-24 border-2 border-primary">
            <AvatarImage src={user.photoURL || undefined} alt="User avatar" />
            <AvatarFallback className="text-4xl">
              {user.email?.charAt(0).toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="text-center md:text-left">
            <CardTitle>{user.displayName || 'No display name set'}</CardTitle>
            <CardDescription>{user.email}</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="displayName">Display Name</Label>
            <Input id="displayName" value={user.displayName || ''} readOnly className="bg-gray-800 border-gray-700" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input id="email" value={user.email || ''} readOnly className="bg-gray-800 border-gray-700" />
          </div>
          <Button disabled>Update Profile (coming soon)</Button>
        </CardContent>
      </Card>
    </div>
  );
}
