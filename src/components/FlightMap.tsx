import React, { useMemo } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import { AircraftMarkerComponent } from './AircraftMarker';
import { AirportMarkerComponent } from './AirportMarker';
import type { LiveAircraft, EnrichedFlight } from '../types/opensky';
import type { Airport } from '../types/database';

interface FlightMapProps {
    liveAircraft: LiveAircraft[];
    enrichedFlights: Map<string, EnrichedFlight>;
    airports: Airport[];
    lastUpdated: Date | null;
    isRateLimited: boolean;
    error: string | null;
}

// Vietnam center
const MAP_CENTER: [number, number] = [16.0, 108.0];
const MAP_ZOOM = 5;

// CartoDB Dark Matter — free dark tiles
const TILE_URL = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
const TILE_ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>';

export const FlightMap: React.FC<FlightMapProps> = ({
    liveAircraft,
    enrichedFlights,
    airports,
    lastUpdated,
    isRateLimited,
    error,
}) => {
    const updatedAgo = useMemo(() => {
        if (!lastUpdated) return null;
        const seconds = Math.floor((Date.now() - lastUpdated.getTime()) / 1000);
        if (seconds < 10) return 'just now';
        if (seconds < 60) return `${seconds}s ago`;
        return `${Math.floor(seconds / 60)}m ago`;
    }, [lastUpdated, liveAircraft]); // re-compute when aircraft updates

    return (
        <div className="relative w-full h-full rounded-xl overflow-hidden border border-red-500/10">
            <MapContainer
                center={MAP_CENTER}
                zoom={MAP_ZOOM}
                className="w-full h-full"
                zoomControl={true}
                attributionControl={true}
            >
                <TileLayer url={TILE_URL} attribution={TILE_ATTRIBUTION} />

                {/* Airport markers */}
                {airports.map(airport => (
                    <AirportMarkerComponent key={airport.id} airport={airport} />
                ))}

                {/* Live aircraft markers */}
                {liveAircraft.map(aircraft => (
                    <AircraftMarkerComponent
                        key={aircraft.icao24}
                        aircraft={aircraft}
                        flightInfo={enrichedFlights.get(aircraft.callsign.trim()) || null}
                    />
                ))}
            </MapContainer>

            {/* Status overlay */}
            <div className="absolute bottom-3 left-3 z-[1000] flex items-center gap-2">
                {/* Live indicator */}
                <div className="bg-[#1a0d0e]/90 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-red-500/10 flex items-center gap-2">
                    <div className={`size-2 rounded-full ${error ? 'bg-orange-400' : 'bg-emerald-500'} ${!error ? 'animate-pulse' : ''}`} />
                    <span className="text-[10px] text-white/60">
                        {error ? 'Fallback' : 'OpenSky Live'}
                    </span>
                    {updatedAgo && (
                        <span className="text-[10px] text-white/30">
                            · {updatedAgo}
                        </span>
                    )}
                </div>

                {isRateLimited && (
                    <div className="bg-orange-500/10 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-orange-500/20">
                        <span className="text-[10px] text-orange-400">⚠ Rate Limited</span>
                    </div>
                )}
            </div>

            {/* Aircraft count overlay */}
            <div className="absolute top-3 left-3 z-[1000]">
                <div className="bg-[#1a0d0e]/90 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-red-500/10">
                    <span className="text-[10px] text-white/40">LIVE TRACKING </span>
                    <span className="text-xs font-bold text-[#db1f25]">{liveAircraft.length}</span>
                    <span className="text-[10px] text-white/40"> aircraft</span>
                </div>
            </div>
        </div>
    );
};
