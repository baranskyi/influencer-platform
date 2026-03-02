import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { OnboardingWizard } from "@/components/onboarding/onboarding-wizard";
import type { Profile } from "@/types/database";

export default async function OnboardingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const profile = data as Profile | null;

  // If profile already has full_name filled, onboarding is done
  if (profile?.full_name) {
    redirect("/dashboard");
  }

  // Provide a fallback profile so the wizard always has something to work with
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
    notification_preferences: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  return <OnboardingWizard profile={resolvedProfile} />;
}
