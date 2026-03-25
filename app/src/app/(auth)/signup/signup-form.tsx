"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2, MailCheck } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

export function SignUpForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    trackEvent({ action: "signup_submit" });

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    trackEvent({ action: "signup_success" });

    // Google Ads conversion tracking
    if (typeof window !== "undefined" && typeof window.gtag === "function") {
      window.gtag("event", "conversion", {
        send_to: "AW-1039954261/rtfLCJi7iY8cENXi8e8D",
      });
    }

    setLoading(false);
    setEmailSent(true);
  }

  // ── Magic Link sent screen ─────────────────────────────────
  if (emailSent) {
    return (
      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-mint/15">
            <MailCheck className="h-8 w-8 text-mint" />
          </div>
          <CardTitle className="font-serif text-2xl">
            Check your email
          </CardTitle>
          <CardDescription className="mt-2 text-base">
            We sent a magic link to{" "}
            <span className="font-medium text-foreground">{email}</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <p className="text-sm text-muted-foreground">
            Click the link in the email to sign in. No password needed.
          </p>
          <div className="rounded-lg border border-border/50 bg-muted/30 px-4 py-3 text-xs text-muted-foreground">
            Didn&apos;t get the email? Check your spam folder or{" "}
            <button
              type="button"
              className="text-primary hover:underline"
              onClick={() => setEmailSent(false)}
            >
              try again
            </button>
            .
          </div>
        </CardContent>
      </Card>
    );
  }

  // ── Sign-up form (email only) ──────────────────────────────
  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="font-serif text-3xl">Get started</CardTitle>
        <CardDescription>
          Enter your email to create an account on brandea.today
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
            />
          </div>

          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending link...
              </>
            ) : (
              "Send Magic Link"
            )}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="justify-center">
        <p className="text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
