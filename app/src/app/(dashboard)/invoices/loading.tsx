import {
  DashboardShell,
  DashboardStatsRow,
} from "@/components/dashboard/dashboard-grid"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function InvoicesLoading() {
  return (
    <DashboardShell>
      {/* Heading skeleton */}
      <div className="mb-6 flex items-center justify-between">
        <Skeleton className="h-9 w-32" />
        <Skeleton className="h-8 w-28" />
      </div>

      {/* Stats row skeleton — 3 invoice stat cards */}
      <DashboardStatsRow className="mb-6 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="glass glass-highlight rounded-xl p-4 md:p-5"
          >
            <div className="flex items-center justify-between">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-4 w-4 rounded-full" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <Skeleton className="h-7 w-24" />
              <Skeleton className="h-3 w-14" />
            </div>
          </div>
        ))}
      </DashboardStatsRow>

      {/* Table skeleton */}
      <Card variant="glass">
        <CardHeader>
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-24" />
            <div className="flex gap-2">
              <Skeleton className="h-8 w-32 rounded-md" />
              <Skeleton className="h-8 w-24 rounded-md" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Table header row */}
          <div className="mb-3 grid grid-cols-5 gap-4 border-b border-white/10 pb-3">
            {["Invoice", "Client", "Amount", "Status", "Due Date"].map((col) => (
              <Skeleton key={col} className="h-3 w-16" />
            ))}
          </div>

          {/* 5 skeleton table rows */}
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="grid grid-cols-5 gap-4 border-b border-white/5 py-3 last:border-0"
            >
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-5 w-20 rounded-full" />
              <Skeleton className="h-4 w-20" />
            </div>
          ))}
        </CardContent>
      </Card>
    </DashboardShell>
  )
}
