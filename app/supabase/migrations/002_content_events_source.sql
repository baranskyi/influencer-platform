-- Add source column to distinguish manual vs deal-synced events
ALTER TABLE content_events ADD COLUMN source TEXT NOT NULL DEFAULT 'manual';

-- Index for fast lookup of deal-synced events by deal_id
CREATE INDEX idx_content_events_deal_source ON content_events(deal_id, source) WHERE source = 'deal_sync';
