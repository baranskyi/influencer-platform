"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { DealsTable } from "./deals-table";
import { DealsKanban } from "./deals-kanban";
import { Search, LayoutList, LayoutGrid } from "lucide-react";
import type { Deal } from "@/types/database";
import { trackEvent } from "@/lib/analytics";
import {
  type StatusConfig,
  DEFAULT_DEAL_STATUSES,
  getEnabledStatuses,
} from "@/lib/deal-status-config";

const ALL_PLATFORMS = [
  { value: "all", label: "All Platforms" },
  { value: "instagram", label: "Instagram" },
  { value: "tiktok", label: "TikTok" },
  { value: "youtube", label: "YouTube" },
  { value: "multi", label: "Multi" },
];

type ViewMode = "table" | "kanban";

export function DealsPageClient({
  deals,
  statusConfig,
}: {
  deals: Deal[];
  statusConfig?: StatusConfig[];
}) {
  const config = statusConfig ?? DEFAULT_DEAL_STATUSES;
  const [view, setView] = useState<ViewMode>("table");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [platformFilter, setPlatformFilter] = useState("all");

  const enabledStatuses = getEnabledStatuses(config);
  const allStatuses = [
    { value: "all", label: "All Statuses" },
    ...enabledStatuses.map((s) => ({ value: s.value, label: s.label })),
  ];

  const filtered = deals.filter((deal) => {
    const matchesSearch =
      search === "" ||
      deal.title.toLowerCase().includes(search.toLowerCase()) ||
      deal.brand_name.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || deal.status === statusFilter;
    const matchesPlatform =
      platformFilter === "all" || deal.platform === platformFilter;
    return matchesSearch && matchesStatus && matchesPlatform;
  });

  return (
    <div className="space-y-4">
      {/* Filters + View Switcher */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search deals..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); trackEvent({ action: "deal_filter_status", label: v }); }}>
          <SelectTrigger className="w-full sm:w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {allStatuses.map((s) => (
              <SelectItem key={s.value} value={s.value}>
                {s.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={platformFilter} onValueChange={setPlatformFilter}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {ALL_PLATFORMS.map((p) => (
              <SelectItem key={p.value} value={p.value}>
                {p.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="flex gap-1">
          <Button
            variant={view === "table" ? "secondary" : "ghost"}
            size="icon"
            onClick={() => { setView("table"); trackEvent({ action: "deal_view_toggle", label: "table" }); }}
            aria-label="Table view"
          >
            <LayoutList className="h-4 w-4" />
          </Button>
          <Button
            variant={view === "kanban" ? "secondary" : "ghost"}
            size="icon"
            onClick={() => { setView("kanban"); trackEvent({ action: "deal_view_toggle", label: "kanban" }); }}
            aria-label="Kanban view"
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* View */}
      {view === "table" ? (
        <DealsTable deals={filtered} allDealsCount={deals.length} statusConfig={config} />
      ) : (
        <DealsKanban deals={filtered} statusConfig={config} />
      )}
    </div>
  );
}
