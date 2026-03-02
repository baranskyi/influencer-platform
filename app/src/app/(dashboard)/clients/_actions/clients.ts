"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export type CreateClientInput = {
  name: string;
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  website: string;
  category: string;
  notes: string;
};

export type UpdateClientInput = CreateClientInput & { id: string };

export async function createClientAction(input: CreateClientInput) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  const { data, error } = await supabase
    .from("clients")
    .insert({
      user_id: user.id,
      name: input.name,
      contact_name: input.contact_name || null,
      contact_email: input.contact_email || null,
      contact_phone: input.contact_phone || null,
      website: input.website || null,
      category: input.category || null,
      notes: input.notes || null,
    })
    .select("id")
    .single();

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/clients");
  redirect(`/clients/${data.id}`);
}

export async function updateClientAction(input: UpdateClientInput) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  const { error } = await supabase
    .from("clients")
    .update({
      name: input.name,
      contact_name: input.contact_name || null,
      contact_email: input.contact_email || null,
      contact_phone: input.contact_phone || null,
      website: input.website || null,
      category: input.category || null,
      notes: input.notes || null,
    })
    .eq("id", input.id)
    .eq("user_id", user.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/clients");
  revalidatePath(`/clients/${input.id}`);
  return { success: true };
}

export async function deleteClientAction(clientId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  const { error } = await supabase
    .from("clients")
    .delete()
    .eq("id", clientId)
    .eq("user_id", user.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/clients");
  redirect("/clients");
}
