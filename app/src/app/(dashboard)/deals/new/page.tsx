import { createClient } from "@/lib/supabase/server";
import { DealForm } from "@/components/deals/deal-form";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function NewDealPage() {
  const supabase = await createClient();
  const { data: clients } = await supabase
    .from("clients")
    .select("id, name")
    .order("name");

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/deals"
          className="text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="font-serif text-3xl">New Deal</h1>
      </div>
      <DealForm clients={clients ?? []} />
    </div>
  );
}
