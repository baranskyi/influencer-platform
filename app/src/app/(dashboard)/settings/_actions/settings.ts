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
    .upsert({
      id: user.id,
      email: user.email ?? "",
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
    });

  if (error) {
    console.error("[updateProfile]", error);
    return { error: "Failed to update profile. Please try again." };
  }

  revalidatePath("/settings");
  return { success: true };
}

export async function saveDealStatusConfig(config: import("@/lib/deal-status-config").StatusConfig[]) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  // Validate: at least one isInitial, at least one isPaid, at least one isEarned
  const enabled = config.filter((s) => s.enabled);
  if (enabled.length < 2) return { error: "At least 2 statuses must be enabled." };
  if (enabled.filter((s) => s.isInitial).length !== 1)
    return { error: "Exactly one enabled status must be marked as Initial." };
  if (!config.some((s) => s.isPaid))
    return { error: "At least one status must be marked as Paid." };
  if (!config.some((s) => s.isEarned))
    return { error: "At least one status must be marked as Earned." };

  // Check unique slugs
  const slugs = new Set<string>();
  for (const s of config) {
    if (slugs.has(s.value)) return { error: `Duplicate slug: "${s.value}"` };
    slugs.add(s.value);
  }

  const { error } = await supabase
    .from("profiles")
    .update({ deal_status_config: config, updated_at: new Date().toISOString() })
    .eq("id", user.id);

  if (error) {
    console.error("[saveDealStatusConfig]", error);
    return { error: "Failed to save pipeline config." };
  }

  revalidatePath("/settings");
  revalidatePath("/deals");
  revalidatePath("/dashboard");
  revalidatePath("/analytics");
  revalidatePath("/calendar");
  return { success: true };
}

export async function changePassword(newPassword: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  if (newPassword.length < 8) {
    return { error: "Password must be at least 8 characters long" };
  }

  const { error } = await supabase.auth.updateUser({ password: newPassword });
  if (error) {
    console.error("[changePassword]", error);
    return { error: "Failed to change password. Please try again." };
  }
  return { success: true };
}
