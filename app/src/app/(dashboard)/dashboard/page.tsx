import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
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
  TrendingUp,
  ChevronRight,
} from "lucide-react";
import type { DealStatus, InvoiceStatus, Platform } from "@/types/database";
import {
  startOfDay,
  addDays,
  getDay,
  parseISO,
  subMonths,
  startOfMonth,
  endOfMonth,
  format,
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
      - Invoice Tracking (bar chart + status legend — real data)
      - Campaign Analytics (line chart + metrics)

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
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("id", user.id)
      .single();

    if (profile && !profile.full_name) {
      redirect("/onboarding");
    }
  }

  // ---- Date boundaries ----
  const now = new Date();

  // Current month
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 1).toISOString();

  // Content Calendar: next 7 days (Mon–Sun of current week view)
  const weekStart = startOfDay(now);
  const weekEnd = startOfDay(addDays(now, 7));

  // Last 6 months: for Invoice bar chart and Campaign Analytics
  const sixMonthsAgo = startOfMonth(subMonths(now, 5));

  // Typed row shapes coming back from Supabase
  type DealRow = { amount: number | null; status: DealStatus; created_at: string; currency: string };
  type InvoiceRow = { total: number; status: InvoiceStatus; paid_date: string | null; issue_date: string };
  type ContentEventRow = { platform: Platform | null; scheduled_at: string };
  type DealHistoryRow = { amount: number | null; status: DealStatus; created_at: string; currency: string };

  let dealsThisMonth: DealRow[] = [];
  let allInvoices: InvoiceRow[] = [];
  let contentEvents: ContentEventRow[] = [];
  let dealsHistory: DealHistoryRow[] = [];

  if (user) {
    const [dealsRes, invoicesRes, eventsRes, dealsHistoryRes] = await Promise.all([
      // KPI: deals created this calendar month
      supabase
        .from("deals")
        .select("amount, status, created_at, currency")
        .eq("user_id", user.id)
        .gte("created_at", monthStart)
        .lt("created_at", monthEnd),

      // All invoices (for KPI and bar chart)
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

      // Campaign Analytics: deals from last 6 months
      supabase
        .from("deals")
        .select("amount, status, created_at, currency")
        .eq("user_id", user.id)
        .gte("created_at", sixMonthsAgo.toISOString()),
    ]);

    dealsThisMonth = (dealsRes.data ?? []).map((d: Record<string, unknown>) => ({
      amount: d.amount != null ? Number(d.amount) : null,
      status: d.status as DealStatus,
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

    dealsHistory = (dealsHistoryRes.data ?? []).map((d: Record<string, unknown>) => ({
      amount: d.amount != null ? Number(d.amount) : null,
      status: d.status as DealStatus,
      created_at: d.created_at as string,
      currency: (d.currency as string) ?? "EUR",
    }));
  }

  // ---- Determine primary currency from all fetched deals ----
  const currencyCounts: Record<string, number> = {};
  [...dealsThisMonth, ...dealsHistory].forEach((d) => {
    const c = d.currency ?? "EUR";
    currencyCounts[c] = (currencyCounts[c] || 0) + 1;
  });
  const primaryCurrency =
    Object.entries(currencyCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "EUR";
  const formatCurrency = makeCurrencyFormatter(primaryCurrency);

  // ---- KPI calculations ----

  // "Earned This Month" — deals created this month that are paid or completed
  const earnedThisMonth = dealsThisMonth
    .filter((d) => ["paid", "completed"].includes(d.status))
    .reduce((sum, d) => sum + (d.amount ?? 0), 0);

  // "Active Deals" — deals this month NOT in terminal/paid statuses
  const activeDeals = dealsThisMonth.filter(
    (d) => !["paid", "completed", "cancelled"].includes(d.status)
  ).length;

  // "Pending Payment" — invoices with status sent or viewed
  const pendingInvoices = allInvoices.filter((i) =>
    ["sent", "viewed"].includes(i.status)
  );
  const pendingPaymentTotal = pendingInvoices.reduce((sum, i) => sum + i.total, 0);

  // "Overdue" — invoices with status overdue
  const overdueInvoices = allInvoices.filter((i) => i.status === "overdue");
  const overdueTotal = overdueInvoices.reduce((sum, i) => sum + i.total, 0);

  // Invoice Tracking card — revenue (paid invoices) + pending + overdue
  const invoiceRevenue = allInvoices
    .filter((i) => i.status === "paid")
    .reduce((sum, i) => sum + i.total, 0);

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

  // ---- Invoice bar chart: last 6 months paid totals ----
  // Build array of { monthKey: "YYYY-MM", total: number } for 6 months
  const invoiceMonthlyTotals: number[] = Array(6).fill(0);
  const invoiceMonthLabels: string[] = [];
  for (let i = 5; i >= 0; i--) {
    const monthDate = subMonths(now, i);
    invoiceMonthLabels.push(format(monthDate, "MMM"));
    const mStart = startOfMonth(monthDate);
    const mEnd = endOfMonth(monthDate);
    const total = allInvoices
      .filter((inv) => {
        if (inv.status !== "paid" || !inv.paid_date) return false;
        const paidAt = parseISO(inv.paid_date);
        return paidAt >= mStart && paidAt <= mEnd;
      })
      .reduce((sum, inv) => sum + inv.total, 0);
    invoiceMonthlyTotals[5 - i] = total;
  }
  const invoiceMaxMonthly = Math.max(...invoiceMonthlyTotals, 1); // avoid div/0
  const invoiceBarHeights = invoiceMonthlyTotals.map((t) =>
    Math.max(Math.round((t / invoiceMaxMonthly) * 100), 4)
  );

  // ---- Campaign Analytics: last 6 months deal revenue ----
  const dealMonthlyRevenue: number[] = Array(6).fill(0);
  const dealMonthLabels: string[] = [];
  for (let i = 5; i >= 0; i--) {
    const monthDate = subMonths(now, i);
    dealMonthLabels.push(format(monthDate, "MMM"));
    const mStart = startOfMonth(monthDate);
    const mEnd = endOfMonth(monthDate);
    const revenue = dealsHistory
      .filter((d) => {
        if (!["paid", "completed"].includes(d.status)) return false;
        const createdAt = parseISO(d.created_at);
        return createdAt >= mStart && createdAt <= mEnd;
      })
      .reduce((sum, d) => sum + (d.amount ?? 0), 0);
    dealMonthlyRevenue[5 - i] = revenue;
  }
  const dealMaxMonthly = Math.max(...dealMonthlyRevenue, 1);
  const dealBarHeights = dealMonthlyRevenue.map((r) =>
    Math.max(Math.round((r / dealMaxMonthly) * 100), 4)
  );

  // Total revenue across all 6 months (paid/completed deals)
  const totalRevenue6Months = dealMonthlyRevenue.reduce((s, v) => s + v, 0);

  // Active deals count across all 6-month history (not just this month)
  const activeDealsTotal = dealsHistory.filter(
    (d) => !["paid", "completed", "cancelled"].includes(d.status)
  ).length;

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

        {/* ---- Invoice Tracking Card (real data) ---- */}
        <Card variant="glass" className="min-h-[320px]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-mint" />
              Invoice Tracking
            </CardTitle>
            <CardAction>
              <Link href="/invoices">
                <Button variant="glass" size="xs">
                  View All
                </Button>
              </Link>
            </CardAction>
          </CardHeader>
          <CardContent>
            {/* Bar chart — real paid invoice totals for last 6 months */}
            <div className="mb-1 flex items-end gap-2" style={{ height: "100px" }}>
              {invoiceBarHeights.map((height, i) => (
                <div key={i} className="flex flex-1 flex-col items-center gap-1">
                  <div
                    className="w-full rounded-t-sm bg-gradient-to-t from-mint/60 to-mint/20 transition-all hover:from-mint/80 hover:to-mint/40"
                    style={{ height: `${height}%` }}
                  />
                </div>
              ))}
            </div>
            {/* Month labels below the bars */}
            <div className="mb-3 flex gap-2">
              {invoiceMonthLabels.map((label, i) => (
                <div
                  key={i}
                  className="flex-1 text-center text-[9px] text-muted-foreground"
                >
                  {label}
                </div>
              ))}
            </div>

            {/* Status legend — real numbers from invoices */}
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-lg bg-white/5 p-2.5">
                <p className="text-[10px] font-medium text-muted-foreground">Revenue</p>
                <p className="text-sm font-bold text-mint">
                  {formatCurrency(invoiceRevenue)}
                </p>
              </div>
              <div className="rounded-lg bg-white/5 p-2.5">
                <p className="text-[10px] font-medium text-muted-foreground">Pending</p>
                <p className="text-sm font-bold text-orange">
                  {formatCurrency(pendingPaymentTotal)}
                </p>
              </div>
              <div className="rounded-lg bg-white/5 p-2.5">
                <p className="text-[10px] font-medium text-muted-foreground">Overdue</p>
                <p className="text-sm font-bold text-coral">
                  {formatCurrency(overdueTotal)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ---- Campaign Analytics Card ---- */}
        <Card variant="glass" className="min-h-[320px]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-coral" />
              Campaign Analytics
            </CardTitle>
            <CardAction>
              <Link href="/analytics">
                <Button variant="glass" size="xs">
                  Details
                  <ChevronRight className="h-3 w-3" />
                </Button>
              </Link>
            </CardAction>
          </CardHeader>
          <CardContent>
            {/* Bar chart — real deal revenue for last 6 months */}
            <div className="mb-1 flex items-end gap-2" style={{ height: "100px" }}>
              {dealBarHeights.map((height, i) => (
                <div key={i} className="flex flex-1 flex-col items-center gap-1">
                  <div
                    className="w-full rounded-t-sm bg-gradient-to-t from-coral/50 to-coral/10 transition-all hover:from-coral/70 hover:to-coral/20"
                    style={{ height: `${height}%` }}
                  />
                </div>
              ))}
            </div>
            {/* Month labels */}
            <div className="mb-3 flex gap-2">
              {dealMonthLabels.map((label, i) => (
                <div
                  key={i}
                  className="flex-1 text-center text-[9px] text-muted-foreground"
                >
                  {label}
                </div>
              ))}
            </div>

            {/* Metrics row — real data */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg bg-white/5 p-3">
                <p className="text-[10px] font-medium text-muted-foreground">
                  Total Revenue
                </p>
                <p className="text-lg font-bold">
                  {formatCurrency(totalRevenue6Months)}
                </p>
                <p className="text-xs text-mint">last 6 months</p>
              </div>
              <div className="rounded-lg bg-white/5 p-3">
                <p className="text-[10px] font-medium text-muted-foreground">
                  Active Deals
                </p>
                <p className="text-lg font-bold">{activeDealsTotal}</p>
                <p className="text-xs text-orange">
                  {activeDealsTotal === 1 ? "deal in progress" : "deals in progress"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </DashboardGrid>
    </DashboardShell>
  );
}
