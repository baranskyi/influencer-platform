"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export type UpdateProfileInput = {
  full_name: string;
  display_name: string;
  phone: string;
  legal_name: string;
  tax_id: string;
  address: {
    street: string;
    city: string;
    postal_code: string;
    country: string;
  };
  bank_details: {
    iban: string;
    swift: string;
    bank_name: string;
  };
  instagram_handle: string;
  tiktok_handle: string;
  youtube_handle: string;
  currency: string;
  timezone: string;
};

export async function updateProfile(input: UpdateProfileInput) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: input.full_name || null,
      display_name: input.display_name || null,
      phone: input.phone || null,
      legal_name: input.legal_name || null,
      tax_id: input.tax_id || null,
      address:
        input.address.street ||
        input.address.city ||
        input.address.postal_code ||
        input.address.country
          ? {
              street: input.address.street || undefined,
              city: input.address.city || undefined,
              postal_code: input.address.postal_code || undefined,
              country: input.address.country || undefined,
            }
          : null,
      bank_details:
        input.bank_details.iban ||
        input.bank_details.swift ||
        input.bank_details.bank_name
          ? {
              iban: input.bank_details.iban || undefined,
              swift: input.bank_details.swift || undefined,
              bank_name: input.bank_details.bank_name || undefined,
            }
          : null,
      instagram_handle: input.instagram_handle || null,
      tiktok_handle: input.tiktok_handle || null,
      youtube_handle: input.youtube_handle || null,
      currency: input.currency || "EUR",
      timezone: input.timezone || "UTC",
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/settings");
  return { success: true };
}

export async function changePassword(newPassword: string) {
  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password: newPassword });
  if (error) return { error: error.message };
  return { success: true };
}
