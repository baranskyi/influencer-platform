import type { SupabaseClient } from "@supabase/supabase-js";

type DateMapping = {
  dateField: string | null;
  eventType: "deadline" | "payment_due";
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
  }
) {
  const { dealId, userId, dealTitle, contentDeadline, paymentDueDate } = params;

  const mappings: DateMapping[] = [
    {
      dateField: contentDeadline,
      eventType: "deadline",
      titlePrefix: "Content Deadline",
    },
    {
      dateField: paymentDueDate,
      eventType: "payment_due",
      titlePrefix: "Payment Due",
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
      await supabase
        .from("content_events")
        .update({
          scheduled_at: `${mapping.dateField}T10:00:00`,
          title,
        })
        .eq("id", current.id);
    } else if (mapping.dateField && !current) {
      // Date SET + no event → INSERT
      await supabase.from("content_events").insert({
        user_id: userId,
        deal_id: dealId,
        title,
        event_type: mapping.eventType,
        scheduled_at: `${mapping.dateField}T10:00:00`,
        status: "planned",
        source: "deal_sync",
      });
    } else if (!mapping.dateField && current) {
      // Date NULL + event exists → DELETE
      await supabase
        .from("content_events")
        .delete()
        .eq("id", current.id);
    }
    // Date NULL + no event → nothing to do
  }
}
