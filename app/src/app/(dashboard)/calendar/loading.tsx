import { DashboardShell } from "@/components/dashboard/dashboard-grid"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function CalendarLoading() {
  return (
    <DashboardShell>
      {/* Heading skeleton */}
      <div className="mb-6 flex items-center justify-between">
        <Skeleton className="h-9 w-44" />
        <div className="flex gap-2">
          <Skeleton className="h-8 w-8 rounded-md" />
          <Skeleton className="h-8 w-28 rounded-md" />
          <Skeleton className="h-8 w-8 rounded-md" />
        </div>
      </div>

      {/* Calendar card */}
      <Card variant="glass">
        <CardHeader>
          {/* Day-of-week headers */}
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: 7 }).map((_, i) => (
              <Skeleton key={i} className="h-4 w-full" />
            ))}
          </div>
        </CardHeader>
        <CardContent>
          {/* 5 weeks × 7 days = 35 skeleton day blocks */}
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: 35 }).map((_, i) => (
              <div
                key={i}
                className="glass glass-highlight rounded-lg p-2 min-h-[80px] space-y-1.5"
              >
                <Skeleton className="h-3 w-6" />
                {/* Randomly show 0-2 event blocks per day */}
                {i % 3 === 0 && <Skeleton className="h-6 w-full rounded-md" />}
                {i % 5 === 0 && <Skeleton className="h-6 w-full rounded-md" />}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </DashboardShell>
  )
}
