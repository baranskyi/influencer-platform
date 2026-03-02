import { DashboardShell } from "@/components/dashboard/dashboard-grid"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function ClientsLoading() {
  return (
    <DashboardShell>
      {/* Heading skeleton */}
      <div className="mb-6 flex items-center justify-between">
        <Skeleton className="h-9 w-24" />
        <Skeleton className="h-8 w-28" />
      </div>

      {/* Table skeleton */}
      <Card variant="glass">
        <CardHeader>
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-8 w-40 rounded-md" />
          </div>
        </CardHeader>
        <CardContent>
          {/* Table header row */}
          <div className="mb-3 grid grid-cols-4 gap-4 border-b border-white/10 pb-3">
            {["Client", "Deals", "Revenue", "Last Activity"].map((col) => (
              <Skeleton key={col} className="h-3 w-20" />
            ))}
          </div>

          {/* 5 skeleton table rows */}
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="grid grid-cols-4 gap-4 border-b border-white/5 py-3 last:border-0"
            >
              {/* Client with avatar */}
              <div className="flex items-center gap-2">
                <Skeleton className="h-8 w-8 rounded-full shrink-0" />
                <div className="space-y-1.5">
                  <Skeleton className="h-3.5 w-24" />
                  <Skeleton className="h-3 w-32" />
                </div>
              </div>
              <Skeleton className="h-4 w-8 self-center" />
              <Skeleton className="h-4 w-20 self-center" />
              <Skeleton className="h-4 w-24 self-center" />
            </div>
          ))}
        </CardContent>
      </Card>
    </DashboardShell>
  )
}
