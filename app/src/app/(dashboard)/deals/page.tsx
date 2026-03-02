import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { DealsTable } from "@/components/deals/deals-table";
import { Plus } from "lucide-react";
import type { Deal } from "@/types/database";

export default async function DealsPage() {
  const supabase = await createClient();
  const { data: deals } = await supabase
    .from("deals")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-3xl">Deals</h1>
        <Link href="/deals/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Deal
          </Button>
        </Link>
      </div>
      <DealsTable deals={(deals as Deal[]) ?? []} />
    </div>
  );
}
