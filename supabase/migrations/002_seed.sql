-- ============================================================
-- OE Dashboard - Seed Data for NEW tables only
-- (flights, airports, aircraft already have real data from AIMS)
-- ============================================================

-- Weather Reports (seed for demo)
INSERT INTO weather_reports (airport_code, condition, temperature_c, wind_speed_kts, wind_gust_kts, visibility_m, humidity_pct, dew_point_c, severity, valid_from, valid_to) VALUES
  ('SGN', 'Thunderstorm', 28, 18, 24, 800, 92, 24, 'critical', now(), now() + interval '4 hours'),
  ('HAN', 'Heavy Rain', 22, 12, 18, 2000, 88, 19, 'warning', now(), now() + interval '2 hours'),
  ('DAD', 'Partly Cloudy', 26, 8, 12, 9999, 65, 18, 'info', now(), now() + interval '6 hours'),
  ('CXR', 'Clear', 30, 6, 10, 9999, 55, 20, 'info', now(), now() + interval '8 hours'),
  ('PQC', 'Scattered Clouds', 29, 10, 14, 8000, 70, 22, 'info', now(), now() + interval '6 hours');

-- Weather SIGMET entries
INSERT INTO weather_reports (airport_code, condition, temperature_c, wind_speed_kts, visibility_m, humidity_pct, sigmet_id, sigmet_type, sigmet_desc, severity, valid_from, valid_to) VALUES
  ('SGN', 'SIGMET Active', 28, 18, 800, 92, 'SIGMET 04', 'TS', 'Severe turbulence expected FL280-FL350', 'critical', now(), now() + interval '3 hours'),
  ('HAN', 'SIGMET Active', 22, 12, 2000, 88, 'SIGMET 02', 'ICE', 'Moderate icing reported', 'warning', now(), now() + interval '4 hours');

-- Alerts (some referencing NULL flight, no FK needed for seed)
INSERT INTO alerts (severity, category, flight_id, title, description, status) VALUES
  ('critical', 'AOG', NULL, 'AOG - Engine #1 Vibration Alert', 'Aircraft showing abnormal vibration readings. Maintenance team dispatched.', 'active'),
  ('major', 'CREW', NULL, 'Missing 2 Cabin Crew Members', 'Crew scheduling conflict at HAN. Standby crew notified but not confirmed.', 'active'),
  ('minor', 'WX', NULL, 'Low Visibility Procedures (LVP) Imminent', 'Expected fog at DAD starting 22:00 UTC. RVR monitoring required.', 'active'),
  ('critical', 'TECH', NULL, 'Technical Issue - APU Fault', 'APU fault reported after arrival at HAN. Engineering team assessing.', 'acknowledged'),
  ('major', 'GROUND', NULL, 'Gate Conflict at SGN Terminal B', 'Gate B05 double-booked. Reassignment in progress.', 'resolved');

-- Ground Ops Metrics
INSERT INTO ground_ops_metrics (airport_code, stage, avg_time_minutes, status) VALUES
  ('SGN', 'CHECK-IN', 2, 'good'), ('SGN', 'SECURITY', 4, 'good'), ('SGN', 'BOARDING', 18, 'critical'),
  ('SGN', 'LOADING', 12, 'warning'), ('SGN', 'FUELING', 3, 'good'), ('SGN', 'CATERING', 6, 'warning'), ('SGN', 'CLEANING', 4, 'good'),
  ('HAN', 'CHECK-IN', 4, 'good'), ('HAN', 'SECURITY', 3, 'good'), ('HAN', 'BOARDING', 14, 'warning'),
  ('HAN', 'LOADING', 9, 'warning'), ('HAN', 'FUELING', 5, 'warning'), ('HAN', 'CATERING', 11, 'warning'), ('HAN', 'CLEANING', 7, 'warning'),
  ('DAD', 'CHECK-IN', 1, 'good'), ('DAD', 'SECURITY', 2, 'good'), ('DAD', 'BOARDING', 8, 'warning'),
  ('DAD', 'LOADING', 16, 'critical'), ('DAD', 'FUELING', 4, 'good'), ('DAD', 'CATERING', 3, 'good'), ('DAD', 'CLEANING', 2, 'good'),
  ('CXR', 'CHECK-IN', 3, 'good'), ('CXR', 'SECURITY', 3, 'good'), ('CXR', 'BOARDING', 10, 'warning'),
  ('CXR', 'LOADING', 7, 'warning'), ('CXR', 'FUELING', 4, 'good'), ('CXR', 'CATERING', 5, 'good'), ('CXR', 'CLEANING', 3, 'good'),
  ('PQC', 'CHECK-IN', 2, 'good'), ('PQC', 'SECURITY', 2, 'good'), ('PQC', 'BOARDING', 7, 'warning'),
  ('PQC', 'LOADING', 8, 'warning'), ('PQC', 'FUELING', 3, 'good'), ('PQC', 'CATERING', 4, 'good'), ('PQC', 'CLEANING', 2, 'good');
