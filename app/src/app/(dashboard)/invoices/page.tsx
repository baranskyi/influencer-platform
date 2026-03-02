import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import {
  DashboardShell,
  DashboardHeading,
  DashboardStatsRow,
  StatCard,
} from "@/components/dashboard/dashboard-grid";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { InvoiceStatusBadge } from "@/components/invoices/invoice-status-badge";
import {
  Plus,
  FileText,
  DollarSign,
  Clock,
  AlertTriangle,
} from "lucide-react";
import { format } from "date-fns";
import type { InvoiceStatus } from "@/types/database";

export default async function InvoicesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let invoices: Array<{
    id: string;
    invoice_number: string;
    subtotal: number;
    total: number;
    currency: string;
    status: InvoiceStatus;
    issue_date: string;
    due_date: string | null;
    client_name: string | null;
    deal_title: string | null;
  }> = [];

  if (user) {
    const { data } = await supabase
      .from("invoices")
      .select(
        "id, invoice_number, subtotal, total, currency, status, issue_date, due_date, clients(name), deals(title)"
      )
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    invoices = (data ?? []).map((inv: Record<string, unknown>) => ({
      id: inv.id as string,
      invoice_number: inv.invoice_number as string,
      subtotal: Number(inv.subtotal),
      total: Number(inv.total),
      currency: inv.currency as string,
      status: inv.status as InvoiceStatus,
      issue_date: inv.issue_date as string,
      due_date: inv.due_date as string | null,
      client_name:
        (inv.clients as Record<string, string> | null)?.name ?? null,
      deal_title:
        (inv.deals as Record<string, string> | null)?.title ?? null,
    }));
  }

  // Calculate stats
  const totalRevenue = invoices
    .filter((i) => i.status === "paid")
    .reduce((sum, i) => sum + i.total, 0);
  const pendingAmount = invoices
    .filter((i) => ["sent", "viewed"].includes(i.status))
    .reduce((sum, i) => sum + i.total, 0);
  const overdueAmount = invoices
    .filter((i) => i.status === "overdue")
    .reduce((sum, i) => sum + i.total, 0);
  const draftCount = invoices.filter((i) => i.status === "draft").length;

  const currency = invoices[0]?.currency ?? "EUR";
  const fmt = (n: number) =>
    new Intl.NumberFormat("en", {
      style: "currency",
      currency,
      minimumFractionDigits: 0,
    }).format(n);

  return (
    <DashboardShell>
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FileText className="h-7 w-7 text-orange" />
          <DashboardHeading>Invoices</DashboardHeading>
        </div>
        <Link href="/invoices/generate">
          <Button variant="accent" size="sm">
            <Plus className="h-4 w-4" />
            Generate Invoice
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <DashboardStatsRow className="mb-6">
        <StatCard
          label="Paid"
          value={fmt(totalRevenue)}
          trend={`${invoices.filter((i) => i.status === "paid").length} invoices`}
          trendDirection="up"
          icon={<DollarSign className="h-4 w-4" />}
        />
        <StatCard
          label="Pending"
          value={fmt(pendingAmount)}
          trend={`${invoices.filter((i) => ["sent", "viewed"].includes(i.status)).length} invoices`}
          trendDirection="neutral"
          icon={<Clock className="h-4 w-4" />}
        />
        <StatCard
          label="Overdue"
          value={fmt(overdueAmount)}
          trend={`${invoices.filter((i) => i.status === "overdue").length} invoices`}
          trendDirection="down"
          icon={<AlertTriangle className="h-4 w-4" />}
        />
        <StatCard
          label="Drafts"
          value={String(draftCount)}
          trend="awaiting send"
          trendDirection="neutral"
          icon={<FileText className="h-4 w-4" />}
        />
      </DashboardStatsRow>

      {/* Invoice Table */}
      <Card variant="glass">
        <CardContent className="p-0">
          {invoices.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              <FileText className="mx-auto mb-3 h-10 w-10 opacity-50" />
              <p>No invoices yet.</p>
              <p className="text-sm">
                Generate your first invoice from a completed deal.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice #</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Deal</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Issued</TableHead>
                  <TableHead>Due</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map((inv) => (
                  <TableRow key={inv.id}>
                    <TableCell>
                      <Link
                        href={`/invoices/${inv.id}`}
                        className="font-medium text-orange hover:underline"
                      >
                        {inv.invoice_number}
                      </Link>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {inv.client_name ?? "—"}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm truncate max-w-[150px]">
                      {inv.deal_title ?? "—"}
                    </TableCell>
                    <TableCell className="text-right font-mono font-medium">
                      {fmt(inv.total)}
                    </TableCell>
                    <TableCell>
                      <InvoiceStatusBadge status={inv.status} />
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {format(new Date(inv.issue_date), "MMM d, yyyy")}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {inv.due_date
                        ? format(new Date(inv.due_date), "MMM d, yyyy")
                        : "—"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </DashboardShell>
  );
}
