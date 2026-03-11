import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  type StatusConfig,
  DEFAULT_DEAL_STATUSES,
  getBadgeClassName,
  getStatusLabel,
} from "@/lib/deal-status-config";

export function DealStatusBadge({
  status,
  statusConfig,
}: {
  status: string;
  statusConfig?: StatusConfig[];
}) {
  const config = statusConfig ?? DEFAULT_DEAL_STATUSES;
  const label = getStatusLabel(config, status);
  const badgeClass = getBadgeClassName(config, status);

  return (
    <Badge
      variant="secondary"
      className={cn("font-medium border-0", badgeClass)}
    >
      {label}
    </Badge>
  );
}

export function getPlatformEmoji(platform: string) {
  switch (platform) {
    case "instagram":
      return "📸";
    case "tiktok":
      return "🎵";
    case "youtube":
      return "🎬";
    case "multi":
      return "📱";
    default:
      return "📱";
  }
}
