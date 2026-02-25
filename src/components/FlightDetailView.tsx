import React from 'react';
import { 
  ArrowLeft, 
  Plane, 
  Calendar, 
  Tag, 
  Check, 
  Clock, 
  AlertTriangle, 
  Users, 
  Star, 
  Luggage, 
  Package, 
  Map as MapIcon,
  Wrench,
  Info,
  Settings,
  BarChart3
} from 'lucide-react';
import { cn } from '../utils';

interface FlightDetailViewProps {
  flightId: string;
  onBack: () => void;
}

export const FlightDetailView: React.FC<FlightDetailViewProps> = ({ flightId, onBack }) => {
  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full custom-scrollbar bg-[#1a0d0e]">
      {/* Breadcrumbs */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm">
          <button onClick={onBack} className="text-[#db1f25] font-medium flex items-center gap-1 hover:underline">
            <ArrowLeft className="size-4" /> Back to List
          </button>
          <span className="text-slate-600">/</span>
          <span className="text-slate-400">Operations</span>
          <span className="text-slate-600">/</span>
          <span className="font-semibold text-white">{flightId} Details</span>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-slate-800 rounded-lg text-sm font-bold text-white">Export Logs</button>
          <button className="px-4 py-2 bg-[#db1f25] text-white rounded-lg text-sm font-bold">Edit Flight</button>
        </div>
      </div>

      {/* Flight Hero */}
      <section className="bg-[#211112] rounded-xl p-6 shadow-sm border border-red-500/10 flex flex-col md:flex-row gap-6 items-center">
        <div className="h-24 w-24 bg-red-500/20 rounded-xl flex items-center justify-center text-[#db1f25] shrink-0">
          <Plane className="size-12" />
        </div>
        <div className="flex-1 space-y-1 text-center md:text-left">
          <div className="flex flex-wrap justify-center md:justify-start items-center gap-3">
            <h1 className="text-3xl font-bold text-white">{flightId}</h1>
            <span className="px-3 py-1 bg-orange-500/20 text-orange-500 rounded-full text-xs font-bold uppercase tracking-wider italic">Delayed +15m</span>
          </div>
          <p className="text-xl font-medium text-slate-300">Ho Chi Minh (SGN) → Ha Noi (HAN)</p>
          <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-slate-500 pt-1">
            <span className="flex items-center gap-1"><Calendar className="size-4" /> 25 Oct 2023</span>
            <span className="flex items-center gap-1"><Plane className="size-4" /> Airbus A321 Neo</span>
            <span className="flex items-center gap-1"><Tag className="size-4" /> Reg: VN-A652</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
          <div className="bg-[#1a0d0e] p-3 rounded-lg text-center border border-red-500/10">
            <p className="text-[10px] uppercase font-bold text-slate-500">STD</p>
            <p className="text-lg font-bold text-white">08:00</p>
          </div>
          <div className="bg-red-500/5 p-3 rounded-lg text-center border border-red-500/20">
            <p className="text-[10px] uppercase font-bold text-[#db1f25]">ATD</p>
            <p className="text-lg font-bold text-[#db1f25]">08:15</p>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Timeline */}
          <section className="bg-[#211112] rounded-xl p-6 border border-red-500/10">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-white">
              <Clock className="size-5 text-[#db1f25]" /> Timeline & Milestones
            </h3>
            <div className="space-y-0">
              <MilestoneItem label="Chocks Off" scheduled="08:00" actual="08:10" status="completed" icon={Check} />
              <MilestoneItem label="Airborne" scheduled="08:10" actual="08:25" status="completed" icon={Plane} />
              <MilestoneItem label="ETA / Arrival" scheduled="10:10" actual="10:25" status="active" icon={Plane} />
              <MilestoneItem label="Chocks On" scheduled="10:15" actual="--:--" status="pending" icon={Clock} isLast />
            </div>
          </section>

          {/* Ground Ops */}
          <section className="bg-[#211112] rounded-xl p-6 border border-red-500/10">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-white">
              <Wrench className="size-5 text-[#db1f25]" /> Ground Ops Status
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <StatusProgress label="Boarding (Gate 12)" progress={100} status="Complete" color="bg-emerald-500" />
                <StatusProgress label="Fueling" progress={100} status="Complete" color="bg-emerald-500" />
              </div>
              <div className="space-y-4">
                <StatusProgress label="Catering" progress={85} status="In Progress" color="bg-[#db1f25]" />
                <StatusProgress label="Baggage & Cargo Loading" progress={40} status="Loading" color="bg-slate-500" />
              </div>
            </div>
          </section>

          {/* Technical AMOS */}
          <section className="bg-[#211112] rounded-xl p-6 border border-red-500/10">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-white">
              <Settings className="size-5 text-[#db1f25]" /> Technical & Maintenance (AMOS)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-2">
                <p className="text-[10px] uppercase font-bold text-slate-500">Aircraft Health</p>
                <div className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-emerald-500"></span>
                  <span className="font-bold text-emerald-500">Serviceable</span>
                </div>
                <p className="text-xs text-orange-500 font-medium bg-orange-500/10 px-2 py-1 rounded inline-block">MEL Restricted</p>
              </div>
              <div className="space-y-2">
                <p className="text-[10px] uppercase font-bold text-slate-500">Open Tech Log Items</p>
                <ul className="space-y-1">
                  <li className="text-sm flex items-start gap-2 text-white">
                    <AlertTriangle className="size-3 text-red-500 mt-1" />
                    <span>Engine #1 Vib High</span>
                  </li>
                  <li className="text-sm flex items-start gap-2 text-white">
                    <Info className="size-3 text-slate-400 mt-1" />
                    <span>Cabin Light Row 12</span>
                  </li>
                </ul>
              </div>
              <div className="space-y-2">
                <p className="text-[10px] uppercase font-bold text-slate-500">Maintenance Due</p>
                <div className="p-2 bg-[#1a0d0e] rounded border border-red-500/10">
                  <p className="text-sm font-bold text-white">A-Check</p>
                  <p className="text-xs text-slate-500">in 48 hours / 12 cycles</p>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-[10px] uppercase font-bold text-slate-500">Fluid Levels</p>
                <div className="space-y-1 text-xs text-white">
                  <div className="flex justify-between"><span>Fuel</span><span className="font-bold">12,400 kg</span></div>
                  <div className="flex justify-between"><span>Oil</span><span className="font-bold">18.5 Qts</span></div>
                  <div className="flex justify-between"><span>Hydraulic</span><span className="font-bold text-emerald-500">Normal</span></div>
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <section className="bg-red-500/10 rounded-xl p-6 border border-red-500/20">
            <div className="flex items-center gap-2 mb-4 text-[#db1f25]">
              <AlertTriangle className="size-5" />
              <h3 className="text-lg font-bold">Delay Log</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center bg-[#211112]/50 p-3 rounded-lg">
                <span className="text-[10px] font-bold px-2 py-1 bg-red-500/20 text-[#db1f25] rounded">IATA 89</span>
                <span className="text-sm font-medium text-white">Late Arrival of Aircraft</span>
                <span className="text-sm font-bold text-[#db1f25]">+15m</span>
              </div>
              <p className="text-xs text-[#db1f25]/80 italic">Primary delay occurred at previous sector (HAN-SGN) due to weather ATC constraints.</p>
            </div>
          </section>

          <section className="bg-[#211112] rounded-xl p-6 border border-red-500/10">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-white">
              <BarChart3 className="size-5 text-[#db1f25]" /> Flight Load Summary
            </h3>
            <div className="space-y-4">
              <LoadItem icon={Users} label="Total Passengers" value="186 / 230" />
              <LoadItem icon={Star} label="VIPs / SkyBoss" value="12" iconColor="text-amber-500" />
              <LoadItem icon={Luggage} label="Baggage Count" value="214 pcs" />
              <LoadItem icon={Package} label="Cargo Weight" value="1,420 kg" />
            </div>
          </section>

          <div className="h-48 rounded-xl overflow-hidden bg-slate-800 relative group">
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
            <div className="absolute bottom-4 left-4 text-white">
              <p className="text-[10px] font-bold uppercase tracking-widest opacity-80">Arrival Airport</p>
              <p className="text-lg font-bold">Noi Bai Int'l (HAN)</p>
            </div>
            <div className="w-full h-full bg-red-500/10 flex items-center justify-center">
              <MapIcon className="size-12 text-[#db1f25]/30" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const MilestoneItem = ({ label, scheduled, actual, status, icon: Icon, isLast }: any) => (
  <div className="grid grid-cols-[40px_1fr] group">
    <div className="flex flex-col items-center">
      <div className={cn(
        "size-8 rounded-full flex items-center justify-center z-10",
        status === 'completed' ? "bg-emerald-500 text-white" : 
        status === 'active' ? "bg-[#db1f25] text-white animate-pulse" : 
        "bg-slate-800 text-slate-500"
      )}>
        <Icon className="size-4" />
      </div>
      {!isLast && <div className="w-0.5 bg-slate-800 grow h-10"></div>}
    </div>
    <div className="pb-6 pl-4">
      <div className="flex justify-between items-start">
        <div>
          <p className={cn("font-bold", status === 'active' ? "text-[#db1f25]" : "text-white")}>{label}</p>
          <p className="text-sm text-slate-500">Scheduled: {scheduled}</p>
        </div>
        <div className="text-right">
          <p className={cn("font-bold", status === 'completed' ? "text-emerald-500" : status === 'active' ? "text-[#db1f25]" : "text-slate-500")}>{actual}</p>
          <p className="text-[10px] uppercase font-bold text-slate-500">{status === 'pending' ? 'Pending' : status === 'active' ? 'Estimated' : 'Actual'}</p>
        </div>
      </div>
    </div>
  </div>
);

const StatusProgress = ({ label, progress, status, color }: any) => (
  <div>
    <div className="flex justify-between text-sm mb-1">
      <span className="font-semibold text-white">{label}</span>
      <span className={cn(color === 'bg-emerald-500' ? "text-emerald-500" : "text-[#db1f25]")}>{progress}% {status}</span>
    </div>
    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
      <div className={cn("h-2 rounded-full", color)} style={{ width: `${progress}%` }}></div>
    </div>
  </div>
);

const LoadItem = ({ icon: Icon, label, value, iconColor = "text-[#db1f25]" }: any) => (
  <div className="flex items-center justify-between p-3 rounded-lg bg-[#1a0d0e] border border-red-500/10">
    <div className="flex items-center gap-3">
      <Icon className={cn("size-5", iconColor)} />
      <span className="text-sm font-medium text-white">{label}</span>
    </div>
    <span className="font-bold text-white">{value}</span>
  </div>
);
