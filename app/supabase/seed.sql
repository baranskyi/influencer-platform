-- ============================================================
-- DealFlow — Seed Data for Development
-- ============================================================
-- NOTE: This seed file assumes a test user has been created via
-- Supabase Auth with the following UUID. Replace with your
-- actual test user's UUID after signing up.
-- ============================================================

-- Use a placeholder UUID — replace after creating test user
DO $$
DECLARE
  test_user_id UUID := '00000000-0000-0000-0000-000000000001';
  -- Client IDs
  client_glow UUID;
  client_verde UUID;
  client_fitpro UUID;
  client_techwave UUID;
  client_nomad UUID;
  -- Deal IDs for invoice references
  deal_glow UUID;
  deal_verde UUID;
  deal_fitpro UUID;
BEGIN

-- ========================================
-- Insert test profile (manually, bypassing auth trigger)
-- ========================================
INSERT INTO profiles (id, full_name, display_name, email, instagram_handle, tiktok_handle, follower_count, currency, timezone)
VALUES (
  test_user_id,
  'Maria Garcia',
  'maria.creates',
  'maria@example.com',
  '@maria.creates',
  '@mariacreates',
  45000,
  'EUR',
  'Europe/Madrid'
) ON CONFLICT (id) DO NOTHING;

-- ========================================
-- 5 Clients
-- ========================================
INSERT INTO clients (id, user_id, name, contact_name, contact_email, category, payment_rating, avg_payment_days, total_deals, total_revenue)
VALUES
  (gen_random_uuid(), test_user_id, 'GlowSkin Beauty', 'Ana López', 'ana@glowskin.com', 'Beauty', 4, 35, 3, 4500.00),
  (gen_random_uuid(), test_user_id, 'Verde Organic', 'Carlos Ruiz', 'carlos@verde.es', 'Food & Drink', 5, 20, 2, 2200.00),
  (gen_random_uuid(), test_user_id, 'FitPro Supplements', 'James Wilson', 'james@fitpro.uk', 'Fitness', 3, 60, 4, 6800.00),
  (gen_random_uuid(), test_user_id, 'TechWave Electronics', 'Sophie Chen', 'sophie@techwave.de', 'Technology', 4, 30, 1, 1500.00),
  (gen_random_uuid(), test_user_id, 'Nomad Travel Co.', 'Luca Bianchi', 'luca@nomadtravel.it', 'Travel', 2, 90, 2, 3000.00)
RETURNING id INTO client_glow;

-- Get client IDs for deal references
SELECT id INTO client_glow FROM clients WHERE user_id = test_user_id AND name = 'GlowSkin Beauty';
SELECT id INTO client_verde FROM clients WHERE user_id = test_user_id AND name = 'Verde Organic';
SELECT id INTO client_fitpro FROM clients WHERE user_id = test_user_id AND name = 'FitPro Supplements';
SELECT id INTO client_techwave FROM clients WHERE user_id = test_user_id AND name = 'TechWave Electronics';
SELECT id INTO client_nomad FROM clients WHERE user_id = test_user_id AND name = 'Nomad Travel Co.';

-- ========================================
-- 10 Deals (various statuses across pipeline)
-- ========================================
INSERT INTO deals (id, user_id, client_id, title, brand_name, platform, deal_type, amount, status, start_date, end_date, content_deadline, payment_due_date, deliverables)
VALUES
  -- Paid & Completed
  (gen_random_uuid(), test_user_id, client_glow, 'Spring Skincare Routine', 'GlowSkin Beauty', 'instagram', 'sponsored', 1500.00, 'completed', '2026-01-15', '2026-02-15', '2026-02-01', '2026-03-15',
   '[{"type": "reel", "count": 2}, {"type": "story", "count": 3}]'::jsonb),
  -- In Progress
  (gen_random_uuid(), test_user_id, client_glow, 'Summer Glow Collection', 'GlowSkin Beauty', 'instagram', 'sponsored', 2000.00, 'in_progress', '2026-03-01', '2026-04-01', '2026-03-20', '2026-04-30',
   '[{"type": "reel", "count": 3}, {"type": "post", "count": 2}]'::jsonb),
  -- Content Submitted — awaiting approval
  (gen_random_uuid(), test_user_id, client_verde, 'Organic Smoothie Challenge', 'Verde Organic', 'tiktok', 'sponsored', 1200.00, 'content_submitted', '2026-02-10', '2026-03-10', '2026-02-28', '2026-04-10',
   '[{"type": "video", "count": 4}]'::jsonb),
  -- Invoiced — waiting for payment
  (gen_random_uuid(), test_user_id, client_fitpro, 'Protein Range Review', 'FitPro Supplements', 'youtube', 'sponsored', 2500.00, 'invoiced', '2026-01-20', '2026-02-20', '2026-02-10', '2026-03-20',
   '[{"type": "video", "count": 1}, {"type": "short", "count": 2}]'::jsonb),
  -- Negotiation
  (gen_random_uuid(), test_user_id, client_techwave, 'Smart Home Setup', 'TechWave Electronics', 'youtube', 'sponsored', 1500.00, 'negotiation', NULL, NULL, NULL, NULL,
   '[{"type": "video", "count": 1}]'::jsonb),
  -- Agreed — contract signed
  (gen_random_uuid(), test_user_id, client_nomad, 'Barcelona City Guide', 'Nomad Travel Co.', 'instagram', 'sponsored', 1800.00, 'agreed', '2026-03-15', '2026-04-15', '2026-04-01', '2026-05-15',
   '[{"type": "reel", "count": 5}, {"type": "story", "count": 10}]'::jsonb),
  -- Overdue payment
  (gen_random_uuid(), test_user_id, client_fitpro, 'Pre-Workout Launch', 'FitPro Supplements', 'instagram', 'sponsored', 1800.00, 'invoiced', '2025-11-01', '2025-12-01', '2025-11-25', '2026-01-01',
   '[{"type": "reel", "count": 2}, {"type": "post", "count": 1}]'::jsonb),
  -- Barter deal
  (gen_random_uuid(), test_user_id, client_verde, 'Weekly Recipe Series', 'Verde Organic', 'tiktok', 'barter', 0, 'in_progress', '2026-02-01', '2026-05-01', '2026-04-30', NULL,
   '[{"type": "video", "count": 12}]'::jsonb),
  -- Cancelled
  (gen_random_uuid(), test_user_id, client_nomad, 'Ibiza Summer Campaign', 'Nomad Travel Co.', 'multi', 'ambassador', 3000.00, 'cancelled', NULL, NULL, NULL, NULL,
   '[{"type": "reel", "count": 10}, {"type": "story", "count": 20}]'::jsonb),
  -- UGC deal
  (gen_random_uuid(), test_user_id, client_glow, 'Product Photography Pack', 'GlowSkin Beauty', 'instagram', 'ugc', 800.00, 'content_approved', '2026-02-20', '2026-03-05', '2026-03-01', '2026-04-05',
   '[{"type": "photo", "count": 15}]'::jsonb);

-- Get deal IDs for invoices
SELECT id INTO deal_glow FROM deals WHERE user_id = test_user_id AND title = 'Spring Skincare Routine';
SELECT id INTO deal_verde FROM deals WHERE user_id = test_user_id AND title = 'Organic Smoothie Challenge';
SELECT id INTO deal_fitpro FROM deals WHERE user_id = test_user_id AND title = 'Protein Range Review';

-- ========================================
-- 3 Invoices
-- ========================================
INSERT INTO invoices (user_id, deal_id, client_id, invoice_number, subtotal, tax_rate, tax_amount, irpf_rate, irpf_amount, total, status, issue_date, due_date, paid_date)
VALUES
  -- Paid invoice
  (test_user_id, deal_glow, client_glow, 'DF-2026-001', 1500.00, 21.00, 315.00, 15.00, 225.00, 1590.00, 'paid', '2026-02-15', '2026-03-15', '2026-03-10'),
  -- Sent — awaiting payment
  (test_user_id, deal_fitpro, client_fitpro, 'DF-2026-002', 2500.00, 21.00, 525.00, 15.00, 375.00, 2650.00, 'sent', '2026-02-20', '2026-03-20', NULL),
  -- Draft
  (test_user_id, deal_verde, client_verde, 'DF-2026-003', 1200.00, 21.00, 252.00, 0, 0, 1452.00, 'draft', '2026-03-01', '2026-04-10', NULL);

END $$;
