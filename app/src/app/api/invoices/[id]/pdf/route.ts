import { NextRequest, NextResponse } from "next/server";
import { renderToBuffer, DocumentProps } from "@react-pdf/renderer";
import { createClient } from "@/lib/supabase/server";
import { InvoicePDF } from "@/lib/pdf/invoice-template";
import React, { type JSXElementConstructor, type ReactElement } from "react";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Fetch invoice with related client data
  const { data: invoice, error: invoiceError } = await supabase
    .from("invoices")
    .select("*, clients(name, contact_email)")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (invoiceError || !invoice) {
    return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
  }

  // Fetch user profile
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select(
      "full_name, email, legal_name, tax_id, address"
    )
    .eq("id", user.id)
    .single();

  if (profileError || !profile) {
    return NextResponse.json(
      { error: "Profile not found" },
      { status: 404 }
    );
  }

  // Shape data for the PDF template
  const client = invoice.clients as
    | { name: string; contact_email: string | null }
    | null;

  const pdfProps = {
    invoice: {
      invoice_number: invoice.invoice_number,
      subtotal: Number(invoice.subtotal),
      tax_rate: Number(invoice.tax_rate),
      tax_amount: Number(invoice.tax_amount ?? 0),
      irpf_rate: Number(invoice.irpf_rate),
      irpf_amount: Number(invoice.irpf_amount ?? 0),
      total: Number(invoice.total),
      currency: invoice.currency ?? "EUR",
      status: invoice.status,
      issue_date: invoice.issue_date,
      due_date: invoice.due_date,
      notes: invoice.notes,
    },
    profile: {
      full_name: profile.full_name,
      email: profile.email,
      legal_name: profile.legal_name,
      tax_id: profile.tax_id,
      address: profile.address as {
        street?: string;
        city?: string;
        postal_code?: string;
        country?: string;
      } | null,
    },
    client,
  };

  try {
    const element = React.createElement(
      InvoicePDF,
      pdfProps
    ) as unknown as ReactElement<DocumentProps, JSXElementConstructor<DocumentProps>>;

    const buffer = await renderToBuffer(element);

    const filename = `${invoice.invoice_number}.pdf`;
    // Convert Node.js Buffer to Uint8Array for Web API Response compatibility
    const uint8 = new Uint8Array(buffer);

    return new Response(uint8, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Content-Length": uint8.byteLength.toString(),
      },
    });
  } catch (err) {
    console.error("PDF generation error:", err);
    return NextResponse.json(
      { error: "Failed to generate PDF" },
      { status: 500 }
    );
  }
}
