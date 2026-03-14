import { createClient } from "@/lib/supabase/server";
import { OnboardingModal } from "./onboarding-modal";
import type { Profile } from "@/types/database";

export async function OnboardingGate() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  const profile = data as Profile | null;

  // If profile already has full_name, onboarding is done
  if (profile?.full_name) return null;

  // Build a fallback profile so the modal always has data to work with
  const resolvedProfile: Profile = profile ?? {
    id: user.id,
    full_name: user.user_metadata?.full_name ?? "",
    display_name: null,
    email: user.email ?? "",
    phone: null,
    avatar_url: null,
    legal_name: null,
    tax_id: null,
    address: null,
    bank_details: null,
    instagram_handle: null,
    tiktok_handle: null,
    youtube_handle: null,
    follower_count: null,
    currency: "EUR",
    timezone: "UTC",
    deal_status_config: null,
    notification_preferences: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  return <OnboardingModal profile={resolvedProfile} />;
}
