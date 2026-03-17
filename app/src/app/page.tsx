import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Calendar,
  Check,
  ChevronRight,
  CircleDollarSign,
  Globe,
  Kanban,
  ReceiptText,
  Star,
  Users,
  Zap,
} from "lucide-react";
import { LandingTracker } from "@/components/landing/landing-tracker";

/* ============================================================
   brandea.today Landing Page
   ============================================================
   Server component — no "use client" needed.
   Uses raw Tailwind + existing glass/gradient utilities from globals.css.
   Dark-first design with glassmorphism depth.
   ============================================================ */

/* ---------- Data ---------- */

const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
  { label: "Blog", href: "/blog" },
] as const;

const FEATURES = [
  {
    icon: Kanban,
    title: "Deal Pipeline",
    description:
      "Visual Kanban board to track every brand deal from pitch to payment. Drag, drop, and never lose track of a deal again.",
  },
  {
    icon: ReceiptText,
    title: "Smart Invoicing",
    description:
      "Generate professional PDF invoices in one click. Automatic reminders keep cash flowing without awkward follow-ups.",
  },
  {
    icon: Users,
    title: "Client CRM",
    description:
      "Keep every brand contact, conversation, and contract in one place. Build relationships that turn into repeat business.",
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    description:
      "Real-time revenue insights, deal conversion rates, and monthly trends. Know your numbers, grow your income.",
  },
  {
    icon: Calendar,
    title: "Content Calendar",
    description:
      "Never miss a deliverable deadline. Synced calendar with automatic reminders for every post, story, and reel.",
  },
  {
    icon: Globe,
    title: "Multi-Currency",
    description:
      "Work with brands worldwide. Invoice in USD, EUR, GBP, or any currency and track payments across borders.",
  },
] as const;

const STATS = [
  { value: "650+", label: "Creators onboarded" },
  { value: "$1.5M+", label: "Revenue tracked" },
  { value: "4.9", label: "Average rating", suffix: "★" },
  { value: "30+", label: "Countries supported" },
] as const;

const PRICING_TIERS = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Free forever for up to 5 clients. No credit card required.",
    features: [
      "Up to 5 active deals",
      "Basic invoicing",
      "1 client workspace",
      "Deal pipeline view",
      "Email support",
    ],
    cta: "Sign Up Free",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$29",
    period: "per month",
    description: "Free to start. Unlimited deals when your business grows.",
    features: [
      "Free up to 5 deals, then unlimited",
      "Smart invoicing with reminders",
      "Unlimited clients",
      "Analytics dashboard",
      "Content calendar",
      "Multi-currency support",
      "Priority support",
    ],
    cta: "Sign Up Free",
    highlighted: true,
  },
] as const;

const FOOTER_LINKS = {
  Product: [
    { label: "Features", href: "#features" },
    { label: "Pricing", href: "#pricing" },
  ],
  Company: [
    { label: "About", href: "#" },
    { label: "Blog", href: "/blog" },
    { label: "Contact Us", href: "mailto:hello@brandea.today" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
    { label: "Cookie Policy", href: "#" },
  ],
} as const;

/* ---------- Page Component ---------- */

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-mesh-gradient text-foreground font-sans scroll-smooth">
      <LandingTracker />
      {/* ============================================================
          NAVIGATION
          Sticky glass nav with smooth scroll anchors.
          Height: 64px. Z-index keeps it above all sections.
          ============================================================ */}
      <nav className="sticky top-0 z-50 glass-subtle" role="navigation" aria-label="Main navigation">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2" aria-label="brandea.today home">
            <span className="text-gradient-brand font-serif text-2xl tracking-tight">
              brandea.today
            </span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden items-center gap-8 md:flex">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                data-track="nav"
                data-track-label={link.label}
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* CTA buttons */}
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="hidden text-sm font-medium text-muted-foreground transition-colors hover:text-foreground sm:inline-flex"
              data-track="nav"
              data-track-label="login"
            >
              Log In
            </Link>
            <Link
              href="/signup"
              className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-coral to-orange px-5 py-2 text-sm font-semibold text-white shadow-lg transition-all hover:shadow-orange/25 hover:brightness-110"
              data-track="cta"
              data-track-label="nav-get-started"
            >
              Get Started Free
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </nav>

      {/* ============================================================
          HERO SECTION
          Large serif headline with gradient text on key phrases.
          Two CTAs + abstract glass card mockup for visual depth.
          Generous vertical padding for breathing room.
          ============================================================ */}
      <section className="relative overflow-hidden px-4 pb-24 pt-20 sm:px-6 sm:pb-32 sm:pt-28 lg:px-8 lg:pb-40 lg:pt-36">
        {/* Decorative glow orbs — purely visual background elements */}
        <div
          className="pointer-events-none absolute left-1/4 top-0 h-[500px] w-[500px] rounded-full opacity-30 blur-[120px]"
          style={{ background: "radial-gradient(circle, #7C3AED 0%, transparent 70%)" }}
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute right-1/4 top-1/4 h-[400px] w-[400px] rounded-full opacity-20 blur-[100px]"
          style={{ background: "radial-gradient(circle, #F5A623 0%, transparent 70%)" }}
          aria-hidden="true"
        />

        <div className="relative mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            {/* Badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-muted-foreground backdrop-blur-sm">
              <Zap className="h-3.5 w-3.5 text-orange" />
              <span>Built for creators who mean business</span>
            </div>

            {/* Headline */}
            <h1 className="font-serif text-4xl font-normal leading-[1.1] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              Stop doing admin.{" "}
              <span className="text-gradient-brand">Get paid faster.</span>
            </h1>

            {/* Subtitle */}
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
              The all-in-one platform for influencers and content creators to track brand deals,
              send invoices, and grow revenue — so you can focus on creating.
            </p>

            {/* CTAs */}
            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-coral to-orange px-8 py-3.5 text-base font-semibold text-white shadow-lg transition-all hover:shadow-orange/30 hover:brightness-110"
                data-track="cta"
                data-track-label="hero-start-free"
              >
                Start Free
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="#features"
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-8 py-3.5 text-base font-medium text-foreground backdrop-blur-sm transition-all hover:border-white/25 hover:bg-white/10"
                data-track="cta"
                data-track-label="hero-see-how"
              >
                See How It Works
                <ChevronRight className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Abstract dashboard mockup — glass composition */}
          <div className="relative mx-auto mt-16 max-w-4xl sm:mt-20 lg:mt-24" aria-hidden="true">
            <div className="glass glass-highlight rounded-2xl p-1.5">
              <div className="rounded-xl bg-background/50 p-4 sm:p-6">
                {/* Mock top bar */}
                <div className="flex items-center gap-2 pb-4">
                  <div className="h-3 w-3 rounded-full bg-coral/60" />
                  <div className="h-3 w-3 rounded-full bg-orange/60" />
                  <div className="h-3 w-3 rounded-full bg-mint/60" />
                  <div className="ml-4 h-4 w-48 rounded-full bg-white/5" />
                </div>

                {/* Mock Kanban columns */}
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {["Pitched", "Negotiating", "In Progress", "Paid"].map(
                    (col, i) => (
                      <div key={col} className="space-y-2.5">
                        <div className="flex items-center gap-2">
                          <div
                            className="h-2 w-2 rounded-full"
                            style={{
                              background: [
                                "#B8A9E8",
                                "#F5A623",
                                "#7ECFB3",
                                "#E8788A",
                              ][i],
                            }}
                          />
                          <span className="text-xs font-medium text-muted-foreground">
                            {col}
                          </span>
                        </div>
                        {/* Mock deal cards */}
                        {Array.from({ length: 3 - Math.floor(i / 2) }).map(
                          (_, j) => (
                            <div
                              key={j}
                              className="glass-subtle rounded-lg p-3"
                            >
                              <div className="mb-2 h-3 w-full rounded bg-white/8" />
                              <div className="h-2 w-2/3 rounded bg-white/5" />
                              <div className="mt-3 flex items-center justify-between">
                                <div className="h-2.5 w-12 rounded bg-white/8" />
                                <div
                                  className="h-5 w-5 rounded-full"
                                  style={{
                                    background: [
                                      "#E8788A30",
                                      "#F5A62330",
                                      "#7ECFB330",
                                      "#B8A9E830",
                                    ][i],
                                  }}
                                />
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>

            {/* Floating glass accent cards */}
            <div className="absolute -left-6 top-1/3 hidden rounded-xl glass glass-highlight p-3 sm:block lg:-left-12">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-mint/15">
                  <CircleDollarSign className="h-4 w-4 text-mint" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Invoice Paid</p>
                  <p className="text-sm font-semibold text-mint">+$2,400</p>
                </div>
              </div>
            </div>

            <div className="absolute -right-6 top-1/2 hidden rounded-xl glass glass-highlight p-3 sm:block lg:-right-12">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange/15">
                  <BarChart3 className="h-4 w-4 text-orange" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">This Month</p>
                  <p className="text-sm font-semibold text-orange">$12,840</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          PRODUCT HUNT BADGE
          ============================================================ */}
      <section className="flex justify-center px-4 pb-8 sm:px-6 lg:px-8" aria-label="Featured on Product Hunt">
        <a
          href="https://www.producthunt.com/products/brandea?embed=true&utm_source=badge-featured&utm_medium=badge&utm_campaign=badge-brandea"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1099957&theme=dark&t=1773676114292"
            alt="Brandea - Deal tracker &amp; invoicing built for content creators | Product Hunt"
            width="250"
            height="54"
          />
        </a>
      </section>

      {/* ============================================================
          SOCIAL PROOF / STATS
          A glass strip with key metrics to build credibility.
          ============================================================ */}
      <section className="px-4 py-12 sm:px-6 sm:py-16 lg:px-8" aria-label="Platform statistics">
        <div className="mx-auto max-w-5xl">
          <div className="glass glass-highlight rounded-2xl px-6 py-8 sm:px-10 sm:py-10">
            <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
              {STATS.map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-gradient-brand font-serif text-3xl sm:text-4xl">
                    {stat.value}
                    {"suffix" in stat && (
                      <span className="ml-0.5 text-orange">{stat.suffix}</span>
                    )}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          FEATURES SECTION
          6 glass cards in a responsive grid.
          Each card has a gradient-accented icon, title, and description.
          ============================================================ */}
      <section
        id="features"
        className="scroll-mt-20 px-4 py-20 sm:px-6 sm:py-28 lg:px-8"
        aria-labelledby="features-heading"
      >
        <div className="mx-auto max-w-7xl">
          {/* Section header */}
          <div className="mx-auto max-w-2xl text-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-orange">
              Features
            </p>
            <h2
              id="features-heading"
              className="font-serif text-3xl leading-tight sm:text-4xl lg:text-5xl"
            >
              Everything you need to{" "}
              <span className="text-gradient-brand">run your creator business</span>
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              From first pitch to final payment, brandea.today handles the business side so you can do
              what you do best.
            </p>
          </div>

          {/* Feature cards grid */}
          <div className="mt-14 grid gap-5 sm:mt-16 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="glass glass-highlight group rounded-2xl p-6 transition-all duration-300 hover:glow-purple hover:-translate-y-0.5 sm:p-7"
                >
                  {/* Icon container with subtle gradient background */}
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-coral/15 to-orange/15">
                    <Icon className="h-5 w-5 text-coral" />
                  </div>
                  <h3 className="font-serif text-xl">{feature.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============================================================
          PRICING SECTION
          2 tiers: Free and Pro (highlighted).
          Pro tier has orange glow + "Most Popular" badge.
          ============================================================ */}
      <section
        id="pricing"
        className="scroll-mt-20 px-4 py-20 sm:px-6 sm:py-28 lg:px-8"
        aria-labelledby="pricing-heading"
      >
        <div className="mx-auto max-w-7xl">
          {/* Section header */}
          <div className="mx-auto max-w-2xl text-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-orange">
              Pricing
            </p>
            <h2
              id="pricing-heading"
              className="font-serif text-3xl leading-tight sm:text-4xl lg:text-5xl"
            >
              Simple pricing,{" "}
              <span className="text-gradient-brand">no surprises</span>
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Upgrade when your creator business takes off.
              <br />
              We really want to help you love your creative job again.
            </p>
          </div>

          {/* Pricing cards */}
          <div className="mx-auto mt-14 grid max-w-3xl gap-6 sm:mt-16 lg:grid-cols-2">
            {PRICING_TIERS.map((tier) => (
              <div
                key={tier.name}
                className={`relative flex flex-col rounded-2xl p-7 transition-all duration-300 sm:p-8 ${
                  tier.highlighted
                    ? "glass-heavy glass-highlight glow-orange scale-[1.02] lg:scale-105"
                    : "glass glass-highlight"
                }`}
              >
                {/* "Most Popular" badge for highlighted tier */}
                {tier.highlighted && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-coral to-orange px-4 py-1 text-xs font-semibold text-white shadow-lg">
                      <Star className="h-3 w-3" />
                      Most Popular
                    </span>
                  </div>
                )}

                {/* Tier name & price */}
                <div className="mb-6">
                  <h3 className="font-serif text-xl">{tier.name}</h3>
                  <div className="mt-3 flex items-baseline gap-1">
                    <span className="text-gradient-brand font-serif text-4xl sm:text-5xl">
                      {tier.price}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      /{tier.period}
                    </span>
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground">
                    {tier.description}
                  </p>
                </div>

                {/* Feature list */}
                <ul className="mb-8 flex-1 space-y-3" role="list">
                  {tier.features.map((feat) => (
                    <li key={feat} className="flex items-start gap-3 text-sm">
                      <Check
                        className={`mt-0.5 h-4 w-4 flex-shrink-0 ${
                          tier.highlighted ? "text-orange" : "text-mint"
                        }`}
                      />
                      <span className="text-muted-foreground">{feat}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Link
                  href="/signup"
                  className={`inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold transition-all ${
                    tier.highlighted
                      ? "bg-gradient-to-r from-coral to-orange text-white shadow-lg hover:shadow-orange/30 hover:brightness-110"
                      : "border border-white/15 bg-white/5 text-foreground hover:border-white/25 hover:bg-white/10"
                  }`}
                  data-track="pricing"
                  data-track-label={tier.name.toLowerCase()}
                >
                  {tier.cta}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
                <p className="mt-2 text-center text-xs text-muted-foreground">
                  No credit card required
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          FINAL CTA SECTION
          Full-width glass panel with strong call to action.
          Creates urgency before the footer.
          ============================================================ */}
      <section className="px-4 py-20 sm:px-6 sm:py-28 lg:px-8" aria-label="Call to action">
        <div className="mx-auto max-w-4xl">
          <div className="glass-heavy glass-highlight relative overflow-hidden rounded-3xl px-6 py-14 text-center sm:px-12 sm:py-20">
            {/* Background accent orbs */}
            <div
              className="pointer-events-none absolute -left-20 -top-20 h-60 w-60 rounded-full opacity-20 blur-[80px]"
              style={{ background: "#E8788A" }}
              aria-hidden="true"
            />
            <div
              className="pointer-events-none absolute -bottom-20 -right-20 h-60 w-60 rounded-full opacity-20 blur-[80px]"
              style={{ background: "#F5A623" }}
              aria-hidden="true"
            />

            <div className="relative">
              <h2 className="font-serif text-3xl leading-tight sm:text-4xl lg:text-5xl">
                Ready to take control of{" "}
                <span className="text-gradient-brand">your creator business?</span>
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
                Join thousands of creators who stopped chasing payments and started growing
                their income with brandea.today.
              </p>
              <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                <Link
                  href="/signup"
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-coral to-orange px-8 py-3.5 text-base font-semibold text-white shadow-lg transition-all hover:shadow-orange/30 hover:brightness-110"
                  data-track="cta"
                  data-track-label="final-get-started"
                >
                  Get Started Free
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <p className="text-sm text-muted-foreground">
                  No credit card required
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          FOOTER
          Multi-column links + branding + copyright.
          Glass-subtle surface sitting at the bottom.
          ============================================================ */}
      <footer className="border-t border-white/5 px-4 py-12 sm:px-6 sm:py-16 lg:px-8" role="contentinfo">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
            {/* Brand column */}
            <div className="lg:col-span-2">
              <Link href="/" className="inline-block" aria-label="brandea.today home">
                <span className="text-gradient-brand font-serif text-2xl tracking-tight">
                  brandea.today
                </span>
              </Link>
              <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground">
                The business platform built for influencers and content creators. Track deals,
                send invoices, get paid.
              </p>
            </div>

            {/* Link columns */}
            {Object.entries(FOOTER_LINKS).map(([category, links]) => (
              <div key={category}>
                <p className="text-sm font-semibold text-foreground">{category}</p>
                <ul className="mt-3 space-y-2.5" role="list">
                  {links.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom bar */}
          <div className="mt-12 border-t border-white/5 pt-8">
            <p className="text-center text-xs text-muted-foreground">
              &copy; {new Date().getFullYear()} brandea.today. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
