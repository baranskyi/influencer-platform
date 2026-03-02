"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export type CreateEventInput = {
  title: string;
  description: string;
  event_type: string;
  platform: string;
  scheduled_at: string;
  deal_id: string | null;
};

export type UpdateEventInput = CreateEventInput & {
  id: string;
};

export async function createEvent(input: CreateEventInput) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  const { error } = await supabase.from("content_events").insert({
    user_id: user.id,
    title: input.title,
    description: input.description || null,
    event_type: input.event_type,
    platform: input.platform || null,
    scheduled_at: input.scheduled_at,
    deal_id: input.deal_id || null,
    status: "planned",
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/calendar");
  return { success: true };
}

export async function updateEvent(input: UpdateEventInput) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  const { error } = await supabase
    .from("content_events")
    .update({
      title: input.title,
      description: input.description || null,
      event_type: input.event_type,
      platform: input.platform || null,
      scheduled_at: input.scheduled_at,
      deal_id: input.deal_id || null,
    })
    .eq("id", input.id)
    .eq("user_id", user.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/calendar");
  return { success: true };
}

export async function updateEventStatus(eventId: string, status: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  const updateData: Record<string, unknown> = { status };

  if (status === "completed") {
    updateData.completed_at = new Date().toISOString();
  }

  const { error } = await supabase
    .from("content_events")
    .update(updateData)
    .eq("id", eventId)
    .eq("user_id", user.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/calendar");
  return { success: true };
}

export async function deleteEvent(eventId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  const { error } = await supabase
    .from("content_events")
    .delete()
    .eq("id", eventId)
    .eq("user_id", user.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/calendar");
  return { success: true };
}
