import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function InvoicesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-3xl">Invoices</h1>
        <Link href="/invoices/generate">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Generate Invoice
          </Button>
        </Link>
      </div>
      <p className="text-muted-foreground">
        No invoices yet. Generate your first invoice from a completed deal.
      </p>
    </div>
  );
}
