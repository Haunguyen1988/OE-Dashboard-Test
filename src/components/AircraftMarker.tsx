import React, { useMemo } from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import type { LiveAircraft, EnrichedFlight } from '../types/opensky';
import { msToKnots, metersToFeet } from '../lib/openSkyClient';

interface AircraftMarkerProps {
    aircraft: LiveAircraft;
    flightInfo?: EnrichedFlight | null;
}

function createPlaneIcon(heading: number | null, onGround: boolean): L.DivIcon {
    const rotation = heading ?? 0;
    const fill = onGround ? '#6b7280' : '#f59e0b';
    const stroke = onGround ? '#4b5563' : '#d97706';
    const shadow = onGround
        ? 'none'
        : 'drop-shadow(0 0 6px rgba(245, 158, 11, 0.7))';

    // FlightRadar24-style sleek airplane silhouette (top-down view)
    return L.divIcon({
        className: '',
        html: `<div style="
            transform: rotate(${rotation}deg);
            transition: transform 1.5s ease;
            filter: ${shadow};
            line-height: 0;
            cursor: pointer;
        ">
            <svg width="22" height="22" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                <path d="
                    M16 1
                    L14.5 4
                    L14.5 11
                    L3 18
                    L3 20
                    L14.5 16.5
                    L14.5 25
                    L11 27.5
                    L11 29
                    L16 27.5
                    L21 29
                    L21 27.5
                    L17.5 25
                    L17.5 16.5
                    L29 20
                    L29 18
                    L17.5 11
                    L17.5 4
                    Z
                " fill="${fill}" stroke="${stroke}" stroke-width="0.5" stroke-linejoin="round"/>
            </svg>
        </div>`,
        iconSize: [22, 22],
        iconAnchor: [11, 11],
        popupAnchor: [0, -11],
    });
}

export const AircraftMarkerComponent: React.FC<AircraftMarkerProps> = ({ aircraft, flightInfo }) => {
    const icon = useMemo(
        () => createPlaneIcon(aircraft.trueTrack, aircraft.onGround),
        [aircraft.trueTrack, aircraft.onGround]
    );

    const speedKts = msToKnots(aircraft.velocity);
    const altFt = metersToFeet(aircraft.baroAltitude);
    const flightLabel = flightInfo
        ? `${flightInfo.carrierCode}${flightInfo.flightNumber}`
        : aircraft.callsign;
    const route = flightInfo
        ? `${flightInfo.departure} → ${flightInfo.arrival}`
        : '';
    const vertDir = aircraft.verticalRate !== null
        ? aircraft.verticalRate > 0.5 ? '↑ Climbing' : aircraft.verticalRate < -0.5 ? '↓ Descending' : '→ Level'
        : '';

    return (
        <Marker position={[aircraft.latitude, aircraft.longitude]} icon={icon}>
            <Popup>
                <div style={{ minWidth: 160, fontFamily: 'inherit' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                        <span style={{ fontSize: 16, fontWeight: 'bold', color: '#db1f25' }}>
                            {flightLabel}
                        </span>
                        <span style={{
                            fontSize: 10,
                            padding: '2px 6px',
                            borderRadius: 4,
                            background: aircraft.onGround ? '#374151' : 'rgba(219, 31, 37, 0.2)',
                            color: aircraft.onGround ? '#9ca3af' : '#db1f25',
                            fontWeight: 'bold',
                        }}>
                            {aircraft.onGround ? 'GND' : 'AIR'}
                        </span>
                    </div>

                    {route && (
                        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', marginBottom: 6 }}>
                            ✈ {route}
                        </div>
                    )}

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px 12px', fontSize: 11 }}>
                        {altFt !== null && (
                            <>
                                <span style={{ color: 'rgba(255,255,255,0.4)' }}>Altitude</span>
                                <span style={{ color: 'white', fontWeight: 600 }}>{altFt.toLocaleString()} ft</span>
                            </>
                        )}
                        {speedKts !== null && (
                            <>
                                <span style={{ color: 'rgba(255,255,255,0.4)' }}>Speed</span>
                                <span style={{ color: 'white', fontWeight: 600 }}>{speedKts} kts</span>
                            </>
                        )}
                        {vertDir && (
                            <>
                                <span style={{ color: 'rgba(255,255,255,0.4)' }}>V/S</span>
                                <span style={{ color: 'white', fontWeight: 600 }}>{vertDir}</span>
                            </>
                        )}
                        {flightInfo?.aircraftReg && (
                            <>
                                <span style={{ color: 'rgba(255,255,255,0.4)' }}>Reg</span>
                                <span style={{ color: 'white', fontWeight: 600 }}>{flightInfo.aircraftReg}</span>
                            </>
                        )}
                        {flightInfo?.status && (
                            <>
                                <span style={{ color: 'rgba(255,255,255,0.4)' }}>Status</span>
                                <span style={{
                                    fontWeight: 600,
                                    color: (flightInfo.delayMinutes ?? 0) > 15 ? '#f59e0b' : '#10b981'
                                }}>
                                    {flightInfo.status}
                                    {(flightInfo.delayMinutes ?? 0) > 0 && ` (+${flightInfo.delayMinutes}m)`}
                                </span>
                            </>
                        )}
                    </div>
                </div>
            </Popup>
        </Marker>
    );
};
