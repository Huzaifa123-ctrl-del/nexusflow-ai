"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FileText,
  LayoutDashboard,
  LogOut,
  Menu,
  Receipt,
  Settings,
  Shield,
  Sparkles,
  Users,
  Workflow,
  FolderKanban,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { signOutAction } from "@/lib/actions/auth";
import { cn, initials } from "@/lib/utils";

type ShellUser = { name?: string | null; email?: string | null; role: string; plan: string };

const NAV = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard, ready: true },
  { href: "/dashboard/clients", label: "Clients", icon: Users, ready: false },
  { href: "/dashboard/projects", label: "Projects", icon: FolderKanban, ready: false },
  { href: "/dashboard/proposals", label: "Proposals", icon: Sparkles, ready: false },
  { href: "/dashboard/invoices", label: "Invoices", icon: Receipt, ready: false },
  { href: "/dashboard/settings", label: "Settings", icon: Settings, ready: false },
];

export function AppShell({ user, children }: { user: ShellUser; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const canAdmin = user.role === "OWNER" || user.role === "ADMIN";

  useEffect(() => setOpen(false), [pathname]);

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[240px_1fr]">
      {open && (
        <button
          aria-label="Close menu"
          className="fixed inset-0 z-30 bg-background/70 backdrop-blur-sm lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-60 flex-col border-r bg-card transition-transform lg:sticky lg:top-0 lg:h-screen lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-14 items-center justify-between px-4">
          <Link href="/dashboard" className="flex items-center gap-2 text-[15px] font-semibold tracking-tight">
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Workflow className="h-3.5 w-3.5" />
            </span>
            NexusFlow AI
          </Link>
          <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Close menu" onClick={() => setOpen(false)}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <nav className="flex-1 space-y-0.5 px-2 py-2" aria-label="Main">
          {NAV.map(({ href, label, icon: Icon, ready }) => {
            const active = pathname === href;
            const base = "flex h-8 items-center gap-2.5 rounded-md px-2.5 text-[13px] font-medium";
            if (!ready) {
              return (
                <span key={href} aria-disabled className={cn(base, "cursor-not-allowed text-muted-foreground/60")}>
                  <Icon className="h-4 w-4" />
                  {label}
                  <Badge variant="muted" className="ml-auto text-[10px]">
                    Soon
                  </Badge>
                </span>
              );
            }
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(base, active ? "bg-accent text-foreground" : "text-muted-foreground hover:bg-accent/60 hover:text-foreground")}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            );
          })}
          {canAdmin && (
            <Link
              href="/admin"
              aria-current={pathname === "/admin" ? "page" : undefined}
              className={cn(
                "flex h-8 items-center gap-2.5 rounded-md px-2.5 text-[13px] font-medium",
                pathname === "/admin" ? "bg-accent text-foreground" : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"
              )}
            >
              <Shield className="h-4 w-4" />
              Admin
            </Link>
          )}
        </nav>

        <div className="border-t p-3">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/15 text-xs font-semibold text-primary">
              {initials(user.name)}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] font-medium leading-tight">{user.name}</p>
              <p className="truncate text-xs capitalize text-muted-foreground">{user.plan} plan</p>
            </div>
            <form action={signOutAction}>
              <Button type="submit" variant="ghost" size="icon" aria-label="Sign out">
                <LogOut className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-col">
        <header className="sticky top-0 z-20 flex h-14 items-center gap-2 border-b bg-background/80 px-4 backdrop-blur lg:px-8">
          <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu" onClick={() => setOpen(true)}>
            <Menu className="h-4 w-4" />
          </Button>
          <div className="ml-auto flex items-center gap-1">
            <ThemeToggle />
          </div>
        </header>
        <main className="flex-1 px-4 py-6 lg:px-8 lg:py-8">{children}</main>
      </div>
    </div>
  );
}
