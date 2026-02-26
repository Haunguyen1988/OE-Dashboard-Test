# Phase 04: Integration & Polish
Status: ⬜ Pending
Dependencies: Phase 03

## Objective
Replace the placeholder in NetworkView with FlightMap, wire up all data sources, add auto-refresh indicator, and handle edge cases.

## Implementation Steps
1. [ ] Update `src/components/NetworkView.tsx`
   - Replace placeholder div with `<FlightMap>` component
   - Pass merged data (OpenSky + Supabase) to map
   - Keep existing stats panel (Airborne, On-Time %, Active Flights, Sectors)
   - Update stats to reflect OpenSky live counts
2. [ ] Add data freshness indicator
   - "Last updated: X seconds ago" badge on map
   - Visual indicator when OpenSky API is unreachable (fallback mode)
3. [ ] Handle edge cases
   - No VJ flights visible (coverage gap) → Show message + fallback to AIMS data
   - API rate limit hit → Show warning, increase refresh interval
   - Map resize on window resize
4. [ ] CSS polish
   - Ensure map fits dashboard dark theme perfectly
   - Smooth marker transitions on position update
   - Loading skeleton while map initializes

## Files to Create/Modify
- `src/components/NetworkView.tsx` — [MODIFY] Major rewrite to integrate FlightMap
- `src/index.css` — [MODIFY] Add Leaflet dark theme overrides

## Test Criteria
- [ ] Network View shows real map instead of placeholder
- [ ] Aircraft positions update every 30s without page reload
- [ ] Stats panel still works correctly
- [ ] Fallback works when OpenSky is unreachable
- [ ] No TypeScript errors (`npm run lint`)
- [ ] Visual: map matches dashboard dark theme

---
✅ Feature Complete
