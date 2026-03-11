import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getStatusConfig } from "@/lib/get-status-config";
import { getInvoiceableStatuses } from "@/lib/deal-status-config";
import {
  DashboardShell,
  DashboardHeading,
} from "@/components/dashboard/dashboard-grid";
import { InvoiceForm } from "@/components/invoices/invoice-form";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText } from "lucide-react";

export default async function GenerateInvoicePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let deals: Array<{
    id: string;
    title: string;
    brand_name: string;
    amount: number | null;
    client_id: string | null;
  }> = [];
  let clients: Array<{ id: string; name: string }> = [];

  if (user) {
    const statusConfig = await getStatusConfig();
    const invoiceableStatuses = getInvoiceableStatuses(statusConfig);

    const dealsQuery = invoiceableStatuses.length > 0
      ? supabase
          .from("deals")
          .select("id, title, brand_name, amount, client_id")
          .eq("user_id", user.id)
          .in("status", invoiceableStatuses)
          .order("title")
      : Promise.resolve({ data: [] });

    const [dealsRes, clientsRes] = await Promise.all([
      dealsQuery,
      supabase
        .from("clients")
        .select("id, name")
        .eq("user_id", user.id)
        .order("name"),
    ]);

    deals = (dealsRes.data ?? []).map((d: Record<string, unknown>) => ({
      id: d.id as string,
      title: d.title as string,
      brand_name: d.brand_name as string,
      amount: d.amount != null ? Number(d.amount) : null,
      client_id: (d.client_id as string) ?? null,
    }));
    clients = (clientsRes.data ?? []).map((c: Record<string, unknown>) => ({
      id: c.id as string,
      name: c.name as string,
    }));
  }

  return (
    <DashboardShell>
      <div className="mb-6 flex items-center gap-3">
        <Link href="/invoices">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <FileText className="h-7 w-7 text-orange" />
        <DashboardHeading>Generate Invoice</DashboardHeading>
      </div>

      <InvoiceForm deals={deals} clients={clients} />
    </DashboardShell>
  );
}
