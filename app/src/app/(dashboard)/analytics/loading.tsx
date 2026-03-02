import {
  DashboardShell,
  DashboardGrid,
  DashboardStatsRow,
} from "@/components/dashboard/dashboard-grid"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function AnalyticsLoading() {
  return (
    <DashboardShell>
      {/* Heading skeleton */}
      <div className="mb-6 flex items-center justify-between">
        <Skeleton className="h-9 w-28" />
        <div className="flex gap-2">
          <Skeleton className="h-8 w-24 rounded-md" />
          <Skeleton className="h-8 w-24 rounded-md" />
        </div>
      </div>

      {/* Stats row — 4 metric cards */}
      <DashboardStatsRow className="mb-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="glass glass-highlight rounded-xl p-4 md:p-5"
          >
            <div className="flex items-center justify-between">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-4 w-4 rounded-full" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <Skeleton className="h-7 w-20" />
              <Skeleton className="h-3 w-10" />
            </div>
          </div>
        ))}
      </DashboardStatsRow>

      {/* 2 chart card skeletons */}
      <DashboardGrid>
        {Array.from({ length: 2 }).map((_, i) => (
          <Card key={i} variant="glass" className="min-h-[320px]">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-5 w-5 rounded-full" />
                  <Skeleton className="h-4 w-36" />
                </div>
                <div className="flex gap-1">
                  <Skeleton className="h-6 w-12 rounded-md" />
                  <Skeleton className="h-6 w-12 rounded-md" />
                  <Skeleton className="h-6 w-12 rounded-md" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Chart area */}
              <Skeleton className="h-[160px] w-full rounded-lg" />
              {/* Legend row */}
              <div className="flex gap-4">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-3 w-20" />
              </div>
            </CardContent>
          </Card>
        ))}
      </DashboardGrid>
    </DashboardShell>
  )
}
