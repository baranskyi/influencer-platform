import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import {
  DashboardShell,
  DashboardHeading,
} from "@/components/dashboard/dashboard-grid";
import { DealForm } from "@/components/deals/deal-form";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Handshake } from "lucide-react";
import type { Deal } from "@/types/database";
import { getStatusConfig } from "@/lib/get-status-config";

export default async function EditDealPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [supabase, statusConfig] = await Promise.all([
    createClient(),
    getStatusConfig(),
  ]);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    notFound();
  }

  const [dealRes, clientsRes] = await Promise.all([
    supabase
      .from("deals")
      .select("*")
      .eq("id", id)
      .eq("user_id", user.id)
      .single(),
    supabase
      .from("clients")
      .select("id, name")
      .eq("user_id", user.id)
      .order("name"),
  ]);

  if (!dealRes.data) {
    notFound();
  }

  const deal = dealRes.data as Deal;
  const clients = (clientsRes.data ?? []) as { id: string; name: string }[];

  return (
    <DashboardShell>
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="flex items-center gap-3">
          <Link href={`/deals/${id}`}>
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <Handshake className="h-7 w-7 text-orange" />
          <DashboardHeading>Edit Deal</DashboardHeading>
        </div>
        <DealForm clients={clients} deal={deal} dealId={id} statusConfig={statusConfig} />
      </div>
    </DashboardShell>
  );
}
