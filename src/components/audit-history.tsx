'use client';

import { useMemo } from 'react';
import { useCollection, useUser, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, limit as firestoreLimit } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDistanceToNow } from 'date-fns';
import { type AuditResult } from '@/ai/flows/audit-flow';
import Link from 'next/link';

type AuditHistoryItem = {
    id: string;
    url: string;
    auditResult: AuditResult;
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

export function AuditHistory({ listLimit }: { listLimit?: number }) {
    const { user } = useUser();
    const firestore = useFirestore();

    const historyQuery = useMemoFirebase(() => {
        if (!user || !firestore) return null;
        
        let q = query(collection(firestore, 'users', user.uid, 'webAudits'), orderBy('timestamp', 'desc'));
        
        if (listLimit) {
            q = query(q, firestoreLimit(listLimit));
        }

        return q;
    }, [user, firestore, listLimit]);
    
    const { data: history, isLoading } = useCollection<AuditHistoryItem>(historyQuery);

    if (isLoading) {
        return (
            <div className="space-y-4">
                {[...Array(listLimit || 3)].map((_, i) => (
                    <Skeleton key={i} className="h-28 w-full" />
                ))}
            </div>
        );
    }

    if (!history || history.length === 0) {
        return (
            <Card className="bg-gray-900/50 border-gray-800">
                <CardHeader>
                    <CardTitle>No Audits Yet</CardTitle>
                    <CardDescription>Run your first audit to see your history here.</CardDescription>
                </CardHeader>
            </Card>
        );
    }

    return (
        <div className="space-y-4">
            {history.map(item => (
                <Link href={`/history/${item.id}`} key={item.id} className="block">
                     <Card className="bg-gray-900/50 border-gray-800 hover:border-primary transition-colors h-full">
                        <CardHeader>
                            <CardTitle className="break-all">
                               <span title={item.url}>
                                 {getDomainName(item.url)}
                               </span>
                            </CardTitle>
                            <CardDescription>
                                Audited {item.timestamp ? formatDistanceToNow(new Date(item.timestamp.seconds * 1000), { addSuffix: true }) : 'just now'}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-gray-400 break-words">{item.auditResult?.summary}</p>
                        </CardContent>
                     </Card>
                </Link>
            ))}
        </div>
    );
}
