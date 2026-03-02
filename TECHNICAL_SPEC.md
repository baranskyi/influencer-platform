# DealFlow — Technical Specification (MVP)

> **Date**: March 2, 2026
> **Version**: 1.0
> **Team**: Group C (Slava, Sherman, Tomoki, Genevieve, Sri, Kamran)
> **Stack**: Next.js 15 + Supabase + Tailwind CSS
> **Geo Focus**: Spain / Europe

---

## 1. Project Summary

### 1.1 Mission
Remove operational friction for micro-influencers so they can focus entirely on creating content.

### 1.2 One-Liner (≤10 words)
**"Stop doing admin. Get paid faster."**

### 1.3 Problem
Micro-influencers (10K–100K followers) earning $5K–$20K/month are losing thousands of dollars due to:
- **Payment delays** — brands pay in 60–120 days
- **Contract chaos** — contracts scattered across Gmail, WhatsApp, DMs with no single source of truth
- **Manual invoicing** — Excel, Google Sheets, manually sending PDFs
- **No follow-up** — forgotten unpaid invoices
- **No analytics** — no visibility into how much they've earned, what's pending, or what's been lost

### 1.4 Target User
| Attribute | Value |
|---|---|
| Platforms | Instagram, TikTok, YouTube |
| Followers | 10K–100K |
| Active deals | 3–10 per month |
| Income | €2,000–€15,000/month |
| Geography | Spain, Germany, Italy, UK, France |
| Pain point | Spending 5–10 hours/week on admin instead of content |
| Current tools | Excel, Gmail, WhatsApp, Notion, pen & paper |

### 1.5 Business Model
- **Freemium → SaaS subscription**: €0 (up to 3 deals) / €19/month (up to 20 deals) / €49/month (unlimited + analytics)
- **Monetization is NOT a priority at launch** (per Prof. Matt's advice) — first goal is acquiring 200 active users

---

## 2. Architecture

### 2.1 Technology Stack

| Layer | Technology | Rationale |
|---|---|---|
| Frontend | **Next.js 15 (App Router)** | SSR/SSG, React Server Components, fast UI |
| Styling | **Tailwind CSS 4 + shadcn/ui** | Rapid development, consistent design system |
| Backend/API | **Next.js API Routes + Supabase Edge Functions** | Serverless, scalable |
| Database | **Supabase (PostgreSQL)** | Row Level Security, Realtime, free tier |
| Authentication | **Supabase Auth** | Email/password + Magic Link + Google OAuth |
| File Storage | **Supabase Storage** | Contracts, invoices, creatives |
| PDF Generation | **@react-pdf/renderer** or **jsPDF** | Client-side invoice and contract generation |
| Email Notifications | **Resend** (or Supabase Edge + SMTP) | Payment reminders, follow-ups |
| Deployment | **Vercel** | Zero-config for Next.js, free tier |
| Analytics | **Plausible** (or PostHog) | Privacy-friendly, GDPR-compliant |

### 2.2 Project Structure

```
dealflow/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/             # Auth route group
│   │   │   ├── login/
│   │   │   ├── signup/
│   │   │   └── forgot-password/
│   │   ├── (dashboard)/        # Protected routes
│   │   │   ├── dashboard/      # Main dashboard
│   │   │   ├── deals/          # Deal management
│   │   │   │   ├── [id]/       # Deal details
│   │   │   │   └── new/        # Create deal
│   │   │   ├── invoices/       # Invoices
│   │   │   │   ├── [id]/
│   │   │   │   └── generate/
│   │   │   ├── calendar/       # Content calendar
│   │   │   ├── clients/        # Brand/client directory
│   │   │   ├── analytics/      # Financial analytics
│   │   │   └── settings/       # Profile settings
│   │   ├── api/                # API Routes
│   │   │   ├── invoices/
│   │   │   ├── deals/
│   │   │   ├── reminders/
│   │   │   └── webhooks/
│   │   ├── layout.tsx
│   │   └── page.tsx            # Landing page
│   ├── components/
│   │   ├── ui/                 # shadcn/ui components
│   │   ├── deals/              # Deal components
│   │   ├── invoices/           # Invoice components
│   │   ├── calendar/           # Calendar components
│   │   ├── analytics/          # Charts and widgets
│   │   └── layout/             # Navigation, sidebar
│   ├── lib/
│   │   ├── supabase/           # Supabase clients
│   │   ├── pdf/                # PDF generation
│   │   ├── email/              # Email templates
│   │   └── utils/              # Utilities
│   ├── hooks/                  # Custom React hooks
│   ├── types/                  # TypeScript types
│   └── styles/                 # Global styles
├── supabase/
│   ├── migrations/             # SQL migrations
│   ├── seed.sql                # Test data
│   └── functions/              # Edge Functions
├── public/                     # Static assets
├── tests/                      # Tests
└── docs/                       # Documentation
```

### 2.3 Data Model (PostgreSQL / Supabase)

```sql
-- ========================================
-- Influencer Profile
-- ========================================
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  display_name TEXT,
  email TEXT NOT NULL,
  phone TEXT,
  avatar_url TEXT,
  -- Business data
  legal_name TEXT,                    -- For invoices
  tax_id TEXT,                        -- NIF/NIE (Spain), VAT number
  address JSONB,                      -- {street, city, postal_code, country}
  bank_details JSONB,                 -- {iban, swift, bank_name} (encrypted)
  -- Social media
  instagram_handle TEXT,
  tiktok_handle TEXT,
  youtube_handle TEXT,
  follower_count INTEGER,
  -- Settings
  currency TEXT DEFAULT 'EUR',
  timezone TEXT DEFAULT 'Europe/Madrid',
  notification_preferences JSONB,
  -- Meta
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================
-- Clients (Brands)
-- ========================================
CREATE TABLE clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,                  -- Brand name
  contact_name TEXT,                   -- Contact person
  contact_email TEXT,
  contact_phone TEXT,
  website TEXT,
  category TEXT,                       -- Fashion, Beauty, Tech, Food...
  notes TEXT,
  -- Rating (based on experience)
  payment_rating INTEGER CHECK (payment_rating BETWEEN 1 AND 5),
  avg_payment_days INTEGER,            -- Average payment turnaround
  total_deals INTEGER DEFAULT 0,
  total_revenue DECIMAL(12,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================
-- Deals (Deal Tracker — MVP core)
-- ========================================
CREATE TABLE deals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
  -- Core
  title TEXT NOT NULL,                 -- "Summer Collection 2026"
  brand_name TEXT NOT NULL,            -- Denormalized for fast access
  platform TEXT NOT NULL,              -- instagram, tiktok, youtube, multi
  deal_type TEXT DEFAULT 'sponsored',  -- sponsored, affiliate, barter, ambassador, ugc
  -- Financials
  amount DECIMAL(12,2),                -- Deal value
  currency TEXT DEFAULT 'EUR',
  payment_terms TEXT,                  -- "Net 30", "50% upfront, 50% on delivery"
  -- Status
  status TEXT NOT NULL DEFAULT 'negotiation',
  -- negotiation → agreed → in_progress → content_submitted →
  -- content_approved → invoiced → paid → completed
  -- cancelled, disputed
  -- Dates
  start_date DATE,
  end_date DATE,
  content_deadline DATE,               -- Content submission deadline
  payment_due_date DATE,               -- When payment is due
  paid_date DATE,                      -- When payment was actually received
  -- Content
  deliverables JSONB,                  -- [{type: "reel", count: 2, specs: "..."}]
  content_requirements TEXT,
  hashtags TEXT[],
  -- Files
  contract_url TEXT,                   -- Link to contract in Storage
  -- Meta
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================
-- Invoices
-- ========================================
CREATE TABLE invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  deal_id UUID REFERENCES deals(id) ON DELETE SET NULL,
  client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
  -- Invoice
  invoice_number TEXT NOT NULL,        -- AUTO: DF-2026-001
  -- Amounts
  subtotal DECIMAL(12,2) NOT NULL,
  tax_rate DECIMAL(5,2) DEFAULT 21.00, -- IVA 21% (Spain)
  tax_amount DECIMAL(12,2),
  irpf_rate DECIMAL(5,2) DEFAULT 0,   -- IRPF withholding (Spain, autónomos)
  irpf_amount DECIMAL(12,2) DEFAULT 0,
  total DECIMAL(12,2) NOT NULL,
  currency TEXT DEFAULT 'EUR',
  -- Status
  status TEXT DEFAULT 'draft',         -- draft, sent, viewed, paid, overdue, cancelled
  -- Dates
  issue_date DATE DEFAULT CURRENT_DATE,
  due_date DATE,
  paid_date DATE,
  -- Reminders
  reminder_sent_count INTEGER DEFAULT 0,
  last_reminder_at TIMESTAMPTZ,
  next_reminder_at TIMESTAMPTZ,
  -- PDF
  pdf_url TEXT,                        -- Generated PDF in Storage
  -- Meta
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================
-- Content Calendar
-- ========================================
CREATE TABLE content_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  deal_id UUID REFERENCES deals(id) ON DELETE CASCADE,
  -- Event
  title TEXT NOT NULL,
  description TEXT,
  event_type TEXT NOT NULL,            -- post, story, reel, video, review, deadline
  platform TEXT,                       -- instagram, tiktok, youtube
  -- Time
  scheduled_at TIMESTAMPTZ NOT NULL,
  completed_at TIMESTAMPTZ,
  -- Status
  status TEXT DEFAULT 'planned',       -- planned, in_progress, completed, missed
  -- Meta
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================
-- Reminders (follow-up)
-- ========================================
CREATE TABLE reminders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  deal_id UUID REFERENCES deals(id) ON DELETE CASCADE,
  invoice_id UUID REFERENCES invoices(id) ON DELETE CASCADE,
  -- Reminder
  type TEXT NOT NULL,                  -- payment_due, content_deadline, follow_up, custom
  title TEXT NOT NULL,
  message TEXT,
  -- Time
  remind_at TIMESTAMPTZ NOT NULL,
  -- Channels
  channels TEXT[] DEFAULT '{email}',   -- email, push, whatsapp
  -- Status
  status TEXT DEFAULT 'pending',       -- pending, sent, dismissed
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================
-- Files (contracts, creatives)
-- ========================================
CREATE TABLE files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  deal_id UUID REFERENCES deals(id) ON DELETE SET NULL,
  -- File
  file_name TEXT NOT NULL,
  file_type TEXT NOT NULL,             -- contract, invoice, creative, brief, other
  mime_type TEXT,
  file_size INTEGER,
  storage_path TEXT NOT NULL,          -- Path in Supabase Storage
  -- Meta
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 2.4 Security Policies (RLS)

```sql
-- Each user can only access their OWN data
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE files ENABLE ROW LEVEL SECURITY;

-- Example policy for deals
CREATE POLICY "Users can CRUD own deals"
  ON deals FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Analogous policies for all tables
```

---

## 3. Functional Requirements (MVP)

### 3.1 Module: Authentication

| ID | Feature | Priority | Description |
|----|---------|----------|-------------|
| AUTH-01 | Sign Up | P0 | Email + password. Fields: name, email, password |
| AUTH-02 | Login | P0 | Email + password |
| AUTH-03 | Magic Link | P1 | Passwordless login via email link |
| AUTH-04 | Google OAuth | P1 | Sign in with Google |
| AUTH-05 | Password Reset | P0 | Send reset link via email |
| AUTH-06 | Onboarding | P0 | First visit → profile wizard (name, socials, country, currency) |

### 3.2 Module: Dashboard

| ID | Feature | Priority | Description |
|----|---------|----------|-------------|
| DASH-01 | Revenue Overview | P0 | Widgets: earned this month, pending payment, overdue |
| DASH-02 | Active Deals | P0 | List of current deals with statuses (kanban or list view) |
| DASH-03 | Upcoming Deadlines | P0 | Upcoming content deadlines and payments (next 7 days) |
| DASH-04 | Quick Actions | P1 | Buttons: "New Deal", "Generate Invoice", "Record Payment" |
| DASH-05 | Notifications | P1 | Feed: overdue payments, approaching deadlines |

### 3.3 Module: Deal Tracker (Core — deal management)

| ID | Feature | Priority | Description |
|----|---------|----------|-------------|
| DEAL-01 | Create Deal | P0 | Form: brand, amount, platform, deal type, dates, deliverables |
| DEAL-02 | Status Pipeline | P0 | Kanban board or table with statuses: negotiation → agreed → in_progress → content_submitted → content_approved → invoiced → paid |
| DEAL-03 | Deal Details | P0 | Deal page: all data, files, notes, history |
| DEAL-04 | Link Client | P0 | Select existing client or create new one inline |
| DEAL-05 | Upload Contract | P1 | Upload PDF/DOCX contract to Storage |
| DEAL-06 | Deliverables Checklist | P1 | Task checklist per deal (2 Reels, 1 Story → mark as done) |
| DEAL-07 | Quick Search | P1 | Search deals by: brand, status, amount, date |
| DEAL-08 | Filters | P1 | Filter by: status, platform, deal type, date range |
| DEAL-09 | Bulk Actions | P2 | Select multiple deals → change status |

### 3.4 Module: Invoicing

| ID | Feature | Priority | Description |
|----|---------|----------|-------------|
| INV-01 | Generate Invoice | P0 | From deal → auto-fill data → preview → generate PDF |
| INV-02 | PDF Template | P0 | Professional invoice: sender/recipient details, line items, IVA, IRPF, total. Compliant with Spanish Factura requirements |
| INV-03 | Auto-Numbering | P0 | Format: DF-2026-001, DF-2026-002 (auto-increment per year) |
| INV-04 | EU Taxes | P0 | IVA 21% (Spain), configurable rates for other EU countries. IRPF for autónomos |
| INV-05 | Send Invoice | P1 | Email with attached PDF → to brand |
| INV-06 | Statuses | P0 | draft → sent → viewed → paid → overdue |
| INV-07 | Record Payment | P0 | Mark as "paid" → date, payment method |
| INV-08 | Overdue Detection | P0 | Automatically mark as "overdue" when past due_date |

### 3.5 Module: Reminders & Follow-up

| ID | Feature | Priority | Description |
|----|---------|----------|-------------|
| REM-01 | Payment Reminders | P0 | Auto-reminder: "Invoice DF-2026-003 is 7 days overdue" |
| REM-02 | Message Templates | P0 | Ready-made email/WhatsApp templates for payment follow-up (EN/ES) |
| REM-03 | Content Deadline | P1 | Notification 3 days before content submission deadline |
| REM-04 | Reminder Schedule | P1 | Configure: remind at 7, 14, 30 days past due |
| REM-05 | One-Click Follow-up | P0 | "Remind" button on invoice → generates email from template |

### 3.6 Module: Content Calendar

| ID | Feature | Priority | Description |
|----|---------|----------|-------------|
| CAL-01 | Monthly Calendar | P1 | Visual calendar with content events |
| CAL-02 | Create Event | P1 | Post type, platform, time, linked to deal |
| CAL-03 | Event Statuses | P1 | planned → in_progress → completed → missed |
| CAL-04 | Drag & Drop | P2 | Drag events between days to reschedule |

### 3.7 Module: Clients (CRM-lite)

| ID | Feature | Priority | Description |
|----|---------|----------|-------------|
| CLI-01 | Client Directory | P0 | Brand list: name, contact, email, category |
| CLI-02 | Client Profile | P0 | Brand profile: all deals, invoices, rating, notes |
| CLI-03 | Payment Rating | P1 | 1–5 star rating: how quickly the brand pays |
| CLI-04 | Deal History | P0 | All deals with this brand — amounts, dates, statuses |

### 3.8 Module: Financial Analytics

| ID | Feature | Priority | Description |
|----|---------|----------|-------------|
| FIN-01 | Monthly Revenue | P1 | Bar chart: revenue over the last 12 months |
| FIN-02 | Paid vs Pending | P0 | Widgets: paid, pending, overdue (€) |
| FIN-03 | Revenue by Platform | P1 | Pie chart: Instagram vs TikTok vs YouTube |
| FIN-04 | Revenue by Client | P1 | Top 5 clients by revenue |
| FIN-05 | Cash Flow Forecast | P2 | Projected incoming payments based on due dates |

### 3.9 Module: Profile & Settings

| ID | Feature | Priority | Description |
|----|---------|----------|-------------|
| SET-01 | Profile | P0 | Name, email, avatar, social handles |
| SET-02 | Business Details | P0 | Legal name, NIF/NIE, address, bank details (for invoices) |
| SET-03 | Tax Settings | P0 | IVA %, IRPF %, default currency |
| SET-04 | Reminder Templates | P1 | Customize email reminder text |
| SET-05 | Notifications | P1 | Enable/disable email notifications by type |

---

## 4. Non-Functional Requirements

| Category | Requirement |
|---|---|
| **Performance** | Dashboard load < 2 sec, PDF generation < 3 sec |
| **Security** | HTTPS, RLS on all tables, bank details encrypted (pgcrypto), GDPR compliance |
| **Scalability** | Supabase free tier → Pro at 500+ users |
| **Accessibility** | WCAG 2.1 AA, responsive (mobile-first — influencers live on their phones) |
| **Localization** | English (default) + Spanish. Structured for adding DE, FR, IT later |
| **Monitoring** | Vercel Analytics + Sentry for error tracking |

---

## 5. Design & UI/UX

### 5.1 Style
Inherited from the existing DealFlow landing page:
- **Glassmorphism** with soft tones
- Colors: `--accent: #E8788A` (pink), `--mint: #7ECFB3`, `--lavender: #B8A9E8`
- Fonts: DM Serif Display (headings), Inter (body)
- Dark mode: supported (already in the landing page)

### 5.2 Key Screens (wireframes)

1. **Dashboard** — 3 KPI cards at top → active deals (kanban) → upcoming deadlines
2. **Deals** — Kanban board with status columns OR table view (toggle)
3. **Deal Detail** — Sidebar: status progress, core data; Main: deliverables, files, notes, invoices
4. **Invoices** — Invoice table + "Generate" button → preview → download/send
5. **Calendar** — Monthly view with color-coded platform labels
6. **Analytics** — Revenue charts, pie charts by platform/client

### 5.3 Mobile-First
At least 60% of users will access from mobile (influencers live on their phones). All screens must be fully usable at 375px+.

---

## 6. Success Metrics (KPIs)

Derived from Sessions 5–6 and Prof. Matt's guidance:

| Metric | Target | How to Measure |
|---|---|---|
| Landing page conversion | > 5% | Sign-ups / Visitors |
| Day-1 deal creation | > 40% | Users who create first deal in first session |
| Day-7 status update | > 25% | Users who update a deal status within 7 days |
| Week-2 invoice generation | > 15% | Users who generate at least 1 invoice in 2 weeks |
| First month retention | > 20% | Users active after 30 days |
| NPS (interviews) | > 40 | From 12 interviews (Session 7) |

---

## 7. Risks & Mitigation

From Risk Heatmap (Session 6):

| Risk | Level | Mitigation |
|---|---|---|
| **Data Entry Assumption** — creators won't manually input data | HIGH | Minimize friction: 5 fields per deal, auto-complete, templates |
| **Trust** — users don't trust a new tool | HIGH | Data transparency, don't require bank details upfront, demonstrate value without them |
| **Payment pain not strong enough** — creators tolerate the status quo | MEDIUM | Focus on time savings (5 hrs/week), not just payments |
| **Competition** — Lumanu, Willa, Grin, Creator.co | MEDIUM | Focus on micro-influencers (competitors target top-tier), EU/Spain niche |
| **GDPR Compliance** | MEDIUM | Supabase EU region, privacy policy, data deletion on request |

---

## 8. Roadmap

### Phase 1 — MVP Core (4 weeks)
- Authentication + onboarding
- Deal Tracker (CRUD + statuses + kanban)
- Client directory
- Dashboard (KPI widgets)

### Phase 2 — Invoicing (2 weeks)
- PDF invoice generation (IVA/IRPF)
- Invoice statuses
- Auto-numbering

### Phase 3 — Reminders & Follow-up (2 weeks)
- Payment reminders (email)
- Follow-up message templates
- Deadline notifications

### Phase 4 — Calendar & Analytics (2 weeks)
- Content calendar
- Financial analytics (charts)

### Phase 5 — Polish & Launch (2 weeks)
- Mobile UX polish
- Landing page integration
- A/B message testing
- Outreach to 50 Spanish influencers (from existing database)

---

## 9. Programming Checklist

### Sprint 0 — Setup (1–2 days)

- [ ] **S0-01** — Initialize Next.js 15 project with App Router
- [ ] **S0-02** — Set up Tailwind CSS 4 + shadcn/ui
- [ ] **S0-03** — Create Supabase project (EU region)
- [ ] **S0-04** — Configure Supabase client (server + browser)
- [ ] **S0-05** — Set up ESLint + Prettier + TypeScript strict mode
- [ ] **S0-06** — Configure Vercel deployment (preview + production)
- [ ] **S0-07** — Set up environment variables (.env.local + Vercel)
- [ ] **S0-08** — Create base directory structure (src/app, components, lib, hooks, types)
- [ ] **S0-09** — Set up Git hooks (husky + lint-staged)

### Sprint 1 — Database & Authentication (3–4 days)

- [ ] **S1-01** — SQL migration: create all tables (profiles, clients, deals, invoices, content_events, reminders, files)
- [ ] **S1-02** — SQL migration: RLS policies for all tables
- [ ] **S1-03** — SQL migration: indexes (user_id, status, dates)
- [ ] **S1-04** — SQL migration: triggers (auto-update updated_at)
- [ ] **S1-05** — Supabase Auth: configure Email + Password
- [ ] **S1-06** — Supabase Auth: configure Google OAuth
- [ ] **S1-07** — Supabase Auth: configure Magic Link
- [ ] **S1-08** — Middleware: protect /dashboard/* routes (redirect to /login)
- [ ] **S1-09** — /login page (email + password + Google + Magic Link)
- [ ] **S1-10** — /signup page (email + password + name)
- [ ] **S1-11** — /forgot-password page
- [ ] **S1-12** — Onboarding wizard (step 1: name + socials, step 2: country + currency)
- [ ] **S1-13** — Layout: sidebar navigation (Dashboard, Deals, Invoices, Calendar, Clients, Analytics, Settings)
- [ ] **S1-14** — Layout: mobile bottom navigation
- [ ] **S1-15** — Layout: header with avatar + logout
- [ ] **S1-16** — Seed data: test data for development

### Sprint 2 — Deal Tracker (5–7 days)

- [ ] **S2-01** — TypeScript types for Deal, Client, Invoice
- [ ] **S2-02** — Supabase queries: CRUD for deals (lib/supabase/deals.ts)
- [ ] **S2-03** — /deals page — Kanban board (columns by status)
- [ ] **S2-04** — /deals page — alternative table view
- [ ] **S2-05** — Kanban ↔ Table view toggle
- [ ] **S2-06** — Drag & drop on Kanban (status change)
- [ ] **S2-07** — /deals/new form — create deal (brand, amount, platform, type, dates)
- [ ] **S2-08** — Client auto-complete (search existing + create new inline)
- [ ] **S2-09** — /deals/[id] page — deal details
- [ ] **S2-10** — Deliverables checklist (add/remove/check off)
- [ ] **S2-11** — File upload for deals (contract, brief)
- [ ] **S2-12** — Deal notes (textarea + save)
- [ ] **S2-13** — Deal search (full-text search)
- [ ] **S2-14** — Filters: status, platform, deal type, date range
- [ ] **S2-15** — Quick status change (dropdown in list)

### Sprint 3 — Clients CRM (2–3 days)

- [ ] **S3-01** — Supabase queries: CRUD for clients
- [ ] **S3-02** — /clients page — client list (table)
- [ ] **S3-03** — /clients/[id] — client profile with deals, rating
- [ ] **S3-04** — Create/edit client form
- [ ] **S3-05** — Payment rating (1–5 stars)
- [ ] **S3-06** — Auto-calculated stats: total deals, total revenue, avg payment days

### Sprint 4 — Dashboard (3–4 days)

- [ ] **S4-01** — KPI widgets: earned this month, pending, overdue
- [ ] **S4-02** — Aggregate SQL queries (or Supabase RPC functions)
- [ ] **S4-03** — Active deals list (compact view)
- [ ] **S4-04** — Upcoming deadlines (next 7 days)
- [ ] **S4-05** — Quick actions: "New Deal", "Generate Invoice", "Record Payment"
- [ ] **S4-06** — Notification feed: overdue payments, deadlines
- [ ] **S4-07** — Responsive layout (mobile dashboard)

### Sprint 5 — Invoicing (4–5 days)

- [ ] **S5-01** — Supabase queries: CRUD for invoices
- [ ] **S5-02** — Auto-numbering: DF-{YEAR}-{NNN}
- [ ] **S5-03** — /invoices page — invoice list (table)
- [ ] **S5-04** — Generate invoice from deal (auto-fill data)
- [ ] **S5-05** — Invoice form: line items, IVA, IRPF, total
- [ ] **S5-06** — Invoice preview (live preview)
- [ ] **S5-07** — PDF generation (@react-pdf/renderer): Factura template
- [ ] **S5-08** — PDF layout: logo, from/to details, line items, taxes, bank details
- [ ] **S5-09** — Download PDF
- [ ] **S5-10** — Save PDF to Supabase Storage
- [ ] **S5-11** — Send invoice via email (Resend + PDF attachment)
- [ ] **S5-12** — Invoice statuses: draft → sent → paid → overdue
- [ ] **S5-13** — Auto-mark as "overdue" (cron / Edge Function)
- [ ] **S5-14** — Record payment: "Mark as Paid" button + date

### Sprint 6 — Reminders (3–4 days)

- [ ] **S6-01** — Supabase Edge Function: cron check for overdue invoices
- [ ] **S6-02** — Email templates: payment reminder (EN + ES)
- [ ] **S6-03** — Email templates: content deadline reminder
- [ ] **S6-04** — Configure Resend for email delivery
- [ ] **S6-05** — One-click follow-up: "Remind" button on invoice → send email
- [ ] **S6-06** — Reminder schedule: auto-remind at 7, 14, 30 days past due
- [ ] **S6-07** — WhatsApp template (copy-to-clipboard with pre-filled text)
- [ ] **S6-08** — In-app notifications (badge on sidebar)

### Sprint 7 — Content Calendar (3–4 days)

- [ ] **S7-01** — Supabase queries: CRUD for content_events
- [ ] **S7-02** — /calendar page — monthly view
- [ ] **S7-03** — Color coding by platform (IG = pink, TT = blue, YT = red)
- [ ] **S7-04** — Create event (linked to deal)
- [ ] **S7-05** — Statuses: planned → completed → missed
- [ ] **S7-06** — Weekly view (optional)
- [ ] **S7-07** — Mobile: swipe navigation between months

### Sprint 8 — Financial Analytics (3–4 days)

- [ ] **S8-01** — Chart library (Recharts or Chart.js)
- [ ] **S8-02** — Bar chart: monthly revenue (12 months)
- [ ] **S8-03** — Pie chart: revenue by platform
- [ ] **S8-04** — Pie chart: revenue by client (top 5)
- [ ] **S8-05** — KPI cards: average deal size, average payment time, total deals
- [ ] **S8-06** — Period filter (this month, quarter, year, custom)
- [ ] **S8-07** — SQL RPC functions for aggregations

### Sprint 9 — Settings & Profile (2–3 days)

- [ ] **S9-01** — /settings page — profile (name, email, avatar, socials)
- [ ] **S9-02** — Business details (legal name, NIF, address, bank)
- [ ] **S9-03** — Tax settings (IVA %, IRPF %, currency)
- [ ] **S9-04** — Reminder templates (edit text)
- [ ] **S9-05** — Notifications (enable/disable by type)
- [ ] **S9-06** — Avatar upload (Supabase Storage)
- [ ] **S9-07** — Delete account (GDPR)

### Sprint 10 — Polish, Testing & Launch (3–5 days)

- [ ] **S10-01** — Responsive check on all screens (375px, 768px, 1024px, 1440px)
- [ ] **S10-02** — Dark mode for all dashboard screens
- [ ] **S10-03** — Loading states (skeletons) for all pages
- [ ] **S10-04** — Empty states ("No deals yet — create your first!")
- [ ] **S10-05** — Error handling (toast notifications)
- [ ] **S10-06** — 404 and error pages
- [ ] **S10-07** — SEO meta tags for landing page
- [ ] **S10-08** — Plausible/PostHog analytics setup
- [ ] **S10-09** — Sentry error tracking
- [ ] **S10-10** — Smoke tests: sign up → create deal → invoice → reminder
- [ ] **S10-11** — Lighthouse audit (Performance > 90, Accessibility > 90)
- [ ] **S10-12** — Landing page integration (current landing-page.html → Next.js page)
- [ ] **S10-13** — Vercel production deploy + custom domain
- [ ] **S10-14** — Privacy Policy + Terms of Service pages

---

## 10. Glossary

| Term | Definition |
|---|---|
| **Micro-influencer** | Content creator with 10K–100K followers |
| **Deal** | An agreement between an influencer and a brand to create content for compensation |
| **Deliverable** | A unit of content the influencer must produce (Reel, Story, Video) |
| **Factura** | Spanish tax invoice (mandatory for autónomos) |
| **IVA** | Impuesto sobre el Valor Añadido — VAT in Spain (21%) |
| **IRPF** | Impuesto sobre la Renta de las Personas Físicas — income tax withholding (deducted from payment) |
| **Autónomo** | Self-employed worker in Spain (most influencers are registered as autónomos) |
| **Barter deal** | A deal where compensation is product/service, not money |
| **UGC** | User-Generated Content — content created for a brand, not posted on the influencer's own account |
| **RAT** | Riskiest Assumption Test — testing the most critical hypothesis |

---

## 11. Data Sources

This document is based on:
- Interview with Mela (52K IG, Philippines → Spain)
- Interview with Mark Williams (17.1K, US → Madrid)
- Interview with W Talent Management (Manila) and TikTok (Tina)
- Sherman's interviews: Juxin (RED BOOK), Momo (RED BOOK 300K), Andie (Chanel marketing director)
- Tomoki's interview: Shigetravel (YouTuber)
- 6 mentoring sessions with Prof. Matthieu Heusch (Jan 28 – Feb 25, 2026)
- 50 Spanish micro-influencers database
- US micro-influencers database (YouTube + Instagram)
- HBS Go-To-Market Strategy framework
- Session 4–6 team presentations
- EMBA Startup Lab coaching deliverables

---

*Document prepared: March 2, 2026*
*Version: 1.0 MVP*
