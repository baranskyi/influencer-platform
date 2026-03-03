import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export const STATUS_CONFIG: Record<
  string,
  { label: string; className: string }
> = {
  negotiation: {
    label: "Negotiation",
    className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  },
  agreed: {
    label: "Agreed",
    className: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  },
  in_progress: {
    label: "In Progress",
    className: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400",
  },
  content_submitted: {
    label: "Submitted",
    className: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
  },
  content_approved: {
    label: "Approved",
    className: "bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-400",
  },
  invoiced: {
    label: "Invoiced",
    className: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
  },
  paid: {
    label: "Paid",
    className: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  },
  completed: {
    label: "Completed",
    className: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
  },
  cancelled: {
    label: "Cancelled",
    className: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
  },
  disputed: {
    label: "Disputed",
    className: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  },
};

export function DealStatusBadge({ status }: { status: string }) {
  const config = STATUS_CONFIG[status] ?? {
    label: status,
    className: "bg-gray-100 text-gray-800",
  };

  return (
    <Badge
      variant="secondary"
      className={cn("font-medium border-0", config.className)}
    >
      {config.label}
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
