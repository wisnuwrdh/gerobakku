-- Gerobakku — Supabase Schema
-- Run this in Supabase SQL Editor

-- ============================================================
-- TABLES
-- ============================================================

CREATE TABLE sellers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  phone TEXT,
  whatsapp TEXT,
  is_active BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id UUID NOT NULL REFERENCES sellers(id) ON DELETE CASCADE,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  speed DOUBLE PRECISION,
  accuracy DOUBLE PRECISION,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- INDEXES — query-optimal strategy
-- ============================================================

-- Locations: most common query is by seller_id + date range
CREATE INDEX idx_locations_seller_date
  ON locations(seller_id, created_at DESC);

-- Locations: partial index for recent data (today's data only)
-- Useful for realtime dashboard queries
CREATE INDEX idx_locations_today
  ON locations(seller_id, created_at)
  WHERE created_at >= CURRENT_DATE;

-- Sellers: fast lookup for active sellers
CREATE INDEX idx_sellers_active
  ON sellers(is_active)
  WHERE is_active = true;

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE sellers ENABLE ROW LEVEL SECURITY;
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;

-- Sellers: anyone can read, only authenticated users can insert/update
CREATE POLICY "sellers_select" ON sellers FOR SELECT USING (true);
CREATE POLICY "sellers_insert" ON sellers FOR INSERT WITH CHECK (true);
CREATE POLICY "sellers_update" ON sellers FOR UPDATE USING (true);

-- Locations: anyone can read, only authenticated users can insert
CREATE POLICY "locations_select" ON locations FOR SELECT USING (true);
CREATE POLICY "locations_insert" ON locations FOR INSERT WITH CHECK (true);

-- ============================================================
-- REALTIME
-- ============================================================

ALTER PUBLICATION supabase_realtime ADD TABLE locations;
ALTER PUBLICATION supabase_realtime ADD TABLE sellers;
