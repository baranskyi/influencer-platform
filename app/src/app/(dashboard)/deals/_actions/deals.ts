"use server";

import { createClient } from "@/lib/supabase/server";
import { syncDealCalendar } from "@/lib/deals/sync-deal-calendar";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export type CreateDealInput = {
  title: string;
  brand_name: string;
  platform: string;
  deal_type: string;
  amount: number | null;
  currency: string;
  payment_terms: string;
  status: string;
  start_date: string | null;
  end_date: string | null;
  content_deadline: string | null;
  payment_due_date: string | null;
  deliverables: { type: string; count: number }[];
  content_requirements: string;
  notes: string;
  client_id: string | null;
  // Inline client creation
  new_client_name: string;
  new_client_email: string;
  new_client_category: string;
};

export async function createDeal(input: CreateDealInput) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  let clientId = input.client_id;

  // Create new client inline if needed
  if (!clientId && input.new_client_name) {
    const { data: client, error: clientError } = await supabase
      .from("clients")
      .insert({
        user_id: user.id,
        name: input.new_client_name,
        contact_email: input.new_client_email || null,
        category: input.new_client_category || null,
      })
      .select("id")
      .single();

    if (clientError) {
      console.error("[createDeal] client creation", clientError);
      return { error: "Failed to create client. Please try again." };
    }
    clientId = client.id;
  }

  const { data: deal, error } = await supabase
    .from("deals")
    .insert({
      user_id: user.id,
      client_id: clientId || null,
      title: input.title,
      brand_name: input.brand_name,
      platform: input.platform,
      deal_type: input.deal_type,
      amount: input.amount,
      currency: input.currency,
      payment_terms: input.payment_terms || null,
      status: input.status || "negotiation",
      start_date: input.start_date || null,
      end_date: input.end_date || null,
      content_deadline: input.content_deadline || null,
      payment_due_date: input.payment_due_date || null,
      deliverables: input.deliverables.length > 0 ? input.deliverables : null,
      content_requirements: input.content_requirements || null,
      notes: input.notes || null,
    })
    .select("id")
    .single();

  if (error) {
    console.error("[createDeal]", error);
    return { error: "Failed to create deal. Please try again." };
  }

  await syncDealCalendar(supabase, {
    dealId: deal.id,
    userId: user.id,
    dealTitle: input.title,
    contentDeadline: input.content_deadline || null,
    paymentDueDate: input.payment_due_date || null,
    startDate: input.start_date || null,
    endDate: input.end_date || null,
    platform: input.platform,
  });

  revalidatePath("/deals");
  revalidatePath("/calendar");
  redirect("/deals");
}

export async function updateDeal(dealId: string, input: CreateDealInput) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  let clientId = input.client_id;

  // Create new client inline if needed
  if (!clientId && input.new_client_name) {
    const { data: client, error: clientError } = await supabase
      .from("clients")
      .insert({
        user_id: user.id,
        name: input.new_client_name,
        contact_email: input.new_client_email || null,
        category: input.new_client_category || null,
      })
      .select("id")
      .single();

    if (clientError) {
      console.error("[updateDeal] client creation", clientError);
      return { error: "Failed to create client. Please try again." };
    }
    clientId = client.id;
  }

  const { error } = await supabase
    .from("deals")
    .update({
      client_id: clientId || null,
      title: input.title,
      brand_name: input.brand_name,
      platform: input.platform,
      deal_type: input.deal_type,
      amount: input.amount,
      currency: input.currency,
      payment_terms: input.payment_terms || null,
      status: input.status || "negotiation",
      start_date: input.start_date || null,
      end_date: input.end_date || null,
      content_deadline: input.content_deadline || null,
      payment_due_date: input.payment_due_date || null,
      deliverables: input.deliverables.length > 0 ? input.deliverables : null,
      content_requirements: input.content_requirements || null,
      notes: input.notes || null,
    })
    .eq("id", dealId)
    .eq("user_id", user.id);

  if (error) {
    console.error("[updateDeal]", error);
    return { error: "Failed to update deal. Please try again." };
  }

  await syncDealCalendar(supabase, {
    dealId,
    userId: user.id,
    dealTitle: input.title,
    contentDeadline: input.content_deadline || null,
    paymentDueDate: input.payment_due_date || null,
    startDate: input.start_date || null,
    endDate: input.end_date || null,
    platform: input.platform,
  });

  revalidatePath("/deals");
  revalidatePath(`/deals/${dealId}`);
  revalidatePath("/calendar");
  redirect(`/deals/${dealId}`);
}

export async function updateDealStatus(dealId: string, status: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  const updateData: Record<string, unknown> = { status };

  // Auto-set paid_date when marking as paid
  if (status === "paid") {
    updateData.paid_date = new Date().toISOString().split("T")[0];
  }

  const { error } = await supabase
    .from("deals")
    .update(updateData)
    .eq("id", dealId)
    .eq("user_id", user.id);

  if (error) {
    console.error("[updateDealStatus]", error);
    return { error: "Failed to update deal status. Please try again." };
  }

  revalidatePath("/deals");
  revalidatePath(`/deals/${dealId}`);
  revalidatePath("/calendar");
  return { success: true };
}

export async function toggleDeliverable(
  dealId: string,
  index: number,
  completed: boolean
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  // Fetch current deliverables
  const { data: deal, error: fetchError } = await supabase
    .from("deals")
    .select("deliverables")
    .eq("id", dealId)
    .eq("user_id", user.id)
    .single();

  if (fetchError || !deal) {
    return { error: "Deal not found" };
  }

  const deliverables = (
    deal.deliverables as { type: string; count: number; specs?: string; completed?: boolean }[] | null
  ) ?? [];

  const updated = deliverables.map((item, i) =>
    i === index ? { ...item, completed } : item
  );

  const { error } = await supabase
    .from("deals")
    .update({ deliverables: updated })
    .eq("id", dealId)
    .eq("user_id", user.id);

  if (error) {
    console.error("[toggleDeliverable]", error);
    return { error: "Failed to update deliverable. Please try again." };
  }

  revalidatePath(`/deals/${dealId}`);
  return { success: true };
}

export async function deleteDeal(dealId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  const { error } = await supabase
    .from("deals")
    .delete()
    .eq("id", dealId)
    .eq("user_id", user.id);

  if (error) {
    console.error("[deleteDeal]", error);
    return { error: "Failed to delete deal. Please try again." };
  }

  revalidatePath("/deals");
  revalidatePath("/calendar");
  redirect("/deals");
}
