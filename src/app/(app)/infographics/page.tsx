
'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Loader2, AlertTriangle, Download, Plus, Send, Image as ImageIcon, X, History, Trash2, Upload, FileText } from 'lucide-react';
import { generateInfographicContent, type MultiSectionReport } from '@/ai/flows/infographic-content-flow';
import { Skeleton } from '@/components/ui/skeleton';
import DynamicIcon from '@/components/dynamic-icon';
import { useToast } from '@/hooks/use-toast';
import NextImage from 'next/image';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useUser } from '@/firebase';
import { cn } from '@/lib/utils';
import * as XLSX from 'xlsx';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, Legend } from 'recharts';

type InfographicGeneration = {
    id: number;
    data: MultiSectionReport;
};

// --- Chart Components ---

// If a pie/ring chart has more slices than this, it will use a legend instead of labels.
const LABEL_THRESHOLD = 7;

const CustomBarChart = ({ data, layout, categoryKey, dataKey }: { data: any[], layout: 'horizontal' | 'vertical', categoryKey: string, dataKey: string }) => {
    return (
        <ResponsiveContainer width="100%" height={400}>
            <BarChart
                data={data}
                layout={layout}
                margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
            >
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border) / 0.5)" />
                {layout === 'horizontal' ? (
                    <>
                        <XAxis type="number" stroke="hsl(var(--muted-foreground))" />
                        <YAxis dataKey={categoryKey} type="category" stroke="hsl(var(--muted-foreground))" width={80} tick={{ fill: 'hsl(var(--foreground))' }} />
                    </>
                ) : (
                    <>
                        <XAxis dataKey={categoryKey} stroke="hsl(var(--muted-foreground))" />
                        <YAxis stroke="hsl(var(--muted-foreground))" />
                    </>
                )}
                <Tooltip
                    contentStyle={{
                        background: 'hsl(var(--background))',
                        borderColor: 'hsl(var(--border))',
                        color: 'hsl(var(--foreground))'
                    }}
                    cursor={{ fill: 'hsl(var(--primary) / 0.1)' }}
                />
                <Bar dataKey={dataKey} fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
        </ResponsiveContainer>
    );
};

const CustomLineChart = ({ data, categoryKey, dataKey }: { data: any[], categoryKey: string, dataKey: string }) => {
    return (
        <ResponsiveContainer width="100%" height={400}>
            <LineChart
                data={data}
                margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
            >
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border) / 0.5)" />
                <XAxis dataKey={categoryKey} stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                    contentStyle={{
                        background: 'hsl(var(--background))',
                        borderColor: 'hsl(var(--border))',
                        color: 'hsl(var(--foreground))'
                    }}
                    cursor={{ fill: 'hsl(var(--primary) / 0.1)' }}
                />
                <Line type="monotone" dataKey={dataKey} stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 4, fill: "hsl(var(--primary))" }} activeDot={{ r: 8 }} />
            </LineChart>
        </ResponsiveContainer>
    );
};

const CHART_COLORS_HSL = [
    'hsl(var(--chart-1))',
    'hsl(var(--chart-2))',
    'hsl(var(--chart-3))',
    'hsl(var(--chart-4))',
    'hsl(var(--chart-5))',
    'hsl(var(--chart-6))',
    'hsl(var(--chart-7))',
    'hsl(var(--chart-8))',
    'hsl(var(--chart-9))',
    'hsl(var(--chart-10))',
];

const CustomPieChart = ({ data, categoryKey, dataKey }: { data: any[], categoryKey: string, dataKey: string }) => {
    const showLegend = data.length > LABEL_THRESHOLD;
    const totalValue = useMemo(() => data.reduce((sum, entry) => sum + (entry[dataKey] || 0), 0), [data, dataKey]);

    const legendFormatter = (value: string, entry: any) => {
        const itemValue = entry?.payload?.[dataKey];
        if (totalValue > 0 && typeof itemValue === 'number') {
            const percentage = ((itemValue / totalValue) * 100).toFixed(0);
            return <span className="text-muted-foreground"><span className="text-foreground font-medium">{value}</span>&nbsp;({percentage}%)</span>;
        }
        return value;
    };

    return (
        <ResponsiveContainer width="100%" height={400}>
            <PieChart>
                <Tooltip
                    contentStyle={{
                        background: 'hsl(var(--background))',
                        borderColor: 'hsl(var(--border))',
                        color: 'hsl(var(--foreground))'
                    }}
                />
                {showLegend && <Legend formatter={legendFormatter} />}
                <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    labelLine={!showLegend}
                    label={!showLegend ? (props) => `${props.name} (${(props.percent * 100).toFixed(0)}%)` : false}
                    outerRadius={120}
                    dataKey={dataKey}
                    nameKey={categoryKey}
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={CHART_COLORS_HSL[index % CHART_COLORS_HSL.length]} />
                    ))}
                </Pie>
            </PieChart>
        </ResponsiveContainer>
    );
};

const CustomRingChart = ({ data, categoryKey, dataKey }: { data: any[], categoryKey: string, dataKey: string }) => {
    const showLegend = data.length > LABEL_THRESHOLD;
    const totalValue = useMemo(() => data.reduce((sum, entry) => sum + (entry[dataKey] || 0), 0), [data, dataKey]);

    const legendFormatter = (value: string, entry: any) => {
        const itemValue = entry?.payload?.[dataKey];
        if (totalValue > 0 && typeof itemValue === 'number') {
            const percentage = ((itemValue / totalValue) * 100).toFixed(0);
            return <span className="text-muted-foreground"><span className="text-foreground font-medium">{value}</span>&nbsp;({percentage}%)</span>;
        }
        return value;
    };
    
    return (
        <ResponsiveContainer width="100%" height={400}>
            <PieChart>
                <Tooltip
                    contentStyle={{
                        background: 'hsl(var(--background))',
                        borderColor: 'hsl(var(--border))',
                        color: 'hsl(var(--foreground))'
                    }}
                />
                {showLegend && <Legend formatter={legendFormatter} />}
                <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    labelLine={!showLegend}
                    label={!showLegend ? (props) => `${props.name} (${(props.percent * 100).toFixed(0)}%)` : false}
                    innerRadius={60}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey={dataKey}
                    nameKey={categoryKey}
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={CHART_COLORS_HSL[index % CHART_COLORS_HSL.length]} />
                    ))}
                </Pie>
            </PieChart>
        </ResponsiveContainer>
    );
};


const CustomAreaChart = ({ data, categoryKey, dataKey }: { data: any[], categoryKey: string, dataKey: string }) => {
    return (
        <ResponsiveContainer width="100%" height={400}>
            <AreaChart
                data={data}
                margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
            >
                <defs>
                    <linearGradient id="chart-fill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border) / 0.5)" />
                <XAxis dataKey={categoryKey} stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                    contentStyle={{
                        background: 'hsl(var(--background))',
                        borderColor: 'hsl(var(--border))',
                        color: 'hsl(var(--foreground))'
                    }}
                    cursor={{ fill: 'hsl(var(--primary) / 0.1)' }}
                />
                <Area type="monotone" dataKey={dataKey} stroke="hsl(var(--primary))" strokeWidth={2} fillOpacity={1} fill="url(#chart-fill)" />
                <Line type="monotone" dataKey={dataKey} stroke="hsl(var(--primary))" strokeWidth={3} dot={false} activeDot={{ r: 8 }} />
            </AreaChart>
        </ResponsiveContainer>
    );
};


// Main Report Display Component
const GeneratedReport = ({ data }: { data: MultiSectionReport }) => {
    const sectionRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});
    const { toast } = useToast();

    const handleDownloadChart = async (chartIndex: number) => {
        const element = sectionRefs.current[chartIndex];
        const section = data.sections[chartIndex];

        if (!element || !section) {
            toast({
                variant: 'destructive',
                title: "Download Failed",
                description: "Could not find the chart content to download.",
            });
            return;
        }

        toast({
            title: "Preparing Chart Download",
            description: "Your PNG is being generated. Please wait...",
        });

        try {
            const canvas = await html2canvas(element, { 
                backgroundColor: '#050505', // Match the theme's dark background
                useCORS: true,
                scale: 2,
            });
            const imgData = canvas.toDataURL('image/png');
    
            const link = document.createElement('a');
            link.href = imgData;
            link.download = `architect-ai-chart-${section.title.toLowerCase().replace(/\s+/g, '-')}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

        } catch (err) {
            console.error("Chart download error:", err);
            toast({
                variant: 'destructive',
                title: "Chart Download Failed",
                description: "There was an error creating your PNG file.",
            });
        }
    };
    
    return (
        <div className="bg-gray-900/80 p-4 md:p-8 rounded-lg border border-primary/20 backdrop-blur-sm space-y-12">
            {/* Main Title */}
            <div className="text-center">
                <h2 className="text-3xl md:text-4xl font-black text-primary tracking-tight uppercase">{data.mainTitle}</h2>
                <p className="text-base md:text-lg text-white/80 mt-2">{data.mainSubtitle}</p>
            </div>

            {/* Sections */}
            {data.sections.map((section, index) => {
                if (section.type === 'chart' && section.chart && section.data) {
                    const chartType = section.chart.type;

                    return (
                        <div key={index} className="space-y-8 py-8 border-b border-gray-800 last:border-b-0" ref={el => sectionRefs.current[index] = el}>
                            <div className="flex justify-between items-center">
                                <h3 className="text-2xl font-bold text-white flex-grow">{section.title}</h3>
                                <Button variant="ghost" size="icon" onClick={() => handleDownloadChart(index)} className="text-muted-foreground hover:text-primary">
                                    <Download className="w-5 h-5" />
                                    <span className="sr-only">Download chart section</span>
                                </Button>
                            </div>
                             {chartType === 'bar' && (
                                <CustomBarChart
                                    data={section.data}
                                    layout={section.chart.layout || 'vertical'}
                                    categoryKey={section.chart.categoryKey}
                                    dataKey={section.chart.dataKey}
                                />
                            )}
                            {chartType === 'line' && (
                                <CustomLineChart
                                    data={section.data}
                                    categoryKey={section.chart.categoryKey}
                                    dataKey={section.chart.dataKey}
                                />
                            )}
                            {chartType === 'pie' && (
                                <CustomPieChart
                                    data={section.data}
                                    categoryKey={section.chart.categoryKey}
                                    dataKey={section.chart.dataKey}
                                />
                            )}
                             {chartType === 'ring' && (
                                <CustomRingChart
                                    data={section.data}
                                    categoryKey={section.chart.categoryKey}
                                    dataKey={section.chart.dataKey}
                                />
                            )}
                            {chartType === 'area' && (
                                <CustomAreaChart
                                    data={section.data}
                                    categoryKey={section.chart.categoryKey}
                                    dataKey={section.chart.dataKey}
                                />
                            )}
                            {section.analysis && (
                                <div className="bg-black/20 p-6 rounded-lg border border-white/10">
                                    <h4 className="font-bold text-lg text-primary mb-2">Analysis</h4>
                                    <p className="text-white/80 leading-relaxed whitespace-pre-wrap">{section.analysis}</p>
                                </div>
                            )}
                        </div>
                    );
                }
                if (section.type === 'keyPoints' && section.points) {
                    return (
                        <div key={index} className="space-y-8 py-8 border-b border-gray-800 last:border-b-0">
                            <h3 className="text-2xl font-bold text-center text-white">{section.title}</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {section.points.map((point, pIndex) => (
                                    <div key={pIndex} className="flex flex-col items-center text-center">
                                        <div className="flex items-center justify-center size-16 bg-primary/10 border-2 border-primary/30 rounded-full mb-4">
                                            <DynamicIcon name={point.icon} className="text-primary size-8"/>
                                        </div>
                                        <h4 className="text-xl font-bold text-white">{point.title}</h4>
                                        <p className="text-white/70">{point.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                }
                if (section.type === 'text' && section.content) {
                     return (
                        <div key={index} className="py-8 border-b border-gray-800 last:border-b-0">
                            <div className="max-w-3xl mx-auto">
                                <h3 className="font-bold text-2xl text-primary mb-4">{section.title}</h3>
                                <p className="text-white/80 leading-relaxed whitespace-pre-wrap">
                                    {section.content.split('**').map((part, i) =>
                                        i % 2 === 1 ? <strong key={i}>{part}</strong> : part
                                    )}
                                </p>
                            </div>
                        </div>
                     );
                }
                return null;
            })}
        </div>
    );
};


export default function InfographicsPage() {
    const [textContent, setTextContent] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [generatedData, setGeneratedData] = useState<MultiSectionReport | null>(null);
    const [referenceImage, setReferenceImage] = useState<string | null>(null);
    const [referencedTextFile, setReferencedTextFile] = useState<{ name: string; content: string } | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const infographicRef = useRef<HTMLDivElement>(null);
    const pageTopRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);

    const [generationHistory, setGenerationHistory] = useState<InfographicGeneration[]>([]);
    const [historyLoaded, setHistoryLoaded] = useState(false);

    const { user } = useUser();
    const { toast } = useToast();

    // Load history from localStorage
    useEffect(() => {
        if (!user || typeof window === 'undefined') return;
        const key = `infographic-history-${user.uid}`;
        try {
            const saved = window.localStorage.getItem(key);
            if (saved) {
                setGenerationHistory(JSON.parse(saved));
            }
        } catch (e) {
            console.error("Failed to load infographic history:", e);
        }
        setHistoryLoaded(true);
    }, [user]);

    // Save history to localStorage
    useEffect(() => {
        if (!historyLoaded || !user || typeof window === 'undefined') return;
        const key = `infographic-history-${user.uid}`;
        try {
            window.localStorage.setItem(key, JSON.stringify(generationHistory));
        } catch (e) {
            console.error("Failed to save infographic history:", e);
        }
    }, [generationHistory, historyLoaded, user]);

    const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        const textarea = event.target;
        setTextContent(textarea.value);
        
        textarea.style.height = 'auto';
        const computedStyle = window.getComputedStyle(textarea);
        const lineHeight = parseFloat(computedStyle.lineHeight) || 24;
        const maxHeight = 7 * lineHeight;
        const scrollHeight = textarea.scrollHeight;

        if (scrollHeight > maxHeight) {
            textarea.style.height = `${maxHeight}px`;
            textarea.style.overflowY = 'auto';
        } else {
            textarea.style.height = `${scrollHeight}px`;
            textarea.style.overflowY = 'hidden';
        }
    };

    const processFile = (file: File) => {
        setError(null);
        if (file.type.startsWith('text/') || file.type === 'application/xml' || file.type === 'text/xml') {
            const reader = new FileReader();
            reader.onload = (e) => {
                const content = e.target?.result as string;
                setReferencedTextFile({ name: file.name, content });
            };
            reader.readAsText(file);
        } else if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setReferenceImage(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        } else if (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || file.name.endsWith('.xlsx')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const data = e.target?.result;
                    const workbook = XLSX.read(data, { type: 'array' });
                    let fullText = '';
                    workbook.SheetNames.forEach(sheetName => {
                        const worksheet = workbook.Sheets[sheetName];
                        const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
                        fullText += json.map(row => (row as any[]).join(' ')).join('\n');
                    });
                    setReferencedTextFile({ name: file.name, content: fullText });
                } catch (err) {
                    console.error("Error parsing XLSX file:", err);
                    setError("Failed to parse the XLSX file. Please ensure it's a valid Excel file.");
                }
            };
            reader.readAsArrayBuffer(file);
        } else {
            setError('Please upload a valid text, XML, Excel (.xlsx), or image file.');
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            processFile(file);
        }
    };
    
    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
        setIsDragging(false);
        const file = event.dataTransfer.files?.[0];
        if (file) {
            processFile(file);
        }
    };

    const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
            setIsDragging(true);
        }
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
            setIsDragging(false);
        }
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handlePaste = (event: React.ClipboardEvent<HTMLDivElement>) => {
        const file = event.clipboardData.files?.[0];
        if (file && file.type.startsWith('image/')) {
            event.preventDefault();
            processFile(file);
        }
    };

    const handleGeneration = async () => {
        const combinedText = [referencedTextFile?.content, textContent].filter(Boolean).join('\n\n');

        if (!combinedText && !referenceImage) {
            setError('Please provide some text or an image to generate a report.');
            return;
        }

        setLoading(true);
        setError(null);
        
        pageTopRef.current?.scrollIntoView({ behavior: 'smooth' });

        try {
            const result = await generateInfographicContent({ 
                textContent: combinedText, 
                imageDataUri: referenceImage || undefined 
            });
            setGeneratedData(result);

            const newGeneration: InfographicGeneration = {
                id: Date.now(),
                data: result,
            };
            setGenerationHistory(prev => [newGeneration, ...prev]);
            setTextContent(''); // Clear after successful iteration

        } catch (e: any) {
            setError(e.message || 'An unexpected error occurred during generation.');
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleGeneration();
        }
    };

    const handleDownload = async () => {
        const element = infographicRef.current;
        if (!element || !generatedData) {
            toast({
                variant: 'destructive',
                title: "Download Failed",
                description: "Could not find the report content to download.",
            });
            return;
        }

        toast({
            title: "Preparing Download",
            description: "Your PDF is being generated. Please wait...",
        });

        try {
            const canvas = await html2canvas(element, { 
                backgroundColor: '#050505',
                useCORS: true,
                scale: 2,
            });
            const imgData = canvas.toDataURL('image/png');
    
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'px',
                format: [canvas.width, canvas.height]
            });
    
            pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
            pdf.save(`architect-ai-report-${generatedData.mainTitle.toLowerCase().replace(/\s+/g, '-')}.pdf`);

        } catch (err) {
            console.error("PDF generation error:", err);
            toast({
                variant: 'destructive',
                title: "PDF Generation Failed",
                description: "There was an error creating your PDF file.",
            });
        }
    };

    const handleRestore = (data: MultiSectionReport) => {
        setGeneratedData(data);
        pageTopRef.current?.scrollIntoView({ behavior: 'smooth' });
        toast({ title: 'Restored report from history.' });
    };

    const handleClearHistory = () => {
        setGenerationHistory([]);
        toast({ title: 'Report history has been cleared.' });
    };

    return (
        <div className="w-full max-w-4xl mx-auto" ref={pageTopRef}>
            <div className="space-y-8 pb-48"> 
                
                {/* Initial State View */}
                {!loading && !error && !generatedData && (
                    <div className="text-center space-y-4 pt-4 md:pt-0">
                        <div className="inline-flex items-center justify-center gap-2 mb-2 bg-primary/10 text-primary p-3 rounded-full border border-primary/20">
                            <ImageIcon className="w-6 h-6" />
                        </div>
                        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Presentation Lab</h1>
                        <p className="text-muted-foreground mt-1">Transform raw data or text into a polished, multi-section document.</p>
                    </div>
                )}

                {/* Loading State */}
                {loading && (
                    <Card className="bg-gray-900/50 border-gray-800 animate-in fade-in-50">
                        <CardContent className="p-0">
                            <div className="space-y-6 p-8">
                                <Skeleton className="h-8 w-3/4 mx-auto" />
                                <Skeleton className="h-4 w-full mx-auto" />
                                <Skeleton className="h-24 w-full" />
                                <Skeleton className="h-64 w-full" />
                                <Skeleton className="h-32 w-full" />
                            </div>
                        </CardContent>
                    </Card>
                )}
                
                {/* Error State */}
                {error && !loading && (
                     <div className="p-3 my-4 bg-destructive/20 border border-destructive/50 text-destructive-foreground rounded-xl flex items-start gap-2 text-sm">
                        <AlertTriangle className="h-5 w-5 mt-0.5 flex-shrink-0"/>
                        <p>{error}</p>
                    </div>
                )}
                
                {/* Result State */}
                {generatedData && !loading && (
                    <div className="w-full max-w-4xl mx-auto">
                        <Card className="bg-gray-900/50 border-gray-800 animate-in fade-in-50">
                            <CardHeader>
                                <CardTitle>Your Generated Report</CardTitle>
                                <CardDescription>
                                Review the report below. Use the prompt at the bottom of the page to make changes.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div ref={infographicRef}>
                                    <GeneratedReport data={generatedData} />
                                    <div className="mt-12 p-6 bg-gray-800/50 rounded-lg border border-gray-700">
                                        <h4 className="font-bold text-primary mb-2">Documentation</h4>
                                        <p className="text-sm text-gray-300">{generatedData.documentation}</p>
                                    </div>
                                </div>
                            </CardContent>
                            <div className="p-6 pt-0">
                                <Button onClick={handleDownload} className="w-full">
                                    <Download className="mr-2"/>
                                    Download as PDF
                                </Button>
                            </div>
                        </Card>
                    </div>
                )}

                {/* History Section - Positioned at end of page content */}
                {!loading && historyLoaded && generationHistory.length > 0 && (
                     <Card className="mt-8 bg-gray-900/50 border-gray-800">
                        <CardHeader className="flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
                            <div>
                                <CardTitle className="flex items-center gap-2">
                                    <History className="w-5 h-5 text-primary"/>
                                    Recent Reports
                                </CardTitle>
                                <CardDescription>Your last 5 creations are saved in your browser.</CardDescription>
                            </div>
                            <Button variant="destructive" size="sm" onClick={handleClearHistory} className="w-full md:w-auto">
                                <Trash2 className="w-4 h-4 mr-2"/>
                                Clear All
                            </Button>
                        </CardHeader>
                        <CardContent className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-1">
                            {generationHistory.slice(0, 5).map(gen => (
                                <div key={gen.id} className="flex flex-col items-start gap-3 rounded-md border border-gray-700 bg-gray-800/60 p-3 sm:flex-row sm:items-center sm:justify-between">
                                    <div className="min-w-0">
                                        <p className="font-semibold truncate">{gen.data.mainTitle}</p>
                                        <p className="text-xs text-muted-foreground">{new Date(gen.id).toLocaleDateString()}</p>
                                    </div>
                                    <Button size="sm" onClick={() => handleRestore(gen.data)} className="w-full sm:w-auto">Restore</Button>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                )}
            </div>

            {/* --- Sticky Input Area --- */}
            <div className="w-full max-w-3xl mx-auto space-y-2 sticky bottom-6 z-20">
                <div
                    className={cn("relative transition-all duration-300", isDragging && "scale-105")}
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    onPaste={handlePaste}
                >
                    {isDragging && (
                        <div className="absolute inset-0 bg-primary/20 border-2 border-dashed border-primary rounded-3xl flex flex-col items-center justify-center pointer-events-none z-10">
                            <Upload className="w-10 h-10 text-primary" />
                            <p className="font-bold text-primary text-lg mt-2">Drop file to upload</p>
                        </div>
                    )}
                    <div className={cn("p-3 bg-[#1f1f1f] border border-gray-700/50 rounded-3xl w-full transition-opacity shadow-2xl shadow-black/50", isDragging && "opacity-50")}>
                        <div className="flex flex-wrap items-start gap-2 mb-2">
                            {referenceImage && (
                                <div className="relative w-20 h-20">
                                    <NextImage src={referenceImage} alt="Reference" layout="fill" objectFit="contain" className="rounded-md" />
                                    <Button
                                        variant="destructive"
                                        size="icon"
                                        className="absolute -top-2 -right-2 h-6 w-6 rounded-full z-10"
                                        onClick={() => setReferenceImage(null)}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            )}
                            {referencedTextFile && (
                                <div className="flex items-center justify-between p-2 pl-3 bg-gray-700/50 rounded-lg border border-gray-600 max-w-xs">
                                    <div className="flex items-center gap-2 min-w-0">
                                        <FileText className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                                        <p className="text-sm font-medium text-white/90 truncate">{referencedTextFile.name}</p>
                                    </div>
                                    <Button variant="ghost" size="icon" className="h-6 w-6 flex-shrink-0" onClick={() => setReferencedTextFile(null)}>
                                        <X className="w-4 w-4" />
                                    </Button>
                                </div>
                            )}
                        </div>
                        <Textarea
                            placeholder={generatedData ? "Describe the changes you want to make..." : "Paste data, text, or drop a file..."}
                            value={textContent}
                            onChange={handleTextChange}
                            className="w-full bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0 text-white/90 text-base resize-none py-2 custom-scrollbar"
                            disabled={loading}
                            rows={1}
                            onKeyDown={handleKeyDown}
                        />
                        <div className="mt-2 flex items-center justify-between border-t border-gray-800/50 pt-2">
                            <div className="flex items-center">
                                <Button variant="ghost" size="icon" className="text-muted-foreground hover:bg-gray-700/50 rounded-full h-9 w-9" onClick={() => fileInputRef.current?.click()}>
                                    <Plus className="w-5 h-5" />
                                </Button>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                    className="hidden"
                                    accept="text/*,.md,.xml,application/xml,image/*,.xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                                />
                            </div>
                            <Button onClick={handleGeneration} disabled={(!textContent && !referenceImage && !referencedTextFile) || loading} className="bg-primary hover:bg-primary/90 text-black rounded-full p-3 h-auto w-auto disabled:bg-gray-600 disabled:cursor-not-allowed">
                                {loading ? <Loader2 className="animate-spin w-5 h-5" /> : <Send className="w-5 h-5" />}
                            </Button>
                        </div>
                    </div>
                </div>
                <p className="text-xs text-center text-muted-foreground">Architect AI is experimental and can make mistakes.</p>
            </div>
        </div>
    );
}
