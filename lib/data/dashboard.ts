import { Types } from "mongoose";
import { connectDB } from "@/lib/db";
import { Client } from "@/models/Client";
import { Project } from "@/models/Project";
import { Task } from "@/models/Task";

export type DashboardStats = {
  mrr: number;
  mrrChangePct: number | null;
  mrrSeries: { month: string; mrr: number }[];
  activeProjects: number;
  activeClients: number;
  tasks: { todo: number; doing: number; done: number };
  recentProjects: { id: string; name: string; client: string | null; status: string; updatedAt: string }[];
};

export async function getDashboardStats(orgId: string): Promise<DashboardStats> {
  await connectDB();
  const org = new Types.ObjectId(orgId);

  const [clients, activeProjects, taskGroups, recent] = await Promise.all([
    Client.find({ organization: org, status: "ACTIVE" }).select("monthlyRevenue createdAt").lean(),
    Project.countDocuments({ organization: org, status: "ACTIVE" }),
    Task.aggregate<{ _id: string; count: number }>([
      { $match: { organization: org } },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]),
    Project.find({ organization: org }).sort({ updatedAt: -1 }).limit(5).populate<{ client?: { name: string } }>("client", "name").lean(),
  ]);

  // MRR history: recurring revenue of active clients that existed at each month end.
  const now = new Date();
  const mrrSeries = Array.from({ length: 6 }, (_, i) => {
    const offset = 5 - i;
    const monthEnd = new Date(now.getFullYear(), now.getMonth() - offset + 1, 0, 23, 59, 59);
    const mrr = clients.filter((c) => c.createdAt <= monthEnd).reduce((sum, c) => sum + (c.monthlyRevenue ?? 0), 0);
    return { month: monthEnd.toLocaleString("en-US", { month: "short" }), mrr };
  });

  const current = mrrSeries[5].mrr;
  const previous = mrrSeries[4].mrr;
  const mrrChangePct = previous > 0 ? ((current - previous) / previous) * 100 : null;

  const count = (s: string) => taskGroups.find((g) => g._id === s)?.count ?? 0;

  return {
    mrr: current,
    mrrChangePct,
    mrrSeries,
    activeProjects,
    activeClients: clients.length,
    tasks: { todo: count("TODO"), doing: count("DOING"), done: count("DONE") },
    recentProjects: recent.map((p) => ({
      id: String(p._id),
      name: p.name,
      client: p.client?.name ?? null,
      status: p.status,
      updatedAt: p.updatedAt.toISOString(),
    })),
  };
}
