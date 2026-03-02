"use client";

import { cn } from "@/lib/utils";
import type { InvoiceStatus } from "@/types/database";

const STATUS_CONFIG: Record<
  InvoiceStatus,
  { label: string; className: string }
> = {
  draft: {
    label: "Draft",
    className: "bg-white/10 text-muted-foreground border-border/50",
  },
  sent: {
    label: "Sent",
    className: "bg-lavender/20 text-lavender border-lavender/30",
  },
  viewed: {
    label: "Viewed",
    className: "bg-orange/20 text-orange border-orange/30",
  },
  paid: {
    label: "Paid",
    className: "bg-mint/20 text-mint border-mint/30",
  },
  overdue: {
    label: "Overdue",
    className: "bg-coral/20 text-coral border-coral/30",
  },
  cancelled: {
    label: "Cancelled",
    className: "bg-white/5 text-muted-foreground/50 border-border/30",
  },
};

export function InvoiceStatusBadge({ status }: { status: InvoiceStatus }) {
  const config = STATUS_CONFIG[status] ?? STATUS_CONFIG.draft;

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium",
        config.className
      )}
    >
      {config.label}
    </span>
  );
}
