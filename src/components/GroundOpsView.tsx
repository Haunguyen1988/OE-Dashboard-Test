import React from 'react';
import { Filter, Clock, AlertTriangle } from 'lucide-react';
import { cn } from '../utils';
import { useGroundOps } from '../hooks/useGroundOps';
import { LoadingSpinner, ErrorMessage } from './ui/LoadingSpinner';

export const GroundOpsView: React.FC = () => {
  const { metrics, airports, stages, loading, error, refetch } = useGroundOps();

  if (loading) return <LoadingSpinner message="Loading ground ops..." />;
  if (error) return <ErrorMessage message={error} onRetry={refetch} />;

  const getMetric = (airport: string, stage: string) =>
    metrics.find(m => m.airport_code === airport && m.stage === stage);

  const statusColor: Record<string, string> = {
    good: 'bg-emerald-500/10 text-emerald-500',
    warning: 'bg-orange-500/10 text-orange-500',
    critical: 'bg-red-500/10 text-[#db1f25]',
  };

  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full custom-scrollbar">
      <div className="flex gap-4 items-center bg-[#2d1617] p-4 rounded-xl border border-red-500/10">
        <div className="flex items-center gap-2.5 text-xs font-medium text-white">
          <Filter className="size-4 text-[#db1f25]" />
          <select className="bg-transparent border border-red-500/20 rounded-md px-2 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-red-500">
            <option>All Airports</option>
            {airports.map(a => <option key={a}>{a}</option>)}
          </select>
          <select className="bg-transparent border border-red-500/20 rounded-md px-2 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-red-500">
            <option>All Stages</option>
          </select>
        </div>
        <div className="ml-auto flex items-center gap-4 text-[10px] font-bold text-white/60">
          <span>Legend:</span>
          <span className="flex items-center gap-1"><span className="size-2 rounded-full bg-emerald-500"></span> &lt;5m</span>
          <span className="flex items-center gap-1"><span className="size-2 rounded-full bg-orange-400"></span> 5-15m</span>
          <span className="flex items-center gap-1"><span className="size-2 rounded-full bg-[#db1f25]"></span> &gt;15m</span>
        </div>
      </div>

      <div className="bg-[#211112] rounded-xl border border-red-500/10 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-red-500/5 border-b border-red-500/10">
              <tr>
                <th className="px-4 py-3 text-left font-bold text-white/60 uppercase tracking-wider">Airport</th>
                {stages.map(s => (
                  <th key={s} className="px-3 py-3 text-center font-bold text-white/60 uppercase tracking-wider">{s}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-red-500/10">
              {airports.map(airport => (
                <tr key={airport} className="hover:bg-red-500/5 transition-colors">
                  <td className="px-4 py-3 font-bold text-[#db1f25]">{airport}</td>
                  {stages.map(stage => {
                    const m = getMetric(airport, stage);
                    return (
                      <td key={stage} className="px-3 py-3 text-center">
                        {m ? (
                          <span className={cn("px-2 py-1 rounded-md text-[10px] font-bold", statusColor[m.status])}>
                            {m.avg_time_minutes}m
                          </span>
                        ) : (
                          <span className="text-white/20">—</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#211112] p-5 rounded-xl border border-red-500/10">
          <h4 className="text-sm font-bold mb-4 flex items-center gap-2 text-white">
            <AlertTriangle className="size-4 text-[#db1f25]" />
            Top Delay Stages
          </h4>
          <div className="space-y-3">
            {metrics
              .filter(m => m.status === 'critical')
              .sort((a, b) => b.avg_time_minutes - a.avg_time_minutes)
              .slice(0, 5)
              .map(m => (
                <div key={`${m.airport_code}-${m.stage}`} className="flex items-center justify-between">
                  <span className="text-xs text-white">{m.airport_code} — {m.stage}</span>
                  <span className="text-xs font-bold text-[#db1f25]">{m.avg_time_minutes}m</span>
                </div>
              ))}
          </div>
        </div>

        <div className="bg-[#211112] p-5 rounded-xl border border-red-500/10">
          <h4 className="text-sm font-bold mb-4 flex items-center gap-2 text-white">
            <Clock className="size-4 text-[#db1f25]" />
            Efficiency Trend
          </h4>
          <div className="h-40 flex items-center justify-center text-xs text-white/40">
            Chart placeholder — connect to time-series data
          </div>
        </div>
      </div>
    </div>
  );
};
