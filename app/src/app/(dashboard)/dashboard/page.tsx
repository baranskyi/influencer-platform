import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import {
  DashboardShell,
  DashboardGrid,
  DashboardStatsRow,
  DashboardHeading,
  StatCard,
} from "@/components/dashboard/dashboard-grid";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardAction,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DollarSign,
  Clock,
  Handshake,
  AlertTriangle,
  Plus,
  FileText,
  CalendarDays,
  ChevronRight,
} from "lucide-react";
import type { InvoiceStatus, Platform } from "@/types/database";
import { getStatusConfig } from "@/lib/get-status-config";
import { getEarnedStatuses, getTerminalStatuses, getPaidStatuses } from "@/lib/deal-status-config";
import {
  startOfDay,
  addDays,
  getDay,
  parseISO,
  format,
  differenceInDays,
} from "date-fns";

/* ============================================================
   Dashboard Page — "Creator Hub" / "Influencer Dashboard"
   ============================================================
   Layout matches the analyzed mockups:

   1. KPI Stats Row (4 cards across):
      - Earned This Month
      - Pending Payment
      - Active Deals
      - Overdue

   2. Bento Grid:
      - Content Calendar (full-width weekly view with colored blocks)
      - Upcoming Deadlines (full-width: content + payment due dates)

   3. Quick Actions row at top-right

   All cards use the glassmorphism "glass" variant to achieve
   the frosted effect seen in Mockup 2. The gradient background
   from DashboardShell bleeds through the translucent surfaces.
   ============================================================ */

function makeCurrencyFormatter(currency: string) {
  return (amount: number): string =>
    new Intl.NumberFormat("en", {
      style: "currency",
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Redirect new users to onboarding if profile has no full_name set
  // Onboarding is now handled by OnboardingGate in the dashboard layout

  // ---- Date boundaries ----
  const now = new Date();

  // Current month
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 1).toISOString();

  // Content Calendar: next 7 days (Mon–Sun of current week view)
  const weekStart = startOfDay(now);
  const weekEnd = startOfDay(addDays(now, 7));

  // Upcoming Deadlines: today's date string for querying
  const todayISO = startOfDay(now).toISOString();

  // Typed row shapes coming back from Supabase
  type DealRow = { amount: number | null; status: string; created_at: string; currency: string };
  type InvoiceRow = { total: number; status: InvoiceStatus; paid_date: string | null; issue_date: string };
  type ContentEventRow = { platform: Platform | null; scheduled_at: string };
  type DeadlineRow = {
    id: string;
    title: string;
    brand_name: string | null;
    content_deadline: string | null;
    payment_due_date: string | null;
  };

  let dealsThisMonth: DealRow[] = [];
  let allInvoices: InvoiceRow[] = [];
  let contentEvents: ContentEventRow[] = [];
  let upcomingDeadlines: DeadlineRow[] = [];

  if (user) {
    const [dealsRes, invoicesRes, eventsRes, deadlinesRes] = await Promise.all([
      // KPI: deals created this calendar month
      supabase
        .from("deals")
        .select("amount, status, created_at, currency")
        .eq("user_id", user.id)
        .gte("created_at", monthStart)
        .lt("created_at", monthEnd),

      // All invoices (for KPI stats)
      supabase
        .from("invoices")
        .select("total, status, paid_date, issue_date")
        .eq("user_id", user.id),

      // Content Calendar: events in next 7 days
      supabase
        .from("content_events")
        .select("platform, scheduled_at")
        .eq("user_id", user.id)
        .gte("scheduled_at", weekStart.toISOString())
        .lt("scheduled_at", weekEnd.toISOString())
        .order("scheduled_at", { ascending: true }),

      // Upcoming Deadlines: deals with content_deadline or payment_due_date >= today
      // Exclude terminal + paid statuses from deadline view
      (async () => {
        const cfg = await getStatusConfig();
        const excludeStatuses = [...new Set([...getTerminalStatuses(cfg), ...getPaidStatuses(cfg)])];
        const excludeStr = excludeStatuses.length > 0
          ? `(${excludeStatuses.map((s) => `"${s}"`).join(",")})`
          : '("__none__")';
        return supabase
          .from("deals")
          .select("id, title, brand_name, content_deadline, payment_due_date")
          .eq("user_id", user.id)
          .or(
            `content_deadline.gte.${todayISO},payment_due_date.gte.${todayISO}`
          )
          .not("status", "in", excludeStr)
          .order("content_deadline", { ascending: true, nullsFirst: false });
      })(),
    ]);

    dealsThisMonth = (dealsRes.data ?? []).map((d: Record<string, unknown>) => ({
      amount: d.amount != null ? Number(d.amount) : null,
      status: d.status as string,
      created_at: d.created_at as string,
      currency: (d.currency as string) ?? "EUR",
    }));

    allInvoices = (invoicesRes.data ?? []).map((i: Record<string, unknown>) => ({
      total: Number(i.total),
      status: i.status as InvoiceStatus,
      paid_date: (i.paid_date as string | null) ?? null,
      issue_date: i.issue_date as string,
    }));

    contentEvents = (eventsRes.data ?? []).map((e: Record<string, unknown>) => ({
      platform: (e.platform as Platform | null) ?? null,
      scheduled_at: e.scheduled_at as string,
    }));

    upcomingDeadlines = (deadlinesRes.data ?? []).map((d: Record<string, unknown>) => ({
      id: d.id as string,
      title: (d.title as string) ?? "Untitled Deal",
      brand_name: (d.brand_name as string | null) ?? null,
      content_deadline: (d.content_deadline as string | null) ?? null,
      payment_due_date: (d.payment_due_date as string | null) ?? null,
    }));
  }

  // ---- Determine primary currency from fetched deals ----
  const currencyCounts: Record<string, number> = {};
  dealsThisMonth.forEach((d) => {
    const c = d.currency ?? "EUR";
    currencyCounts[c] = (currencyCounts[c] || 0) + 1;
  });
  const primaryCurrency =
    Object.entries(currencyCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "EUR";
  const formatCurrency = makeCurrencyFormatter(primaryCurrency);

  // ---- KPI calculations (config-driven) ----
  const statusConfig = await getStatusConfig();
  const earnedStatusValues = getEarnedStatuses(statusConfig);
  const terminalStatusValues = getTerminalStatuses(statusConfig);
  const paidStatusValues = getPaidStatuses(statusConfig);
  const inactiveStatuses = [...new Set([...terminalStatusValues, ...paidStatusValues])];

  // "Earned This Month" — deals created this month with isEarned statuses
  const earnedThisMonth = dealsThisMonth
    .filter((d) => earnedStatusValues.includes(d.status))
    .reduce((sum, d) => sum + (d.amount ?? 0), 0);

  // "Active Deals" — deals this month NOT in terminal/paid statuses
  const activeDeals = dealsThisMonth.filter(
    (d) => !inactiveStatuses.includes(d.status)
  ).length;

  // "Pending Payment" — invoices with status sent or viewed
  const pendingInvoices = allInvoices.filter((i) =>
    ["sent", "viewed"].includes(i.status)
  );
  const pendingPaymentTotal = pendingInvoices.reduce((sum, i) => sum + i.total, 0);

  // "Overdue" — invoices with status overdue
  const overdueInvoices = allInvoices.filter((i) => i.status === "overdue");
  const overdueTotal = overdueInvoices.reduce((sum, i) => sum + i.total, 0);

  // ---- Content Calendar: group events by day-of-week index (0=Mon…6=Sun) ----
  // We render a Mon-Sun week starting from today's week.
  // Map JS getDay() (0=Sun…6=Sat) to our Mon-first index (0=Mon…6=Sun)
  type PlatformLabel = "IG" | "TT" | "YT" | "Multi";
  type CalendarSlot = { label: PlatformLabel; color: "coral" | "lavender" | "mint" | "orange" };

  function platformToSlot(platform: Platform | null): CalendarSlot {
    switch (platform) {
      case "instagram": return { label: "IG", color: "coral" };
      case "tiktok":    return { label: "TT", color: "lavender" };
      case "youtube":   return { label: "YT", color: "mint" };
      default:          return { label: "Multi", color: "orange" };
    }
  }

  // Build a 7-element array (index 0=today, 6=today+6 days)
  const calendarDays: CalendarSlot[][] = Array.from({ length: 7 }, () => []);
  for (const event of contentEvents) {
    const eventDate = startOfDay(parseISO(event.scheduled_at));
    // day index relative to weekStart (0–6)
    const diffMs = eventDate.getTime() - weekStart.getTime();
    const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays >= 0 && diffDays < 7) {
      calendarDays[diffDays].push(platformToSlot(event.platform));
    }
  }

  // Day-of-week labels: use Mon-Sun ordering anchored to today
  // 0 = today's weekday name
  const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const calendarDayLabels = Array.from({ length: 7 }, (_, i) => {
    const d = addDays(now, i);
    return DAY_NAMES[getDay(d)];
  });

  const hasAnyCalendarEvents = calendarDays.some((slots) => slots.length > 0);

  // ---- Upcoming Deadlines: build flat sorted list of deadline entries ----
  type DeadlineEntry = {
    dealId: string;
    dealTitle: string;
    brandName: string | null;
    date: Date;
    type: "content" | "payment";
  };

  const today = startOfDay(now);
  const deadlineEntries: DeadlineEntry[] = [];

  for (const deal of upcomingDeadlines) {
    if (deal.content_deadline) {
      const d = startOfDay(parseISO(deal.content_deadline));
      if (d >= today) {
        deadlineEntries.push({
          dealId: deal.id,
          dealTitle: deal.title,
          brandName: deal.brand_name,
          date: d,
          type: "content",
        });
      }
    }
    if (deal.payment_due_date) {
      const d = startOfDay(parseISO(deal.payment_due_date));
      if (d >= today) {
        deadlineEntries.push({
          dealId: deal.id,
          dealTitle: deal.title,
          brandName: deal.brand_name,
          date: d,
          type: "payment",
        });
      }
    }
  }

  // Sort by date ascending and take top 7
  deadlineEntries.sort((a, b) => a.date.getTime() - b.date.getTime());
  const visibleDeadlines = deadlineEntries.slice(0, 7);

  function formatDeadlineDistance(date: Date): string {
    const days = differenceInDays(date, today);
    if (days === 0) return "today";
    if (days === 1) return "tomorrow";
    return `in ${days} days`;
  }

  return (
    <DashboardShell>
      {/* --- Page Header --- */}
      <div className="mb-6 flex items-center justify-between">
        <DashboardHeading>Dashboard</DashboardHeading>

        {/* Quick actions — matches Mockup 1's top-right CTA buttons */}
        <div className="flex gap-2">
          <Link href="/deals/new">
            <Button variant="accent" size="sm">
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">New Deal</span>
            </Button>
          </Link>
          <Link href="/invoices/generate">
            <Button variant="glass" size="sm">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Invoice</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* --- KPI Stats Row --- */}
      <DashboardStatsRow className="mb-6">
        <StatCard
          label="Earned This Month"
          value={formatCurrency(earnedThisMonth)}
          trend={activeDeals > 0 ? `${activeDeals} active` : undefined}
          trendDirection="up"
          icon={<DollarSign className="h-4 w-4" />}
        />
        <StatCard
          label="Pending Payment"
          value={formatCurrency(pendingPaymentTotal)}
          trend={
            pendingInvoices.length > 0
              ? `${pendingInvoices.length} invoice${pendingInvoices.length !== 1 ? "s" : ""}`
              : "none"
          }
          trendDirection="neutral"
          icon={<Clock className="h-4 w-4" />}
        />
        <StatCard
          label="Active Deals"
          value={String(activeDeals)}
          trendDirection="up"
          icon={<Handshake className="h-4 w-4" />}
        />
        <StatCard
          label="Overdue"
          value={formatCurrency(overdueTotal)}
          trend={
            overdueInvoices.length > 0
              ? `${overdueInvoices.length} invoice${overdueInvoices.length !== 1 ? "s" : ""}`
              : "none"
          }
          trendDirection={overdueTotal > 0 ? "down" : "neutral"}
          icon={<AlertTriangle className="h-4 w-4" />}
        />
      </DashboardStatsRow>

      {/* --- Main Bento Grid (2-column) --- */}
      <DashboardGrid>
        {/* ---- Content Calendar Card (full width) ---- */}
        <Card variant="glass" className="min-h-[320px] md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-lavender" />
              Content Calendar
            </CardTitle>
            <CardAction>
              <Link href="/calendar">
                <Button variant="glass" size="xs">
                  View All
                  <ChevronRight className="h-3 w-3" />
                </Button>
              </Link>
            </CardAction>
          </CardHeader>
          <CardContent>
            {hasAnyCalendarEvents ? (
              <>
                {/* Weekly grid — 7 columns for days anchored to today */}
                <div className="grid grid-cols-7 gap-1.5">
                  {/* Day headers */}
                  {calendarDayLabels.map((day, idx) => (
                    <div
                      key={idx}
                      className="pb-2 text-center text-xs font-medium text-muted-foreground"
                    >
                      {day}
                    </div>
                  ))}

                  {/* Content event blocks per day */}
                  {calendarDays.map((slots, dayIdx) => (
                    <div key={dayIdx} className="space-y-1">
                      {slots.length > 0 ? (
                        slots.map((slot, slotIdx) => (
                          <div
                            key={slotIdx}
                            className={`h-8 rounded-md border flex items-center justify-center
                              ${slot.color === "coral"    ? "bg-coral/20 border-coral/30"       : ""}
                              ${slot.color === "lavender" ? "bg-lavender/20 border-lavender/30" : ""}
                              ${slot.color === "mint"     ? "bg-mint/20 border-mint/30"         : ""}
                              ${slot.color === "orange"   ? "bg-orange/20 border-orange/30"     : ""}
                            `}
                          >
                            <span
                              className={`text-[10px] font-medium
                                ${slot.color === "coral"    ? "text-coral"    : ""}
                                ${slot.color === "lavender" ? "text-lavender" : ""}
                                ${slot.color === "mint"     ? "text-mint"     : ""}
                                ${slot.color === "orange"   ? "text-orange"   : ""}
                              `}
                            >
                              {slot.label}
                            </span>
                          </div>
                        ))
                      ) : (
                        <div />
                      )}
                    </div>
                  ))}
                </div>

                {/* Platform legend */}
                <div className="mt-4 flex gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-coral" />
                    Instagram
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-lavender" />
                    TikTok
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-mint" />
                    YouTube
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-orange" />
                    Multi
                  </div>
                </div>
              </>
            ) : (
              <div className="flex h-40 flex-col items-center justify-center gap-2 text-muted-foreground">
                <CalendarDays className="h-8 w-8 opacity-30" />
                <p className="text-sm">No content scheduled this week</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* ---- Upcoming Deadlines Card (full width) ---- */}
        <Card variant="glass" className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-orange" />
              Upcoming Deadlines
            </CardTitle>
            <CardAction>
              <Link href="/deals">
                <Button variant="glass" size="xs">
                  All Deals
                  <ChevronRight className="h-3 w-3" />
                </Button>
              </Link>
            </CardAction>
          </CardHeader>
          <CardContent>
            {visibleDeadlines.length > 0 ? (
              <ul className="divide-y divide-white/5">
                {visibleDeadlines.map((entry, idx) => {
                  const daysAway = differenceInDays(entry.date, today);
                  const isUrgent = daysAway <= 2;
                  const isSoon = daysAway <= 7 && daysAway > 2;
                  return (
                    <li
                      key={`${entry.dealId}-${entry.type}-${idx}`}
                      className="flex items-center gap-4 py-3 first:pt-0 last:pb-0"
                    >
                      {/* Icon */}
                      <div
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg
                          ${entry.type === "content"
                            ? "bg-lavender/15 text-lavender"
                            : "bg-mint/15 text-mint"
                          }`}
                      >
                        {entry.type === "content" ? (
                          <CalendarDays className="h-4 w-4" />
                        ) : (
                          <DollarSign className="h-4 w-4" />
                        )}
                      </div>

                      {/* Deal info */}
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium leading-tight">
                          {entry.dealTitle}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">
                          {entry.brandName ?? "No brand"} &middot;{" "}
                          {entry.type === "content" ? "Content deadline" : "Payment due"}
                        </p>
                      </div>

                      {/* Date + urgency badge */}
                      <div className="flex shrink-0 flex-col items-end gap-0.5">
                        <span className="text-xs font-medium text-foreground">
                          {format(entry.date, "MMM d")}
                        </span>
                        <span
                          className={`text-[10px] font-semibold
                            ${isUrgent ? "text-coral" : isSoon ? "text-orange" : "text-muted-foreground"}`}
                        >
                          {formatDeadlineDistance(entry.date)}
                        </span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <div className="flex h-36 flex-col items-center justify-center gap-2 text-muted-foreground">
                <CalendarDays className="h-8 w-8 opacity-30" />
                <p className="text-sm">No upcoming deadlines</p>
              </div>
            )}
          </CardContent>
        </Card>
      </DashboardGrid>
    </DashboardShell>
  );
}
