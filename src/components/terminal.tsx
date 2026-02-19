"use client";

import { useEffect, useState, useRef } from "react";
import { cn } from "@/lib/utils";

const initialLog = {
  id: 0,
  level: "INFO" as const,
  message: "Initializing Automation Simulation... Stand by for status updates.",
  timestamp: new Date().toISOString(),
};

const mockLogs = [
    "Connecting to Firestore collection 'tasks'...",
    "Connection successful. Listening for new automation jobs.",
    "Found new task: 'sync-contacts'. Processing...",
    "API call to Google People API initiated.",
    "Successfully fetched 24 new contacts.",
    "Writing contacts to CRM database...",
    "Task 'sync-contacts' completed successfully. [status: DONE]",
    "Found new task: 'generate-weekly-report'. Processing...",
    "Querying analytics data from BigQuery...",
    "Data aggregation complete. 1,452 events processed.",
    "Generating PDF report using Google Docs API...",
    "Report 'weekly-digest-2024-w28.pdf' created.",
    "Uploading report to Google Drive folder 'Weekly Reports'...",
    "Upload complete.",
    "Sending report via Gmail to stakeholders...",
    "Email sent successfully.",
    "Task 'generate-weekly-report' completed successfully. [status: DONE]",
    "System idle. Awaiting next task...",
];

type LogEntry = {
    id: number;
    level: "INFO" | "WARN" | "ERROR" | "SUCCESS";
    message: string;
    timestamp: string;
};

export function Terminal() {
  const [logs, setLogs] = useState<LogEntry[]>([initialLog]);
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let logIndex = 0;
    const intervalId = setInterval(() => {
      if (logIndex >= mockLogs.length) {
        clearInterval(intervalId);
        return;
      }

      const message = mockLogs[logIndex];
      const level = message.includes("successfully") ? "SUCCESS" : "INFO";

      setLogs(prev => [...prev, {
          id: prev.length,
          level: level as "SUCCESS" | "INFO",
          message: message,
          timestamp: new Date().toISOString(),
      }]);

      logIndex++;
    }, 1500);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    if (terminalRef.current) {
        terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [logs]);
  
  const formatTimestamp = (ts: string) => ts.slice(11, 19);

  return (
    <div className="w-full h-[60vh] bg-black border border-gray-800 rounded-lg shadow-2xl shadow-primary/10 font-code text-sm">
        <div className="flex items-center justify-between h-10 px-4 bg-gray-900 rounded-t-lg border-b border-gray-800">
            <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-red-500 rounded-full"></span>
                <span className="w-3 h-3 bg-yellow-500 rounded-full"></span>
                <span className="w-3 h-3 bg-green-500 rounded-full"></span>
            </div>
            <p className="text-xs text-gray-400">/var/log/architect-ai/automation.log</p>
            <div/>
        </div>
        <div ref={terminalRef} className="p-4 h-[calc(60vh-2.5rem)] overflow-y-auto">
            {logs.map(log => (
                <div key={log.id} className="flex gap-4">
                    <span className="text-gray-600 flex-shrink-0">{formatTimestamp(log.timestamp)}</span>
                    <span className={cn("font-bold w-20 flex-shrink-0", {
                        "text-blue-400": log.level === "INFO",
                        "text-yellow-400": log.level === "WARN",
                        "text-red-400": log.level === "ERROR",
                        "text-green-400": log.level === "SUCCESS",
                    })}>
                        [{log.level}]
                    </span>
                    <p className="text-gray-300 break-words">{log.message}</p>
                </div>
            ))}
        </div>
    </div>
  );
}
