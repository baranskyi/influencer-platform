import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const ALLOWED_REDIRECT_PREFIXES = [
  "/dashboard",
  "/deals",
  "/invoices",
  "/calendar",
  "/clients",
  "/analytics",
  "/settings",
  "/onboarding",
];

function getSafeRedirectPath(next: string | null): string {
  const fallback = "/dashboard";

  if (!next) return fallback;

  // Must start with a single slash and not contain protocol schemes or double slashes
  if (!next.startsWith("/")) return fallback;
  if (next.startsWith("//")) return fallback;
  if (/^\/[a-z][a-z0-9+\-.]*:/i.test(next)) return fallback;

  // Must match one of the allowed path prefixes
  const isAllowed = ALLOWED_REDIRECT_PREFIXES.some(
    (prefix) => next === prefix || next.startsWith(`${prefix}/`) || next.startsWith(`${prefix}?`)
  );

  return isAllowed ? next : fallback;
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = getSafeRedirectPath(searchParams.get("next"));

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/login?error=auth_callback_error`);
}
