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
import {
  type StatusConfig,
  DEFAULT_DEAL_STATUSES,
  getEnabledStatuses,
} from "@/lib/deal-status-config";

export function DealStatusSelect({
  dealId,
  currentStatus,
  statusConfig,
}: {
  dealId: string;
  currentStatus: string;
  statusConfig?: StatusConfig[];
}) {
  const config = statusConfig ?? DEFAULT_DEAL_STATUSES;
  const [isPending, startTransition] = useTransition();
  const statuses = getEnabledStatuses(config);

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
          {statuses.map((s) => (
            <SelectItem key={s.value} value={s.value}>
              {s.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
