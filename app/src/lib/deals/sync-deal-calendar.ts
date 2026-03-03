import type { SupabaseClient } from "@supabase/supabase-js";

type DateMapping = {
  dateField: string | null;
  eventType: "deadline" | "payment_due" | "campaign_start" | "campaign_end";
  titlePrefix: string;
};

/**
 * Syncs deal dates (content_deadline, payment_due_date) to calendar events.
 * Creates, updates, or deletes events with source="deal_sync".
 */
export async function syncDealCalendar(
  supabase: SupabaseClient,
  params: {
    dealId: string;
    userId: string;
    dealTitle: string;
    contentDeadline: string | null;
    paymentDueDate: string | null;
    startDate: string | null;
    endDate: string | null;
  }
) {
  const { dealId, userId, dealTitle, contentDeadline, paymentDueDate, startDate, endDate } = params;

  console.log("[syncDealCalendar] params:", { dealId, dealTitle, startDate, endDate, contentDeadline, paymentDueDate });

  const mappings: DateMapping[] = [
    {
      dateField: startDate,
      eventType: "campaign_start",
      titlePrefix: "Start Date",
    },
    {
      dateField: contentDeadline,
      eventType: "deadline",
      titlePrefix: "Content Deadline",
    },
    {
      dateField: endDate,
      eventType: "campaign_end",
      titlePrefix: "End Date",
    },
    {
      dateField: paymentDueDate,
      eventType: "payment_due",
      titlePrefix: "Payment Due Date",
    },
  ];

  // Fetch existing deal_sync events for this deal
  const { data: existing } = await supabase
    .from("content_events")
    .select("id, event_type, scheduled_at")
    .eq("deal_id", dealId)
    .eq("source", "deal_sync");

  const existingByType = new Map(
    (existing ?? []).map((e) => [e.event_type, e])
  );

  for (const mapping of mappings) {
    const current = existingByType.get(mapping.eventType);
    const title = `${mapping.titlePrefix}: ${dealTitle}`;

    if (mapping.dateField && current) {
      // Date SET + event exists → UPDATE
      const { error } = await supabase
        .from("content_events")
        .update({
          scheduled_at: `${mapping.dateField}T10:00:00`,
          title,
        })
        .eq("id", current.id);
      if (error) console.error(`[syncDealCalendar] UPDATE ${mapping.eventType}:`, error);
    } else if (mapping.dateField && !current) {
      // Date SET + no event → INSERT
      const { error } = await supabase.from("content_events").insert({
        user_id: userId,
        deal_id: dealId,
        title,
        event_type: mapping.eventType,
        scheduled_at: `${mapping.dateField}T10:00:00`,
        status: "planned",
        source: "deal_sync",
      });
      if (error) console.error(`[syncDealCalendar] INSERT ${mapping.eventType}:`, error);
    } else if (!mapping.dateField && current) {
      // Date NULL + event exists → DELETE
      const { error } = await supabase
        .from("content_events")
        .delete()
        .eq("id", current.id);
      if (error) console.error(`[syncDealCalendar] DELETE ${mapping.eventType}:`, error);
    }
    // Date NULL + no event → nothing to do
  }
}
