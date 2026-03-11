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
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DealStatusBadge, getPlatformEmoji } from "./deal-status-badge";
import { ChevronUp, ChevronDown, ChevronsUpDown, Handshake, Plus } from "lucide-react";
import type { Deal } from "@/types/database";
import type { StatusConfig } from "@/lib/deal-status-config";

type SortColumn = "title" | "amount" | "status" | "created_at";
type SortDirection = "asc" | "desc";

function formatCurrency(amount: number | null, currency: string) {
  if (amount === null) return "—";
  return new Intl.NumberFormat("en-EU", {
    style: "currency",
    currency,
  }).format(amount);
}

interface DealsTableProps {
  deals: Deal[];
  allDealsCount: number;
  statusConfig?: StatusConfig[];
}

export function DealsTable({ deals, allDealsCount, statusConfig }: DealsTableProps) {
  const [sortColumn, setSortColumn] = useState<SortColumn>("created_at");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  function handleSort(column: SortColumn) {
    if (sortColumn === column) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortColumn(column);
      setSortDirection(column === "amount" ? "desc" : "asc");
    }
  }

  function SortIcon({ column }: { column: SortColumn }) {
    if (sortColumn !== column) {
      return <ChevronsUpDown className="ml-1 inline h-3.5 w-3.5 text-muted-foreground/50" />;
    }
    return sortDirection === "asc"
      ? <ChevronUp className="ml-1 inline h-3.5 w-3.5" />
      : <ChevronDown className="ml-1 inline h-3.5 w-3.5" />;
  }

  const sorted = [...deals].sort((a, b) => {
    let cmp = 0;
    if (sortColumn === "title") {
      cmp = a.title.localeCompare(b.title);
    } else if (sortColumn === "amount") {
      cmp = (a.amount ?? 0) - (b.amount ?? 0);
    } else if (sortColumn === "status") {
      cmp = a.status.localeCompare(b.status);
    } else if (sortColumn === "created_at") {
      cmp =
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
    }
    return sortDirection === "asc" ? cmp : -cmp;
  });

  if (deals.length === 0) {
    return (
      <Card variant="glass">
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <div className="mb-4 rounded-full bg-orange/10 p-4">
            <Handshake className="h-10 w-10 text-orange" />
          </div>
          {allDealsCount === 0 ? (
            <>
              <h3 className="mb-2 text-lg font-semibold">No deals yet</h3>
              <p className="mb-6 max-w-sm text-sm text-muted-foreground">
                Start tracking your brand collaborations by creating your first deal.
              </p>
              <Link href="/deals/new">
                <Button variant="accent">
                  <Plus className="mr-2 h-4 w-4" />
                  Create First Deal
                </Button>
              </Link>
            </>
          ) : (
            <>
              <h3 className="mb-2 text-lg font-semibold">No matches</h3>
              <p className="text-sm text-muted-foreground">
                Try adjusting your search or filters.
              </p>
            </>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="overflow-x-auto rounded-lg border border-border/50">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead
                className="cursor-pointer select-none hover:text-foreground"
                onClick={() => handleSort("title")}
              >
                Deal
                <SortIcon column="title" />
              </TableHead>
              <TableHead className="hidden sm:table-cell">
                Platform
              </TableHead>
              <TableHead
                className="cursor-pointer select-none hover:text-foreground"
                onClick={() => handleSort("status")}
              >
                Status
                <SortIcon column="status" />
              </TableHead>
              <TableHead
                className="cursor-pointer select-none text-right hover:text-foreground"
                onClick={() => handleSort("amount")}
              >
                Amount
                <SortIcon column="amount" />
              </TableHead>
              <TableHead
                className="hidden cursor-pointer select-none md:table-cell hover:text-foreground"
                onClick={() => handleSort("created_at")}
              >
                Deadline
                <SortIcon column="created_at" />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sorted.map((deal) => (
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
                  <DealStatusBadge status={deal.status} statusConfig={statusConfig} />
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

      {/* Summary */}
      {sorted.length > 0 && (
        <div className="text-sm text-muted-foreground">
          {sorted.length} deal{sorted.length !== 1 ? "s" : ""} · Total:{" "}
          {formatCurrency(
            sorted.reduce((sum, d) => sum + (d.amount ?? 0), 0),
            "EUR"
          )}
        </div>
      )}
    </>
  );
}
