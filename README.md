# DealFlow — Influencer Business Platform

> **"Stop doing admin. Get paid faster."**

DealFlow removes operational friction for micro-influencers (10K–100K followers) so they can focus entirely on creating content.

## What's Inside

| Component | Path | Deployment |
|-----------|------|------------|
| **Landing Page** | `/index.html` | [GitHub Pages](https://baranskyi.github.io/influencer-platform) |
| **Web App** | `/app/` | [Railway](https://railway.app) |

## Features (MVP)

- **Deal Tracker** — Kanban-style pipeline from pitch to payment
- **Invoice Generator** — PDF invoices with IVA/IRPF tax support (Spain/EU)
- **Content Calendar** — Deadlines, deliverables, posting schedule
- **Client Directory** — Brand contacts and deal history
- **Financial Analytics** — Revenue, pending payments, monthly trends
- **Payment Reminders** — Automated follow-ups for overdue invoices

## Tech Stack

- **Frontend**: Next.js 15 (App Router) + Tailwind CSS 4 + shadcn/ui
- **Backend**: Supabase (PostgreSQL + Auth + Storage + Edge Functions)
- **PDF**: @react-pdf/renderer
- **Email**: Resend
- **Deployment**: Railway (app) + GitHub Pages (landing)

## Getting Started

```bash
cd app
npm install
cp .env.example .env.local   # Fill in Supabase credentials
npm run dev                   # → http://localhost:3000
```

## Team

Group C — Slava, Sherman, Tomoki, Genevieve, Sri, Kamran

## License

Private — IE University Capstone Project
