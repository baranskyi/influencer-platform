"use client";

import { useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DealStatusBadge, getPlatformEmoji } from "./deal-status-badge";
import { Search } from "lucide-react";
import type { Deal } from "@/types/database";

const ALL_STATUSES = [
  { value: "all", label: "All Statuses" },
  { value: "negotiation", label: "Negotiation" },
  { value: "agreed", label: "Agreed" },
  { value: "in_progress", label: "In Progress" },
  { value: "content_submitted", label: "Submitted" },
  { value: "content_approved", label: "Approved" },
  { value: "invoiced", label: "Invoiced" },
  { value: "paid", label: "Paid" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

const ALL_PLATFORMS = [
  { value: "all", label: "All Platforms" },
  { value: "instagram", label: "Instagram" },
  { value: "tiktok", label: "TikTok" },
  { value: "youtube", label: "YouTube" },
  { value: "multi", label: "Multi" },
];

function formatCurrency(amount: number | null, currency: string) {
  if (amount === null) return "—";
  return new Intl.NumberFormat("en-EU", {
    style: "currency",
    currency,
  }).format(amount);
}

export function DealsTable({ deals }: { deals: Deal[] }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [platformFilter, setPlatformFilter] = useState("all");

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
      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search deals..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {ALL_STATUSES.map((s) => (
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
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="rounded-lg border border-dashed p-8 text-center text-muted-foreground">
          {deals.length === 0
            ? "No deals yet. Create your first deal to get started."
            : "No deals match your filters."}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Deal</TableHead>
                <TableHead className="hidden sm:table-cell">
                  Platform
                </TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="hidden md:table-cell">
                  Deadline
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((deal) => (
                <TableRow key={deal.id} className="cursor-pointer">
                  <TableCell>
                    <Link
                      href={`/deals/${deal.id}`}
                      className="block space-y-1"
                    >
                      <div className="font-medium">{deal.title}</div>
                      <div className="text-sm text-muted-foreground">
                        {deal.brand_name}
                      </div>
                    </Link>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <span title={deal.platform}>
                      {getPlatformEmoji(deal.platform)}{" "}
                      <span className="capitalize">{deal.platform}</span>
                    </span>
                  </TableCell>
                  <TableCell>
                    <DealStatusBadge status={deal.status} />
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {formatCurrency(deal.amount, deal.currency)}
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                    {deal.content_deadline
                      ? format(new Date(deal.content_deadline), "MMM d, yyyy")
                      : "—"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Summary */}
      {filtered.length > 0 && (
        <div className="text-sm text-muted-foreground">
          {filtered.length} deal{filtered.length !== 1 ? "s" : ""} · Total:{" "}
          {formatCurrency(
            filtered.reduce((sum, d) => sum + (d.amount ?? 0), 0),
            "EUR"
          )}
        </div>
      )}
    </div>
  );
}
