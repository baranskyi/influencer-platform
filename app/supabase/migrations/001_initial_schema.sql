-- ============================================================
-- DealFlow — Initial Database Schema
-- Version: 001
-- Date: 2026-03-02
-- ============================================================

-- ========================================
-- Helper: updated_at trigger function
-- ========================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ========================================
-- 1. Influencer Profiles
-- ========================================
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  display_name TEXT,
  email TEXT NOT NULL,
  phone TEXT,
  avatar_url TEXT,
  -- Business data
  legal_name TEXT,
  tax_id TEXT,
  address JSONB,
  bank_details JSONB,
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

CREATE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ========================================
-- 2. Clients (Brands)
-- ========================================
CREATE TABLE clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  contact_name TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  website TEXT,
  category TEXT,
  notes TEXT,
  payment_rating INTEGER CHECK (payment_rating BETWEEN 1 AND 5),
  avg_payment_days INTEGER,
  total_deals INTEGER DEFAULT 0,
  total_revenue DECIMAL(12,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_clients_user_id ON clients(user_id);

CREATE TRIGGER set_clients_updated_at
  BEFORE UPDATE ON clients
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ========================================
-- 3. Deals (Core — Deal Tracker)
-- ========================================
CREATE TABLE deals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
  -- Core
  title TEXT NOT NULL,
  brand_name TEXT NOT NULL,
  platform TEXT NOT NULL,
  deal_type TEXT DEFAULT 'sponsored',
  -- Financials
  amount DECIMAL(12,2),
  currency TEXT DEFAULT 'EUR',
  payment_terms TEXT,
  -- Status pipeline:
  -- negotiation → agreed → in_progress → content_submitted →
  -- content_approved → invoiced → paid → completed
  -- Also: cancelled, disputed
  status TEXT NOT NULL DEFAULT 'negotiation',
  -- Dates
  start_date DATE,
  end_date DATE,
  content_deadline DATE,
  payment_due_date DATE,
  paid_date DATE,
  -- Content
  deliverables JSONB,
  content_requirements TEXT,
  hashtags TEXT[],
  -- Files
  contract_url TEXT,
  -- Meta
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_deals_user_id ON deals(user_id);
CREATE INDEX idx_deals_status ON deals(status);
CREATE INDEX idx_deals_created_at ON deals(created_at);
CREATE INDEX idx_deals_payment_due_date ON deals(payment_due_date);

CREATE TRIGGER set_deals_updated_at
  BEFORE UPDATE ON deals
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ========================================
-- 4. Invoices
-- ========================================
CREATE TABLE invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  deal_id UUID REFERENCES deals(id) ON DELETE SET NULL,
  client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
  -- Invoice number
  invoice_number TEXT NOT NULL,
  -- Amounts
  subtotal DECIMAL(12,2) NOT NULL,
  tax_rate DECIMAL(5,2) DEFAULT 21.00,
  tax_amount DECIMAL(12,2),
  irpf_rate DECIMAL(5,2) DEFAULT 0,
  irpf_amount DECIMAL(12,2) DEFAULT 0,
  total DECIMAL(12,2) NOT NULL,
  currency TEXT DEFAULT 'EUR',
  -- Status: draft, sent, viewed, paid, overdue, cancelled
  status TEXT DEFAULT 'draft',
  -- Dates
  issue_date DATE DEFAULT CURRENT_DATE,
  due_date DATE,
  paid_date DATE,
  -- Reminders
  reminder_sent_count INTEGER DEFAULT 0,
  last_reminder_at TIMESTAMPTZ,
  next_reminder_at TIMESTAMPTZ,
  -- PDF
  pdf_url TEXT,
  -- Meta
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_invoices_user_id ON invoices(user_id);
CREATE INDEX idx_invoices_status ON invoices(status);
CREATE INDEX idx_invoices_due_date ON invoices(due_date);

CREATE TRIGGER set_invoices_updated_at
  BEFORE UPDATE ON invoices
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ========================================
-- 5. Content Calendar Events
-- ========================================
CREATE TABLE content_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  deal_id UUID REFERENCES deals(id) ON DELETE CASCADE,
  -- Event
  title TEXT NOT NULL,
  description TEXT,
  event_type TEXT NOT NULL,
  platform TEXT,
  -- Time
  scheduled_at TIMESTAMPTZ NOT NULL,
  completed_at TIMESTAMPTZ,
  -- Status: planned, in_progress, completed, missed
  status TEXT DEFAULT 'planned',
  -- Meta
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_content_events_user_id ON content_events(user_id);
CREATE INDEX idx_content_events_scheduled_at ON content_events(scheduled_at);

CREATE TRIGGER set_content_events_updated_at
  BEFORE UPDATE ON content_events
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ========================================
-- 6. Reminders (Follow-up System)
-- ========================================
CREATE TABLE reminders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  deal_id UUID REFERENCES deals(id) ON DELETE CASCADE,
  invoice_id UUID REFERENCES invoices(id) ON DELETE CASCADE,
  -- Reminder
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT,
  -- Time
  remind_at TIMESTAMPTZ NOT NULL,
  -- Channels: email, push, whatsapp
  channels TEXT[] DEFAULT '{email}',
  -- Status: pending, sent, dismissed
  status TEXT DEFAULT 'pending',
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_reminders_user_id ON reminders(user_id);
CREATE INDEX idx_reminders_remind_at ON reminders(remind_at);
CREATE INDEX idx_reminders_status ON reminders(status);

-- ========================================
-- 7. Files (Contracts, Creatives)
-- ========================================
CREATE TABLE files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  deal_id UUID REFERENCES deals(id) ON DELETE SET NULL,
  -- File
  file_name TEXT NOT NULL,
  file_type TEXT NOT NULL,
  mime_type TEXT,
  file_size INTEGER,
  storage_path TEXT NOT NULL,
  -- Meta
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_files_user_id ON files(user_id);
CREATE INDEX idx_files_deal_id ON files(deal_id);

-- ========================================
-- Row Level Security (RLS)
-- ========================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE files ENABLE ROW LEVEL SECURITY;

-- Profiles: users can only access their own profile
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Clients: users can only CRUD their own clients
CREATE POLICY "Users can CRUD own clients"
  ON clients FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Deals: users can only CRUD their own deals
CREATE POLICY "Users can CRUD own deals"
  ON deals FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Invoices: users can only CRUD their own invoices
CREATE POLICY "Users can CRUD own invoices"
  ON invoices FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Content Events: users can only CRUD their own events
CREATE POLICY "Users can CRUD own content_events"
  ON content_events FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Reminders: users can only CRUD their own reminders
CREATE POLICY "Users can CRUD own reminders"
  ON reminders FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Files: users can only CRUD their own files
CREATE POLICY "Users can CRUD own files"
  ON files FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ========================================
-- Auto-create profile on signup
-- ========================================
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, full_name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    NEW.email
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
