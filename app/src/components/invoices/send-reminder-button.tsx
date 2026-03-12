"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { sendPaymentReminder } from "@/app/(dashboard)/invoices/_actions/email";
import { Bell } from "lucide-react";
import { toast } from "sonner";
import type { InvoiceStatus } from "@/types/database";
import { trackEvent } from "@/lib/analytics";

const ELIGIBLE_STATUSES: InvoiceStatus[] = ["sent", "viewed", "overdue"];

export function SendReminderButton({
  invoiceId,
  clientEmail,
  currentStatus,
  reminderCount,
}: {
  invoiceId: string;
  clientEmail: string | null | undefined;
  currentStatus: InvoiceStatus;
  reminderCount: number;
}) {
  const [isPending, startTransition] = useTransition();

  // Only show for sent/viewed/overdue invoices that have a client email
  if (!clientEmail || !ELIGIBLE_STATUSES.includes(currentStatus)) {
    return null;
  }

  const reminderLabel =
    reminderCount > 0
      ? `Send Reminder (${reminderCount} sent)`
      : "Send Reminder";

  function handleSendReminder() {
    trackEvent({ action: "invoice_send_reminder" });
    startTransition(async () => {
      const result = await sendPaymentReminder(invoiceId);
      if ("error" in result) {
        toast.error(result.error);
      } else {
        toast.success("Payment reminder sent", {
          description: `Reminder sent to ${clientEmail}`,
        });
      }
    });
  }

  return (
    <Button
      variant="glass"
      size="sm"
      onClick={handleSendReminder}
      disabled={isPending}
    >
      <Bell className="h-4 w-4" />
      {isPending ? "Sending..." : reminderLabel}
    </Button>
  );
}
