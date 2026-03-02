import { notFound } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import { createClient } from "@/lib/supabase/server";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { DealStatusSelect } from "@/components/deals/deal-status-select";
import { DeleteDealButton } from "@/components/deals/delete-deal-button";
import { getPlatformEmoji } from "@/components/deals/deal-status-badge";
import { DeliverablesChecklist } from "@/components/deals/deliverables-checklist";
import { ArrowLeft, Calendar, CreditCard, Pencil, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

function formatCurrency(amount: number | null, currency: string) {
  if (amount === null) return "—";
  return new Intl.NumberFormat("en-EU", {
    style: "currency",
    currency,
  }).format(amount);
}

function formatDate(date: string | null) {
  if (!date) return "—";
  return format(new Date(date), "MMM d, yyyy");
}

export default async function DealDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: deal } = await supabase
    .from("deals")
    .select("*, clients(name, contact_email, category)")
    .eq("id", id)
    .single();

  if (!deal) {
    notFound();
  }

  const client = deal.clients as {
    name: string;
    contact_email: string | null;
    category: string | null;
  } | null;

  const deliverables = (
    deal.deliverables as { type: string; count: number; specs?: string; completed?: boolean }[] | null
  ) ?? [];

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/deals"
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="font-serif text-3xl">{deal.title}</h1>
            <p className="text-muted-foreground">
              {deal.brand_name} · {getPlatformEmoji(deal.platform)}{" "}
              <span className="capitalize">{deal.platform}</span>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <DealStatusSelect dealId={deal.id} currentStatus={deal.status} />
          <Link href={`/deals/${deal.id}/edit`}>
            <Button variant="glass" size="sm">
              <Pencil className="h-4 w-4" />
              Edit
            </Button>
          </Link>
          <DeleteDealButton dealId={deal.id} />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main content — 2 cols */}
        <div className="space-y-6 lg:col-span-2">
          {/* Financials */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <CreditCard className="h-5 w-5" />
                Financials
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                <div>
                  <div className="text-sm text-muted-foreground">Amount</div>
                  <div className="text-2xl font-bold">
                    {formatCurrency(deal.amount, deal.currency)}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Type</div>
                  <div className="mt-1 capitalize">{deal.deal_type}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">
                    Payment Terms
                  </div>
                  <div className="mt-1">{deal.payment_terms || "—"}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Dates */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Calendar className="h-5 w-5" />
                Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground">
                    Start Date
                  </div>
                  <div className="mt-1">{formatDate(deal.start_date)}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">End Date</div>
                  <div className="mt-1">{formatDate(deal.end_date)}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">
                    Content Deadline
                  </div>
                  <div className="mt-1">
                    {formatDate(deal.content_deadline)}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">
                    Payment Due
                  </div>
                  <div className="mt-1">
                    {formatDate(deal.payment_due_date)}
                  </div>
                </div>
                {deal.paid_date && (
                  <div>
                    <div className="text-sm text-muted-foreground">
                      Paid On
                    </div>
                    <div className="mt-1 text-green-600 font-medium">
                      {formatDate(deal.paid_date)}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Deliverables */}
          {deliverables.length > 0 ? (
            <DeliverablesChecklist
              dealId={deal.id}
              deliverables={deliverables}
            />
          ) : (
            <Card variant="glass">
              <CardContent className="p-6 text-center text-muted-foreground">
                <p className="text-sm">No deliverables added to this deal.</p>
                <Link href={`/deals/${deal.id}/edit`}>
                  <Button variant="glass" size="sm" className="mt-2">
                    Add Deliverables
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}

          {/* Notes & Requirements */}
          {(deal.content_requirements || deal.notes) && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Notes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {deal.content_requirements && (
                  <div>
                    <div className="text-sm font-medium text-muted-foreground mb-1">
                      Content Requirements
                    </div>
                    <p className="text-sm whitespace-pre-wrap">
                      {deal.content_requirements}
                    </p>
                  </div>
                )}
                {deal.content_requirements && deal.notes && <Separator />}
                {deal.notes && (
                  <div>
                    <div className="text-sm font-medium text-muted-foreground mb-1">
                      Notes
                    </div>
                    <p className="text-sm whitespace-pre-wrap">{deal.notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar — 1 col */}
        <div className="space-y-6">
          {/* Client */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Users className="h-5 w-5" />
                Client
              </CardTitle>
            </CardHeader>
            <CardContent>
              {client ? (
                <div className="space-y-2">
                  <div className="font-medium">{client.name}</div>
                  {client.contact_email && (
                    <div className="text-sm text-muted-foreground">
                      {client.contact_email}
                    </div>
                  )}
                  {client.category && (
                    <Badge variant="secondary">{client.category}</Badge>
                  )}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No client linked
                </p>
              )}
            </CardContent>
          </Card>

          {/* Created */}
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Created</span>
                  <span>{formatDate(deal.created_at)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Updated</span>
                  <span>{formatDate(deal.updated_at)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
