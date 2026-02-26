# Phase 02: OpenSky API Hook
Status: ⬜ Pending
Dependencies: Phase 01

## Objective
Create `useOpenSky` hook that fetches live aircraft positions from OpenSky API, filters VJ flights by callsign, and merges with Supabase flight data.

## Implementation Steps
1. [ ] Create `src/hooks/useOpenSky.ts`
   - Fetch `/states/all` with bounding box (VN + SEA region)
   - Filter states where callsign starts with "VJC" (ICAO code for Vietjet)
   - Auto-refresh every 30s with `setInterval`
   - Handle 429 rate limit errors gracefully
   - Return: `liveAircraft[]`, `loading`, `error`, `lastUpdated`
2. [ ] Create `src/lib/openSkyClient.ts`
   - Fetch function with error handling
   - Constants: bounding box for VN/SEA region
   - Helper: parse callsign → carrier_code + flight_number
3. [ ] Update `src/hooks/useNetwork.ts` — merge Supabase flights with OpenSky live positions

## Data Flow
```
OpenSky /states/all?lamin=0&lomin=95&lamax=25&lomax=120
  → Filter callsign starts with "VJC"
  → Parse: "VJC 126" → { carrier: "VJ", flight_number: 126 }
  → Match with Supabase flights (today)
  → Output: EnrichedFlight[] (flight data + live position)
```

## Files to Create/Modify
- `src/lib/openSkyClient.ts` — [NEW] API client + helpers
- `src/hooks/useOpenSky.ts` — [NEW] React hook
- `src/hooks/useNetwork.ts` — [MODIFY] Merge OpenSky + Supabase data
- `src/types/opensky.ts` — [MODIFY] Add EnrichedFlight type

## Test Criteria
- [ ] Hook returns aircraft data when API is reachable
- [ ] Graceful fallback when API returns 429 or is unreachable
- [ ] Callsign parsing correctly extracts flight number
- [ ] Only VJC flights are returned (no other airlines)

---
Next Phase: phase-03-map-component.md
