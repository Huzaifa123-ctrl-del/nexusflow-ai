import type { Metadata } from "next";
import { auth } from "@/auth";
import { MrrChart } from "@/components/dashboard/mrr-chart";
import { StatCard } from "@/components/dashboard/stat-card";
import { TasksChart } from "@/components/dashboard/tasks-chart";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getDashboardStats } from "@/lib/data/dashboard";
import { formatCurrency } from "@/lib/utils";

// CV ke liye mock
const mockStats = {
  mrr: 2400,
  mrrChangePct: 12,
  activeProjects: 3,
  activeClients: 3,
  tasks: { todo: 5, doing: 3, done: 8 },
  mrrSeries: [
    { month: "May", mrr: 800 },
    { month: "Jun", mrr: 1200 },
    { month: "Jul", mrr: 1500 },
    { month: "Aug", mrr: 1800 },
    { month: "Sep", mrr: 2100 },
    { month: "Oct", mrr: 2400 },
  ],
  recentProjects: [
    { id: "1", name: "E-commerce Website", client: "Aisha Textiles", status: "ACTIVE" as const },
    { id: "2", name: "POS System", client: "Karachi Foods", status: "ACTIVE" as const },
    { id: "3", name: "SaaS Dashboard", client: "Nexus Agency", status: "PAUSED" as const },
  ]
};

export const metadata: Metadata = { title: "Overview" };
export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await auth();
  let stats = await getDashboardStats(session!.user.orgId);

  // Agar DB me 0 hai to CV ke liye mock dikhao
  if (stats.activeClients === 0) {
    stats = mockStats as any;
  }

  const firstName = session!.user.name?.split(" ")[0];
  const openTasks = stats.tasks.todo + stats.tasks.doing;

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Welcome back{firstName? `, ${firstName}` : ""}</h1>
        <p className="text-sm text-muted-foreground">Here&apos;s where your workspace stands today.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Monthly recurring revenue" value={formatCurrency(stats.mrr)} changePct={stats.mrrChangePct} hint="vs last month" />
        <StatCard label="Active projects" value={String(stats.activeProjects)} hint="in progress" />
        <StatCard label="Open tasks" value={String(openTasks)} hint={`${stats.tasks.done} done`} />
        <StatCard label="Active clients" value={String(stats.activeClients)} hint="on retainer or project" />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Revenue</CardTitle>
            <CardDescription>MRR from active clients, last 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <MrrChart data={stats.mrrSeries} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Tasks by status</CardTitle>
            <CardDescription>Across all projects</CardDescription>
          </CardHeader>
          <CardContent>
            <TasksChart {...stats.tasks} />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent projects</CardTitle>
          <CardDescription>Last updated first</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="divide-y">
            {stats.recentProjects.map((p) => (
              <li key={p.id} className="flex items-center justify-between gap-3 py-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{p.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{p.client?? "No client"}</p>
                </div>
                <Badge variant={p.status === "ACTIVE"? "success" : p.status === "PAUSED"? "warning" : "muted"}>
                  {p.status.charAt(0) + p.status.slice(1).toLowerCase()}
                </Badge>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}