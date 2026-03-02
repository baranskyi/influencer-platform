"use client";

import { useState, useTransition } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  subMonths,
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
} from "lucide-react";
import { EventForm } from "./event-form";
import {
  updateEventStatus,
  deleteEvent,
} from "@/app/(dashboard)/calendar/_actions/events";
import type { ContentEvent, Platform } from "@/types/database";

type DealOption = { id: string; title: string };

const PLATFORM_COLORS: Record<string, { bg: string; border: string; text: string; dot: string }> = {
  instagram: {
    bg: "bg-coral/20",
    border: "border-coral/30",
    text: "text-coral",
    dot: "bg-coral",
  },
  tiktok: {
    bg: "bg-lavender/20",
    border: "border-lavender/30",
    text: "text-lavender",
    dot: "bg-lavender",
  },
  youtube: {
    bg: "bg-mint/20",
    border: "border-mint/30",
    text: "text-mint",
    dot: "bg-mint",
  },
  multi: {
    bg: "bg-orange/20",
    border: "border-orange/30",
    text: "text-orange",
    dot: "bg-orange",
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
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [editingEvent, setEditingEvent] = useState<ContentEvent | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const filteredEvents =
    platformFilter === "all"
      ? events
      : events.filter((e) => e.platform === platformFilter);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

  // Build array of weeks
  const weeks: Date[][] = [];
  let day = calendarStart;
  while (day <= calendarEnd) {
    const week: Date[] = [];
    for (let i = 0; i < 7; i++) {
      week.push(day);
      day = addDays(day, 1);
    }
    weeks.push(week);
  }

  function getEventsForDay(date: Date) {
    return filteredEvents.filter((e) =>
      isSameDay(new Date(e.scheduled_at), date)
    );
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

  return (
    <div className="space-y-4">
      {/* Month navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <h2 className="font-serif text-xl">
          {format(currentMonth, "MMMM yyyy")}
        </h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
        >
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

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {weeks.flat().map((date, idx) => {
          const dayEvents = getEventsForDay(date);
          const inMonth = isSameMonth(date, currentMonth);
          const today = isToday(date);

          return (
            <div
              key={idx}
              className={cn(
                "group relative min-h-[100px] rounded-lg border p-1.5 transition-colors cursor-pointer",
                inMonth
                  ? "border-border/50 bg-white/5 hover:bg-white/10"
                  : "border-transparent bg-white/[0.02] opacity-40",
                today && "ring-1 ring-orange/50 border-orange/30"
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
                      : "text-muted-foreground"
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
                {dayEvents.slice(0, 3).map((event) => {
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
                        STATUS_STYLES[event.status]
                      )}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <span className="truncate flex-1">
                        {PLATFORM_LABELS[event.platform ?? "multi"]}{" "}
                        {event.title}
                      </span>

                      {/* Hover actions */}
                      <div className="hidden group-hover/event:flex items-center gap-0.5">
                        <button
                          onClick={() => handleToggleComplete(event)}
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
                {dayEvents.length > 3 && (
                  <span className="text-[9px] text-muted-foreground pl-1">
                    +{dayEvents.length - 3} more
                  </span>
                )}
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
