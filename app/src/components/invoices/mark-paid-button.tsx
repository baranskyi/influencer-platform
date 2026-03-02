"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { updateInvoiceStatus } from "@/app/(dashboard)/invoices/_actions/invoices";
import { CheckCircle } from "lucide-react";
import type { InvoiceStatus } from "@/types/database";

export function MarkPaidButton({
  invoiceId,
  currentStatus,
}: {
  invoiceId: string;
  currentStatus: InvoiceStatus;
}) {
  const [isPending, startTransition] = useTransition();

  if (currentStatus === "paid" || currentStatus === "cancelled") {
    return null;
  }

  function handleMarkPaid() {
    startTransition(async () => {
      await updateInvoiceStatus(invoiceId, "paid");
    });
  }

  return (
    <Button
      size="sm"
      onClick={handleMarkPaid}
      disabled={isPending}
      className="bg-mint/20 text-mint border border-mint/30 hover:bg-mint/30 hover:text-mint font-semibold"
    >
      <CheckCircle className="h-4 w-4" />
      {isPending ? "Marking..." : "Mark as Paid"}
    </Button>
  );
}
