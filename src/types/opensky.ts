// ============================================================
// OpenSky Network API types
// Docs: https://openskynetwork.github.io/opensky-api/rest.html
// ============================================================

/**
 * Raw state vector array from OpenSky `/states/all` response.
 * Each state is a tuple of 17 fields in fixed order.
 */
export type OpenSkyStateVector = [
    string,        // 0  icao24
    string | null, // 1  callsign
    string,        // 2  origin_country
    number | null, // 3  time_position
    number,        // 4  last_contact
    number | null, // 5  longitude
    number | null, // 6  latitude
    number | null, // 7  baro_altitude
    boolean,       // 8  on_ground
    number | null, // 9  velocity (m/s)
    number | null, // 10 true_track (degrees)
    number | null, // 11 vertical_rate (m/s)
    number[] | null, // 12 sensors
    number | null, // 13 geo_altitude
    string | null, // 14 squawk
    boolean,       // 15 spi
    number,        // 16 position_source
];

/** Response from GET /states/all */
export interface OpenSkyResponse {
    time: number;
    states: OpenSkyStateVector[] | null;
}

/** Parsed, typed live aircraft data from a state vector */
export interface LiveAircraft {
    icao24: string;
    callsign: string;
    originCountry: string;
    latitude: number;
    longitude: number;
    baroAltitude: number | null;
    geoAltitude: number | null;
    onGround: boolean;
    velocity: number | null;       // m/s
    trueTrack: number | null;      // degrees from north
    verticalRate: number | null;   // m/s
    squawk: string | null;
    lastContact: number;
    // Parsed from callsign
    carrierCode: string;           // "VJ"
    flightNumber: number | null;   // 126
}

/** Flight from Supabase enriched with live OpenSky position */
export interface EnrichedFlight {
    // From Supabase
    id: number;
    flightDate: string;
    carrierCode: string;
    flightNumber: number;
    departure: string;
    arrival: string;
    std: string | null;
    sta: string | null;
    status: string | null;
    delayMinutes: number | null;
    aircraftReg: string | null;
    aircraftType: string | null;
    // From OpenSky (null if no live data)
    latitude: number | null;
    longitude: number | null;
    altitude: number | null;
    velocity: number | null;
    heading: number | null;
    verticalRate: number | null;
    onGround: boolean | null;
    isLive: boolean;               // true if OpenSky data available
}

/** Bounding box for API queries */
export interface BoundingBox {
    lamin: number;  // min latitude
    lamax: number;  // max latitude
    lomin: number;  // min longitude
    lomax: number;  // max longitude
}
