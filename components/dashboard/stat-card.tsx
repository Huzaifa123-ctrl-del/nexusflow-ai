import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  hint,
  changePct,
}: {
  label: string;
  value: string;
  hint?: string;
  changePct?: number | null;
}) {
  const up = (changePct ?? 0) >= 0;
  return (
    <Card className="p-5">
      <p className="text-[13px] text-muted-foreground">{label}</p>
      <p className="mt-2 text-2xl font-semibold tracking-tight tabular-nums">{value}</p>
      <div className="mt-1 flex h-5 items-center gap-1 text-xs text-muted-foreground">
        {changePct != null ? (
          <span className={cn("inline-flex items-center font-medium", up ? "text-emerald-600 dark:text-emerald-400" : "text-destructive")}>
            {up ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
            {Math.abs(changePct).toFixed(1)}%
          </span>
        ) : null}
        {hint}
      </div>
    </Card>
  );
}
