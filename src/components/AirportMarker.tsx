import React from 'react';
import { CircleMarker, Tooltip } from 'react-leaflet';
import type { Airport } from '../types/database';

interface AirportMarkerProps {
    airport: Airport;
}

export const AirportMarkerComponent: React.FC<AirportMarkerProps> = ({ airport }) => {
    if (airport.latitude === null || airport.longitude === null) return null;

    return (
        <CircleMarker
            center={[airport.latitude, airport.longitude]}
            radius={5}
            pathOptions={{
                fillColor: 'rgba(219, 31, 37, 0.3)',
                fillOpacity: 0.6,
                color: 'rgba(219, 31, 37, 0.5)',
                weight: 1,
            }}
        >
            <Tooltip
                direction="top"
                offset={[0, -6]}
                permanent={false}
                className="airport-tooltip"
            >
                <div style={{
                    background: '#2d1617',
                    color: 'white',
                    padding: '4px 8px',
                    borderRadius: 6,
                    border: '1px solid rgba(239, 68, 68, 0.2)',
                    fontSize: 11,
                }}>
                    <span style={{ color: '#db1f25', fontWeight: 'bold' }}>{airport.code}</span>
                    {airport.name && (
                        <span style={{ color: 'rgba(255,255,255,0.6)', marginLeft: 6 }}>
                            {airport.name}
                        </span>
                    )}
                </div>
            </Tooltip>
        </CircleMarker>
    );
};
