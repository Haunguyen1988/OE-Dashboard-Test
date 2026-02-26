// ============================================================
// TypeScript types mapped from ACTUAL Supabase schema
// ============================================================

// --- EXISTING TABLES (from AIMS sync) ---

export interface Flight {
    id: number;
    flight_date: string;
    carrier_code: string;
    flight_number: number;
    leg_code: string | null;
    departure: string;
    arrival: string;
    std: string | null;
    sta: string | null;
    etd: string | null;
    eta: string | null;
    atd: string | null;
    ata: string | null;
    takeoff_time: string | null;
    landing_time: string | null;
    aircraft_reg: string | null;
    aircraft_type: string | null;
    status: string | null;
    delay_code: string | null;
    delay_minutes: number | null;
    block_time: number | null;
    flight_time: number | null;
    pax_count: number | null;
    source: string | null;
    created_at: string;
    updated_at: string;
}

export interface Airport {
    id: number;
    code: string;
    name: string;
    country_code: string | null;
    latitude: number | null;
    longitude: number | null;
    altitude: number | null;
    runway_length: number | null;
    created_at: string;
    updated_at: string;
}

export interface Aircraft {
    id: number;
    registration: string;
    aircraft_type: string;
    serial_number: string | null;
    country: string | null;
    use_pounds: boolean;
    created_at: string;
    updated_at: string;
}

export interface CrewMember {
    id: number;
    crew_id: string;
    crew_name: string;
    first_name: string | null;
    last_name: string | null;
    three_letter_code: string | null;
    gender: string | null;
    base: string | null;
    email: string | null;
    cell_phone: string | null;
    employment_begin: string | null;
    source: string | null;
    created_at: string;
    updated_at: string;
}

// --- Existing views ---

export interface FlightToday {
    flight_date: string;
    flight_no: string;
    departure: string;
    arrival: string;
    std: string | null;
    sta: string | null;
    atd: string | null;
    ata: string | null;
    aircraft_reg: string | null;
    status: string | null;
    delay_minutes: number | null;
    flight_status: string | null;
}

// --- NEW TABLES (created by our migration) ---

export interface Alert {
    id: string;
    severity: 'critical' | 'major' | 'minor';
    category: 'AOG' | 'CREW' | 'WX' | 'GROUND' | 'TECH';
    flight_id: number | null;
    title: string;
    description: string | null;
    status: 'active' | 'acknowledged' | 'resolved';
    created_at: string;
    resolved_at: string | null;
}

export interface WeatherReport {
    id: string;
    airport_code: string;
    condition: string;
    temperature_c: number | null;
    wind_speed_kts: number | null;
    wind_gust_kts: number | null;
    visibility_m: number | null;
    humidity_pct: number | null;
    dew_point_c: number | null;
    sigmet_id: string | null;
    sigmet_type: string | null;
    sigmet_desc: string | null;
    severity: 'info' | 'warning' | 'critical';
    valid_from: string | null;
    valid_to: string | null;
    created_at: string;
}

export interface GroundOpsMetric {
    id: string;
    airport_code: string;
    stage: 'CHECK-IN' | 'SECURITY' | 'BOARDING' | 'LOADING' | 'FUELING' | 'CATERING' | 'CLEANING';
    avg_time_minutes: number;
    status: 'good' | 'warning' | 'critical';
    measured_at: string;
}

// --- Computed KPI types (from SQL views) ---

export interface DashboardKpis {
    total_flights: number;
    on_time_count: number;
    delayed_count: number;
    cancelled_count: number;
    otp_pct: number;
    avg_delay_minutes: number;
}

export interface AirportOtp {
    airport_code: string;
    airport_name: string;
    total: number;
    otp_pct: number;
}

export interface FleetSummary {
    total_aircraft: number;
    active_count: number;
    maintenance_count: number;
    aog_count: number;
    avg_utilization: number;
    availability_pct: number;
}
