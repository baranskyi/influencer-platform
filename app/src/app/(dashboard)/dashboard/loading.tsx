import {
  DashboardShell,
  DashboardGrid,
  DashboardStatsRow,
} from "@/components/dashboard/dashboard-grid"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function DashboardLoading() {
  return (
    <DashboardShell>
      {/* Page header skeleton */}
      <div className="mb-6 flex items-center justify-between">
        <Skeleton className="h-9 w-40" />
        <div className="flex gap-2">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-8 w-20" />
        </div>
      </div>

      {/* KPI Stats Row — 4 skeleton stat cards */}
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
              <Skeleton className="h-3 w-12" />
            </div>
          </div>
        ))}
      </DashboardStatsRow>

      {/* Bento Grid — 2x2 skeleton cards */}
      <DashboardGrid>
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} variant="glass" className="min-h-[320px]">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-5 w-5 rounded-full" />
                  <Skeleton className="h-4 w-32" />
                </div>
                <Skeleton className="h-6 w-16 rounded-md" />
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <Skeleton className="h-[120px] w-full rounded-lg" />
              <div className="grid grid-cols-3 gap-3">
                <Skeleton className="h-14 rounded-lg" />
                <Skeleton className="h-14 rounded-lg" />
                <Skeleton className="h-14 rounded-lg" />
              </div>
            </CardContent>
          </Card>
        ))}
      </DashboardGrid>
    </DashboardShell>
  )
}
