"use client";

import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardGrid } from "@/components/dashboard/dashboard-grid";
import { TrendingUp, BarChart3 } from "lucide-react";

type MonthlyData = {
  month: string;
  revenue: number;
  deals: number;
};

type PlatformData = {
  platform: string;
  deals: number;
  revenue: number;
};

type AnalyticsChartsProps = {
  monthlyData: MonthlyData[];
  platformData: PlatformData[];
};

const PLATFORM_LABELS: Record<string, string> = {
  instagram: "Instagram",
  tiktok: "TikTok",
  youtube: "YouTube",
  multi: "Multi",
};

export function AnalyticsCharts({
  monthlyData,
  platformData,
}: AnalyticsChartsProps) {
  const chartPlatformData = platformData.map((p) => ({
    ...p,
    name: PLATFORM_LABELS[p.platform] ?? p.platform,
  }));

  return (
    <DashboardGrid>
      {/* Revenue Trend */}
      <Card variant="glass" className="min-h-[320px]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <TrendingUp className="h-5 w-5 text-mint" />
            Revenue Trend
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={monthlyData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.05)"
              />
              <XAxis
                dataKey="month"
                stroke="rgba(255,255,255,0.3)"
                fontSize={12}
              />
              <YAxis stroke="rgba(255,255,255,0.3)" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(30,20,50,0.9)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "8px",
                  color: "#fff",
                }}
              />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#7ECFB3"
                strokeWidth={2}
                dot={{ fill: "#7ECFB3", r: 4 }}
                name="Revenue ($)"
              />
              <Line
                type="monotone"
                dataKey="deals"
                stroke="#F5A623"
                strokeWidth={2}
                dot={{ fill: "#F5A623", r: 4 }}
                name="Deals"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Platform Revenue */}
      <Card variant="glass" className="min-h-[320px]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <BarChart3 className="h-5 w-5 text-coral" />
            Revenue by Platform
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={chartPlatformData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.05)"
              />
              <XAxis
                dataKey="name"
                stroke="rgba(255,255,255,0.3)"
                fontSize={12}
              />
              <YAxis stroke="rgba(255,255,255,0.3)" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(30,20,50,0.9)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "8px",
                  color: "#fff",
                }}
              />
              <Bar
                dataKey="revenue"
                fill="#E8788A"
                radius={[4, 4, 0, 0]}
                name="Revenue ($)"
              />
              <Bar
                dataKey="deals"
                fill="#B8A9E8"
                radius={[4, 4, 0, 0]}
                name="Deals"
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </DashboardGrid>
  );
}
