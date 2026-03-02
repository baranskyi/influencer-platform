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
  CreditCard,
  CalendarDays,
  TrendingUp,
  ChevronRight,
} from "lucide-react";

/* ============================================================
   Dashboard Page — "Creator Hub" / "Influencer Dashboard"
   ============================================================
   Layout matches the analyzed mockups:

   1. KPI Stats Row (4 cards across):
      - Earned This Month
      - Pending Payment
      - Active Deals
      - Overdue

   2. Bento Grid (2x2):
      - Content Calendar (weekly view with colored blocks)
      - Contract Generator (templates list)
      - Invoice Tracking (bar chart + status legend)
      - Campaign Analytics (line chart + metrics)

   3. Quick Actions row at top-right

   All cards use the glassmorphism "glass" variant to achieve
   the frosted effect seen in Mockup 2. The gradient background
   from DashboardShell bleeds through the translucent surfaces.
   ============================================================ */

export default function DashboardPage() {
  return (
    <DashboardShell>
      {/* --- Page Header --- */}
      <div className="mb-6 flex items-center justify-between">
        <DashboardHeading>Dashboard</DashboardHeading>

        {/* Quick actions — matches Mockup 1's top-right CTA buttons */}
        <div className="flex gap-2">
          <Button variant="accent" size="sm">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">New Deal</span>
          </Button>
          <Button variant="glass" size="sm">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Invoice</span>
          </Button>
        </div>
      </div>

      {/* --- KPI Stats Row --- */}
      <DashboardStatsRow className="mb-6">
        <StatCard
          label="Earned This Month"
          value="$8,373"
          trend="+12.5%"
          trendDirection="up"
          icon={<DollarSign className="h-4 w-4" />}
        />
        <StatCard
          label="Pending Payment"
          value="$1,790"
          trend="3 invoices"
          trendDirection="neutral"
          icon={<Clock className="h-4 w-4" />}
        />
        <StatCard
          label="Active Deals"
          value="7"
          trend="+2 this week"
          trendDirection="up"
          icon={<Handshake className="h-4 w-4" />}
        />
        <StatCard
          label="Overdue"
          value="$425"
          trend="1 invoice"
          trendDirection="down"
          icon={<AlertTriangle className="h-4 w-4" />}
        />
      </DashboardStatsRow>

      {/* --- Main Bento Grid (2-column) --- */}
      <DashboardGrid>
        {/* ---- Content Calendar Card ---- */}
        <Card variant="glass" className="min-h-[320px]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-lavender" />
              Content Calendar
            </CardTitle>
            <CardAction>
              <Button variant="glass" size="xs">
                This Week
                <ChevronRight className="h-3 w-3" />
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent>
            {/* Weekly grid — 7 columns for days */}
            <div className="grid grid-cols-7 gap-1.5">
              {/* Day headers */}
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                <div
                  key={day}
                  className="pb-2 text-center text-xs font-medium text-muted-foreground"
                >
                  {day}
                </div>
              ))}

              {/* Content blocks — colored by platform (from mockup) */}
              {/* Monday: Instagram post (coral) */}
              <div className="space-y-1">
                <div className="h-8 rounded-md bg-coral/20 border border-coral/30 flex items-center justify-center">
                  <span className="text-[10px] font-medium text-coral">IG</span>
                </div>
              </div>
              {/* Tuesday: empty */}
              <div />
              {/* Wednesday: TikTok (lavender) + YouTube (mint) */}
              <div className="space-y-1">
                <div className="h-8 rounded-md bg-lavender/20 border border-lavender/30 flex items-center justify-center">
                  <span className="text-[10px] font-medium text-lavender">TT</span>
                </div>
                <div className="h-8 rounded-md bg-mint/20 border border-mint/30 flex items-center justify-center">
                  <span className="text-[10px] font-medium text-mint">YT</span>
                </div>
              </div>
              {/* Thursday: Instagram story (coral) */}
              <div className="space-y-1">
                <div className="h-8 rounded-md bg-coral/20 border border-coral/30 flex items-center justify-center">
                  <span className="text-[10px] font-medium text-coral">IG</span>
                </div>
              </div>
              {/* Friday: TikTok (lavender) */}
              <div className="space-y-1">
                <div className="h-8 rounded-md bg-lavender/20 border border-lavender/30 flex items-center justify-center">
                  <span className="text-[10px] font-medium text-lavender">TT</span>
                </div>
              </div>
              {/* Saturday: empty */}
              <div />
              {/* Sunday: YouTube (mint) */}
              <div className="space-y-1">
                <div className="h-8 rounded-md bg-mint/20 border border-mint/30 flex items-center justify-center">
                  <span className="text-[10px] font-medium text-mint">YT</span>
                </div>
              </div>
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
            </div>
          </CardContent>
        </Card>

        {/* ---- Contract Generator Card ---- */}
        <Card variant="glass" className="min-h-[320px]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-orange" />
              Contract Generator
            </CardTitle>
            <CardAction>
              <Button variant="accent" size="xs">
                Generate
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent>
            {/* Templates list — matches mockup's template rows */}
            <div className="space-y-3">
              {[
                {
                  name: "Sponsored Post Agreement",
                  status: "Popular",
                  statusColor: "bg-mint/20 text-mint",
                },
                {
                  name: "Brand Ambassador Contract",
                  status: "New",
                  statusColor: "bg-orange/20 text-orange",
                },
                {
                  name: "UGC Content License",
                  status: "Popular",
                  statusColor: "bg-mint/20 text-mint",
                },
                {
                  name: "Affiliate Partnership",
                  status: "",
                  statusColor: "",
                },
              ].map((template) => (
                <div
                  key={template.name}
                  className="flex items-center justify-between rounded-lg border border-border/50 bg-white/5 px-3 py-2.5 transition-colors hover:bg-white/10"
                >
                  <span className="text-sm font-medium">{template.name}</span>
                  {template.status && (
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${template.statusColor}`}
                    >
                      {template.status}
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* E-signature CTA */}
            <div className="mt-4 flex items-center gap-2 rounded-lg bg-lavender/10 p-3">
              <CreditCard className="h-4 w-4 text-lavender" />
              <span className="text-xs text-muted-foreground">
                E-signature included with all contracts
              </span>
            </div>
          </CardContent>
        </Card>

        {/* ---- Invoice Tracking Card ---- */}
        <Card variant="glass" className="min-h-[320px]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-mint" />
              Invoice Tracking
            </CardTitle>
            <CardAction>
              <Button variant="glass" size="xs">
                View All
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent>
            {/* Revenue bar chart placeholder — matches mockup's bar visualization */}
            <div className="mb-4 flex items-end gap-2" style={{ height: "120px" }}>
              {[65, 45, 80, 55, 90, 70, 40, 85, 60, 75, 50, 95].map(
                (height, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-t-sm bg-gradient-to-t from-mint/60 to-mint/20 transition-all hover:from-mint/80 hover:to-mint/40"
                    style={{ height: `${height}%` }}
                  />
                )
              )}
            </div>

            {/* Status legend — matches mockup's $250 amounts and status dots */}
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-lg bg-white/5 p-2.5">
                <p className="text-[10px] font-medium text-muted-foreground">Revenue</p>
                <p className="text-sm font-bold text-mint">$1,790</p>
              </div>
              <div className="rounded-lg bg-white/5 p-2.5">
                <p className="text-[10px] font-medium text-muted-foreground">Pending</p>
                <p className="text-sm font-bold text-orange">$425</p>
              </div>
              <div className="rounded-lg bg-white/5 p-2.5">
                <p className="text-[10px] font-medium text-muted-foreground">Overdue</p>
                <p className="text-sm font-bold text-coral">$250</p>
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
              <Button variant="glass" size="xs">
                Campaign
                <ChevronRight className="h-3 w-3" />
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent>
            {/* Mixed chart placeholder — bar + line as in mockup */}
            <div className="relative mb-4" style={{ height: "120px" }}>
              {/* Bar chart layer */}
              <div className="absolute inset-0 flex items-end gap-2">
                {[40, 60, 35, 75, 50, 85, 65, 45, 70, 55, 80, 90].map(
                  (height, i) => (
                    <div
                      key={i}
                      className="flex-1 rounded-t-sm bg-gradient-to-t from-coral/40 to-coral/10"
                      style={{ height: `${height}%` }}
                    />
                  )
                )}
              </div>
              {/* Line chart overlay — SVG path for the trend line */}
              <svg
                className="absolute inset-0 h-full w-full"
                viewBox="0 0 300 120"
                preserveAspectRatio="none"
              >
                <path
                  d="M0,80 Q25,60 50,65 T100,45 T150,35 T200,50 T250,30 T300,20"
                  fill="none"
                  stroke="var(--color-orange)"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            {/* Metrics row — matches mockup's Total + Metrics display */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg bg-white/5 p-3">
                <p className="text-[10px] font-medium text-muted-foreground">
                  Total Revenue
                </p>
                <p className="text-lg font-bold">$8,373</p>
                <p className="text-xs text-mint">+12.5% vs last month</p>
              </div>
              <div className="rounded-lg bg-white/5 p-3">
                <p className="text-[10px] font-medium text-muted-foreground">
                  Engagement Rate
                </p>
                <p className="text-lg font-bold">98.8%</p>
                <p className="text-xs text-orange">Top 5% creators</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </DashboardGrid>
    </DashboardShell>
  );
}
