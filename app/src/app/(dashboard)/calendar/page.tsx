import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { DashboardShell, DashboardHeading } from "@/components/dashboard/dashboard-grid";

export const metadata: Metadata = {
  title: "Content Calendar",
};
import { CalendarPageClient } from "@/components/calendar/calendar-page-client";
import { CalendarDays } from "lucide-react";
import type { ContentEvent } from "@/types/database";

type DealOption = { id: string; title: string; brand_name: string; platform: string };

export default async function CalendarPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let events: ContentEvent[] = [];
  let deals: DealOption[] = [];

  if (user) {
    const [eventsRes, dealsRes] = await Promise.all([
      supabase
        .from("content_events")
        .select("*")
        .eq("user_id", user.id)
        .order("scheduled_at", { ascending: true }),
      supabase
        .from("deals")
        .select("id, title, brand_name, platform")
        .eq("user_id", user.id)
        .in("status", ["negotiation", "agreed", "in_progress", "content_submitted"])
        .order("title", { ascending: true }),
    ]);

    events = eventsRes.data ?? [];
    deals = dealsRes.data ?? [];
  }

  return (
    <DashboardShell>
      <div className="mb-6 flex items-center gap-3">
        <CalendarDays className="h-7 w-7 text-lavender" />
        <DashboardHeading>Content Calendar</DashboardHeading>
      </div>

      <CalendarPageClient events={events} deals={deals} />
    </DashboardShell>
  );
}
