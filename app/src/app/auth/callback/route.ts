import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";

const ALLOWED_REDIRECT_PREFIXES = [
  "/dashboard",
  "/deals",
  "/invoices",
  "/calendar",
  "/clients",
  "/analytics",
  "/settings",
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

async function getOrigin(requestUrl: string): Promise<string> {
  const headersList = await headers();
  const forwardedHost = headersList.get("x-forwarded-host");
  const forwardedProto = headersList.get("x-forwarded-proto") ?? "https";

  if (forwardedHost) {
    return `${forwardedProto}://${forwardedHost}`;
  }

  return new URL(requestUrl).origin;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const next = getSafeRedirectPath(searchParams.get("next"));
  const origin = await getOrigin(request.url);

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
