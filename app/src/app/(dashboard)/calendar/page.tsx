import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { DashboardShell, DashboardHeading } from "@/components/dashboard/dashboard-grid";

export const metadata: Metadata = {
  title: "Content Calendar",
};
import { CalendarPageClient } from "@/components/calendar/calendar-page-client";
import { CalendarDays } from "lucide-react";
import type { ContentEvent } from "@/types/database";
import { getStatusConfig } from "@/lib/get-status-config";
import { getHiddenFromCalendarStatuses } from "@/lib/deal-status-config";

type DealOption = { id: string; title: string; brand_name: string; platform: string; start_date: string | null; end_date: string | null };

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
        .select("id, title, brand_name, platform, start_date, end_date, status")
        .eq("user_id", user.id)
        .order("title", { ascending: true }),
    ]);

    const statusConfig = await getStatusConfig();
    const hiddenStatuses = getHiddenFromCalendarStatuses(statusConfig);

    const allDeals = dealsRes.data ?? [];
    const hiddenDealIds = new Set(
      allDeals.filter((d) => hiddenStatuses.includes(d.status as string)).map((d) => d.id),
    );

    deals = allDeals.filter((d) => !hiddenStatuses.includes(d.status as string));
    events = (eventsRes.data ?? []).filter(
      (e) => !e.deal_id || !hiddenDealIds.has(e.deal_id),
    );
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
