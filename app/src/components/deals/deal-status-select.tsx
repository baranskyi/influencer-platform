"use client";

import { useTransition } from "react";
import { updateDealStatus } from "@/app/(dashboard)/deals/_actions/deals";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";

const PIPELINE = [
  { value: "negotiation", label: "Negotiation" },
  { value: "agreed", label: "Agreed" },
  { value: "in_progress", label: "In Progress" },
  { value: "content_submitted", label: "Content Submitted" },
  { value: "content_approved", label: "Content Approved" },
  { value: "invoiced", label: "Invoiced" },
  { value: "paid", label: "Paid" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
  { value: "disputed", label: "Disputed" },
];

export function DealStatusSelect({
  dealId,
  currentStatus,
}: {
  dealId: string;
  currentStatus: string;
}) {
  const [isPending, startTransition] = useTransition();

  function handleChange(newStatus: string) {
    startTransition(async () => {
      await updateDealStatus(dealId, newStatus);
    });
  }

  return (
    <div className="flex items-center gap-2">
      <Select value={currentStatus} onValueChange={handleChange}>
        <SelectTrigger className="w-52">
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <SelectValue />
          )}
        </SelectTrigger>
        <SelectContent>
          {PIPELINE.map((s) => (
            <SelectItem key={s.value} value={s.value}>
              {s.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
