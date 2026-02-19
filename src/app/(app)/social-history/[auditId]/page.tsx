'use client';

import { useParams } from 'next/navigation';
import { useDoc, useUser, useFirestore, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { type SocialAuditResult } from '@/ai/flows/social-audit-flow';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SocialAuditResultDisplay } from '@/components/social-audit-result-display';
import { ThumbsUp } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

type AuditHistoryItem = {
    id: string;
    url: string;
    auditResult: SocialAuditResult;
    timestamp: {
        seconds: number;
        nanoseconds: number;
    } | null;
};

function getDomainName(url: string) {    
    try {
        let fullUrl = url;
        if (!/^https?:\/\//i.test(fullUrl)) {
            fullUrl = 'https://' + fullUrl;
        }
        const hostname = new URL(fullUrl).hostname;
        return hostname.replace(/^www\./, '');
    } catch (e) {
        return url; // fallback to full url if parsing fails
    }
}

export default function SocialAuditDetailPage() {
    const params = useParams();
    const auditId = params.auditId as string;

    const { user } = useUser();
    const firestore = useFirestore();

    const auditDocRef = useMemoFirebase(() => {
        if (!user || !firestore || !auditId) return null;
        return doc(firestore, 'users', user.uid, 'socialMediaAudits', auditId);
    }, [user, firestore, auditId]);

    const { data: audit, isLoading } = useDoc<AuditHistoryItem>(auditDocRef);
    
    if (isLoading) {
        return (
            <div className="w-full max-w-4xl space-y-6">
                 <div className="flex items-center gap-2 mb-2">
                    <ThumbsUp className="w-8 h-8 text-primary" />
                    <h1 className="text-3xl font-bold tracking-tight">Social Audit Result</h1>
                </div>
                <Skeleton className="h-40 w-full" />
                <div className="grid md:grid-cols-2 gap-6">
                    <Skeleton className="h-40 w-full" />
                    <Skeleton className="h-40 w-full" />
                </div>
                <Skeleton className="h-60 w-full" />
            </div>
        );
    }

    if (!audit) {
        return (
             <div className="w-full max-w-4xl">
                <div className="flex items-center gap-2 mb-2">
                    <ThumbsUp className="w-8 h-8 text-primary" />
                    <h1 className="text-3xl font-bold tracking-tight">Social Audit Result</h1>
                </div>
                <Card className="bg-gray-900/50 border-gray-800">
                    <CardHeader>
                        <CardTitle>Audit Not Found</CardTitle>
                        <CardDescription>The requested audit could not be found or you do not have permission to view it.</CardDescription>
                    </CardHeader>
                </Card>
            </div>
        );
    }

    return (
        <div className="w-full max-w-4xl">
            <div className="flex items-center gap-2 mb-2">
                <ThumbsUp className="w-8 h-8 text-primary" />
                <h1 className="text-3xl font-bold tracking-tight break-all">{getDomainName(audit.url)}</h1>
            </div>
             <p className="text-muted-foreground mb-6">
                Audited {audit.timestamp ? formatDistanceToNow(new Date(audit.timestamp.seconds * 1000), { addSuffix: true }) : 'just now'}
            </p>

            <SocialAuditResultDisplay audit={audit.auditResult} url={audit.url} />
        </div>
    );
}
