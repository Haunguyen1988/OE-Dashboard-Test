import React from 'react';
import { Plane, Settings, AlertCircle, CheckCircle2, Info, Clock, BarChart3, PieChart } from 'lucide-react';
import { cn } from '../utils';

export const FleetView: React.FC = () => {
  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full custom-scrollbar">
      {/* Fleet KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <FleetKpiCard title="TOTAL AIRCRAFT" value="82" trend="+2% from last month" icon={Plane} />
        <FleetKpiCard title="ACTIVE VS MAINT." value="74 / 8" trend="2 pending A-checks" icon={Settings} isWarning />
        <FleetKpiCard title="AVG DAILY UTIL." value="12.4 hrs" trend="-0.5% shift avg" icon={Clock} />
        <FleetKpiCard title="FLEET AVAILABILITY" value="90.2%" trend="+1.2% efficiency" icon={CheckCircle2} isSuccess />
      </div>

      {/* Utilization Timeline */}
      <div className="bg-[#211112] p-6 rounded-xl border border-red-500/10 shadow-sm">
        <div className="flex justify-between items-center mb-8">
          <h4 className="text-sm font-bold text-white">Utilization Timeline (24h)</h4>
          <div className="flex gap-4 text-[10px] font-bold text-white/60">
            <div className="flex items-center gap-1.5"><span className="size-2 rounded-sm bg-[#db1f25]"></span> FLIGHT</div>
            <div className="flex items-center gap-1.5"><span className="size-2 rounded-sm bg-slate-600"></span> GROUND</div>
            <div className="flex items-center gap-1.5"><span className="size-2 rounded-sm bg-orange-500"></span> MAINT.</div>
          </div>
        </div>
        
        <div className="space-y-4">
          <TimelineRow reg="VN-A521" segments={[{ type: 'flight', label: 'VJ122', start: '20%', width: '15%' }, { type: 'flight', label: 'VJ156', start: '45%', width: '20%' }, { type: 'maint', label: '', start: '75%', width: '10%' }]} />
          <TimelineRow reg="VN-A688" segments={[{ type: 'flight', label: 'VJ801', start: '10%', width: '35%' }, { type: 'flight', label: 'VJ442', start: '65%', width: '25%' }]} />
          <TimelineRow reg="VN-A320" segments={[{ type: 'maint', label: 'SCHEDULED B-CHECK', start: '25%', width: '60%' }]} />
          <TimelineRow reg="VN-A535" segments={[{ type: 'flight', label: 'VJ201', start: '10%', width: '15%' }, { type: 'flight', label: 'VJ202', start: '35%', width: '15%' }, { type: 'flight', label: 'VJ203', start: '60%', width: '15%' }]} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Aircraft Status List */}
        <div className="lg:col-span-2 bg-[#211112] rounded-xl border border-red-500/10 overflow-hidden">
          <div className="p-4 border-b border-red-500/10 flex justify-between items-center">
            <h4 className="text-sm font-bold text-white">Aircraft Status List</h4>
            <div className="flex bg-red-500/10 p-1 rounded-lg">
              <button className="px-3 py-1 text-[10px] font-bold rounded bg-[#db1f25] text-white">All Fleet</button>
              <button className="px-3 py-1 text-[10px] font-bold opacity-60 text-white">Maintenance</button>
            </div>
          </div>
          <table className="w-full text-left text-[11px]">
            <thead className="bg-red-500/5 border-b border-red-500/10 text-white/40 uppercase font-bold tracking-widest">
              <tr>
                <th className="px-4 py-3">Registration</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Location</th>
                <th className="px-4 py-3">Next Flight</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-red-500/10 text-white">
              <StatusRow reg="VN-A521" type="Airbus A321 Neo" status="IN FLIGHT" location="En Route DAD-SGN" next="VJ122 (14:30)" statusColor="bg-emerald-500/10 text-emerald-500" />
              <StatusRow reg="VN-A688" type="Airbus A321 Neo" status="ON GROUND" location="HAN (Gate 12)" next="VJ442 (16:00)" statusColor="bg-slate-500/10 text-slate-500" />
              <StatusRow reg="VN-A320" type="Airbus A320" status="MAINTENANCE" location="SGN Hangar 1" next="RTS (Tomorrow)" statusColor="bg-orange-500/10 text-orange-500" />
            </tbody>
          </table>
        </div>

        {/* Knock-on Delays */}
        <div className="space-y-6">
          <div className="bg-[#211112] rounded-xl border border-red-500/10 p-5">
            <div className="flex justify-between items-center mb-6">
              <h4 className="text-sm font-bold text-white">Knock-on Delays</h4>
              <span className="text-[10px] font-bold text-[#db1f25] bg-red-500/10 px-2 py-0.5 rounded">CRITICAL</span>
            </div>
            <div className="space-y-4">
              <KnockOnItem reg="VN-A521" flight="VJ122" delay="+45m" impact="Affecting 3 downstream flights" />
              <KnockOnItem reg="VN-A688" flight="VJ801" delay="+12m" impact="Affecting 1 downstream flight" isWarning />
            </div>
            <button className="w-full mt-6 py-2 border border-red-500/20 rounded-lg text-[10px] font-bold text-white hover:bg-red-500/5 transition-colors">
              VIEW PROPAGATION TREE
            </button>
          </div>

          <div className="bg-[#211112] rounded-xl border border-red-500/10 p-5">
            <h4 className="text-sm font-bold text-white mb-6">Fleet Composition</h4>
            <div className="space-y-4">
              <CompositionBar label="Airbus A321 Neo" count={48} total={82} color="bg-[#db1f25]" />
              <CompositionBar label="Airbus A320 Ceo" count={24} total={82} color="bg-slate-600" />
              <CompositionBar label="Airbus A330" count={10} total={82} color="bg-slate-400" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const FleetKpiCard = ({ title, value, trend, icon: Icon, isWarning, isSuccess }: any) => (
  <div className="bg-[#211112] p-4 rounded-xl border border-red-500/10 shadow-sm relative overflow-hidden">
    <Icon className={cn("absolute -right-2 -bottom-2 size-16 opacity-5", isWarning ? "text-orange-500" : isSuccess ? "text-emerald-500" : "text-[#db1f25]")} />
    <p className="text-[10px] font-bold opacity-40 uppercase tracking-widest text-white mb-4">{title}</p>
    <h3 className="text-2xl font-black text-white mb-1">{value}</h3>
    <p className={cn("text-[10px] font-bold", isWarning ? "text-orange-500" : isSuccess ? "text-emerald-500" : "text-emerald-500/80")}>{trend}</p>
  </div>
);

const TimelineRow = ({ reg, segments }: any) => (
  <div className="flex items-center gap-4">
    <span className="text-[10px] font-bold text-white w-16">{reg}</span>
    <div className="flex-1 h-8 bg-slate-800/30 rounded-sm relative">
      {segments.map((s: any, i: number) => (
        <div 
          key={i}
          className={cn(
            "absolute h-full flex items-center justify-center text-[8px] font-black text-white overflow-hidden",
            s.type === 'flight' ? "bg-[#db1f25]" : s.type === 'maint' ? "bg-orange-500" : "bg-slate-600"
          )}
          style={{ left: s.start, width: s.width }}
        >
          {s.label}
        </div>
      ))}
    </div>
  </div>
);

const StatusRow = ({ reg, type, status, location, next, statusColor }: any) => (
  <tr className="hover:bg-red-500/5 transition-colors">
    <td className="px-4 py-4 font-bold">{reg}</td>
    <td className="px-4 py-4 opacity-60">{type}</td>
    <td className="px-4 py-4">
      <span className={cn("px-2 py-0.5 rounded-full font-bold", statusColor)}>{status}</span>
    </td>
    <td className="px-4 py-4 opacity-60">{location}</td>
    <td className="px-4 py-4 font-bold">{next}</td>
  </tr>
);

const KnockOnItem = ({ reg, flight, delay, impact, isWarning }: any) => (
  <div className="flex gap-4 p-3 bg-red-500/5 rounded-lg border border-red-500/10">
    <div className={cn("size-8 rounded flex items-center justify-center shrink-0", isWarning ? "bg-orange-500/20 text-orange-500" : "bg-red-500/20 text-[#db1f25]")}>
      <AlertCircle className="size-5" />
    </div>
    <div className="min-w-0">
      <p className="text-xs font-bold text-white">{reg} • {flight}</p>
      <p className="text-[10px] text-white/60 mb-1">Delayed arrival at SGN ({delay})</p>
      <p className={cn("text-[9px] font-bold", isWarning ? "text-orange-500" : "text-[#db1f25]")}>{impact}</p>
    </div>
  </div>
);

const CompositionBar = ({ label, count, total, color }: any) => (
  <div className="space-y-1">
    <div className="flex justify-between text-[10px] font-bold text-white">
      <span>{label}</span>
      <span>{count} Units</span>
    </div>
    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
      <div className={cn("h-full", color)} style={{ width: `${(count / total) * 100}%` }}></div>
    </div>
  </div>
);
