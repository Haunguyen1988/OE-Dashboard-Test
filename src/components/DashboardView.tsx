import React from 'react';
import { Plane, Clock, AlertTriangle, TrendingUp, TrendingDown, ArrowRight } from 'lucide-react';
import { cn } from '../utils';
import { useDashboard } from '../hooks/useDashboard';
import { LoadingSpinner, ErrorMessage } from './ui/LoadingSpinner';
import type { FlightToday, AirportOtp, Alert } from '../types/database';

interface DashboardViewProps {
  onFlightClick: (flightId: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onFlightClick }) => {
  const { kpis, flights, irregularities, weatherAlerts, airportOtp, loading, error, refetch } = useDashboard();

  if (loading) return <LoadingSpinner message="Loading dashboard data..." />;
  if (error) return <ErrorMessage message={error} onRetry={refetch} />;

  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full custom-scrollbar">
      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard label="Total Flights" value={String(kpis?.total_flights ?? 0)} icon={<Plane className="size-5" />} />
        <KpiCard label="OTP %" value={`${kpis?.otp_pct ?? 0}%`} icon={<Clock className="size-5" />} trend={kpis?.otp_pct && kpis.otp_pct >= 85 ? 'up' : 'down'} />
        <KpiCard label="Avg Delay" value={`${kpis?.avg_delay_minutes ?? 0}m`} icon={<AlertTriangle className="size-5" />} />
        <KpiCard label="Delayed" value={String(kpis?.delayed_count ?? 0)} icon={<AlertTriangle className="size-5" />} critical={!!kpis?.delayed_count} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Flight List */}
        <div className="lg:col-span-2 bg-[#211112] rounded-xl border border-red-500/10 overflow-hidden shadow-sm">
          <div className="p-4 border-b border-red-500/10 flex justify-between items-center">
            <h4 className="text-sm font-bold text-white">Today's Flights</h4>
            <span className="text-[10px] text-white/40">{flights.length} flights</span>
          </div>
          <div className="overflow-y-auto max-h-96 custom-scrollbar">
            <table className="w-full text-xs">
              <thead className="bg-red-500/5 sticky top-0">
                <tr className="text-white/60 uppercase text-[10px] tracking-wider">
                  <th className="px-4 py-2 text-left">Flight</th>
                  <th className="px-4 py-2 text-left">Route</th>
                  <th className="px-4 py-2 text-center">STD</th>
                  <th className="px-4 py-2 text-center">Status</th>
                  <th className="px-4 py-2 text-center">Delay</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-red-500/5">
                {flights.map((f, i) => (
                  <tr
                    key={`${f.flight_no}-${i}`}
                    className="hover:bg-red-500/5 cursor-pointer transition-colors"
                    onClick={() => onFlightClick(f.flight_no)}
                  >
                    <td className="px-4 py-2.5 font-bold text-[#db1f25]">{f.flight_no}</td>
                    <td className="px-4 py-2.5 text-white/80">{f.departure} → {f.arrival}</td>
                    <td className="px-4 py-2.5 text-center text-white/60">{f.std?.slice(11, 16) ?? '—'}</td>
                    <td className="px-4 py-2.5 text-center">
                      <FlightStatusBadge status={f.flight_status || f.status || ''} />
                    </td>
                    <td className="px-4 py-2.5 text-center">
                      {f.delay_minutes && f.delay_minutes > 0 ? (
                        <span className="text-[#db1f25] font-bold">+{f.delay_minutes}m</span>
                      ) : (
                        <span className="text-emerald-500">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Side Panels */}
        <div className="space-y-6">
          {/* Bottom 5 Airport OTP */}
          <div className="bg-[#211112] p-4 rounded-xl border border-red-500/10">
            <h4 className="text-sm font-bold mb-4 text-white">Bottom 5 Airport OTP</h4>
            <div className="space-y-3">
              {airportOtp.slice(0, 5).map(a => (
                <AirportBar key={a.airport_code} airport={a} />
              ))}
              {airportOtp.length === 0 && <p className="text-xs text-white/40">No data yet</p>}
            </div>
          </div>

          {/* Active Alerts */}
          <div className="bg-[#211112] p-4 rounded-xl border border-red-500/10">
            <h4 className="text-sm font-bold mb-4 text-white">Active Alerts</h4>
            <div className="space-y-3">
              {irregularities.slice(0, 4).map(a => (
                <IrregularityItem key={a.id} alert={a} />
              ))}
              {irregularities.length === 0 && <p className="text-xs text-white/40">No active alerts</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Sub-components ---

const KpiCard = ({ label, value, icon, trend, critical }: { label: string; value: string; icon: React.ReactNode; trend?: 'up' | 'down'; critical?: boolean }) => (
  <div className="bg-[#211112] p-4 rounded-xl border border-red-500/10 shadow-sm">
    <div className="flex items-center justify-between mb-2">
      <span className="text-xs font-medium opacity-60 text-white uppercase tracking-wider">{label}</span>
      <div className="text-[#db1f25]">{icon}</div>
    </div>
    <h3 className={cn("text-2xl font-bold", critical ? "text-[#db1f25]" : "text-white")}>{value}</h3>
    {trend && (
      <div className={cn("flex items-center gap-1 text-[10px] mt-1", trend === 'up' ? 'text-emerald-500' : 'text-[#db1f25]')}>
        {trend === 'up' ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />}
        <span>{trend === 'up' ? 'On target' : 'Below target'}</span>
      </div>
    )}
  </div>
);

const FlightStatusBadge = ({ status }: { status: string }) => {
  const cfg: Record<string, string> = {
    AIR: 'bg-blue-500/10 text-blue-400',
    DEP: 'bg-emerald-500/10 text-emerald-500',
    ARR: 'bg-emerald-500/10 text-emerald-500',
    SCH: 'bg-white/10 text-white/60',
    CNL: 'bg-red-500/10 text-[#db1f25]',
    DLY: 'bg-orange-500/10 text-orange-400',
  };
  return (
    <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-bold", cfg[status] || cfg.SCH)}>
      {status || 'SCH'}
    </span>
  );
};

const AirportBar: React.FC<{ airport: AirportOtp }> = ({ airport }) => (
  <div>
    <div className="flex justify-between items-center mb-1">
      <span className="text-xs text-white font-medium">{airport.airport_code}{airport.airport_name ? ` — ${airport.airport_name}` : ''}</span>
      <span className={cn("text-xs font-bold", airport.otp_pct >= 85 ? "text-emerald-500" : "text-[#db1f25]")}>{airport.otp_pct}%</span>
    </div>
    <div className="w-full bg-red-500/5 rounded-full h-1.5">
      <div className={cn("h-1.5 rounded-full", airport.otp_pct >= 85 ? "bg-emerald-500" : "bg-[#db1f25]")} style={{ width: `${airport.otp_pct}%` }}></div>
    </div>
  </div>
);

const IrregularityItem: React.FC<{ alert: Alert }> = ({ alert }) => {
  const col = alert.severity === 'critical' ? 'text-[#db1f25]' : 'text-orange-400';
  return (
    <div className="flex items-start gap-2 border-l-2 border-current pl-2" style={{ borderColor: alert.severity === 'critical' ? '#db1f25' : '#f97316' }}>
      <div className="flex-1">
        <p className={cn("text-[10px] font-bold uppercase", col)}>{alert.severity}</p>
        <p className="text-xs text-white">{alert.title}</p>
      </div>
    </div>
  );
};
