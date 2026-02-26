# Phase 01: Install Dependencies & Setup
Status: ⬜ Pending
Dependencies: None

## Objective
Install Leaflet, React-Leaflet, and configure OpenSky API environment variables.

## Implementation Steps
1. [ ] Install `leaflet`, `react-leaflet`, `@types/leaflet`
2. [ ] Add Leaflet CSS import to `index.html` or `index.css`
3. [ ] Add OpenSky env vars to `.env.example` (optional — API works anonymously)
4. [ ] Create `src/types/opensky.ts` — TypeScript types for OpenSky state vectors

## Files to Create/Modify
- `package.json` — Add leaflet dependencies
- `index.html` or `src/index.css` — Add Leaflet CSS
- `.env.example` — Add optional OpenSky credentials
- `src/types/opensky.ts` — [NEW] OpenSky API types

## Test Criteria
- [ ] `npm run dev` still works after install
- [ ] No TypeScript errors (`npm run lint`)

---
Next Phase: phase-02-opensky-hook.md
