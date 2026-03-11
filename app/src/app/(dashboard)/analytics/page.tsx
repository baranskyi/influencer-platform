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
  Users,
} from "lucide-react";
import type { Platform } from "@/types/database";
import { getStatusConfig } from "@/lib/get-status-config";
import { getEarnedStatuses, getTerminalStatuses } from "@/lib/deal-status-config";

export default async function AnalyticsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let deals: Array<{
    amount: number | null;
    currency: string;
    status: string;
    platform: Platform;
    created_at: string;
    client_id: string | null;
    clients: { name: string } | null;
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
        .select("amount, currency, status, platform, created_at, client_id, clients(name)")
        .eq("user_id", user.id),
      supabase
        .from("invoices")
        .select("total, status, issue_date")
        .eq("user_id", user.id),
    ]);

    deals = (dealsRes.data ?? []).map((d: Record<string, unknown>) => ({
      amount: d.amount != null ? Number(d.amount) : null,
      currency: d.currency as string,
      status: d.status as string,
      platform: d.platform as Platform,
      created_at: d.created_at as string,
      client_id: (d.client_id as string) ?? null,
      clients: d.clients
        ? { name: (d.clients as Record<string, unknown>).name as string }
        : null,
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

  // Calculate KPIs (config-driven)
  const statusConfig = await getStatusConfig();
  const earnedStatusValues = getEarnedStatuses(statusConfig);
  const terminalStatusValues = getTerminalStatuses(statusConfig);

  // Total Revenue = sum of earned deals + paid invoices (whichever is higher)
  const paidDealRevenue = deals
    .filter((d) => earnedStatusValues.includes(d.status))
    .reduce((sum, d) => sum + (d.amount ?? 0), 0);
  const paidInvoices = invoices.filter((i) => i.status === "paid");
  const paidInvoiceRevenue = paidInvoices.reduce((sum, i) => sum + i.total, 0);
  // Use the higher of the two to avoid undercounting
  const totalRevenue = Math.max(paidDealRevenue, paidInvoiceRevenue);

  const pendingRevenue = deals
    .filter((d) =>
      !earnedStatusValues.includes(d.status) && !terminalStatusValues.includes(d.status)
    )
    .reduce((sum, d) => sum + (d.amount ?? 0), 0);
  const totalDeals = deals.length;
  const totalInvoices = invoices.length;
  const invoiceRevenue = paidInvoiceRevenue;

  // Platform breakdown — show total deal value per platform (not just paid)
  const platformData = ["instagram", "tiktok", "youtube", "multi"].map(
    (platform) => {
      const platformDeals = deals.filter((d) => d.platform === platform);
      return {
        platform,
        deals: platformDeals.length,
        revenue: platformDeals.reduce((sum, d) => sum + (d.amount ?? 0), 0),
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
      .filter((d) => earnedStatusValues.includes(d.status))
      .reduce((sum, d) => sum + (d.amount ?? 0), 0);

    monthlyData.push({
      month: monthLabel,
      revenue: monthRevenue,
      deals: monthDeals.length,
    });
  }

  // Revenue by client — earned deals grouped by client, top 8
  const clientRevenueMap: Record<string, { name: string; revenue: number }> = {};
  deals
    .filter((d) => earnedStatusValues.includes(d.status) && d.client_id)
    .forEach((d) => {
      const id = d.client_id!;
      const name = d.clients?.name ?? "Unknown Client";
      if (!clientRevenueMap[id]) {
        clientRevenueMap[id] = { name, revenue: 0 };
      }
      clientRevenueMap[id].revenue += d.amount ?? 0;
    });
  const revenueByClient = Object.values(clientRevenueMap)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 8);
  const maxClientRevenue = revenueByClient[0]?.revenue ?? 0;

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
          trend={`${paidInvoices.length} paid invoice${paidInvoices.length !== 1 ? "s" : ""}`}
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
      {/* Revenue by Client */}
      <Card variant="glass" className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Users className="h-5 w-5 text-mint" />
            Revenue by Client
          </CardTitle>
        </CardHeader>
        <CardContent>
          {revenueByClient.length === 0 ? (
            <p className="py-4 text-center text-sm text-muted-foreground">
              No revenue data yet
            </p>
          ) : (
            <div className="space-y-3">
              {revenueByClient.map((client) => {
                const barWidth =
                  maxClientRevenue > 0
                    ? Math.round((client.revenue / maxClientRevenue) * 100)
                    : 0;
                return (
                  <div key={client.name} className="rounded-lg bg-white/5 p-3">
                    <div className="mb-1.5 flex items-center justify-between">
                      <span className="text-sm font-medium">{client.name}</span>
                      <span className="text-sm font-semibold text-mint">
                        {fmt(client.revenue)}
                      </span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                      <div
                        className="h-full rounded-full bg-mint transition-all"
                        style={{ width: `${barWidth}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </DashboardShell>
  );
}
