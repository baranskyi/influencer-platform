"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getStatusConfig } from "@/lib/get-status-config";
import { getPaidStatuses, getEnabledStatuses } from "@/lib/deal-status-config";

export type CreateInvoiceInput = {
  deal_id: string | null;
  client_id: string | null;
  subtotal: number;
  tax_rate: number;
  irpf_rate: number;
  currency: string;
  issue_date: string;
  due_date: string;
  notes: string;
};

export async function createInvoice(input: CreateInvoiceInput) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  // Generate invoice number: INV-YYYYMM-NNN
  const now = new Date();
  const prefix = `INV-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}`;

  const { count } = await supabase
    .from("invoices")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)
    .like("invoice_number", `${prefix}%`);

  const seq = String((count ?? 0) + 1).padStart(3, "0");
  const invoiceNumber = `${prefix}-${seq}`;

  // Calculate tax amounts
  const taxAmount = +(input.subtotal * (input.tax_rate / 100)).toFixed(2);
  const irpfAmount = +(input.subtotal * (input.irpf_rate / 100)).toFixed(2);
  const total = +(input.subtotal + taxAmount - irpfAmount).toFixed(2);

  const { data, error } = await supabase
    .from("invoices")
    .insert({
      user_id: user.id,
      deal_id: input.deal_id || null,
      client_id: input.client_id || null,
      invoice_number: invoiceNumber,
      subtotal: input.subtotal,
      tax_rate: input.tax_rate,
      tax_amount: taxAmount,
      irpf_rate: input.irpf_rate,
      irpf_amount: irpfAmount,
      total,
      currency: input.currency,
      status: "draft",
      issue_date: input.issue_date,
      due_date: input.due_date || null,
      notes: input.notes || null,
    })
    .select("id")
    .single();

  if (error) {
    console.error("[createInvoice]", error);
    return { error: "Failed to create invoice. Please try again." };
  }

  // Auto-transition linked deal to "invoiced" status if it exists and is enabled
  if (input.deal_id) {
    const statusConfig = await getStatusConfig();
    const invoicedStatus = getEnabledStatuses(statusConfig).find(
      (s) => s.value === "invoiced"
    );
    if (invoicedStatus) {
      await supabase
        .from("deals")
        .update({ status: "invoiced" })
        .eq("id", input.deal_id)
        .eq("user_id", user.id);
      revalidatePath("/deals");
      revalidatePath(`/deals/${input.deal_id}`);
    }
  }

  revalidatePath("/invoices");
  redirect(`/invoices/${data.id}`);
}

export async function updateInvoiceStatus(invoiceId: string, status: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  const updateData: Record<string, unknown> = { status };
  const today = new Date().toISOString().split("T")[0];

  if (status === "paid") {
    updateData.paid_date = today;
  }

  const { error } = await supabase
    .from("invoices")
    .update(updateData)
    .eq("id", invoiceId)
    .eq("user_id", user.id);

  if (error) {
    console.error("[updateInvoiceStatus]", error);
    return { error: "Failed to update invoice status. Please try again." };
  }

  // When invoice is marked paid, auto-update linked deal to the first isPaid status
  if (status === "paid") {
    const { data: invoice } = await supabase
      .from("invoices")
      .select("deal_id")
      .eq("id", invoiceId)
      .eq("user_id", user.id)
      .single();

    if (invoice?.deal_id) {
      const statusConfig = await getStatusConfig();
      const paidStatuses = getPaidStatuses(statusConfig);
      const dealPaidStatus = paidStatuses[0] ?? "paid";

      await supabase
        .from("deals")
        .update({ status: dealPaidStatus, paid_date: today })
        .eq("id", invoice.deal_id)
        .eq("user_id", user.id);

      revalidatePath("/deals");
      revalidatePath(`/deals/${invoice.deal_id}`);
    }
  }

  revalidatePath("/invoices");
  revalidatePath(`/invoices/${invoiceId}`);
  return { success: true };
}

export async function markInvoiceSent(invoiceId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  const { error } = await supabase
    .from("invoices")
    .update({ status: "sent" })
    .eq("id", invoiceId)
    .eq("user_id", user.id)
    .eq("status", "draft");

  if (error) {
    console.error("[markInvoiceSent]", error);
    return { error: "Failed to mark invoice as sent. Please try again." };
  }

  revalidatePath("/invoices");
  revalidatePath(`/invoices/${invoiceId}`);
  return { success: true };
}

export async function deleteInvoice(invoiceId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  const { error } = await supabase
    .from("invoices")
    .delete()
    .eq("id", invoiceId)
    .eq("user_id", user.id);

  if (error) {
    console.error("[deleteInvoice]", error);
    return { error: "Failed to delete invoice. Please try again." };
  }

  revalidatePath("/invoices");
  redirect("/invoices");
}
