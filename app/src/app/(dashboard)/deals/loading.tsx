import { DashboardShell } from "@/components/dashboard/dashboard-grid"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function DealsLoading() {
  return (
    <DashboardShell>
      {/* Heading skeleton */}
      <div className="mb-6 flex items-center justify-between">
        <Skeleton className="h-9 w-28" />
        <Skeleton className="h-8 w-24" />
      </div>

      {/* Table skeleton */}
      <Card variant="glass">
        <CardHeader>
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-20" />
            <div className="flex gap-2">
              <Skeleton className="h-8 w-32 rounded-md" />
              <Skeleton className="h-8 w-24 rounded-md" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Table header row */}
          <div className="mb-3 grid grid-cols-5 gap-4 border-b border-white/10 pb-3">
            {["Deal", "Client", "Value", "Status", "Date"].map((col) => (
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
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-5 w-20 rounded-full" />
              <Skeleton className="h-4 w-20" />
            </div>
          ))}
        </CardContent>
      </Card>
    </DashboardShell>
  )
}
