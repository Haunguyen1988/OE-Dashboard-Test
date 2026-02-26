# Changelog

## [2026-02-25] - Supabase Backend Integration

### Added
- Supabase client setup (`src/lib/supabaseClient.ts`)
- TypeScript types for all database tables (`src/types/database.ts`)
- 7 custom hooks with real-time subscriptions:
  - `useDashboard`, `useFlightDetail`, `useFleet`, `useNetwork`
  - `useAlerts`, `useWeather`, `useGroundOps`
- Loading/Error UI components (`src/components/ui/LoadingSpinner.tsx`)
- SQL migration for 3 new tables: `alerts`, `weather_reports`, `ground_ops_metrics`
- SQL views: `view_dashboard_kpis`, `view_airport_otp`, `view_fleet_summary`
- Seed data for new tables
- `.brain/` knowledge directory

### Changed
- All 7 view components now read from Supabase instead of hardcoded mock data
- DashboardView uses `v_flights_today` existing view
- FlightDetailView parses `carrier_code + flight_number` format

### Fixed
- Schema conflict: `flights.id` is INTEGER (not TEXT) — rewrote all references
- Schema conflict: `airports` has no `city` column — use `name` instead
- SQL type mismatch: `flight_date` is DATE — use `CURRENT_DATE` not `CURRENT_DATE::TEXT`
- TypeScript: `import.meta.env` cast for Vite compatibility
- TypeScript: `Object.values()` type inference with explicit `Record<>` typing
