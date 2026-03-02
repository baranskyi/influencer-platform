"use client";

import { useState, useTransition } from "react";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createInvoice } from "@/app/(dashboard)/invoices/_actions/invoices";
import { DollarSign } from "lucide-react";

type DealOption = {
  id: string;
  title: string;
  brand_name: string;
  amount: number | null;
  client_id: string | null;
};

type ClientOption = {
  id: string;
  name: string;
};

type InvoiceFormProps = {
  deals: DealOption[];
  clients: ClientOption[];
};

export function InvoiceForm({ deals, clients }: InvoiceFormProps) {
  const [isPending, startTransition] = useTransition();
  const [subtotal, setSubtotal] = useState(0);
  const [taxRate, setTaxRate] = useState(21);
  const [irpfRate, setIrpfRate] = useState(0);
  const [selectedDeal, setSelectedDeal] = useState<string>("");
  const [selectedClient, setSelectedClient] = useState<string>("");

  const taxAmount = +(subtotal * (taxRate / 100)).toFixed(2);
  const irpfAmount = +(subtotal * (irpfRate / 100)).toFixed(2);
  const total = +(subtotal + taxAmount - irpfAmount).toFixed(2);

  function handleDealSelect(dealId: string) {
    setSelectedDeal(dealId);
    const deal = deals.find((d) => d.id === dealId);
    if (deal) {
      if (deal.amount) setSubtotal(deal.amount);
      if (deal.client_id) setSelectedClient(deal.client_id);
    }
  }

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      await createInvoice({
        deal_id: selectedDeal || null,
        client_id: selectedClient || null,
        subtotal,
        tax_rate: taxRate,
        irpf_rate: irpfRate,
        currency: (formData.get("currency") as string) || "EUR",
        issue_date:
          (formData.get("issue_date") as string) ||
          new Date().toISOString().split("T")[0],
        due_date: formData.get("due_date") as string,
        notes: formData.get("notes") as string,
      });
    });
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        {/* Left column — Invoice details */}
        <Card variant="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <DollarSign className="h-5 w-5 text-mint" />
              Invoice Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Link to Deal */}
            <div className="space-y-2">
              <Label>Link to Deal (optional)</Label>
              <Select value={selectedDeal} onValueChange={handleDealSelect}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a deal" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">No deal</SelectItem>
                  {deals.map((d) => (
                    <SelectItem key={d.id} value={d.id}>
                      {d.title} — {d.brand_name}
                      {d.amount ? ` ($${d.amount})` : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Client */}
            <div className="space-y-2">
              <Label>Client</Label>
              <Select
                value={selectedClient}
                onValueChange={setSelectedClient}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select client" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">No client</SelectItem>
                  {clients.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Currency */}
            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Select name="currency" defaultValue="EUR">
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="EUR">EUR (Euro)</SelectItem>
                  <SelectItem value="USD">USD (Dollar)</SelectItem>
                  <SelectItem value="GBP">GBP (Pound)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="issue_date">Issue Date</Label>
                <Input
                  id="issue_date"
                  name="issue_date"
                  type="date"
                  defaultValue={new Date().toISOString().split("T")[0]}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="due_date">Due Date</Label>
                <Input id="due_date" name="due_date" type="date" />
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Input
                id="notes"
                name="notes"
                placeholder="Payment instructions, bank details..."
              />
            </div>
          </CardContent>
        </Card>

        {/* Right column — Financials */}
        <Card variant="glass">
          <CardHeader>
            <CardTitle className="text-lg">Financials</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Subtotal */}
            <div className="space-y-2">
              <Label htmlFor="subtotal">Subtotal</Label>
              <Input
                id="subtotal"
                type="number"
                step="0.01"
                min="0"
                value={subtotal || ""}
                onChange={(e) => setSubtotal(Number(e.target.value))}
                placeholder="0.00"
                required
              />
            </div>

            {/* Tax Rate (IVA) */}
            <div className="space-y-2">
              <Label htmlFor="tax_rate">IVA / VAT (%)</Label>
              <Select
                value={String(taxRate)}
                onValueChange={(v) => setTaxRate(Number(v))}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">0% (Exempt)</SelectItem>
                  <SelectItem value="10">10% (Reduced)</SelectItem>
                  <SelectItem value="21">21% (Standard)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* IRPF */}
            <div className="space-y-2">
              <Label htmlFor="irpf_rate">IRPF Retention (%)</Label>
              <Select
                value={String(irpfRate)}
                onValueChange={(v) => setIrpfRate(Number(v))}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">0% (None)</SelectItem>
                  <SelectItem value="7">7% (First 2 years)</SelectItem>
                  <SelectItem value="15">15% (Standard)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Calculation summary */}
            <div className="mt-6 space-y-2 rounded-lg bg-white/5 p-4">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Subtotal</span>
                <span>{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>IVA ({taxRate}%)</span>
                <span className="text-mint">+{taxAmount.toFixed(2)}</span>
              </div>
              {irpfRate > 0 && (
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>IRPF ({irpfRate}%)</span>
                  <span className="text-coral">-{irpfAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="border-t border-border/50 pt-2">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-orange">{total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Submit */}
      <div className="flex justify-end gap-3">
        <Button type="submit" variant="accent" disabled={isPending || subtotal <= 0}>
          {isPending ? "Creating..." : "Create Invoice"}
        </Button>
      </div>
    </form>
  );
}
