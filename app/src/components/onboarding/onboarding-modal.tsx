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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { updateProfile } from "@/app/(dashboard)/settings/_actions/settings";
import type { Profile } from "@/types/database";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

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
  "Ukraine",
  "Other",
];

const TOTAL_STEPS = 3;

/* ------------------------------------------------------------------ */
/*  SVG Illustrations                                                  */
/* ------------------------------------------------------------------ */

function PipelineIllustration() {
  const columns = [
    { label: "Pitched", color: "#F97066", cards: 2 },
    { label: "Negotiating", color: "#FB923C", cards: 1 },
    { label: "In Progress", color: "#6EE7B7", cards: 2 },
    { label: "Paid", color: "#A78BFA", cards: 1 },
  ];

  return (
    <svg
      viewBox="0 0 440 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="mx-auto w-full max-w-[400px]"
      aria-hidden
    >
      {columns.map((col, i) => {
        const x = i * 110 + 5;
        return (
          <g key={col.label}>
            {/* Column background */}
            <rect
              x={x}
              y={10}
              width={100}
              height={180}
              rx={12}
              fill="white"
              fillOpacity={0.06}
              stroke="white"
              strokeOpacity={0.1}
            />
            {/* Column header dot + label */}
            <circle cx={x + 16} cy={30} r={5} fill={col.color} />
            <text
              x={x + 28}
              y={34}
              fontSize={10}
              fill="white"
              fillOpacity={0.7}
              fontFamily="system-ui"
            >
              {col.label}
            </text>
            {/* Deal cards */}
            {Array.from({ length: col.cards }).map((_, j) => (
              <rect
                key={j}
                x={x + 8}
                y={48 + j * 50}
                width={84}
                height={40}
                rx={8}
                fill="white"
                fillOpacity={0.1}
                stroke={col.color}
                strokeOpacity={0.3}
                strokeWidth={1}
              />
            ))}
          </g>
        );
      })}
      {/* Arrow showing movement */}
      <path
        d="M105 90 L125 90"
        stroke="white"
        strokeOpacity={0.3}
        strokeWidth={1.5}
        strokeDasharray="3 3"
        markerEnd="url(#arrowhead)"
      />
      <path
        d="M215 68 L235 68"
        stroke="white"
        strokeOpacity={0.3}
        strokeWidth={1.5}
        strokeDasharray="3 3"
      />
      <defs>
        <marker
          id="arrowhead"
          markerWidth="6"
          markerHeight="6"
          refX="5"
          refY="3"
          orient="auto"
        >
          <path d="M0 0 L6 3 L0 6 Z" fill="white" fillOpacity={0.3} />
        </marker>
      </defs>
    </svg>
  );
}

function InvoiceIllustration() {
  return (
    <svg
      viewBox="0 0 300 220"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="mx-auto w-full max-w-[280px]"
      aria-hidden
    >
      {/* Invoice document */}
      <rect
        x={50}
        y={10}
        width={200}
        height={200}
        rx={12}
        fill="white"
        fillOpacity={0.08}
        stroke="white"
        strokeOpacity={0.15}
      />
      {/* Header */}
      <text
        x={70}
        y={40}
        fontSize={14}
        fontWeight="bold"
        fill="white"
        fillOpacity={0.9}
        fontFamily="system-ui"
      >
        INVOICE
      </text>
      <text
        x={180}
        y={40}
        fontSize={9}
        fill="#A78BFA"
        fontFamily="system-ui"
      >
        #INV-001
      </text>
      {/* Divider */}
      <line
        x1={70}
        y1={50}
        x2={230}
        y2={50}
        stroke="white"
        strokeOpacity={0.1}
      />
      {/* From / To sections */}
      <text x={70} y={68} fontSize={8} fill="white" fillOpacity={0.4} fontFamily="system-ui">
        From
      </text>
      <rect x={70} y={72} width={70} height={20} rx={4} fill="white" fillOpacity={0.05} />
      <text x={160} y={68} fontSize={8} fill="white" fillOpacity={0.4} fontFamily="system-ui">
        To
      </text>
      <rect x={160} y={72} width={70} height={20} rx={4} fill="white" fillOpacity={0.05} />
      {/* Line items */}
      <rect x={70} y={102} width={160} height={14} rx={3} fill="white" fillOpacity={0.05} />
      <rect x={70} y={120} width={160} height={14} rx={3} fill="white" fillOpacity={0.05} />
      {/* Total */}
      <line
        x1={70}
        y1={144}
        x2={230}
        y2={144}
        stroke="white"
        strokeOpacity={0.1}
      />
      <text x={70} y={158} fontSize={9} fill="white" fillOpacity={0.5} fontFamily="system-ui">
        Total
      </text>
      <text
        x={200}
        y={158}
        fontSize={12}
        fontWeight="bold"
        fill="#6EE7B7"
        fontFamily="system-ui"
      >
        €2,500
      </text>
      {/* Download button */}
      <rect x={100} y={172} width={100} height={26} rx={8} fill="#FB923C" fillOpacity={0.8} />
      <text
        x={118}
        y={189}
        fontSize={10}
        fill="white"
        fontFamily="system-ui"
      >
        Download PDF
      </text>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */

type OnboardingModalProps = {
  profile: Profile;
};

type FormState = {
  full_name: string;
  legal_name: string;
  tax_id: string;
  country: string;
  currency: string;
};

export function OnboardingModal({ profile }: OnboardingModalProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [currentStep, setCurrentStep] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [form, setForm] = useState<FormState>({
    full_name: profile.full_name ?? "",
    legal_name: profile.legal_name ?? "",
    tax_id: profile.tax_id ?? "",
    country: profile.address?.country ?? "",
    currency: profile.currency ?? "EUR",
  });

  function updateField(field: keyof FormState, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleNext() {
    setErrorMessage(null);
    if (currentStep < TOTAL_STEPS - 1) {
      trackEvent({ action: "onboarding_step", label: `step_${currentStep + 2}` });
      setCurrentStep((s) => s + 1);
    }
  }

  function handleBack() {
    setErrorMessage(null);
    setCurrentStep((s) => s - 1);
  }

  function handleFinish() {
    if (!form.full_name.trim()) {
      setErrorMessage("Full name is required.");
      return;
    }
    trackEvent({ action: "onboarding_complete" });
    setErrorMessage(null);

    startTransition(async () => {
      const result = await updateProfile({
        full_name: form.full_name,
        display_name: "",
        phone: "",
        legal_name: form.legal_name,
        tax_id: form.tax_id,
        address: {
          street: "",
          city: "",
          postal_code: "",
          country: form.country,
        },
        bank_details: {
          iban: "",
          swift: "",
          bank_name: "",
        },
        instagram_handle: "",
        tiktok_handle: "",
        youtube_handle: "",
        currency: form.currency,
        timezone: "UTC",
      });

      if (result?.error) {
        setErrorMessage(result.error);
      } else {
        router.refresh();
      }
    });
  }

  return (
    <Dialog open modal>
      <DialogContent
        showCloseButton={false}
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
        className="max-w-md gap-0 overflow-hidden border-white/10 bg-[#1a1a2e]/95 p-0 backdrop-blur-xl sm:max-w-lg"
      >
        {/* Step dots */}
        <div className="flex items-center justify-center gap-2 pt-6">
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
            <div
              key={i}
              className={[
                "h-1.5 rounded-full transition-all duration-300",
                i === currentStep
                  ? "w-6 bg-gradient-to-r from-orange to-coral"
                  : i < currentStep
                    ? "w-1.5 bg-orange/50"
                    : "w-1.5 bg-white/20",
              ].join(" ")}
            />
          ))}
        </div>

        {/* Step content */}
        <div className="px-6 pb-6 pt-4">
          {/* Screen 1: Pipeline */}
          {currentStep === 0 && (
            <div className="space-y-4 text-center">
              <DialogHeader className="items-center">
                <DialogTitle className="font-serif text-xl tracking-tight sm:text-2xl">
                  Track Every Deal in One Place
                </DialogTitle>
                <DialogDescription className="text-sm leading-relaxed">
                  From first pitch to final payment — drag deals through your
                  visual pipeline. Never lose track of a brand deal again.
                </DialogDescription>
              </DialogHeader>
              <PipelineIllustration />
            </div>
          )}

          {/* Screen 2: Invoicing */}
          {currentStep === 1 && (
            <div className="space-y-4 text-center">
              <DialogHeader className="items-center">
                <DialogTitle className="font-serif text-xl tracking-tight sm:text-2xl">
                  Get Paid in 60 Seconds
                </DialogTitle>
                <DialogDescription className="text-sm leading-relaxed">
                  Generate professional PDF invoices directly from any deal.
                  Auto-filled details, one-click download, payment tracking
                  built in.
                </DialogDescription>
              </DialogHeader>
              <InvoiceIllustration />
            </div>
          )}

          {/* Screen 3: Business Details */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <DialogHeader className="text-center sm:text-center">
                <DialogTitle className="font-serif text-xl tracking-tight sm:text-2xl">
                  Almost Done — Your Invoice Details
                </DialogTitle>
                <DialogDescription className="text-sm leading-relaxed">
                  These details appear on your invoices. You can always update
                  them later in Settings.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-3">
                <div className="space-y-1.5">
                  <Label htmlFor="onb_full_name" className="text-xs">
                    Full Name <span className="text-coral">*</span>
                  </Label>
                  <Input
                    id="onb_full_name"
                    placeholder="Jane Doe"
                    value={form.full_name}
                    onChange={(e) => updateField("full_name", e.target.value)}
                    autoFocus
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="onb_legal_name" className="text-xs">
                    Legal Name / Business Name
                  </Label>
                  <Input
                    id="onb_legal_name"
                    placeholder="Optional — your legal entity"
                    value={form.legal_name}
                    onChange={(e) => updateField("legal_name", e.target.value)}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="onb_tax_id" className="text-xs">
                    Tax ID / VAT Number
                  </Label>
                  <Input
                    id="onb_tax_id"
                    placeholder="e.g. ES12345678A"
                    value={form.tax_id}
                    onChange={(e) => updateField("tax_id", e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="onb_country" className="text-xs">
                      Country
                    </Label>
                    <Select
                      value={form.country}
                      onValueChange={(val) => updateField("country", val)}
                    >
                      <SelectTrigger id="onb_country" className="w-full">
                        <SelectValue placeholder="Select" />
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

                  <div className="space-y-1.5">
                    <Label htmlFor="onb_currency" className="text-xs">
                      Currency
                    </Label>
                    <Select
                      value={form.currency}
                      onValueChange={(val) => updateField("currency", val)}
                    >
                      <SelectTrigger id="onb_currency" className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="EUR">EUR</SelectItem>
                        <SelectItem value="USD">USD</SelectItem>
                        <SelectItem value="GBP">GBP</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Error */}
          {errorMessage && (
            <p className="mt-3 text-center text-sm font-medium text-coral">
              {errorMessage}
            </p>
          )}

          {/* Navigation */}
          <div className="mt-6 flex items-center justify-between">
            <div>
              {currentStep > 0 ? (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleBack}
                  disabled={isPending}
                >
                  <ChevronLeft className="mr-1 h-4 w-4" />
                  Back
                </Button>
              ) : (
                <span />
              )}
            </div>

            {currentStep < TOTAL_STEPS - 1 ? (
              <Button variant="accent" onClick={handleNext}>
                Next
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            ) : (
              <Button
                variant="accent"
                onClick={handleFinish}
                disabled={isPending}
              >
                {isPending ? "Saving..." : "Get Started"}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
