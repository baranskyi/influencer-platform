import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import {
  DashboardShell,
  DashboardHeading,
} from "@/components/dashboard/dashboard-grid";
import { SettingsForm } from "@/components/settings/settings-form";

export const metadata: Metadata = {
  title: "Settings",
};
import { Settings } from "lucide-react";
import type { Profile } from "@/types/database";

export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let profile: Profile | null = null;

  if (user) {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    profile = data as Profile | null;
  }

  // Fallback profile with required fields filled from auth user
  const resolvedProfile: Profile = profile ?? {
    id: user?.id ?? "",
    full_name: user?.user_metadata?.full_name ?? "",
    display_name: null,
    email: user?.email ?? "",
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

  return (
    <DashboardShell>
      <div className="mb-6 flex items-center gap-3">
        <Settings className="h-7 w-7 text-orange" />
        <DashboardHeading>Settings</DashboardHeading>
      </div>

      <SettingsForm profile={resolvedProfile} />
    </DashboardShell>
  );
}
