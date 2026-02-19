import { WebAudit } from "@/components/growth-audit";
import { DashboardHistory } from "@/components/dashboard-history";

export default function DashboardPage() {
  return (
    <div className="w-full space-y-8">
      <WebAudit />
      <DashboardHistory />
    </div>
  );
}
