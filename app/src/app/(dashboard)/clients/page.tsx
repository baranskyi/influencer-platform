import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import {
  DashboardShell,
  DashboardHeading,
} from "@/components/dashboard/dashboard-grid";
import { ClientsPageClient } from "@/components/clients/clients-page-client";

export const metadata: Metadata = {
  title: "Clients",
};
import { Building2 } from "lucide-react";

export default async function ClientsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  type ClientRow = {
    id: string;
    name: string;
    category: string | null;
    contact_email: string | null;
    total_deals: number;
    total_revenue: number;
  };

  let clients: ClientRow[] = [];

  if (user) {
    const [clientsRes, dealsRes] = await Promise.all([
      supabase
        .from("clients")
        .select("id, name, category, contact_email")
        .eq("user_id", user.id)
        .order("name"),
      supabase
        .from("deals")
        .select("client_id, amount, status")
        .eq("user_id", user.id),
    ]);

    // Build a map of client_id → computed totals from actual deals
    type DealTotals = { dealCount: number; totalRevenue: number };
    const dealTotalsMap = new Map<string, DealTotals>();

    for (const deal of dealsRes.data ?? []) {
      const clientId = deal.client_id as string | null;
      if (!clientId) continue;
      const existing = dealTotalsMap.get(clientId) ?? { dealCount: 0, totalRevenue: 0 };
      existing.dealCount += 1;
      if (["paid", "completed"].includes(deal.status as string)) {
        existing.totalRevenue += Number(deal.amount ?? 0);
      }
      dealTotalsMap.set(clientId, existing);
    }

    clients = (clientsRes.data ?? []).map((c: Record<string, unknown>) => {
      const totals = dealTotalsMap.get(c.id as string);
      return {
        id: c.id as string,
        name: c.name as string,
        category: (c.category as string) ?? null,
        contact_email: (c.contact_email as string) ?? null,
        total_deals: totals?.dealCount ?? 0,
        total_revenue: totals?.totalRevenue ?? 0,
      };
    });
  }

  return (
    <DashboardShell>
      <div className="mb-6 flex items-center gap-3">
        <Building2 className="h-7 w-7 text-lavender" />
        <DashboardHeading>Clients</DashboardHeading>
      </div>

      <ClientsPageClient clients={clients} />
    </DashboardShell>
  );
}
