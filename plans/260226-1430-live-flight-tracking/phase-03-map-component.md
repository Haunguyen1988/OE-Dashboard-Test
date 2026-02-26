# Phase 03: Interactive Map Component
Status: ⬜ Pending
Dependencies: Phase 02

## Objective
Build a Leaflet map component that replaces the Placeholder in NetworkView. Display airport markers and live aircraft with rotation, popups, and dark theme.

## Implementation Steps
1. [ ] Create `src/components/FlightMap.tsx`
   - Leaflet MapContainer centered on Vietnam (16°N, 108°E, zoom 5)
   - CartoDB Dark Matter tile layer (matches dashboard theme)
   - Aircraft markers: custom SVG icon rotated by `true_track`
   - Airport markers: circle markers from Supabase `airports` table
   - Aircraft popup: flight number, route, altitude, speed, status
2. [ ] Create `src/components/AircraftMarker.tsx`
   - Custom Leaflet marker with rotated plane icon
   - Color by status: airborne (red VJ), on_ground (gray)
   - Popup with enriched flight data
3. [ ] Create `src/components/AirportMarker.tsx`
   - Circle marker for each VJ airport
   - Tooltip with airport name + code
4. [ ] Create `src/hooks/useAirports.ts`
   - Fetch airports from Supabase for map markers

## Files to Create/Modify
- `src/components/FlightMap.tsx` — [NEW] Main map component
- `src/components/AircraftMarker.tsx` — [NEW] Aircraft marker
- `src/components/AirportMarker.tsx` — [NEW] Airport marker
- `src/hooks/useAirports.ts` — [NEW] Airports data hook

## Test Criteria
- [ ] Map renders with dark tiles in the Network View area
- [ ] Airport markers visible at correct positions
- [ ] Aircraft markers show at correct lat/lon from OpenSky
- [ ] Plane icons rotate according to heading
- [ ] Click popup shows flight info

---
Next Phase: phase-04-integration.md
