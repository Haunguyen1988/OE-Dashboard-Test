import React from 'react';
import { Plane, AlertCircle, BarChart3, Activity } from 'lucide-react';
import { cn } from '../utils';
import { useFleet } from '../hooks/useFleet';
import { LoadingSpinner, ErrorMessage } from './ui/LoadingSpinner';

export const FleetView: React.FC = () => {
  const { summary, aircraft, loading, error, refetch } = useFleet();

  if (loading) return <LoadingSpinner message="Loading fleet data..." />;
  if (error) return <ErrorMessage message={error} onRetry={refetch} />;

  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full custom-scrollbar">
      {/* KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <FleetKpi label="Total Aircraft" value={String(summary?.total_aircraft ?? aircraft.length)} />
        <FleetKpi label="Active" value={String(summary?.active_count ?? aircraft.length)} />
        <FleetKpi label="Fleet Availability" value={`${summary?.availability_pct ?? 100}%`} />
        <FleetKpi label="Aircraft Types" value={String(new Set(aircraft.map(a => a.aircraft_type)).size)} />
      </div>

      {/* Aircraft List */}
      <div className="bg-[#211112] rounded-xl border border-red-500/10 overflow-hidden shadow-sm">
        <div className="p-4 border-b border-red-500/10">
          <h4 className="text-sm font-bold flex items-center gap-2 text-white">
            <Activity className="size-4 text-[#db1f25]" />
            Aircraft Registry ({aircraft.length})
          </h4>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-red-500/5 border-b border-red-500/10 text-white/60">
              <tr>
                <th className="px-4 py-3 font-bold uppercase tracking-wider">Registration</th>
                <th className="px-4 py-3 font-bold uppercase tracking-wider">Type</th>
                <th className="px-4 py-3 font-bold uppercase tracking-wider">Serial #</th>
                <th className="px-4 py-3 font-bold uppercase tracking-wider">Country</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-red-500/10 text-white">
              {aircraft.map(a => (
                <tr key={a.registration} className="hover:bg-red-500/5 transition-colors">
                  <td className="px-4 py-3 font-bold text-[#db1f25] flex items-center gap-2">
                    <Plane className="size-4 text-emerald-500" />
                    {a.registration}
                  </td>
                  <td className="px-4 py-3 opacity-80">{a.aircraft_type}</td>
                  <td className="px-4 py-3 opacity-60">{a.serial_number || '—'}</td>
                  <td className="px-4 py-3 opacity-60">{a.country || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Fleet Composition */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#211112] p-5 rounded-xl border border-red-500/10">
          <h4 className="text-sm font-bold mb-4 flex items-center gap-2 text-white">
            <BarChart3 className="size-4 text-[#db1f25]" />
            Fleet Composition
          </h4>
          <div className="space-y-3">
            {Object.entries(
              aircraft.reduce((acc, a) => { acc[a.aircraft_type] = (acc[a.aircraft_type] || 0) + 1; return acc; }, {} as Record<string, number>)
            ).map(([type, count]) => (
              <div key={type} className="flex items-center justify-between">
                <span className="text-xs text-white">{type}</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-red-500/5 rounded-full h-1.5">
                    <div className="bg-[#db1f25] h-1.5 rounded-full" style={{ width: `${(Number(count) / aircraft.length) * 100}%` }}></div>
                  </div>
                  <span className="text-xs font-bold text-[#db1f25] w-8 text-right">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#211112] p-5 rounded-xl border border-red-500/10">
          <h4 className="text-sm font-bold mb-4 flex items-center gap-2 text-white">
            <AlertCircle className="size-4 text-[#db1f25]" />
            Summary
          </h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-white/60">Total Aircraft</span>
              <span className="text-white font-bold">{aircraft.length}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-white/60">Aircraft Types</span>
              <span className="text-white font-bold">{new Set(aircraft.map(a => a.aircraft_type)).size}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-white/60">Countries</span>
              <span className="text-white font-bold">{new Set(aircraft.filter(a => a.country).map(a => a.country)).size}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const FleetKpi = ({ label, value }: { label: string; value: string }) => (
  <div className="bg-[#211112] p-4 rounded-xl border border-red-500/10 shadow-sm">
    <p className="text-xs font-medium opacity-60 uppercase tracking-wider text-white mb-2">{label}</p>
    <h3 className="text-2xl font-bold text-white">{value}</h3>
  </div>
);
