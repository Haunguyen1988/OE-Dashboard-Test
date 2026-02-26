-- ============================================================
-- OE Dashboard - New Tables Only (existing tables untouched)
-- ============================================================
-- Existing tables: flights, airports, aircraft, crew_members,
--   crew_roster, crew_flight_hours, crew_pairings,
--   crew_qualifications, aircraft_swaps, sync_logs, etl_audit_log
-- Existing views: v_flights_today, v_crew_current_status, v_ftl_warnings
-- ============================================================

-- alerts (NEW - references flights.id which is integer)
CREATE TABLE IF NOT EXISTS alerts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  severity TEXT NOT NULL CHECK (severity IN ('critical','major','minor')),
  category TEXT NOT NULL CHECK (category IN ('AOG','CREW','WX','GROUND','TECH')),
  flight_id INTEGER REFERENCES flights(id),
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active','acknowledged','resolved')),
  created_at TIMESTAMPTZ DEFAULT now(),
  resolved_at TIMESTAMPTZ
);

-- weather_reports (NEW - references airports.code)
CREATE TABLE IF NOT EXISTS weather_reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  airport_code TEXT NOT NULL,
  condition TEXT NOT NULL,
  temperature_c NUMERIC(4,1),
  wind_speed_kts INT,
  wind_gust_kts INT,
  visibility_m INT,
  humidity_pct INT,
  dew_point_c NUMERIC(4,1),
  sigmet_id TEXT,
  sigmet_type TEXT,
  sigmet_desc TEXT,
  severity TEXT DEFAULT 'info' CHECK (severity IN ('info','warning','critical')),
  valid_from TIMESTAMPTZ,
  valid_to TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ground_ops_metrics (NEW)
CREATE TABLE IF NOT EXISTS ground_ops_metrics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  airport_code TEXT NOT NULL,
  stage TEXT NOT NULL CHECK (stage IN ('CHECK-IN','SECURITY','BOARDING','LOADING','FUELING','CATERING','CLEANING')),
  avg_time_minutes NUMERIC(4,1),
  status TEXT DEFAULT 'good' CHECK (status IN ('good','warning','critical')),
  measured_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- Dashboard KPI view (using existing flights table schema)
-- ============================================================

CREATE OR REPLACE VIEW view_dashboard_kpis AS
SELECT
  COUNT(*) AS total_flights,
  COUNT(*) FILTER (WHERE delay_minutes IS NULL OR delay_minutes <= 15) AS on_time_count,
  COUNT(*) FILTER (WHERE delay_minutes > 15) AS delayed_count,
  COUNT(*) FILTER (WHERE status = 'CNL') AS cancelled_count,
  ROUND(100.0 * COUNT(*) FILTER (WHERE delay_minutes IS NULL OR delay_minutes <= 15) / NULLIF(COUNT(*), 0), 1) AS otp_pct,
  COALESCE(ROUND(AVG(delay_minutes)::NUMERIC, 0), 0) AS avg_delay_minutes
FROM flights
WHERE flight_date = CURRENT_DATE;

CREATE OR REPLACE VIEW view_airport_otp AS
SELECT
  f.departure AS airport_code,
  a.name AS airport_name,
  COUNT(*) AS total,
  ROUND(100.0 * COUNT(*) FILTER (WHERE f.delay_minutes IS NULL OR f.delay_minutes <= 15) / NULLIF(COUNT(*), 0), 1) AS otp_pct
FROM flights f
LEFT JOIN airports a ON a.code = f.departure
WHERE f.flight_date = CURRENT_DATE
GROUP BY f.departure, a.name
ORDER BY otp_pct ASC;

CREATE OR REPLACE VIEW view_fleet_summary AS
SELECT
  COUNT(*) AS total_aircraft,
  COUNT(*) AS active_count,
  0 AS maintenance_count,
  0 AS aog_count,
  0.0 AS avg_utilization,
  100.0 AS availability_pct
FROM aircraft;

-- ============================================================
-- RLS for new tables only
-- ============================================================

ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE weather_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE ground_ops_metrics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read" ON alerts FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON weather_reports FOR SELECT USING (true);
CREATE POLICY "Allow public read" ON ground_ops_metrics FOR SELECT USING (true);
CREATE POLICY "Allow anon update alerts" ON alerts FOR UPDATE USING (true) WITH CHECK (true);
