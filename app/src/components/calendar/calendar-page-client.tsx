"use client";

import { useState } from "react";
import { CalendarGrid } from "./calendar-grid";
import { PlatformFilter } from "./platform-filter";
import { EventForm } from "./event-form";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import type { ContentEvent, Platform } from "@/types/database";

type DealOption = { id: string; title: string };

type CalendarPageClientProps = {
  events: ContentEvent[];
  deals: DealOption[];
};

export function CalendarPageClient({ events, deals }: CalendarPageClientProps) {
  const [platformFilter, setPlatformFilter] = useState<Platform | "all">("all");
  const [createOpen, setCreateOpen] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header with filter and create button */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <PlatformFilter value={platformFilter} onChange={setPlatformFilter} />
        <Button variant="accent" size="sm" onClick={() => setCreateOpen(true)}>
          <Plus className="h-4 w-4" />
          New Event
        </Button>
      </div>

      {/* Calendar grid */}
      <CalendarGrid
        events={events}
        deals={deals}
        platformFilter={platformFilter}
      />

      {/* Quick-create dialog (without preselected date) */}
      <EventForm
        open={createOpen}
        onOpenChange={setCreateOpen}
        deals={deals}
      />
    </div>
  );
}
