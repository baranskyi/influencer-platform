import { createClient } from "@/lib/supabase/server";
import {
  DashboardShell,
  DashboardHeading,
} from "@/components/dashboard/dashboard-grid";
import { ClientsPageClient } from "@/components/clients/clients-page-client";
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
    const { data } = await supabase
      .from("clients")
      .select("id, name, category, contact_email, total_deals, total_revenue")
      .eq("user_id", user.id)
      .order("name");

    clients = (data ?? []).map((c: Record<string, unknown>) => ({
      id: c.id as string,
      name: c.name as string,
      category: (c.category as string) ?? null,
      contact_email: (c.contact_email as string) ?? null,
      total_deals: Number(c.total_deals ?? 0),
      total_revenue: Number(c.total_revenue ?? 0),
    }));
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
