-- Add customizable deal status pipeline config to profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS deal_status_config JSONB;
