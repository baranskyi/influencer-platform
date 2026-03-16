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

  const hasAddress =
    input.address.street ||
    input.address.city ||
    input.address.postal_code ||
    input.address.country;

  const hasBankDetails =
    input.bank_details.iban ||
    input.bank_details.swift ||
    input.bank_details.bank_name;

  const { error } = await supabase
    .from("profiles")
    .upsert({
      id: user.id,
      email: user.email ?? "",
      full_name: input.full_name.trim(),
      display_name: input.display_name || null,
      phone: input.phone || null,
      legal_name: input.legal_name || null,
      tax_id: input.tax_id || null,
      address: hasAddress
        ? {
            street: input.address.street || null,
            city: input.address.city || null,
            postal_code: input.address.postal_code || null,
            country: input.address.country || null,
          }
        : null,
      bank_details: hasBankDetails
        ? {
            iban: input.bank_details.iban || null,
            swift: input.bank_details.swift || null,
            bank_name: input.bank_details.bank_name || null,
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
    return { error: `Failed to update profile: ${error.message}` };
  }

  revalidatePath("/", "layout");
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

