"use client";

import { useState, useTransition } from "react";
import { createDeal, updateDeal, type CreateDealInput } from "@/app/(dashboard)/deals/_actions/deals";
import type { Deal } from "@/types/database";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, X, Loader2 } from "lucide-react";

const PLATFORMS = [
  { value: "instagram", label: "Instagram" },
  { value: "tiktok", label: "TikTok" },
  { value: "youtube", label: "YouTube" },
  { value: "multi", label: "Multi-platform" },
];

const DEAL_TYPES = [
  { value: "sponsored", label: "Sponsored" },
  { value: "affiliate", label: "Affiliate" },
  { value: "barter", label: "Barter" },
  { value: "ambassador", label: "Ambassador" },
  { value: "ugc", label: "UGC" },
];

const STATUSES = [
  { value: "negotiation", label: "Negotiation" },
  { value: "agreed", label: "Agreed" },
  { value: "in_progress", label: "In Progress" },
];

const DELIVERABLE_TYPES = [
  "reel",
  "post",
  "story",
  "video",
  "short",
  "photo",
  "review",
];

type Client = { id: string; name: string };

export function DealForm({
  clients,
  deal,
  dealId,
}: {
  clients: Client[];
  deal?: Deal;
  dealId?: string;
}) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [showNewClient, setShowNewClient] = useState(false);
  const [deliverables, setDeliverables] = useState<
    { type: string; count: number }[]
  >(
    deal?.deliverables?.map((d) => ({ type: d.type, count: d.count })) ?? []
  );
  const [newDeliverableType, setNewDeliverableType] = useState("reel");
  const [newDeliverableCount, setNewDeliverableCount] = useState(1);

  function addDeliverable() {
    setDeliverables((prev) => [
      ...prev,
      { type: newDeliverableType, count: newDeliverableCount },
    ]);
    setNewDeliverableCount(1);
  }

  function removeDeliverable(index: number) {
    setDeliverables((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(formData: FormData) {
    setError(null);

    const input: CreateDealInput = {
      title: formData.get("title") as string,
      brand_name: formData.get("brand_name") as string,
      platform: formData.get("platform") as string,
      deal_type: formData.get("deal_type") as string,
      amount: formData.get("amount")
        ? Number(formData.get("amount"))
        : null,
      currency: (formData.get("currency") as string) || "EUR",
      payment_terms: formData.get("payment_terms") as string,
      status: (formData.get("status") as string) || "negotiation",
      start_date: (formData.get("start_date") as string) || null,
      end_date: (formData.get("end_date") as string) || null,
      content_deadline: (formData.get("content_deadline") as string) || null,
      payment_due_date: (formData.get("payment_due_date") as string) || null,
      deliverables,
      content_requirements: formData.get("content_requirements") as string,
      notes: formData.get("notes") as string,
      client_id: showNewClient
        ? null
        : (formData.get("client_id") as string) || null,
      new_client_name: (formData.get("new_client_name") as string) || "",
      new_client_email: (formData.get("new_client_email") as string) || "",
      new_client_category:
        (formData.get("new_client_category") as string) || "",
    };

    startTransition(async () => {
      const result = dealId
        ? await updateDeal(dealId, input)
        : await createDeal(input);
      if (result?.error) {
        setError(result.error);
      }
    });
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Basic Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Deal Info</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="title">Deal Title *</Label>
            <Input
              id="title"
              name="title"
              placeholder="Summer Collection 2026"
              defaultValue={deal?.title}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="brand_name">Brand Name *</Label>
            <Input
              id="brand_name"
              name="brand_name"
              placeholder="GlowSkin Beauty"
              defaultValue={deal?.brand_name}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="platform">Platform *</Label>
            <Select name="platform" defaultValue={deal?.platform ?? "instagram"}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PLATFORMS.map((p) => (
                  <SelectItem key={p.value} value={p.value}>
                    {p.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="deal_type">Deal Type</Label>
            <Select name="deal_type" defaultValue={deal?.deal_type ?? "sponsored"}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {DEAL_TYPES.map((d) => (
                  <SelectItem key={d.value} value={d.value}>
                    {d.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Initial Status</Label>
            <Select name="status" defaultValue={deal?.status ?? "negotiation"}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STATUSES.map((s) => (
                  <SelectItem key={s.value} value={s.value}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Client */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Client</CardTitle>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setShowNewClient(!showNewClient)}
            >
              {showNewClient ? "Select Existing" : "+ New Client"}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          {showNewClient ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="new_client_name">Client Name *</Label>
                <Input
                  id="new_client_name"
                  name="new_client_name"
                  placeholder="Acme Corp"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new_client_email">Contact Email</Label>
                <Input
                  id="new_client_email"
                  name="new_client_email"
                  type="email"
                  placeholder="contact@acme.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new_client_category">Category</Label>
                <Input
                  id="new_client_category"
                  name="new_client_category"
                  placeholder="Fashion, Beauty, Tech..."
                />
              </div>
            </>
          ) : (
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="client_id">Select Client</Label>
              <Select name="client_id" defaultValue={deal?.client_id ?? undefined}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a client (optional)" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                  {clients.length === 0 && (
                    <div className="px-2 py-1.5 text-sm text-muted-foreground">
                      No clients yet
                    </div>
                  )}
                </SelectContent>
              </Select>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Financials */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Financials</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              name="amount"
              type="number"
              step="0.01"
              min="0"
              placeholder="1500.00"
              defaultValue={deal?.amount ?? undefined}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="currency">Currency</Label>
            <Select name="currency" defaultValue={deal?.currency ?? "EUR"}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="EUR">EUR (€)</SelectItem>
                <SelectItem value="USD">USD ($)</SelectItem>
                <SelectItem value="GBP">GBP (£)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="payment_terms">Payment Terms</Label>
            <Input
              id="payment_terms"
              name="payment_terms"
              placeholder="Net 30"
              defaultValue={deal?.payment_terms ?? undefined}
            />
          </div>
        </CardContent>
      </Card>

      {/* Dates */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Dates</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="start_date">Start Date</Label>
            <Input
              id="start_date"
              name="start_date"
              type="date"
              defaultValue={deal?.start_date ?? undefined}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="end_date">End Date</Label>
            <Input
              id="end_date"
              name="end_date"
              type="date"
              defaultValue={deal?.end_date ?? undefined}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="content_deadline">Content Deadline</Label>
            <Input
              id="content_deadline"
              name="content_deadline"
              type="date"
              defaultValue={deal?.content_deadline ?? undefined}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="payment_due_date">Payment Due Date</Label>
            <Input
              id="payment_due_date"
              name="payment_due_date"
              type="date"
              defaultValue={deal?.payment_due_date ?? undefined}
            />
          </div>
        </CardContent>
      </Card>

      {/* Deliverables */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Deliverables</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {deliverables.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {deliverables.map((d, i) => (
                <Badge
                  key={i}
                  variant="secondary"
                  className="gap-1 px-3 py-1.5"
                >
                  {d.count}x {d.type}
                  <button
                    type="button"
                    onClick={() => removeDeliverable(i)}
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
          <div className="flex gap-2 items-end">
            <div className="space-y-2">
              <Label>Type</Label>
              <Select
                value={newDeliverableType}
                onValueChange={setNewDeliverableType}
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DELIVERABLE_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Count</Label>
              <Input
                type="number"
                min="1"
                value={newDeliverableCount}
                onChange={(e) =>
                  setNewDeliverableCount(Number(e.target.value))
                }
                className="w-20"
              />
            </div>
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={addDeliverable}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Notes */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Additional</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="space-y-2">
            <Label htmlFor="content_requirements">
              Content Requirements
            </Label>
            <textarea
              id="content_requirements"
              name="content_requirements"
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              placeholder="Brand guidelines, hashtags, messaging..."
              defaultValue={deal?.content_requirements ?? undefined}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <textarea
              id="notes"
              name="notes"
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              placeholder="Any additional notes..."
              defaultValue={deal?.notes ?? undefined}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-3 justify-end">
        <Button type="submit" disabled={isPending}>
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {dealId ? "Save Changes" : "Create Deal"}
        </Button>
      </div>
    </form>
  );
}
