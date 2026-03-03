import { createClient } from "@/lib/supabase/server";
import {
  DashboardShell,
  DashboardHeading,
} from "@/components/dashboard/dashboard-grid";
import { DealForm } from "@/components/deals/deal-form";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, Handshake } from "lucide-react";

export default async function NewDealPage() {
  const supabase = await createClient();
  const { data: clients } = await supabase
    .from("clients")
    .select("id, name")
    .order("name");

  return (
    <DashboardShell>
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="flex items-center gap-3">
          <Link href="/deals">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <Handshake className="h-7 w-7 text-orange" />
          <DashboardHeading>New Deal</DashboardHeading>
        </div>
        <DealForm clients={clients ?? []} />
      </div>
    </DashboardShell>
  );
}
