import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Deals",
};
import { createClient } from "@/lib/supabase/server";
import {
  DashboardShell,
  DashboardHeading,
} from "@/components/dashboard/dashboard-grid";
import { Button } from "@/components/ui/button";
import { DealsPageClient } from "@/components/deals/deals-page-client";
import { Plus, Handshake } from "lucide-react";
import type { Deal } from "@/types/database";

export default async function DealsPage() {
  const supabase = await createClient();
  const { data: deals } = await supabase
    .from("deals")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <DashboardShell>
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Handshake className="h-7 w-7 text-orange" />
          <DashboardHeading>Deals</DashboardHeading>
        </div>
        <Link href="/deals/new">
          <Button variant="accent">
            <Plus className="mr-2 h-4 w-4" />
            New Deal
          </Button>
        </Link>
      </div>
      <DealsPageClient deals={(deals as Deal[]) ?? []} />
    </DashboardShell>
  );
}
