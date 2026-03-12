"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { DashboardShell } from "@/components/dashboard/dashboard-grid";
import { updateProfile } from "@/app/(dashboard)/settings/_actions/settings";
import type { Profile } from "@/types/database";
import { User, Share2, Building2, ChevronRight, ChevronLeft } from "lucide-react";

type OnboardingWizardProps = {
  profile: Profile;
};

type FormState = {
  // Step 1
  full_name: string;
  display_name: string;
  phone: string;
  // Step 2
  instagram_handle: string;
  tiktok_handle: string;
  youtube_handle: string;
  currency: string;
  // Step 3
  legal_name: string;
  tax_id: string;
  country: string;
};

const STEPS = [
  { label: "About You", icon: User },
  { label: "Your Platforms", icon: Share2 },
  { label: "Business Details", icon: Building2 },
];

const COUNTRIES = [
  "United States",
  "United Kingdom",
  "Germany",
  "France",
  "Spain",
  "Italy",
  "Netherlands",
  "Poland",
  "Portugal",
  "Sweden",
  "Norway",
  "Denmark",
  "Switzerland",
  "Austria",
  "Belgium",
  "Canada",
  "Australia",
  "Brazil",
  "Mexico",
  "Argentina",
  "Japan",
  "South Korea",
  "India",
  "United Arab Emirates",
  "Other",
];

export function OnboardingWizard({ profile }: OnboardingWizardProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [currentStep, setCurrentStep] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [form, setForm] = useState<FormState>({
    full_name: profile.full_name ?? "",
    display_name: profile.display_name ?? "",
    phone: profile.phone ?? "",
    instagram_handle: profile.instagram_handle ?? "",
    tiktok_handle: profile.tiktok_handle ?? "",
    youtube_handle: profile.youtube_handle ?? "",
    currency: profile.currency ?? "EUR",
    legal_name: profile.legal_name ?? "",
    tax_id: profile.tax_id ?? "",
    country: profile.address?.country ?? "",
  });

  function updateField(field: keyof FormState, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleNext() {
    if (currentStep === 0 && !form.full_name.trim()) {
      setErrorMessage("Full name is required to continue.");
      return;
    }
    setErrorMessage(null);
    setCurrentStep((s) => s + 1);
  }

  function handleBack() {
    setErrorMessage(null);
    setCurrentStep((s) => s - 1);
  }

  function handleSkip() {
    setErrorMessage(null);
    submitProfile(true);
  }

  function handleFinish() {
    setErrorMessage(null);
    submitProfile(false);
  }

  function submitProfile(skipBusinessDetails: boolean) {
    startTransition(async () => {
      const result = await updateProfile({
        full_name: form.full_name,
        display_name: form.display_name,
        phone: form.phone,
        legal_name: skipBusinessDetails ? "" : form.legal_name,
        tax_id: skipBusinessDetails ? "" : form.tax_id,
        address: {
          street: "",
          city: "",
          postal_code: "",
          country: skipBusinessDetails ? "" : form.country,
        },
        bank_details: {
          iban: "",
          swift: "",
          bank_name: "",
        },
        instagram_handle: form.instagram_handle,
        tiktok_handle: form.tiktok_handle,
        youtube_handle: form.youtube_handle,
        currency: form.currency,
        timezone: "UTC",
      });

      if (result?.error) {
        setErrorMessage(result.error);
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    });
  }

  const progressPercent = ((currentStep + 1) / STEPS.length) * 100;

  return (
    <DashboardShell>
      <div className="mx-auto max-w-lg py-8">
        {/* Hero heading */}
        <div className="mb-8 text-center">
          <h1 className="font-serif text-3xl tracking-tight md:text-4xl">
            Welcome to brandea.today
          </h1>
          <p className="mt-2 text-muted-foreground">
            Let&apos;s set up your creator profile
          </p>
        </div>

        {/* Step indicator */}
        <div className="mb-6">
          {/* Step labels */}
          <div className="mb-3 flex justify-between text-xs text-muted-foreground">
            {STEPS.map((step, idx) => (
              <span
                key={step.label}
                className={
                  idx <= currentStep
                    ? "font-medium text-foreground"
                    : "opacity-50"
                }
              >
                {step.label}
              </span>
            ))}
          </div>

          {/* Progress bar */}
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-orange to-coral transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Step counter */}
          <p className="mt-2 text-right text-xs text-muted-foreground">
            Step {currentStep + 1} of {STEPS.length}
          </p>
        </div>

        {/* Step 1 — About You */}
        {currentStep === 0 && (
          <Card variant="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <User className="h-5 w-5 text-orange" />
                About You
              </CardTitle>
              <CardDescription>
                Tell us your name so brands can recognise you.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="full_name">
                  Full Name <span className="text-coral">*</span>
                </Label>
                <Input
                  id="full_name"
                  placeholder="Jane Doe"
                  value={form.full_name}
                  onChange={(e) => updateField("full_name", e.target.value)}
                  autoFocus
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="display_name">
                  Display Name{" "}
                  <span className="text-xs text-muted-foreground">
                    (optional)
                  </span>
                </Label>
                <Input
                  id="display_name"
                  placeholder="How you appear in the app"
                  value={form.display_name}
                  onChange={(e) => updateField("display_name", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">
                  Phone{" "}
                  <span className="text-xs text-muted-foreground">
                    (optional)
                  </span>
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+1 234 567 8900"
                  value={form.phone}
                  onChange={(e) => updateField("phone", e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2 — Your Platforms */}
        {currentStep === 1 && (
          <Card variant="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Share2 className="h-5 w-5 text-mint" />
                Your Platforms
              </CardTitle>
              <CardDescription>
                Connect your social handles so brands can find you.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="instagram_handle">Instagram</Label>
                <div className="relative">
                  <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-sm text-muted-foreground">
                    @
                  </span>
                  <Input
                    id="instagram_handle"
                    placeholder="yourhandle"
                    className="pl-7"
                    value={form.instagram_handle}
                    onChange={(e) =>
                      updateField("instagram_handle", e.target.value)
                    }
                    autoFocus
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tiktok_handle">TikTok</Label>
                <div className="relative">
                  <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-sm text-muted-foreground">
                    @
                  </span>
                  <Input
                    id="tiktok_handle"
                    placeholder="yourhandle"
                    className="pl-7"
                    value={form.tiktok_handle}
                    onChange={(e) =>
                      updateField("tiktok_handle", e.target.value)
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="youtube_handle">YouTube</Label>
                <div className="relative">
                  <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-sm text-muted-foreground">
                    @
                  </span>
                  <Input
                    id="youtube_handle"
                    placeholder="yourchannel"
                    className="pl-7"
                    value={form.youtube_handle}
                    onChange={(e) =>
                      updateField("youtube_handle", e.target.value)
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="currency">Default Currency</Label>
                <Select
                  value={form.currency}
                  onValueChange={(val) => updateField("currency", val)}
                >
                  <SelectTrigger id="currency" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="EUR">EUR — Euro</SelectItem>
                    <SelectItem value="USD">USD — US Dollar</SelectItem>
                    <SelectItem value="GBP">GBP — British Pound</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3 — Business Details (optional) */}
        {currentStep === 2 && (
          <Card variant="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Building2 className="h-5 w-5 text-orange" />
                Business Details
              </CardTitle>
              <CardDescription>
                Optional — needed for generating invoices and contracts.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="legal_name">Legal Name</Label>
                <Input
                  id="legal_name"
                  placeholder="Legal entity or personal name"
                  value={form.legal_name}
                  onChange={(e) => updateField("legal_name", e.target.value)}
                  autoFocus
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tax_id">Tax ID / VAT Number</Label>
                <Input
                  id="tax_id"
                  placeholder="e.g. ES12345678A"
                  value={form.tax_id}
                  onChange={(e) => updateField("tax_id", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Select
                  value={form.country}
                  onValueChange={(val) => updateField("country", val)}
                >
                  <SelectTrigger id="country" className="w-full">
                    <SelectValue placeholder="Select your country" />
                  </SelectTrigger>
                  <SelectContent>
                    {COUNTRIES.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Error message */}
        {errorMessage && (
          <p className="mt-3 text-sm font-medium text-coral">{errorMessage}</p>
        )}

        {/* Navigation buttons */}
        <div className="mt-6 flex items-center justify-between gap-3">
          {/* Back / empty spacer */}
          <div>
            {currentStep > 0 ? (
              <Button
                variant="ghost"
                onClick={handleBack}
                disabled={isPending}
              >
                <ChevronLeft className="h-4 w-4" />
                Back
              </Button>
            ) : (
              <span />
            )}
          </div>

          {/* Right-side actions */}
          <div className="flex items-center gap-2">
            {/* Skip is only available on step 3 */}
            {currentStep === 2 && (
              <Button variant="ghost" onClick={handleSkip} disabled={isPending}>
                Skip for now
              </Button>
            )}

            {currentStep < STEPS.length - 1 ? (
              <Button variant="accent" size="lg" onClick={handleNext}>
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                variant="accent"
                size="lg"
                onClick={handleFinish}
                disabled={isPending}
              >
                {isPending ? "Saving..." : "Go to Dashboard"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
