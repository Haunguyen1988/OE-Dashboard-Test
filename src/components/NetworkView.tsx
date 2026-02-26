import React, { useMemo } from 'react';
import { Globe, Plane, Clock, Activity, Wifi, WifiOff } from 'lucide-react';
import { cn } from '../utils';
import { useNetwork } from '../hooks/useNetwork';
import { useOpenSky } from '../hooks/useOpenSky';
import { useAirports } from '../hooks/useAirports';
import { FlightMap } from './FlightMap';
import { LoadingSpinner, ErrorMessage } from './ui/LoadingSpinner';
import type { EnrichedFlight } from '../types/opensky';

export const NetworkView: React.FC = () => {
  const { activeFlights, airborneCount, onTimePct, loading, error, refetch } = useNetwork();
  const { liveAircraft, loading: osLoading, error: osError, lastUpdated, isRateLimited } = useOpenSky();
  const { airports } = useAirports();

  // Build enriched flights map: callsign → EnrichedFlight
  const enrichedFlights = useMemo(() => {
    const map = new Map<string, EnrichedFlight>();
    activeFlights.forEach(f => {
      // Build the ICAO-style callsign: VJ→VJC, pad flight number
      const callsign = `VJC${f.flight_number}`;
      map.set(callsign, {
        id: f.id,
        flightDate: f.flight_date,
        carrierCode: f.carrier_code,
        flightNumber: f.flight_number,
        departure: f.departure,
        arrival: f.arrival,
        std: f.std,
        sta: f.sta,
        status: f.status,
        delayMinutes: f.delay_minutes,
        aircraftReg: f.aircraft_reg,
        aircraftType: f.aircraft_type,
        latitude: null,
        longitude: null,
        altitude: null,
        velocity: null,
        heading: null,
        verticalRate: null,
        onGround: null,
        isLive: false,
      });
    });
    return map;
  }, [activeFlights]);

  if (loading) return <LoadingSpinner message="Loading network..." />;
  if (error) return <ErrorMessage message={error} onRetry={refetch} />;

  // Build sectors from flight data
  const sectorMap: Record<string, { route: string; count: number }> = {};
  activeFlights.forEach(f => {
    const key = `${f.departure}-${f.arrival}`;
    if (!sectorMap[key]) sectorMap[key] = { route: `${f.departure} → ${f.arrival}`, count: 0 };
    sectorMap[key].count++;
  });
  const sectors = Object.values(sectorMap);

  // Combine airborne counts: prefer OpenSky live count if available
  const liveAirborne = liveAircraft.filter(a => !a.onGround).length;
  const displayAirborne = liveAircraft.length > 0 ? liveAirborne : airborneCount;

  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full custom-scrollbar">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Network Map — now with real Leaflet map */}
        <div className="lg:col-span-3 relative">
          <div className="h-[500px]">
            <FlightMap
              liveAircraft={liveAircraft}
              enrichedFlights={enrichedFlights}
              airports={airports}
              lastUpdated={lastUpdated}
              isRateLimited={isRateLimited}
              error={osError}
            />
          </div>
        </div>

        {/* Stats Panel */}
        <div className="space-y-4">
          <NetworkStat
            icon={<Plane className="size-4" />}
            label="Airborne"
            value={String(displayAirborne)}
            color="text-[#db1f25]"
            badge={liveAircraft.length > 0 ? 'LIVE' : undefined}
          />
          <NetworkStat icon={<Clock className="size-4" />} label="On-Time %" value={`${onTimePct}%`} color="text-emerald-500" />
          <NetworkStat icon={<Activity className="size-4" />} label="Active Flights" value={String(activeFlights.length)} color="text-white" />
          <NetworkStat icon={<Globe className="size-4" />} label="Active Sectors" value={String(sectors.length)} color="text-orange-400" />

          {/* OpenSky Connection Status */}
          <div className="bg-[#211112] p-4 rounded-xl border border-red-500/10 flex items-center gap-3">
            <div className={cn("size-10 rounded-lg bg-red-500/5 flex items-center justify-center",
              osError ? 'text-orange-400' : 'text-emerald-500'
            )}>
              {osError ? <WifiOff className="size-4" /> : <Wifi className="size-4" />}
            </div>
            <div>
              <p className="text-[10px] text-white/40 uppercase tracking-wider">OpenSky</p>
              <p className={cn("text-xs font-bold", osError ? 'text-orange-400' : 'text-emerald-500')}>
                {osLoading ? 'Connecting...' : osError ? 'Fallback' : `${liveAircraft.length} tracked`}
              </p>
            </div>
          </div>

          <div className="bg-[#211112] p-4 rounded-xl border border-red-500/10">
            <h4 className="text-xs font-bold uppercase text-white/60 mb-3">Top Sectors</h4>
            <div className="space-y-2">
              {sectors.sort((a, b) => b.count - a.count).slice(0, 6).map(s => (
                <div key={s.route} className="flex items-center justify-between text-xs">
                  <span className="text-white">{s.route}</span>
                  <span className="text-[10px] font-bold text-[#db1f25]">{s.count} flt{s.count > 1 ? 's' : ''}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#211112] p-4 rounded-xl border border-red-500/10">
            <h4 className="text-xs font-bold uppercase text-white/60 mb-3">Flight Tracker</h4>
            <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
              {activeFlights.slice(0, 8).map(f => {
                const isTracked = liveAircraft.some(a => {
                  const cs = a.callsign.trim();
                  return cs === `VJC${f.flight_number}`;
                });
                return (
                  <div key={f.id} className="flex items-center gap-2 text-xs">
                    <Plane className={cn("size-3", (f.status === 'AIR' || f.status === 'DEP') ? 'text-[#db1f25]' : 'text-white/40')} />
                    <span className="font-bold text-[#db1f25]">{f.carrier_code}{f.flight_number}</span>
                    <span className="text-white/60">{f.departure}→{f.arrival}</span>
                    {isTracked && (
                      <span className="text-[8px] text-emerald-500 font-bold">●</span>
                    )}
                    <span className={cn(
                      "ml-auto text-[10px] font-bold",
                      (f.delay_minutes ?? 0) > 15 ? 'text-orange-400' : 'text-emerald-500'
                    )}>
                      {f.status || 'SCH'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const NetworkStat = ({
  icon, label, value, color, badge
}: {
  icon: React.ReactNode; label: string; value: string; color: string; badge?: string;
}) => (
  <div className="bg-[#211112] p-4 rounded-xl border border-red-500/10 flex items-center gap-3">
    <div className={cn("size-10 rounded-lg bg-red-500/5 flex items-center justify-center", color)}>
      {icon}
    </div>
    <div className="flex-1">
      <p className="text-[10px] text-white/40 uppercase tracking-wider">{label}</p>
      <div className="flex items-center gap-2">
        <p className={cn("text-lg font-bold", color)}>{value}</p>
        {badge && (
          <span className="text-[8px] font-bold text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded animate-pulse">
            {badge}
          </span>
        )}
      </div>
    </div>
  </div>
);
