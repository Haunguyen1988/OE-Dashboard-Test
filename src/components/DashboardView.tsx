import React from 'react';
import { TrendingUp, TrendingDown, PieChart, ListOrdered, BarChart3, AlertCircle, CloudRain } from 'lucide-react';
import { Flight } from '../types';
import { cn } from '../utils';

interface DashboardViewProps {
  onFlightClick: (id: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onFlightClick }) => {
  const flights: Flight[] = [
    { id: 'VJ126', route: 'SGN → HAN', std: '14:30', atd_etd: '14:42', delay: '+12m', status: 'DEPARTED' },
    { id: 'VJ881', route: 'SGN → ICN', std: '14:45', atd_etd: '14:45', delay: '0m', status: 'BOARDING' },
    { id: 'VJ152', route: 'HAN → DAD', std: '15:00', atd_etd: '15:45', delay: '+45m', status: 'DELAYED' },
    { id: 'VJ210', route: 'SGN → CXR', std: '15:15', atd_etd: '15:15', delay: '0m', status: 'ON-TIME' },
    { id: 'VJ442', route: 'DAD → SGN', std: '15:30', atd_etd: '15:30', delay: '0m', status: 'ON-TIME' },
  ];

  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full custom-scrollbar">
      {/* KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard title="OTP OTD (On-Time Departure)" value="84.5%" trend="+1.2%" target="vs Target 85.0%" trendUp />
        <KpiCard title="OTP OTA (On-Time Arrival)" value="81.2%" trend="-0.5%" target="vs Target 82.0%" trendUp={false} />
        <KpiCard title="Average Delay" value="14 mins" trend="-2m" target="Prev. 16 mins" trendUp />
        <KpiCard title="Cancellation Rate" value="0.5%" trend="0.0%" target="Industry Avg 1.2%" isStable />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#211112] p-5 rounded-xl border border-red-500/10 shadow-sm">
              <h4 className="text-sm font-bold mb-6 flex items-center gap-2 text-white">
                <PieChart className="size-4 text-[#db1f25]" />
                OTP Overview
              </h4>
              <div className="flex items-center justify-center h-48 relative">
                <div className="size-40 rounded-full border-[16px] border-emerald-500/20 border-t-emerald-500 border-r-emerald-500 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-2xl font-black text-white">78%</p>
                    <p className="text-[10px] opacity-60 text-white">ON-TIME</p>
                  </div>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2 text-[10px] font-medium text-white">
                <div className="flex items-center gap-2"><span className="size-2 rounded-full bg-emerald-500"></span> On-Time (245)</div>
                <div className="flex items-center gap-2"><span className="size-2 rounded-full bg-[#db1f25]"></span> Delayed (58)</div>
                <div className="flex items-center gap-2"><span className="size-2 rounded-full bg-orange-400"></span> Early (12)</div>
                <div className="flex items-center gap-2"><span className="size-2 rounded-full bg-slate-500"></span> Canceled (2)</div>
              </div>
            </div>

            <div className="bg-[#211112] p-5 rounded-xl border border-red-500/10 shadow-sm">
              <h4 className="text-sm font-bold mb-6 flex items-center gap-2 text-white">
                <ListOrdered className="size-4 text-[#db1f25]" />
                Bottom 5 Airport OTP
              </h4>
              <div className="space-y-4">
                <AirportBar label="SGN - Ho Chi Minh" value={62} />
                <AirportBar label="HAN - Hanoi" value={68} />
                <AirportBar label="DAD - Da Nang" value={75} />
                <AirportBar label="HUI - Hue" value={78} />
                <AirportBar label="CXR - Cam Ranh" value={81} />
              </div>
            </div>
          </div>

          <div className="bg-[#211112] p-5 rounded-xl border border-red-500/10 shadow-sm">
            <h4 className="text-sm font-bold mb-6 flex items-center gap-2 text-white">
              <BarChart3 className="size-4 text-[#db1f25]" />
              Delay Cause Analysis (IATA Codes)
            </h4>
            <div className="h-48 flex items-end gap-4 px-4">
              <DelayBar label="SGN" segments={[40, 20, 30]} />
              <DelayBar label="HAN" segments={[10, 60, 15]} />
              <DelayBar label="DAD" segments={[5, 20, 45]} />
              <DelayBar label="CXR" segments={[15, 10, 20]} />
              <DelayBar label="PQC" segments={[30, 40, 10]} />
            </div>
            <div className="mt-6 flex flex-wrap justify-center gap-6 text-[10px] font-bold opacity-60 text-white">
              <div className="flex items-center gap-2"><span className="size-2 bg-[#db1f25]/90 rounded-sm"></span> WEATHER</div>
              <div className="flex items-center gap-2"><span className="size-2 bg-[#db1f25]/60 rounded-sm"></span> TECHNICAL</div>
              <div className="flex items-center gap-2"><span className="size-2 bg-[#db1f25]/30 rounded-sm"></span> ATC / GROUND OPS</div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-[#211112] rounded-xl border border-red-500/10 overflow-hidden flex flex-col h-[400px]">
            <div className="p-4 border-b border-red-500/10 flex justify-between items-center">
              <h4 className="text-sm font-bold flex items-center gap-2 text-white">
                <AlertCircle className="size-4 text-[#db1f25]" />
                Latest Irregularities
              </h4>
              <span className="text-[10px] bg-red-500/10 text-[#db1f25] px-2 py-0.5 rounded-full font-bold">LIVE</span>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4">
              <IrregularityItem code="VJ123" route="SGN-HAN" time="14:40" issue="Technical Issue - APU Fault" status="Maintenance on-site" color="border-[#db1f25]" textColor="text-[#db1f25]" />
              <IrregularityItem code="VJ456" route="DAD-SGN" time="14:32" issue="Missing Guest - Offloaded" status="Resolved - Door Closed" color="border-emerald-500" textColor="text-emerald-500" />
              <IrregularityItem code="VJ789" route="HAN-DAD" time="14:20" issue="Late Inbound A/C (VJ122)" status="Pending Departure (+35m)" color="border-[#db1f25]" textColor="text-[#db1f25]" opacity="opacity-80" />
            </div>
          </div>

          <div className="bg-red-500/10 rounded-xl border border-red-500/20 p-5 relative overflow-hidden">
            <CloudRain className="absolute -right-4 -top-4 size-24 opacity-10 text-white" />
            <h4 className="text-sm font-bold flex items-center gap-2 mb-4 text-white">
              <CloudRain className="size-4 text-[#db1f25]" />
              Weather Alerts
            </h4>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="size-10 rounded-lg bg-[#211112] flex items-center justify-center text-[#db1f25]">
                  <CloudRain className="size-6" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">HAN: Thunderstorm</p>
                  <p className="text-[10px] opacity-70 text-white">Exp: 14:00 - 16:00 ICT</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-[#211112] rounded-xl border border-red-500/10 overflow-hidden shadow-sm">
        <div className="p-4 border-b border-red-500/10 flex justify-between items-center">
          <h4 className="text-sm font-bold flex items-center gap-2 text-white">
            <ListOrdered className="size-4 text-[#db1f25]" />
            Operational Flight List (Current Window)
          </h4>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-red-500/5 border-b border-red-500/10 text-white/60">
              <tr>
                <th className="px-4 py-3 font-bold uppercase tracking-wider">Flight</th>
                <th className="px-4 py-3 font-bold uppercase tracking-wider">Route</th>
                <th className="px-4 py-3 font-bold uppercase tracking-wider">STD</th>
                <th className="px-4 py-3 font-bold uppercase tracking-wider">ATD/ETD</th>
                <th className="px-4 py-3 font-bold uppercase tracking-wider">Delay</th>
                <th className="px-4 py-3 font-bold uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-red-500/10 text-white">
              {flights.map((f) => (
                <tr 
                  key={f.id} 
                  className="hover:bg-red-500/5 transition-colors cursor-pointer"
                  onClick={() => onFlightClick(f.id)}
                >
                  <td className="px-4 py-3 font-bold text-[#db1f25]">{f.id}</td>
                  <td className="px-4 py-3">{f.route}</td>
                  <td className="px-4 py-3 opacity-60">{f.std}</td>
                  <td className="px-4 py-3">{f.atd_etd}</td>
                  <td className={cn("px-4 py-3 font-bold", f.delay === '0m' ? "text-emerald-500" : "text-[#db1f25]")}>{f.delay}</td>
                  <td className="px-4 py-3">
                    <span className={cn(
                      "px-2 py-0.5 rounded-full text-[10px] font-bold",
                      f.status === 'DEPARTED' && "bg-emerald-500/10 text-emerald-500",
                      f.status === 'BOARDING' && "bg-red-500/10 text-[#db1f25]",
                      f.status === 'DELAYED' && "bg-orange-500/10 text-orange-500",
                      f.status === 'ON-TIME' && "bg-slate-500/10 text-slate-500",
                    )}>
                      {f.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const KpiCard = ({ title, value, trend, target, trendUp, isStable }: any) => (
  <div className="bg-[#211112] p-4 rounded-xl border border-red-500/10 shadow-sm">
    <div className="flex justify-between items-start mb-2">
      <p className="text-xs font-medium opacity-60 uppercase tracking-wider text-white">{title}</p>
      {isStable ? (
        <span className="text-slate-400 flex items-center text-xs font-bold">{trend}</span>
      ) : (
        <span className={cn("flex items-center text-xs font-bold", trendUp ? "text-emerald-500" : "text-[#db1f25]")}>
          {trendUp ? <TrendingUp className="size-3 mr-1" /> : <TrendingDown className="size-3 mr-1" />}
          {trend}
        </span>
      )}
    </div>
    <div className="flex items-baseline gap-2">
      <h3 className="text-2xl font-bold text-white">{value}</h3>
      <span className="text-[10px] opacity-40 text-white">{target}</span>
    </div>
    <div className="mt-3 w-full bg-red-500/5 rounded-full h-1.5">
      <div className="bg-[#db1f25] h-1.5 rounded-full" style={{ width: value }}></div>
    </div>
  </div>
);

const AirportBar = ({ label, value }: any) => (
  <div className="space-y-1">
    <div className="flex justify-between text-xs text-white"><span>{label}</span> <span className="font-bold">{value}%</span></div>
    <div className="w-full bg-red-500/5 h-1.5 rounded-full">
      <div className="bg-[#db1f25] h-1.5 rounded-full" style={{ width: `${value}%` }}></div>
    </div>
  </div>
);

const DelayBar = ({ label, segments }: any) => (
  <div className="flex-1 space-y-2">
    <div className="flex flex-col-reverse h-32 gap-0.5">
      <div className="bg-[#db1f25]/90 rounded-sm" style={{ height: `${segments[0]}%` }}></div>
      <div className="bg-[#db1f25]/60 rounded-sm" style={{ height: `${segments[1]}%` }}></div>
      <div className="bg-[#db1f25]/30 rounded-sm" style={{ height: `${segments[2]}%` }}></div>
    </div>
    <p className="text-[10px] text-center font-medium opacity-60 text-white">{label}</p>
  </div>
);

const IrregularityItem = ({ code, route, time, issue, status, color, textColor, opacity }: any) => (
  <div className={cn("border-l-2 pl-3 py-1", color, opacity)}>
    <div className="flex justify-between items-start">
      <p className={cn("text-xs font-bold", textColor)}>{code} ({route})</p>
      <span className="text-[9px] opacity-40 text-white">{time}</span>
    </div>
    <p className="text-xs font-medium mt-1 text-white">{issue}</p>
    <p className="text-[10px] opacity-60 mt-0.5 text-white">Status: {status}</p>
  </div>
);
