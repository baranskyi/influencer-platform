"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { sendInvoiceEmail } from "@/app/(dashboard)/invoices/_actions/email";
import { Mail } from "lucide-react";
import { toast } from "sonner";

export function EmailInvoiceButton({
  invoiceId,
  clientEmail,
}: {
  invoiceId: string;
  clientEmail: string | null | undefined;
}) {
  const [isPending, startTransition] = useTransition();

  // Only show when client has a contact email
  if (!clientEmail) {
    return null;
  }

  function handleEmailInvoice() {
    startTransition(async () => {
      const result = await sendInvoiceEmail(invoiceId);
      if ("error" in result) {
        toast.error(result.error);
      } else {
        toast.success("Invoice emailed successfully", {
          description: `Sent to ${clientEmail}`,
        });
      }
    });
  }

  return (
    <Button
      variant="glass"
      size="sm"
      onClick={handleEmailInvoice}
      disabled={isPending}
    >
      <Mail className="h-4 w-4" />
      {isPending ? "Sending..." : "Email to Client"}
    </Button>
  );
}
