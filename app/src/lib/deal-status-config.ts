// ──────────────────────────────────────────────────────────────
// Deal Status Pipeline — configurable via profile.deal_status_config
// ──────────────────────────────────────────────────────────────

export interface StatusConfig {
  value: string;
  label: string;
  color: string;
  position: number;
  enabled: boolean;
  isInitial: boolean;
  isPaid: boolean;
  isEarned: boolean;
  isTerminal: boolean;
  hideFromCalendar: boolean;
  isSystem: boolean;
}

// ── Color map: tailwind key → badge + dot class strings ──────

export const STATUS_COLOR_MAP: Record<
  string,
  { badge: string; dot: string }
> = {
  yellow: {
    badge: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
    dot: "bg-yellow-400",
  },
  blue: {
    badge: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
    dot: "bg-blue-400",
  },
  indigo: {
    badge: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400",
    dot: "bg-indigo-400",
  },
  purple: {
    badge: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
    dot: "bg-purple-400",
  },
  teal: {
    badge: "bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-400",
    dot: "bg-teal-400",
  },
  orange: {
    badge: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
    dot: "bg-orange-400",
  },
  green: {
    badge: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    dot: "bg-green-400",
  },
  emerald: {
    badge: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
    dot: "bg-emerald-400",
  },
  gray: {
    badge: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
    dot: "bg-gray-400",
  },
  red: {
    badge: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
    dot: "bg-red-400",
  },
  pink: {
    badge: "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-400",
    dot: "bg-pink-400",
  },
  cyan: {
    badge: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-400",
    dot: "bg-cyan-400",
  },
};

// ── Defaults: 10 statuses matching current hardcoded behavior ─

export const DEFAULT_DEAL_STATUSES: StatusConfig[] = [
  {
    value: "negotiation",
    label: "Negotiation",
    color: "yellow",
    position: 0,
    enabled: true,
    isInitial: true,
    isPaid: false,
    isEarned: false,
    isTerminal: false,
    hideFromCalendar: false,
    isSystem: true,
  },
  {
    value: "agreed",
    label: "Agreed",
    color: "blue",
    position: 1,
    enabled: true,
    isInitial: false,
    isPaid: false,
    isEarned: false,
    isTerminal: false,
    hideFromCalendar: false,
    isSystem: true,
  },
  {
    value: "in_progress",
    label: "In Progress",
    color: "indigo",
    position: 2,
    enabled: true,
    isInitial: false,
    isPaid: false,
    isEarned: false,
    isTerminal: false,
    hideFromCalendar: false,
    isSystem: true,
  },
  {
    value: "content_submitted",
    label: "Submitted",
    color: "purple",
    position: 3,
    enabled: true,
    isInitial: false,
    isPaid: false,
    isEarned: false,
    isTerminal: false,
    hideFromCalendar: false,
    isSystem: true,
  },
  {
    value: "content_approved",
    label: "Approved",
    color: "teal",
    position: 4,
    enabled: true,
    isInitial: false,
    isPaid: false,
    isEarned: false,
    isTerminal: false,
    hideFromCalendar: false,
    isSystem: true,
  },
  {
    value: "invoiced",
    label: "Invoiced",
    color: "orange",
    position: 5,
    enabled: true,
    isInitial: false,
    isPaid: false,
    isEarned: false,
    isTerminal: false,
    hideFromCalendar: false,
    isSystem: true,
  },
  {
    value: "paid",
    label: "Paid",
    color: "green",
    position: 6,
    enabled: true,
    isInitial: false,
    isPaid: true,
    isEarned: true,
    isTerminal: false,
    hideFromCalendar: false,
    isSystem: true,
  },
  {
    value: "completed",
    label: "Completed",
    color: "emerald",
    position: 7,
    enabled: true,
    isInitial: false,
    isPaid: false,
    isEarned: true,
    isTerminal: true,
    hideFromCalendar: true,
    isSystem: true,
  },
  {
    value: "cancelled",
    label: "Cancelled",
    color: "gray",
    position: 8,
    enabled: true,
    isInitial: false,
    isPaid: false,
    isEarned: false,
    isTerminal: true,
    hideFromCalendar: true,
    isSystem: true,
  },
  {
    value: "disputed",
    label: "Disputed",
    color: "red",
    position: 9,
    enabled: true,
    isInitial: false,
    isPaid: false,
    isEarned: false,
    isTerminal: true,
    hideFromCalendar: false,
    isSystem: true,
  },
];

// ── Pure helper functions ────────────────────────────────────

export function resolveStatusConfig(
  userConfig: StatusConfig[] | null | undefined,
): StatusConfig[] {
  return userConfig && userConfig.length > 0 ? userConfig : DEFAULT_DEAL_STATUSES;
}

export function getEnabledStatuses(config: StatusConfig[]): StatusConfig[] {
  return config
    .filter((s) => s.enabled)
    .sort((a, b) => a.position - b.position);
}

/** Pipeline columns (enabled + non-terminal) for kanban */
export function getPipelineStatuses(config: StatusConfig[]): StatusConfig[] {
  return getEnabledStatuses(config).filter((s) => !s.isTerminal);
}

/** Terminal statuses shown conditionally in kanban when deals exist */
export function getConditionalStatuses(config: StatusConfig[]): StatusConfig[] {
  return getEnabledStatuses(config).filter((s) => s.isTerminal);
}

export function getInitialStatus(config: StatusConfig[]): string {
  return config.find((s) => s.isInitial && s.enabled)?.value ?? config[0]?.value ?? "negotiation";
}

export function getEarnedStatuses(config: StatusConfig[]): string[] {
  return config.filter((s) => s.isEarned).map((s) => s.value);
}

export function getTerminalStatuses(config: StatusConfig[]): string[] {
  return config.filter((s) => s.isTerminal).map((s) => s.value);
}

export function getPaidStatuses(config: StatusConfig[]): string[] {
  return config.filter((s) => s.isPaid).map((s) => s.value);
}

export function getHiddenFromCalendarStatuses(config: StatusConfig[]): string[] {
  return config.filter((s) => s.hideFromCalendar).map((s) => s.value);
}

/** Statuses eligible for invoicing: enabled, not terminal, not initial, not isPaid */
export function getInvoiceableStatuses(config: StatusConfig[]): string[] {
  return config
    .filter((s) => s.enabled && !s.isTerminal && !s.isInitial && !s.isPaid)
    .map((s) => s.value);
}

export function getStatusLabel(config: StatusConfig[], value: string): string {
  return config.find((s) => s.value === value)?.label ?? value.replace(/_/g, " ");
}

export function getBadgeClassName(config: StatusConfig[], value: string): string {
  const status = config.find((s) => s.value === value);
  const colorKey = status?.color ?? "gray";
  return STATUS_COLOR_MAP[colorKey]?.badge ?? STATUS_COLOR_MAP.gray.badge;
}

export function getDotClassName(config: StatusConfig[], value: string): string {
  const status = config.find((s) => s.value === value);
  const colorKey = status?.color ?? "gray";
  return STATUS_COLOR_MAP[colorKey]?.dot ?? STATUS_COLOR_MAP.gray.dot;
}
