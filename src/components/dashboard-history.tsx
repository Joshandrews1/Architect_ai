'use client';

import { AuditHistory } from '@/components/audit-history';
import { SocialAuditHistory } from '@/components/social-audit-history';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, ThumbsUp } from 'lucide-react';
import Link from 'next/link';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function DashboardHistory() {
    return (
        <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader>
                <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <FileText className="w-6 h-6 text-primary" />
                        <span>Recent Audits</span>
                    </div>
                    <Button asChild variant="ghost" size="sm">
                        <Link href="/history">View All</Link>
                    </Button>
                </CardTitle>
                <CardDescription>
                    Here are your three most recent audits.
                </CardDescription>
            </CardHeader>
            <CardContent>
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
                        <AuditHistory listLimit={3} />
                    </TabsContent>
                    <TabsContent value="social" className="mt-4">
                        <SocialAuditHistory listLimit={3} />
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
}
