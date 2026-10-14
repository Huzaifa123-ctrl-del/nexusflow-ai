import type { Metadata } from "next";
import { auth } from "@/auth";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";

export const metadata: Metadata = { title: "Admin" };
export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const session = await auth();
  await connectDB();
  const members = await User.find({ organization: session!.user.orgId }).sort({ createdAt: 1 }).lean();

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Admin</h1>
        <p className="text-sm text-muted-foreground">Visible to owners and admins only.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Team members</CardTitle>
          <CardDescription>{members.length} in this workspace</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="divide-y">
            {members.map((m) => (
              <li key={String(m._id)} className="flex items-center justify-between gap-3 py-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{m.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{m.email}</p>
                </div>
                <Badge variant={m.role === "MEMBER" ? "muted" : "default"}>{m.role}</Badge>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
