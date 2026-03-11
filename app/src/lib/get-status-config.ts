import { createClient } from "@/lib/supabase/server";
import { resolveStatusConfig, type StatusConfig } from "@/lib/deal-status-config";

/**
 * Server-side: fetch the user's deal_status_config from their profile.
 * Returns resolved defaults if NULL, user not authenticated, or column doesn't exist yet.
 */
export async function getStatusConfig(): Promise<StatusConfig[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return resolveStatusConfig(null);
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("deal_status_config")
    .eq("id", user.id)
    .single();

  // Gracefully handle missing column (migration not yet applied)
  if (error) {
    return resolveStatusConfig(null);
  }

  return resolveStatusConfig(data?.deal_status_config as StatusConfig[] | null);
}
