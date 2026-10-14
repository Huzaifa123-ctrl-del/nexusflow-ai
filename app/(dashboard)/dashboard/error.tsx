"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function DashboardError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => console.error(error), [error]);
  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-3 py-24 text-center">
      <h2 className="text-lg font-semibold">We couldn&apos;t load your dashboard</h2>
      <p className="text-sm text-muted-foreground">
        This is usually a database connection issue. Check that MONGODB_URI is set and your Atlas IP access list allows
        Vercel, then try again.
      </p>
      <Button onClick={reset}>Try again</Button>
    </div>
  );
}
