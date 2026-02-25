import React from 'react';
import { Search, Bell, User, Download, Filter } from 'lucide-react';
import { cn } from '../utils';

export const GroundOpsView: React.FC = () => {
  const airports = ['SGN', 'HAN', 'DAD', 'HUI', 'CXR', 'PQC'];
  const stages = ['CHECK-IN', 'SECURITY', 'BOARDING', 'LOADING', 'FUELING', 'CATERING', 'CLEANING'];

  const data: Record<string, Record<string, { time: string; status: 'good' | 'warning' | 'critical' }>> = {
    SGN: {
      'CHECK-IN': { time: '2m', status: 'good' },
      SECURITY: { time: '4m', status: 'good' },
      BOARDING: { time: '18m', status: 'critical' },
      LOADING: { time: '12m', status: 'warning' },
      FUELING: { time: '3m', status: 'good' },
      CATERING: { time: '6m', status: 'warning' },
      CLEANING: { time: '4m', status: 'good' },
    },
    HAN: {
      'CHECK-IN': { time: '4m', status: 'good' },
      SECURITY: { time: '3m', status: 'good' },
      BOARDING: { time: '14m', status: 'warning' },
      LOADING: { time: '9m', status: 'warning' },
      FUELING: { time: '5m', status: 'warning' },
      CATERING: { time: '11m', status: 'warning' },
      CLEANING: { time: '7m', status: 'warning' },
    },
    DAD: {
      'CHECK-IN': { time: '1m', status: 'good' },
      SECURITY: { time: '2m', status: 'good' },
      BOARDING: { time: '8m', status: 'warning' },
      LOADING: { time: '16m', status: 'critical' },
      FUELING: { time: '4m', status: 'good' },
      CATERING: { time: '3m', status: 'good' },
      CLEANING: { time: '2m', status: 'good' },
    },
  };

  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full custom-scrollbar">
      <div className="flex gap-4 items-center bg-[#2d1617] p-4 rounded-xl border border-red-500/10">
        <FilterSelect label="Airport" value="All Airports" />
        <FilterSelect label="Range" value="Last 24h" />
        <FilterSelect label="Type" value="Domestic/International" />
        
        <div className="ml-auto flex items-center gap-4 text-[10px] font-bold text-white/60">
          <span className="uppercase">Legend:</span>
          <div className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-emerald-500"></span> &lt;5m</div>
          <div className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-orange-500"></span> 5-15m</div>
          <div className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-[#db1f25]"></span> &gt;15m</div>
        </div>
      </div>

      <div className="bg-[#211112] border border-red-500/10 rounded-xl overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-red-500/5 border-b border-red-500/10 text-white/40">
            <tr>
              <th className="px-6 py-4 font-bold uppercase tracking-widest">Airport</th>
              {stages.map(stage => (
                <th key={stage} className="px-4 py-4 font-bold uppercase tracking-widest text-center">{stage}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-red-500/10 text-white">
            {airports.map(airport => (
              <tr key={airport} className="hover:bg-red-500/5 transition-colors">
                <td className="px-6 py-6 font-black text-lg">{airport}</td>
                {stages.map(stage => {
                  const cell = data[airport]?.[stage] || { time: '2m', status: 'good' };
                  return (
                    <td key={stage} className="px-2 py-4">
                      <div className={cn(
                        "mx-auto w-20 py-2 rounded-lg border text-center font-bold",
                        cell.status === 'good' && "bg-emerald-500/10 border-emerald-500/30 text-emerald-500",
                        cell.status === 'warning' && "bg-orange-500/10 border-orange-500/30 text-orange-500",
                        cell.status === 'critical' && "bg-red-500/10 border-red-500/30 text-[#db1f25]",
                      )}>
                        {cell.time}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#211112] p-6 rounded-xl border border-red-500/10">
          <div className="flex justify-between items-center mb-6">
            <h4 className="text-sm font-bold flex items-center gap-2 text-white">
              <BarChart3Icon className="size-4 text-[#db1f25]" />
              Top Delay Stages (Avg)
            </h4>
            <span className="text-[10px] opacity-40 text-white">Past 24 Hours</span>
          </div>
          <div className="space-y-6">
            <DelayProgress label="Boarding" value={12.8} color="bg-[#db1f25]" />
            <DelayProgress label="Loading" value={10.2} color="bg-orange-500" />
            <DelayProgress label="Catering" value={7.1} color="bg-orange-500" />
            <DelayProgress label="Cleaning" value={4.8} color="bg-emerald-500" />
          </div>
        </div>

        <div className="bg-[#211112] p-6 rounded-xl border border-red-500/10">
          <div className="flex justify-between items-center mb-6">
            <h4 className="text-sm font-bold flex items-center gap-2 text-white">
              <TrendingUpIcon className="size-4 text-[#db1f25]" />
              Efficiency Trend
            </h4>
            <div className="flex items-center gap-2 text-[10px] text-white/60">
              <span className="size-2 rounded-full bg-[#db1f25]"></span> Delay (m)
            </div>
          </div>
          <div className="h-48 flex items-end gap-6 px-4">
            <TrendBar label="06:00" height="30%" />
            <TrendBar label="09:00" height="45%" />
            <TrendBar label="12:00" height="80%" />
            <TrendBar label="15:00" height="60%" />
            <TrendBar label="18:00" height="40%" />
            <TrendBar label="21:00" height="25%" />
          </div>
        </div>
      </div>
    </div>
  );
};

const FilterSelect = ({ label, value }: any) => (
  <div className="flex flex-col gap-1">
    <span className="text-[10px] uppercase font-bold text-white/40">{label}</span>
    <button className="bg-red-500/5 border border-red-500/10 px-3 py-1.5 rounded-lg text-xs font-bold text-white flex items-center gap-2">
      {value}
      <Filter className="size-3 opacity-40" />
    </button>
  </div>
);

const DelayProgress = ({ label, value, color }: any) => (
  <div className="space-y-2">
    <div className="flex justify-between text-xs font-bold text-white">
      <span>{label}</span>
      <span className={cn(value > 10 ? "text-[#db1f25]" : "text-emerald-500")}>{value}m</span>
    </div>
    <div className="w-full bg-red-500/5 h-2 rounded-full">
      <div className={cn("h-2 rounded-full", color)} style={{ width: `${(value / 15) * 100}%` }}></div>
    </div>
  </div>
);

const TrendBar = ({ label, height }: any) => (
  <div className="flex-1 space-y-3">
    <div className="bg-[#db1f25]/40 rounded-t-sm w-full" style={{ height }}></div>
    <p className="text-[10px] text-center font-bold opacity-40 text-white">{label}</p>
  </div>
);

const BarChart3Icon = (props: any) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/></svg>
);

const TrendingUpIcon = (props: any) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>
);
