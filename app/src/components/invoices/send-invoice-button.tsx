"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { markInvoiceSent } from "@/app/(dashboard)/invoices/_actions/invoices";
import { Send } from "lucide-react";
import type { InvoiceStatus } from "@/types/database";

export function SendInvoiceButton({
  invoiceId,
  currentStatus,
}: {
  invoiceId: string;
  currentStatus: InvoiceStatus;
}) {
  const [isPending, startTransition] = useTransition();

  if (currentStatus !== "draft") {
    return null;
  }

  function handleSend() {
    startTransition(async () => {
      await markInvoiceSent(invoiceId);
    });
  }

  return (
    <Button
      variant="glass"
      size="sm"
      onClick={handleSend}
      disabled={isPending}
    >
      <Send className="h-4 w-4" />
      {isPending ? "Sending..." : "Send Invoice"}
    </Button>
  );
}
