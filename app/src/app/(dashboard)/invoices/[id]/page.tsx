import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  DashboardShell,
  DashboardHeading,
} from "@/components/dashboard/dashboard-grid";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { InvoiceStatusSelect } from "@/components/invoices/invoice-status-select";
import { DeleteInvoiceButton } from "@/components/invoices/delete-invoice-button";
import { MarkPaidButton } from "@/components/invoices/mark-paid-button";
import { SendInvoiceButton } from "@/components/invoices/send-invoice-button";
import {
  ArrowLeft,
  FileText,
  Calendar,
  DollarSign,
  Building2,
  Handshake,
} from "lucide-react";
import { format } from "date-fns";
import type { InvoiceStatus } from "@/types/database";

export default async function InvoiceDetailPage({
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

  const { data: invoice } = await supabase
    .from("invoices")
    .select("*, clients(name, contact_email), deals(title, brand_name)")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (!invoice) notFound();

  const currency = invoice.currency ?? "EUR";
  const fmt = (n: number) =>
    new Intl.NumberFormat("en", {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
    }).format(n);

  const client = invoice.clients as Record<string, string> | null;
  const deal = invoice.deals as Record<string, string> | null;

  return (
    <DashboardShell>
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Link href="/invoices">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <FileText className="h-7 w-7 text-orange" />
          <div>
            <DashboardHeading>{invoice.invoice_number}</DashboardHeading>
            <p className="text-sm text-muted-foreground">
              Created {format(new Date(invoice.created_at), "MMM d, yyyy")}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <SendInvoiceButton
            invoiceId={invoice.id}
            currentStatus={invoice.status as InvoiceStatus}
          />
          <MarkPaidButton
            invoiceId={invoice.id}
            currentStatus={invoice.status as InvoiceStatus}
          />
          <InvoiceStatusSelect
            invoiceId={invoice.id}
            currentStatus={invoice.status as InvoiceStatus}
          />
          <DeleteInvoiceButton invoiceId={invoice.id} />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Financials */}
        <Card variant="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <DollarSign className="h-5 w-5 text-mint" />
              Financial Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-mono">
                  {fmt(Number(invoice.subtotal))}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  IVA / VAT ({Number(invoice.tax_rate)}%)
                </span>
                <span className="font-mono text-mint">
                  +{fmt(Number(invoice.tax_amount ?? 0))}
                </span>
              </div>
              {Number(invoice.irpf_rate) > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    IRPF ({Number(invoice.irpf_rate)}%)
                  </span>
                  <span className="font-mono text-coral">
                    -{fmt(Number(invoice.irpf_amount ?? 0))}
                  </span>
                </div>
              )}
              <div className="border-t border-border/50 pt-3">
                <div className="flex justify-between text-xl font-bold">
                  <span>Total</span>
                  <span className="text-orange">
                    {fmt(Number(invoice.total))}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Details */}
        <Card variant="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Calendar className="h-5 w-5 text-lavender" />
              Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Client */}
              {client && (
                <div className="flex items-start gap-3">
                  <Building2 className="mt-0.5 h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Client</p>
                    <p className="font-medium">{client.name}</p>
                    {client.contact_email && (
                      <p className="text-sm text-muted-foreground">
                        {client.contact_email}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Deal */}
              {deal && (
                <div className="flex items-start gap-3">
                  <Handshake className="mt-0.5 h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Deal</p>
                    <p className="font-medium">{deal.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {deal.brand_name}
                    </p>
                  </div>
                </div>
              )}

              {/* Dates */}
              <div className="flex items-start gap-3">
                <Calendar className="mt-0.5 h-4 w-4 text-muted-foreground" />
                <div className="space-y-1">
                  <div>
                    <p className="text-xs text-muted-foreground">Issued</p>
                    <p className="text-sm">
                      {format(new Date(invoice.issue_date), "MMMM d, yyyy")}
                    </p>
                  </div>
                  {invoice.due_date && (
                    <div>
                      <p className="text-xs text-muted-foreground">Due</p>
                      <p className="text-sm">
                        {format(new Date(invoice.due_date), "MMMM d, yyyy")}
                      </p>
                    </div>
                  )}
                  {invoice.paid_date && (
                    <div>
                      <p className="text-xs text-muted-foreground">Paid</p>
                      <p className="text-sm text-mint">
                        {format(new Date(invoice.paid_date), "MMMM d, yyyy")}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Notes */}
              {invoice.notes && (
                <div className="rounded-lg bg-white/5 p-3">
                  <p className="text-xs text-muted-foreground mb-1">Notes</p>
                  <p className="text-sm">{invoice.notes}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}
