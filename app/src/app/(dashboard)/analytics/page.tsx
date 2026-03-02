import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import {
  DashboardShell,
  DashboardHeading,
  DashboardStatsRow,
  StatCard,
} from "@/components/dashboard/dashboard-grid";

export const metadata: Metadata = {
  title: "Analytics",
};
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AnalyticsCharts } from "@/components/analytics/analytics-charts";
import {
  TrendingUp,
  DollarSign,
  Handshake,
  FileText,
  BarChart3,
} from "lucide-react";
import type { DealStatus, Platform } from "@/types/database";

export default async function AnalyticsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let deals: Array<{
    amount: number | null;
    currency: string;
    status: DealStatus;
    platform: Platform;
    created_at: string;
  }> = [];
  let invoices: Array<{
    total: number;
    status: string;
    issue_date: string;
  }> = [];

  if (user) {
    const [dealsRes, invoicesRes] = await Promise.all([
      supabase
        .from("deals")
        .select("amount, currency, status, platform, created_at")
        .eq("user_id", user.id),
      supabase
        .from("invoices")
        .select("total, status, issue_date")
        .eq("user_id", user.id),
    ]);

    deals = (dealsRes.data ?? []).map((d: Record<string, unknown>) => ({
      amount: d.amount != null ? Number(d.amount) : null,
      currency: d.currency as string,
      status: d.status as DealStatus,
      platform: d.platform as Platform,
      created_at: d.created_at as string,
    }));
    invoices = (invoicesRes.data ?? []).map((i: Record<string, unknown>) => ({
      total: Number(i.total),
      status: i.status as string,
      issue_date: i.issue_date as string,
    }));
  }

  // Determine primary currency (most common among deals)
  const currencyCounts: Record<string, number> = {};
  deals.forEach((d) => {
    const c = d.currency ?? "EUR";
    currencyCounts[c] = (currencyCounts[c] || 0) + 1;
  });
  const primaryCurrency =
    Object.entries(currencyCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "EUR";

  const fmt = (n: number) =>
    new Intl.NumberFormat("en", {
      style: "currency",
      currency: primaryCurrency,
      minimumFractionDigits: 0,
    }).format(n);

  // Calculate KPIs
  const totalRevenue = deals
    .filter((d) => ["paid", "completed"].includes(d.status))
    .reduce((sum, d) => sum + (d.amount ?? 0), 0);
  const pendingRevenue = deals
    .filter((d) =>
      ["agreed", "in_progress", "content_submitted", "content_approved", "invoiced"].includes(
        d.status
      )
    )
    .reduce((sum, d) => sum + (d.amount ?? 0), 0);
  const totalDeals = deals.length;
  const totalInvoices = invoices.length;
  const paidInvoices = invoices.filter((i) => i.status === "paid");
  const invoiceRevenue = paidInvoices.reduce((sum, i) => sum + i.total, 0);

  // Platform breakdown
  const platformData = ["instagram", "tiktok", "youtube", "multi"].map(
    (platform) => {
      const platformDeals = deals.filter((d) => d.platform === platform);
      return {
        platform,
        deals: platformDeals.length,
        revenue: platformDeals
          .filter((d) => ["paid", "completed"].includes(d.status))
          .reduce((sum, d) => sum + (d.amount ?? 0), 0),
      };
    }
  );

  // Monthly revenue data (last 6 months)
  const monthlyData: Array<{ month: string; revenue: number; deals: number }> =
    [];
  for (let i = 5; i >= 0; i--) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    const monthLabel = date.toLocaleDateString("en", {
      month: "short",
      year: "2-digit",
    });

    const monthDeals = deals.filter((d) => d.created_at.startsWith(monthKey));
    const monthRevenue = monthDeals
      .filter((d) => ["paid", "completed"].includes(d.status))
      .reduce((sum, d) => sum + (d.amount ?? 0), 0);

    monthlyData.push({
      month: monthLabel,
      revenue: monthRevenue,
      deals: monthDeals.length,
    });
  }

  return (
    <DashboardShell>
      <div className="mb-6 flex items-center gap-3">
        <BarChart3 className="h-7 w-7 text-coral" />
        <DashboardHeading>Analytics</DashboardHeading>
      </div>

      {/* KPI Stats */}
      <DashboardStatsRow className="mb-6">
        <StatCard
          label="Total Revenue"
          value={fmt(totalRevenue)}
          trend={`${paidInvoices.length} paid`}
          trendDirection="up"
          icon={<DollarSign className="h-4 w-4" />}
        />
        <StatCard
          label="Pipeline"
          value={fmt(pendingRevenue)}
          trend="in progress"
          trendDirection="neutral"
          icon={<TrendingUp className="h-4 w-4" />}
        />
        <StatCard
          label="Total Deals"
          value={String(totalDeals)}
          icon={<Handshake className="h-4 w-4" />}
        />
        <StatCard
          label="Invoiced"
          value={fmt(invoiceRevenue)}
          trend={`${totalInvoices} invoices`}
          trendDirection="neutral"
          icon={<FileText className="h-4 w-4" />}
        />
      </DashboardStatsRow>

      {/* Charts */}
      <AnalyticsCharts
        monthlyData={monthlyData}
        platformData={platformData}
      />

      {/* Platform Breakdown */}
      <Card variant="glass" className="mt-6">
        <CardHeader>
          <CardTitle className="text-lg">Platform Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {platformData.map((p) => {
              const colors: Record<string, string> = {
                instagram: "text-coral",
                tiktok: "text-lavender",
                youtube: "text-mint",
                multi: "text-orange",
              };
              const labels: Record<string, string> = {
                instagram: "Instagram",
                tiktok: "TikTok",
                youtube: "YouTube",
                multi: "Multi",
              };
              return (
                <div key={p.platform} className="rounded-lg bg-white/5 p-4">
                  <p className={`text-sm font-medium ${colors[p.platform]}`}>
                    {labels[p.platform]}
                  </p>
                  <p className="text-2xl font-bold">{p.deals}</p>
                  <p className="text-xs text-muted-foreground">
                    deals &middot; {fmt(p.revenue)}
                  </p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </DashboardShell>
  );
}
