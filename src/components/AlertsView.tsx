import React from 'react';
import { 
  Bell, 
  Search, 
  Filter, 
  History, 
  CheckCircle2, 
  AlertTriangle, 
  Wrench, 
  Users, 
  Cloud, 
  Wind,
  TrendingUp,
  TrendingDown,
  ChevronRight
} from 'lucide-react';
import { cn } from '../utils';

export const AlertsView: React.FC = () => {
  return (
    <div className="flex flex-col h-full bg-[#1a0d0d] overflow-hidden">
      {/* Sub Header */}
      <header className="p-6 border-b border-red-500/10 shrink-0">
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col">
            <h2 className="text-3xl font-black tracking-tight text-white">Alerts & Notifications Center</h2>
            <p className="text-slate-400 text-sm mt-1 font-medium">Real-time irregularity monitoring and incident lifecycle management</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex flex-col items-end mr-4">
              <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">System Status</span>
              <div className="flex items-center gap-2 text-emerald-500 mt-1">
                <span className="size-2 bg-emerald-500 rounded-full animate-pulse"></span>
                <span className="text-xs font-bold uppercase">All Services Operational</span>
              </div>
            </div>
            <button className="bg-[#db1f25] hover:bg-[#db1f25]/90 text-white px-5 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 shadow-lg shadow-red-500/20 transition-all">
              <CheckCircle2 className="size-5" />
              Acknowledge All Non-Critical
            </button>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-4 mt-8">
          <div className="col-span-3 flex gap-4">
            <StatWidget label="Alert Volume (24h)" value="142" trend="+12%" trendUp />
            <StatWidget label="Avg. Res Time" value="18m" trend="-5%" trendUp={false} />
          </div>
          <div className="col-span-9 flex items-center gap-3 bg-red-500/5 p-2 rounded-xl border border-red-500/10">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 size-4" />
              <input 
                className="w-full bg-[#1a0d0d] border-none rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-1 focus:ring-[#db1f25] placeholder-slate-500 text-white" 
                placeholder="Search by flight, tail number, or incident ID..." 
                type="text"
              />
            </div>
            <div className="h-8 w-px bg-red-500/20 mx-1"></div>
            <div className="flex gap-2">
              <FilterButton icon={AlertTriangle} label="Severity" />
              <FilterButton icon={Filter} label="Category" />
              <FilterButton icon={History} label="Time Range" />
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Main Feed */}
        <section className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400">Active Real-Time Feed</h3>
            <div className="flex items-center gap-4 text-[10px] font-bold text-slate-500">
              <span className="flex items-center gap-1"><span className="size-2 rounded-full bg-red-500"></span> CRITICAL</span>
              <span className="flex items-center gap-1"><span className="size-2 rounded-full bg-amber-500"></span> MAJOR</span>
              <span className="flex items-center gap-1"><span className="size-2 rounded-full bg-blue-500"></span> MINOR</span>
            </div>
          </div>

          <AlertItem 
            severity="critical" 
            icon={Wrench} 
            type="AOG" 
            flight="VJ123" 
            title="AOG - Engine #1 Vibration Alert" 
            desc="Reported via ACARS. Aircraft grounded at SGN. Maintenance team dispatched." 
            time="2 MINUTES AGO" 
          />
          <AlertItem 
            severity="major" 
            icon={Users} 
            type="CREW" 
            flight="VJ456" 
            title="Missing 2 Cabin Crew Members" 
            desc="Crew scheduling conflict at HAN. Standby crew notified but not confirmed." 
            time="14 MINUTES AGO" 
          />
          <AlertItem 
            severity="minor" 
            icon={Cloud} 
            type="WX" 
            flight="ALL FLEET" 
            title="Low Visibility Procedures (LVP) Imminent" 
            desc="Expected fog at DAD starting 22:00 UTC. RVR monitoring required." 
            time="32 MINUTES AGO" 
          />
        </section>

        {/* Right Sidebar */}
        <aside className="w-80 border-l border-red-500/10 bg-red-500/5 p-6 flex flex-col gap-6 overflow-y-auto custom-scrollbar">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
              <Cloud className="size-4" /> Weather Warnings
            </h3>
            <div className="bg-gradient-to-br from-red-500/20 to-red-900/40 border border-red-500/30 rounded-xl p-5 relative overflow-hidden">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-lg font-black text-white">SGN / Ho Chi Minh</h4>
                  <p className="text-xs font-bold text-[#db1f25] uppercase">Severe Thunderstorm</p>
                </div>
                <span className="text-[10px] font-bold bg-white/10 px-2 py-1 rounded text-white">1/3</span>
              </div>
              <div className="mt-6 flex items-center justify-between text-white">
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Time Window</p>
                  <p className="text-xs font-bold">14:00 - 18:00 UTC</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Probability</p>
                  <p className="text-xs font-bold">85%</p>
                </div>
              </div>
              <div className="mt-4 h-1 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-[#db1f25] w-2/3"></div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <WeatherCard icon={Cloud} title="HAN - Low Visibility" desc="Next 2 Hours" color="text-blue-400" />
            <WeatherCard icon={Wind} title="DAD - High Crosswinds" desc="Active - Runway 35L" color="text-amber-400" />
          </div>

          <div className="h-px bg-red-500/10"></div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Incident Distribution</h3>
            <div className="space-y-3">
              <DistributionBar label="Technical" value={42} color="bg-red-500" />
              <DistributionBar label="Crew Scheduling" value={28} color="bg-amber-500" />
              <DistributionBar label="Ground Ops" value={15} color="bg-blue-500" />
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

const StatWidget = ({ label, value, trend, trendUp }: any) => (
  <div className="flex-1 bg-red-500/10 border border-red-500/20 rounded-xl p-4">
    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</p>
    <div className="flex items-end justify-between mt-1">
      <span className="text-2xl font-black text-white">{value}</span>
      <span className={cn(
        "text-xs font-bold px-1.5 py-0.5 rounded flex items-center",
        trendUp ? "text-emerald-400 bg-emerald-400/10" : "text-amber-400 bg-amber-400/10"
      )}>
        {trend} {trendUp ? <TrendingUp className="size-3 ml-1" /> : <TrendingDown className="size-3 ml-1" />}
      </span>
    </div>
  </div>
);

const FilterButton = ({ icon: Icon, label }: any) => (
  <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 text-xs font-bold text-white hover:bg-red-500/20 transition-colors">
    <Icon className="size-4 text-[#db1f25]" /> {label}
    <ChevronRight className="size-4 rotate-90" />
  </button>
);

const AlertItem = ({ severity, icon: Icon, type, flight, title, desc, time }: any) => (
  <div className={cn(
    "border-l-4 rounded-r-xl p-4 flex items-center gap-6 hover:bg-red-500/10 transition-all group",
    severity === 'critical' ? "bg-red-500/5 border-red-500" : 
    severity === 'major' ? "bg-amber-500/5 border-amber-500" : 
    "bg-blue-500/5 border-blue-500"
  )}>
    <div className={cn(
      "flex flex-col items-center justify-center",
      severity === 'critical' ? "text-red-500" : 
      severity === 'major' ? "text-amber-500" : 
      "text-blue-500"
    )}>
      <Icon className="size-8" />
      <span className="text-[10px] font-black mt-1 uppercase">{type}</span>
    </div>
    <div className="flex-1">
      <div className="flex items-center gap-3">
        <span className={cn(
          "text-sm font-black",
          severity === 'critical' ? "text-red-400" : 
          severity === 'major' ? "text-amber-400" : 
          "text-blue-400"
        )}>{flight}</span>
        <span className={cn(
          "text-[10px] font-bold px-2 py-0.5 rounded uppercase",
          severity === 'critical' ? "bg-red-500/20 text-red-500" : 
          severity === 'major' ? "bg-amber-500/20 text-amber-500" : 
          "bg-blue-500/20 text-blue-500"
        )}>{severity} Severity</span>
      </div>
      <h4 className="text-base font-bold text-white mt-1">{title}</h4>
      <p className="text-sm text-slate-400 mt-0.5">{desc}</p>
    </div>
    <div className="text-right flex flex-col items-end gap-2 shrink-0">
      <span className="text-[10px] font-bold text-slate-500">{time}</span>
      <div className="flex gap-2">
        <button className="bg-red-500/20 text-[#db1f25] hover:bg-[#db1f25] hover:text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all uppercase">Acknowledge</button>
        <button className="bg-slate-700 hover:bg-slate-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all uppercase">Details</button>
      </div>
    </div>
  </div>
);

const WeatherCard = ({ icon: Icon, title, desc, color }: any) => (
  <div className="flex items-center justify-between p-3 rounded-lg bg-red-500/10 border border-white/5">
    <div className="flex items-center gap-3">
      <Icon className={cn("size-5", color)} />
      <div>
        <p className="text-xs font-bold text-white">{title}</p>
        <p className="text-[10px] text-slate-500">{desc}</p>
      </div>
    </div>
    <ChevronRight className="size-4 text-slate-500" />
  </div>
);

const DistributionBar = ({ label, value, color }: any) => (
  <div>
    <div className="flex justify-between text-[10px] font-bold uppercase mb-1 text-white">
      <span>{label}</span>
      <span>{value}%</span>
    </div>
    <div className="h-1.5 bg-red-500/10 rounded-full">
      <div className={cn("h-full rounded-full", color)} style={{ width: `${value}%` }}></div>
    </div>
  </div>
);
