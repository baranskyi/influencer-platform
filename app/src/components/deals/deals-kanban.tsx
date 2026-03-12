"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { getPlatformEmoji } from "./deal-status-badge";
import { updateDealStatus } from "@/app/(dashboard)/deals/_actions/deals";
import { Handshake } from "lucide-react";
import type { Deal } from "@/types/database";
import { trackEvent } from "@/lib/analytics";
import {
  type StatusConfig,
  DEFAULT_DEAL_STATUSES,
  getPipelineStatuses,
  getConditionalStatuses,
  getStatusLabel,
  getDotClassName,
} from "@/lib/deal-status-config";

function formatCurrency(amount: number | null, currency: string) {
  if (amount === null) return "—";
  return new Intl.NumberFormat("en-EU", {
    style: "currency",
    currency,
  }).format(amount);
}

export function DealsKanban({
  deals,
  statusConfig,
}: {
  deals: Deal[];
  statusConfig?: StatusConfig[];
}) {
  const config = statusConfig ?? DEFAULT_DEAL_STATUSES;
  const [localDeals, setLocalDeals] = useState<Deal[]>(deals);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);

  // Sync with parent when deals prop changes
  const dealsKey = deals.map((d) => `${d.id}:${d.status}`).join(",");
  const [prevKey, setPrevKey] = useState(dealsKey);
  if (dealsKey !== prevKey) {
    setLocalDeals(deals);
    setPrevKey(dealsKey);
  }

  // Build columns from config
  const pipelineStatuses = getPipelineStatuses(config).map((s) => s.value);
  const conditionalStatuses = getConditionalStatuses(config)
    .map((s) => s.value)
    .filter((s) => localDeals.some((d) => d.status === s));

  const columns = [...pipelineStatuses, ...conditionalStatuses];

  const grouped = columns.reduce(
    (acc, status) => {
      acc[status] = localDeals.filter((d) => d.status === status);
      return acc;
    },
    {} as Record<string, Deal[]>,
  );

  const handleDragStart = useCallback(
    (e: React.DragEvent, dealId: string) => {
      e.dataTransfer.setData("text/plain", dealId);
      e.dataTransfer.effectAllowed = "move";
      setDraggingId(dealId);
    },
    [],
  );

  const handleDragEnd = useCallback(() => {
    setDraggingId(null);
    setDragOverColumn(null);
  }, []);

  const handleDragOver = useCallback(
    (e: React.DragEvent, status: string) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";
      setDragOverColumn(status);
    },
    [],
  );

  const handleDragLeave = useCallback(() => {
    setDragOverColumn(null);
  }, []);

  const handleDrop = useCallback(
    async (e: React.DragEvent, newStatus: string) => {
      e.preventDefault();
      setDragOverColumn(null);

      const dealId = e.dataTransfer.getData("text/plain");
      if (!dealId) return;

      const deal = localDeals.find((d) => d.id === dealId);
      if (!deal || deal.status === newStatus) return;

      // Optimistic update
      const previousDeals = localDeals;
      setLocalDeals((prev) =>
        prev.map((d) => (d.id === dealId ? { ...d, status: newStatus } : d)),
      );

      trackEvent({ action: "deal_kanban_drag", label: newStatus });
      const result = await updateDealStatus(dealId, newStatus);
      if (result?.error) {
        setLocalDeals(previousDeals);
      }
    },
    [localDeals],
  );

  if (localDeals.length === 0) {
    return (
      <Card variant="glass">
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <div className="mb-4 rounded-full bg-orange/10 p-4">
            <Handshake className="h-10 w-10 text-orange" />
          </div>
          <h3 className="mb-2 text-lg font-semibold">No deals yet</h3>
          <p className="text-sm text-muted-foreground">
            Create your first deal to see the Kanban board.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="overflow-x-auto pb-4">
      <div className="flex gap-4" style={{ minWidth: "fit-content" }}>
        {columns.map((status) => {
          const columnDeals = grouped[status] ?? [];
          const label = getStatusLabel(config, status);
          const dotClass = getDotClassName(config, status);
          const isOver = dragOverColumn === status;

          return (
            <div
              key={status}
              className={`w-72 flex-shrink-0 rounded-lg border bg-card/50 backdrop-blur-sm transition-colors ${
                isOver
                  ? "border-orange ring-2 ring-orange/20"
                  : "border-border/50"
              }`}
              onDragOver={(e) => handleDragOver(e, status)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, status)}
            >
              {/* Column header */}
              <div className="flex items-center gap-2 border-b border-border/30 px-3 py-2.5">
                <span className={`h-2.5 w-2.5 rounded-full ${dotClass}`} />
                <span className="text-sm font-medium">{label}</span>
                <span className="ml-auto text-xs text-muted-foreground">
                  {columnDeals.length}
                </span>
              </div>

              {/* Cards */}
              <div className="flex flex-col gap-2 p-2" style={{ minHeight: 80 }}>
                {columnDeals.map((deal) => (
                  <div
                    key={deal.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, deal.id)}
                    onDragEnd={handleDragEnd}
                    className={`cursor-grab rounded-md border border-border/40 bg-card p-3 transition-shadow hover:shadow-md active:cursor-grabbing ${
                      draggingId === deal.id ? "opacity-50" : ""
                    }`}
                  >
                    <div className="mb-1 text-xs text-muted-foreground">
                      {getPlatformEmoji(deal.platform)} {deal.brand_name}
                    </div>
                    <Link
                      href={`/deals/${deal.id}`}
                      className="block text-sm font-medium hover:underline"
                    >
                      {deal.title}
                    </Link>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="font-mono text-xs">
                        {formatCurrency(deal.amount, deal.currency)}
                      </span>
                      {deal.content_deadline && (
                        <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">
                          {format(
                            new Date(deal.content_deadline),
                            "MMM d",
                          )}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
