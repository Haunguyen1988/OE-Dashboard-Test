import type { OpenSkyResponse, OpenSkyStateVector, LiveAircraft, BoundingBox } from '../types/opensky';

// Vietnam + Southeast Asia bounding box
export const SEA_BOUNDING_BOX: BoundingBox = {
    lamin: 0,     // Southern boundary (equator)
    lamax: 25,    // Northern boundary (north Vietnam)
    lomin: 95,    // Western boundary (Myanmar)
    lomax: 125,   // Eastern boundary (Philippines)
};

const OPENSKY_API = 'https://opensky-network.org/api';

/**
 * Fetch live state vectors from OpenSky Network API.
 * Filters by bounding box to reduce data and save API credits.
 */
export async function fetchLiveStates(bbox: BoundingBox = SEA_BOUNDING_BOX): Promise<LiveAircraft[]> {
    const url = new URL(`${OPENSKY_API}/states/all`);
    url.searchParams.set('lamin', String(bbox.lamin));
    url.searchParams.set('lamax', String(bbox.lamax));
    url.searchParams.set('lomin', String(bbox.lomin));
    url.searchParams.set('lomax', String(bbox.lomax));

    const response = await fetch(url.toString());

    if (response.status === 429) {
        const retryAfter = response.headers.get('X-Rate-Limit-Retry-After-Seconds');
        throw new Error(`Rate limited. Retry after ${retryAfter || '?'}s`);
    }

    if (!response.ok) {
        throw new Error(`OpenSky API error: ${response.status} ${response.statusText}`);
    }

    const data: OpenSkyResponse = await response.json();

    if (!data.states) return [];

    // Filter for VJC (Vietjet Air ICAO code) callsigns and parse
    return data.states
        .filter(state => {
            const callsign = state[1]?.trim() || '';
            return callsign.startsWith('VJC');
        })
        .map(parseStateVector)
        .filter((a): a is LiveAircraft => a !== null);
}

/**
 * Parse a raw state vector array into a typed LiveAircraft object.
 * Returns null if essential fields (lat/lon) are missing.
 */
function parseStateVector(state: OpenSkyStateVector): LiveAircraft | null {
    const latitude = state[6];
    const longitude = state[5];

    // Skip if no position data
    if (latitude === null || longitude === null) return null;

    const callsign = (state[1] || '').trim();
    const parsed = parseCallsign(callsign);

    return {
        icao24: state[0],
        callsign,
        originCountry: state[2],
        latitude,
        longitude,
        baroAltitude: state[7],
        geoAltitude: state[13],
        onGround: state[8],
        velocity: state[9],
        trueTrack: state[10],
        verticalRate: state[11],
        squawk: state[14],
        lastContact: state[4],
        carrierCode: parsed.carrierCode,
        flightNumber: parsed.flightNumber,
    };
}

/**
 * Parse OpenSky callsign to carrier code and flight number.
 * OpenSky uses ICAO callsigns: "VJC 126 " → { carrierCode: "VJ", flightNumber: 126 }
 * ICAO code "VJC" maps to IATA code "VJ" (Vietjet Air)
 */
export function parseCallsign(callsign: string): { carrierCode: string; flightNumber: number | null } {
    const trimmed = callsign.trim();

    // Match pattern: VJC followed by digits (with optional spaces)
    const match = trimmed.match(/^VJC\s*(\d+)/);
    if (match) {
        return {
            carrierCode: 'VJ',
            flightNumber: parseInt(match[1], 10),
        };
    }

    return { carrierCode: '', flightNumber: null };
}

/**
 * Convert meters/second to knots.
 */
export function msToKnots(ms: number | null): number | null {
    if (ms === null) return null;
    return Math.round(ms * 1.94384);
}

/**
 * Convert meters to flight level (e.g., 10668m → FL350).
 */
export function metersToFlightLevel(meters: number | null): string | null {
    if (meters === null) return null;
    const fl = Math.round(meters / 30.48); // meters to feet / 100
    return `FL${Math.round(fl / 100) * 100 / 100}`;
}

/**
 * Convert meters to feet.
 */
export function metersToFeet(meters: number | null): number | null {
    if (meters === null) return null;
    return Math.round(meters * 3.28084);
}
