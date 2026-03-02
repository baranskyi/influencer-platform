import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function DealsPage() {
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
      <p className="text-muted-foreground">
        No deals yet. Create your first deal to start tracking brand
        partnerships.
      </p>
    </div>
  );
}
