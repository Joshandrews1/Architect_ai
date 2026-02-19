'use client';

import { AuditHistory } from '@/components/audit-history';
import { SocialAuditHistory } from '@/components/social-audit-history';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, ThumbsUp } from 'lucide-react';

export default function HistoryPage() {
    return (
        <div className="w-full">
            <div className="flex items-center gap-2 mb-2">
                <FileText className="w-8 h-8 text-primary" />
                <h1 className="text-3xl font-bold tracking-tight">Audit History</h1>
            </div>
            <p className="text-muted-foreground mb-6">
                A complete record of all the audits you have performed.
            </p>
            <Tabs defaultValue="web" className="w-full">
                <TabsList className="grid w-full grid-cols-2 max-w-md">
                    <TabsTrigger value="web">
                        <FileText className="w-4 h-4 mr-2"/>
                        Web Audits
                    </TabsTrigger>
                    <TabsTrigger value="social">
                        <ThumbsUp className="w-4 h-4 mr-2"/>
                        Social Media Audits
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="web" className="mt-4">
                    <AuditHistory />
                </TabsContent>
                <TabsContent value="social" className="mt-4">
                    <SocialAuditHistory />
                </TabsContent>
            </Tabs>
        </div>
    );
}
