"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { resend } from "@/lib/email/resend";
import { generateInvoiceEmail } from "@/lib/email/templates/invoice-email";
import { generatePaymentReminder } from "@/lib/email/templates/payment-reminder";

const FROM_ADDRESS = "brandea.today <onboarding@resend.dev>";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export async function sendInvoiceEmail(
  invoiceId: string,
): Promise<{ success: true } | { error: string }> {
  if (!process.env.RESEND_API_KEY) {
    return { error: "Email service not configured. Please add RESEND_API_KEY." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  // Fetch invoice with related client data
  const { data: invoice, error: invoiceError } = await supabase
    .from("invoices")
    .select("*, clients(name, contact_email, contact_name)")
    .eq("id", invoiceId)
    .eq("user_id", user.id)
    .single();

  if (invoiceError || !invoice) {
    return { error: "Invoice not found" };
  }

  const client = invoice.clients as {
    name: string;
    contact_email: string | null;
    contact_name: string | null;
  } | null;

  if (!client?.contact_email) {
    return { error: "Client has no email address. Please add one in the Clients section." };
  }

  // Fetch creator profile
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("full_name, display_name, email")
    .eq("id", user.id)
    .single();

  if (profileError || !profile) {
    return { error: "Could not load your profile" };
  }

  const creatorName =
    profile.display_name ?? profile.full_name ?? "Your creator";
  const creatorEmail = profile.email ?? user.email ?? "";

  const { subject, html } = generateInvoiceEmail({
    invoiceNumber: invoice.invoice_number,
    creatorName,
    creatorEmail,
    clientName: client.contact_name ?? client.name,
    total: Number(invoice.total),
    currency: invoice.currency ?? "EUR",
    issueDate: invoice.issue_date,
    dueDate: invoice.due_date ?? null,
    notes: invoice.notes ?? null,
    appUrl: `${APP_URL}/invoices/${invoiceId}`,
  });

  const { error: sendError } = await resend.emails.send({
    from: FROM_ADDRESS,
    to: client.contact_email,
    subject,
    html,
  });

  if (sendError) {
    console.error("[sendInvoiceEmail]", sendError);
    return { error: "Failed to send email. Please try again." };
  }

  // Mark invoice as sent if it's still a draft
  if (invoice.status === "draft") {
    await supabase
      .from("invoices")
      .update({ status: "sent" })
      .eq("id", invoiceId)
      .eq("user_id", user.id);
  }

  revalidatePath("/invoices");
  revalidatePath(`/invoices/${invoiceId}`);

  return { success: true };
}

export async function sendPaymentReminder(
  invoiceId: string,
): Promise<{ success: true } | { error: string }> {
  if (!process.env.RESEND_API_KEY) {
    return { error: "Email service not configured. Please add RESEND_API_KEY." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  // Fetch invoice with related client data
  const { data: invoice, error: invoiceError } = await supabase
    .from("invoices")
    .select("*, clients(name, contact_email, contact_name)")
    .eq("id", invoiceId)
    .eq("user_id", user.id)
    .single();

  if (invoiceError || !invoice) {
    return { error: "Invoice not found" };
  }

  const client = invoice.clients as {
    name: string;
    contact_email: string | null;
    contact_name: string | null;
  } | null;

  if (!client?.contact_email) {
    return { error: "Client has no email address. Please add one in the Clients section." };
  }

  // Fetch creator profile
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("full_name, display_name, email")
    .eq("id", user.id)
    .single();

  if (profileError || !profile) {
    return { error: "Could not load your profile" };
  }

  const creatorName =
    profile.display_name ?? profile.full_name ?? "Your creator";
  const creatorEmail = profile.email ?? user.email ?? "";

  // Calculate days overdue
  let daysOverdue = 0;
  if (invoice.due_date) {
    const due = new Date(invoice.due_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    due.setHours(0, 0, 0, 0);
    const diff = today.getTime() - due.getTime();
    if (diff > 0) {
      daysOverdue = Math.floor(diff / (1000 * 60 * 60 * 24));
    }
  }

  const newReminderCount = (Number(invoice.reminder_sent_count) ?? 0) + 1;

  const { subject, html } = generatePaymentReminder({
    invoiceNumber: invoice.invoice_number,
    creatorName,
    creatorEmail,
    clientName: client.contact_name ?? client.name,
    total: Number(invoice.total),
    currency: invoice.currency ?? "EUR",
    dueDate: invoice.due_date ?? null,
    daysOverdue,
    reminderCount: newReminderCount,
    appUrl: `${APP_URL}/invoices/${invoiceId}`,
  });

  const { error: sendError } = await resend.emails.send({
    from: FROM_ADDRESS,
    to: client.contact_email,
    subject,
    html,
  });

  if (sendError) {
    console.error("[sendPaymentReminder]", sendError);
    return { error: "Failed to send reminder. Please try again." };
  }

  // Update reminder tracking fields
  await supabase
    .from("invoices")
    .update({
      reminder_sent_count: newReminderCount,
      last_reminder_at: new Date().toISOString(),
    })
    .eq("id", invoiceId)
    .eq("user_id", user.id);

  revalidatePath("/invoices");
  revalidatePath(`/invoices/${invoiceId}`);

  return { success: true };
}
