import * as React from "react"
import { cn } from "@/lib/utils"

/* ============================================================
   DashboardGrid — Bento grid layout matching mockup designs
   ============================================================
   Layout structure (desktop):
   ┌──────────────────────────────────────────┐
   │ KPI Stats Row (4 columns)               │
   ├─────────────────────┬────────────────────┤
   │ Content Calendar     │ Contract Generator │
   │ (larger)            │                    │
   ├─────────────────────┼────────────────────┤
   │ Invoice Tracking     │ Campaign Analytics │
   │                     │                    │
   └─────────────────────┴────────────────────┘

   Mobile: Single column, cards stack vertically.
   Tablet: 2-column grid starts at md breakpoint.
   ============================================================ */

/**
 * Wrapper that provides the gradient background canvas.
 * All dashboard content sits inside this to get the
 * purple-to-orange gradient bleeding through glass cards.
 */
function DashboardShell({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        /* Gradient background that fills the entire dashboard area */
        "min-h-full bg-dashboard-gradient",
        /* In dark mode, use the mesh gradient for richer depth */
        "dark:bg-mesh-gradient",
        /* Padding for content breathing room */
        "p-4 md:p-6 lg:p-8",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

/**
 * Main bento grid container.
 * Uses CSS Grid with responsive columns.
 * Gap of 20px (1.25rem) matches the mockup spacing.
 */
function DashboardGrid({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("dashboard-grid", className)}
      {...props}
    >
      {children}
    </div>
  )
}

/**
 * KPI Stats row — always spans full width of the grid.
 * Contains 3-4 stat cards in a horizontal row.
 * On mobile: 2x2 grid. On desktop: single row.
 */
function DashboardStatsRow({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "dashboard-grid-full",
        "grid grid-cols-2 gap-3 md:gap-4 md:grid-cols-4",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

/**
 * Individual KPI stat card — compact, no padding overhead.
 * Uses glassmorphism in dark mode for visual consistency.
 */
function StatCard({
  className,
  label,
  value,
  trend,
  trendDirection = "neutral",
  icon,
  ...props
}: React.ComponentProps<"div"> & {
  label: string
  value: string
  trend?: string
  trendDirection?: "up" | "down" | "neutral"
  icon?: React.ReactNode
}) {
  return (
    <div
      className={cn(
        /* Glass card surface */
        "glass glass-highlight rounded-xl p-4 md:p-5",
        className
      )}
      {...props}
    >
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-muted-foreground md:text-sm">
          {label}
        </p>
        {icon && (
          <span className="text-muted-foreground">{icon}</span>
        )}
      </div>
      <div className="mt-2 flex items-baseline gap-2">
        <span className="text-xl font-bold tracking-tight md:text-2xl">
          {value}
        </span>
        {trend && (
          <span
            className={cn(
              "text-xs font-medium",
              trendDirection === "up" && "text-success",
              trendDirection === "down" && "text-destructive",
              trendDirection === "neutral" && "text-muted-foreground"
            )}
          >
            {trend}
          </span>
        )}
      </div>
    </div>
  )
}

/**
 * Section heading for dashboard areas.
 * Uses DM Serif Display for the serif heading style.
 */
function DashboardHeading({
  className,
  children,
  ...props
}: React.ComponentProps<"h1">) {
  return (
    <h1
      className={cn(
        "dashboard-grid-full font-serif text-2xl tracking-tight md:text-3xl",
        className
      )}
      {...props}
    >
      {children}
    </h1>
  )
}

export {
  DashboardShell,
  DashboardGrid,
  DashboardStatsRow,
  DashboardHeading,
  StatCard,
}
