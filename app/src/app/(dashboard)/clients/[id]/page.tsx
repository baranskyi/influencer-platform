import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  DashboardShell,
  DashboardHeading,
  DashboardStatsRow,
  StatCard,
} from "@/components/dashboard/dashboard-grid";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ArrowLeft,
  Building2,
  Mail,
  Phone,
  Globe,
  Handshake,
  DollarSign,
  FileText,
} from "lucide-react";
import { format } from "date-fns";
import type { DealStatus, InvoiceStatus } from "@/types/database";
import { ClientDetailActions } from "@/components/clients/client-detail-actions";

export default async function ClientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) notFound();

  const { data: client } = await supabase
    .from("clients")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (!client) notFound();

  // Fetch related deals and invoices
  const [dealsRes, invoicesRes] = await Promise.all([
    supabase
      .from("deals")
      .select("id, title, brand_name, amount, currency, status, created_at")
      .eq("client_id", id)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false }),
    supabase
      .from("invoices")
      .select("id, invoice_number, total, currency, status, issue_date")
      .eq("client_id", id)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false }),
  ]);

  const deals = dealsRes.data ?? [];
  const invoices = invoicesRes.data ?? [];

  return (
    <DashboardShell>
      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        <Link href="/clients">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <Building2 className="h-7 w-7 text-lavender" />
        <div>
          <DashboardHeading>{client.name}</DashboardHeading>
          {client.category && (
            <span className="rounded-full bg-lavender/20 px-2 py-0.5 text-xs font-medium text-lavender">
              {client.category}
            </span>
          )}
        </div>
        <ClientDetailActions client={client} />
      </div>

      {/* Stats */}
      <DashboardStatsRow className="mb-6">
        <StatCard
          label="Total Deals"
          value={String(deals.length)}
          icon={<Handshake className="h-4 w-4" />}
        />
        <StatCard
          label="Total Revenue"
          value={`$${deals
            .filter((d: Record<string, unknown>) =>
              ["paid", "completed"].includes(d.status as string)
            )
            .reduce(
              (sum: number, d: Record<string, unknown>) =>
                sum + Number(d.amount ?? 0),
              0
            )
            .toLocaleString()}`}
          icon={<DollarSign className="h-4 w-4" />}
        />
        <StatCard
          label="Invoices"
          value={String(invoices.length)}
          icon={<FileText className="h-4 w-4" />}
        />
        <StatCard
          label="Payment Rating"
          value={client.payment_rating ? `${client.payment_rating}/5` : "N/A"}
          icon={<DollarSign className="h-4 w-4" />}
        />
      </DashboardStatsRow>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Contact Info */}
        <Card variant="glass">
          <CardHeader>
            <CardTitle className="text-lg">Contact Info</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {client.contact_name && (
              <div className="flex items-center gap-2 text-sm">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                {client.contact_name}
              </div>
            )}
            {client.contact_email && (
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <a
                  href={`mailto:${client.contact_email}`}
                  className="text-orange hover:underline"
                >
                  {client.contact_email}
                </a>
              </div>
            )}
            {client.contact_phone && (
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                {client.contact_phone}
              </div>
            )}
            {client.website && (
              <div className="flex items-center gap-2 text-sm">
                <Globe className="h-4 w-4 text-muted-foreground" />
                <a
                  href={client.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-orange hover:underline"
                >
                  {client.website}
                </a>
              </div>
            )}
            {client.notes && (
              <div className="rounded-lg bg-white/5 p-3 mt-3">
                <p className="text-xs text-muted-foreground mb-1">Notes</p>
                <p className="text-sm">{client.notes}</p>
              </div>
            )}
            {!client.contact_name &&
              !client.contact_email &&
              !client.contact_phone &&
              !client.website && (
                <p className="text-sm text-muted-foreground">
                  No contact info added yet.
                </p>
              )}
          </CardContent>
        </Card>

        {/* Recent Deals */}
        <Card variant="glass">
          <CardHeader>
            <CardTitle className="text-lg">Deals</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {deals.length === 0 ? (
              <p className="p-4 text-sm text-muted-foreground">
                No deals with this client yet.
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Deal</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {deals.slice(0, 10).map((deal: Record<string, unknown>) => (
                    <TableRow key={deal.id as string}>
                      <TableCell>
                        <Link
                          href={`/deals/${deal.id}`}
                          className="text-sm font-medium text-orange hover:underline"
                        >
                          {deal.title as string}
                        </Link>
                      </TableCell>
                      <TableCell className="text-right font-mono text-sm">
                        {deal.amount
                          ? `$${Number(deal.amount).toLocaleString()}`
                          : "—"}
                      </TableCell>
                      <TableCell>
                        <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-medium">
                          {(deal.status as DealStatus).replace(/_/g, " ")}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Invoices */}
        {invoices.length > 0 && (
          <Card variant="glass" className="md:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg">Invoices</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice #</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Issued</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoices.map((inv: Record<string, unknown>) => (
                    <TableRow key={inv.id as string}>
                      <TableCell>
                        <Link
                          href={`/invoices/${inv.id}`}
                          className="font-medium text-orange hover:underline"
                        >
                          {inv.invoice_number as string}
                        </Link>
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        ${Number(inv.total).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-medium">
                          {inv.status as InvoiceStatus}
                        </span>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {format(
                          new Date(inv.issue_date as string),
                          "MMM d, yyyy"
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardShell>
  );
}
