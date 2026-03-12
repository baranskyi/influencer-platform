"use client";

import { useState, useMemo, useTransition } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  subMonths,
  addWeeks,
  subWeeks,
  isSameMonth,
  isSameDay,
  isToday,
} from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Check,
  Trash2,
  Pencil,
  Calendar as CalendarIcon,
  CalendarDays,
} from "lucide-react";
import { EventForm } from "./event-form";
import {
  updateEventStatus,
  deleteEvent,
} from "@/app/(dashboard)/calendar/_actions/events";
import {
  computeDealSpans,
  getLaneCount,
  getSpannedDealIds,
  type DealSpanSegment,
} from "./compute-deal-spans";
import type { ContentEvent, Platform } from "@/types/database";
import { trackEvent } from "@/lib/analytics";

type DealOption = {
  id: string;
  title: string;
  brand_name: string;
  platform: string;
  start_date: string | null;
  end_date: string | null;
};

const PLATFORM_COLORS: Record<
  string,
  { bg: string; border: string; text: string; dot: string; span: string }
> = {
  instagram: {
    bg: "bg-coral/20",
    border: "border-coral/30",
    text: "text-coral",
    dot: "bg-coral",
    span: "bg-coral/30 border-coral/40 text-coral",
  },
  tiktok: {
    bg: "bg-lavender/20",
    border: "border-lavender/30",
    text: "text-lavender",
    dot: "bg-lavender",
    span: "bg-lavender/30 border-lavender/40 text-lavender",
  },
  youtube: {
    bg: "bg-mint/20",
    border: "border-mint/30",
    text: "text-mint",
    dot: "bg-mint",
    span: "bg-mint/30 border-mint/40 text-mint",
  },
  multi: {
    bg: "bg-orange/20",
    border: "border-orange/30",
    text: "text-orange",
    dot: "bg-orange",
    span: "bg-orange/30 border-orange/40 text-orange",
  },
};

const PLATFORM_LABELS: Record<string, string> = {
  instagram: "IG",
  tiktok: "TT",
  youtube: "YT",
  multi: "MP",
};

const STATUS_STYLES: Record<string, string> = {
  planned: "opacity-100",
  in_progress: "opacity-100 ring-1 ring-orange/50",
  completed: "opacity-60 line-through",
  missed: "opacity-40 line-through",
};

type ViewMode = "month" | "week";

const SPAN_LANE_HEIGHT = 22; // px per lane row
const MAX_VISIBLE_LANES = 3;

type CalendarGridProps = {
  events: ContentEvent[];
  deals: DealOption[];
  platformFilter: Platform | "all";
};

export function CalendarGrid({
  events,
  deals,
  platformFilter,
}: CalendarGridProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [currentWeekStart, setCurrentWeekStart] = useState(
    startOfWeek(new Date(), { weekStartsOn: 1 }),
  );
  const [viewMode, setViewMode] = useState<ViewMode>("month");
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [editingEvent, setEditingEvent] = useState<ContentEvent | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const filteredEvents =
    platformFilter === "all"
      ? events
      : events.filter((e) => e.platform === platformFilter);

  const filteredDeals =
    platformFilter === "all"
      ? deals
      : deals.filter((d) => d.platform === platformFilter);

  // Build weeks for current view
  const weeks: Date[][] = useMemo(() => {
    if (viewMode === "week") {
      const week: Date[] = [];
      for (let i = 0; i < 7; i++) {
        week.push(addDays(currentWeekStart, i));
      }
      return [week];
    }

    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

    const result: Date[][] = [];
    let day = calendarStart;
    while (day <= calendarEnd) {
      const week: Date[] = [];
      for (let i = 0; i < 7; i++) {
        week.push(day);
        day = addDays(day, 1);
      }
      result.push(week);
    }
    return result;
  }, [currentMonth, currentWeekStart, viewMode]);

  // Compute deal spans
  const spanSegments = useMemo(
    () => computeDealSpans(filteredDeals, weeks),
    [filteredDeals, weeks],
  );

  const spannedDealIds = useMemo(
    () => getSpannedDealIds(filteredDeals),
    [filteredDeals],
  );

  function getEventsForDay(date: Date) {
    return filteredEvents.filter((e) => {
      if (!isSameDay(new Date(e.scheduled_at), date)) return false;
      // Hide campaign_start/campaign_end for deals shown as spans
      if (
        e.source === "deal_sync" &&
        e.deal_id &&
        spannedDealIds.has(e.deal_id) &&
        (e.event_type === "campaign_start" || e.event_type === "campaign_end")
      ) {
        return false;
      }
      return true;
    });
  }

  function handleDayClick(date: Date) {
    const dateStr = format(date, "yyyy-MM-dd");
    setSelectedDate(dateStr);
    setEditingEvent(null);
    setFormOpen(true);
  }

  function handleEditEvent(event: ContentEvent) {
    setEditingEvent(event);
    setSelectedDate(null);
    setFormOpen(true);
  }

  function handleToggleComplete(event: ContentEvent) {
    const newStatus =
      event.status === "completed" ? "planned" : "completed";
    startTransition(async () => {
      await updateEventStatus(event.id, newStatus);
    });
  }

  function handleDelete(eventId: string) {
    startTransition(async () => {
      await deleteEvent(eventId);
    });
  }

  function handlePrev() {
    trackEvent({ action: "calendar_month_navigate", label: "prev" });
    if (viewMode === "month") {
      setCurrentMonth(subMonths(currentMonth, 1));
    } else {
      setCurrentWeekStart(subWeeks(currentWeekStart, 1));
    }
  }

  function handleNext() {
    trackEvent({ action: "calendar_month_navigate", label: "next" });
    if (viewMode === "month") {
      setCurrentMonth(addMonths(currentMonth, 1));
    } else {
      setCurrentWeekStart(addWeeks(currentWeekStart, 1));
    }
  }

  const headerLabel =
    viewMode === "month"
      ? format(currentMonth, "MMMM yyyy")
      : `${format(currentWeekStart, "MMM d")} – ${format(addDays(currentWeekStart, 6), "MMM d, yyyy")}`;

  // Reference month for "in-month" styling
  const referenceMonth = viewMode === "month" ? currentMonth : currentWeekStart;

  return (
    <div className="space-y-4">
      {/* Navigation + view toggle */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="icon" onClick={handlePrev}>
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <div className="flex items-center gap-3">
          <h2 className="font-serif text-xl">{headerLabel}</h2>
          <div className="flex items-center rounded-lg border border-border/50 p-0.5">
            <button
              className={cn(
                "flex items-center gap-1 rounded-md px-2 py-1 text-xs transition-colors",
                viewMode === "month"
                  ? "bg-white/10 text-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
              onClick={() => { setViewMode("month"); trackEvent({ action: "calendar_view_toggle", label: "month" }); }}
            >
              <CalendarIcon className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Month</span>
            </button>
            <button
              className={cn(
                "flex items-center gap-1 rounded-md px-2 py-1 text-xs transition-colors",
                viewMode === "week"
                  ? "bg-white/10 text-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
              onClick={() => {
                setViewMode("week");
                trackEvent({ action: "calendar_view_toggle", label: "week" });
                // Sync week start to current month view
                setCurrentWeekStart(
                  startOfWeek(currentMonth, { weekStartsOn: 1 }),
                );
              }}
            >
              <CalendarDays className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Week</span>
            </button>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={handleNext}>
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 gap-1">
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
          <div
            key={d}
            className="py-2 text-center text-xs font-medium text-muted-foreground"
          >
            {d}
          </div>
        ))}
      </div>

      {/* Calendar weeks */}
      <div className="space-y-1">
        {weeks.map((week, weekIdx) => {
          const weekSegs = spanSegments.filter(
            (s) => s.weekIndex === weekIdx,
          );
          const laneCount = Math.min(
            getLaneCount(spanSegments, weekIdx),
            MAX_VISIBLE_LANES,
          );
          const overflowLanes =
            getLaneCount(spanSegments, weekIdx) - MAX_VISIBLE_LANES;
          const spanPadding = laneCount * SPAN_LANE_HEIGHT;

          return (
            <div key={weekIdx}>
              {/* Deal span rows (in normal flow, above day cells) */}
              {laneCount > 0 && (
                <div className="mb-0.5">
                  {Array.from({ length: laneCount }, (_, lane) => (
                    <div
                      key={lane}
                      className="grid grid-cols-7 gap-1"
                      style={{ height: `${SPAN_LANE_HEIGHT}px` }}
                    >
                      {renderSpanLane(weekSegs, lane, weekIdx)}
                    </div>
                  ))}
                </div>
              )}

              {/* Day cells */}
              <div className="grid grid-cols-7 gap-1">
                {week.map((date, dayIdx) => {
                  const dayEvents = getEventsForDay(date);
                  const inMonth =
                    viewMode === "week" || isSameMonth(date, referenceMonth);
                  const today = isToday(date);
                  const isWeekView = viewMode === "week";

                  return (
                    <div
                      key={dayIdx}
                      className={cn(
                        "group relative rounded-lg border p-1.5 transition-colors cursor-pointer",
                        isWeekView
                          ? "min-h-[120px] md:min-h-[180px]"
                          : "min-h-[60px] md:min-h-[100px]",
                        inMonth
                          ? "border-border/50 bg-white/5 hover:bg-white/10"
                          : "border-transparent bg-white/[0.02] opacity-40",
                        today && "ring-1 ring-orange/50 border-orange/30",
                      )}
                      onClick={() => handleDayClick(date)}
                    >
                      {/* Day number + add button */}
                      <div className="mb-1 flex items-center justify-between">
                        <span
                          className={cn(
                            "flex h-6 w-6 items-center justify-center rounded-full text-xs",
                            today
                              ? "bg-orange text-white font-bold"
                              : "text-muted-foreground",
                          )}
                        >
                          {format(date, "d")}
                        </span>
                        <button
                          className="opacity-0 group-hover:opacity-100 transition-opacity h-5 w-5 flex items-center justify-center rounded-full hover:bg-white/10"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDayClick(date);
                          }}
                        >
                          <Plus className="h-3 w-3 text-muted-foreground" />
                        </button>
                      </div>

                      {/* Event chips */}
                      <div className="space-y-0.5">
                        {dayEvents
                          .slice(0, isWeekView ? 8 : 3)
                          .map((event) => {
                            const colors =
                              PLATFORM_COLORS[event.platform ?? "multi"] ??
                              PLATFORM_COLORS.multi;

                            return (
                              <div
                                key={event.id}
                                className={cn(
                                  "group/event flex items-center gap-1 rounded px-1 py-0.5 text-[10px] font-medium border transition-all",
                                  colors.bg,
                                  colors.border,
                                  colors.text,
                                  STATUS_STYLES[event.status],
                                )}
                                onClick={(e) => e.stopPropagation()}
                              >
                                <span
                                  className={cn(
                                    "h-1.5 w-1.5 rounded-full flex-shrink-0 md:hidden",
                                    colors.dot,
                                  )}
                                />
                                <span className="hidden md:inline truncate flex-1">
                                  {PLATFORM_LABELS[event.platform ?? "multi"]}{" "}
                                  {event.title}
                                </span>

                                {/* Hover actions */}
                                <div className="hidden group-hover/event:flex items-center gap-0.5">
                                  <button
                                    onClick={() =>
                                      handleToggleComplete(event)
                                    }
                                    className="h-4 w-4 flex items-center justify-center rounded hover:bg-white/20"
                                    title={
                                      event.status === "completed"
                                        ? "Mark as planned"
                                        : "Mark as done"
                                    }
                                  >
                                    <Check className="h-2.5 w-2.5" />
                                  </button>
                                  <button
                                    onClick={() => handleEditEvent(event)}
                                    className="h-4 w-4 flex items-center justify-center rounded hover:bg-white/20"
                                  >
                                    <Pencil className="h-2.5 w-2.5" />
                                  </button>
                                  <button
                                    onClick={() => handleDelete(event.id)}
                                    className="h-4 w-4 flex items-center justify-center rounded hover:bg-white/20 text-coral"
                                  >
                                    <Trash2 className="h-2.5 w-2.5" />
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        {dayEvents.length > (isWeekView ? 8 : 3) && (
                          <span className="text-[9px] text-muted-foreground pl-1">
                            +{dayEvents.length - (isWeekView ? 8 : 3)} more
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Platform legend */}
      <Card variant="glass" className="p-3">
        <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
          {Object.entries(PLATFORM_COLORS).map(([key, colors]) => (
            <div key={key} className="flex items-center gap-1.5">
              <span className={cn("h-2 w-2 rounded-full", colors.dot)} />
              {key === "instagram"
                ? "Instagram"
                : key === "tiktok"
                  ? "TikTok"
                  : key === "youtube"
                    ? "YouTube"
                    : "Multi-platform"}
            </div>
          ))}
          <div className="ml-auto flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-orange ring-1 ring-orange/50" />
              In Progress
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-muted-foreground opacity-60" />
              Completed
            </div>
          </div>
        </div>
      </Card>

      {/* Event form dialog */}
      <EventForm
        open={formOpen}
        onOpenChange={setFormOpen}
        event={editingEvent}
        defaultDate={selectedDate ?? undefined}
        deals={deals}
      />
    </div>
  );
}

/**
 * Render span bars for a single lane row within a week.
 * Returns array of 7 grid cells (some empty, some with bars).
 */
function renderSpanLane(
  weekSegs: DealSpanSegment[],
  lane: number,
  weekIndex: number,
) {
  const segs = weekSegs
    .filter((s) => s.lane === lane)
    .sort((a, b) => a.startCol - b.startCol);

  if (segs.length === 0) {
    return <div className="col-span-7" />;
  }

  const cells: React.ReactNode[] = [];
  let col = 0;

  for (const seg of segs) {
    // Spacer before this segment
    if (seg.startCol > col) {
      cells.push(
        <div
          key={`spacer-${col}`}
          style={{ gridColumn: `span ${seg.startCol - col}` }}
        />,
      );
    }

    const colors =
      PLATFORM_COLORS[seg.platform ?? "multi"] ?? PLATFORM_COLORS.multi;

    cells.push(
      <a
        key={`span-${seg.dealId}-${weekIndex}`}
        href={`/deals/${seg.dealId}`}
        className={cn(
          "pointer-events-auto flex items-center h-[18px] px-1.5 text-[10px] font-medium border truncate transition-colors hover:brightness-125",
          colors.span,
          seg.isStart && "rounded-l-md",
          seg.isEnd && "rounded-r-md",
          !seg.isStart && "border-l-0",
          !seg.isEnd && "border-r-0",
        )}
        style={{ gridColumn: `span ${seg.spanCols}` }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Show title on start segment (desktop), thin bar on mobile */}
        <span className="hidden md:inline truncate">
          {seg.isStart ? seg.dealTitle : ""}
        </span>
      </a>,
    );

    col = seg.startCol + seg.spanCols;
  }

  // Trailing spacer
  if (col < 7) {
    cells.push(
      <div key={`trail-${col}`} style={{ gridColumn: `span ${7 - col}` }} />,
    );
  }

  return cells;
}
