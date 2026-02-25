import React from 'react';
import { Map as MapIcon, Globe, Navigation, Layers, Search, Filter, Plane, Activity, Radio } from 'lucide-react';
import { cn } from '../utils';

export const NetworkView: React.FC = () => {
  return (
    <div className="flex flex-col h-full bg-[#0f0708] overflow-hidden">
      {/* Map Controls Overlay */}
      <div className="absolute top-24 left-1/2 -translate-x-1/2 z-10 flex gap-2">
        <div className="bg-[#1a0d0e]/90 backdrop-blur-md border border-red-500/20 p-1 rounded-xl flex shadow-2xl">
          <MapTab label="Live Flights" active icon={Plane} />
          <MapTab label="Routes" icon={Navigation} />
          <MapTab label="Airports" icon={Radio} />
        </div>
      </div>

      {/* Side Panels */}
      <div className="absolute top-24 left-6 bottom-6 w-80 z-10 flex flex-col gap-4 pointer-events-none">
        <div className="bg-[#1a0d0e]/90 backdrop-blur-md border border-red-500/20 p-6 rounded-2xl shadow-2xl pointer-events-auto">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-black text-white uppercase tracking-widest">Network Stats</h3>
            <Activity className="size-4 text-[#db1f25]" />
          </div>
          <div className="space-y-6">
            <NetworkStat label="Airborne Flights" value="42" total="82" color="bg-[#db1f25]" />
            <NetworkStat label="On-Time Performance" value="88%" total="100%" color="bg-emerald-500" />
            <NetworkStat label="Fuel Efficiency" value="94.2%" total="100%" color="bg-blue-500" />
          </div>
          <div className="mt-8 pt-6 border-t border-red-500/10">
            <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">Search Network</h4>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-500" />
              <input 
                type="text" 
                placeholder="Flight, Reg, or City..." 
                className="w-full bg-black/40 border border-red-500/10 rounded-lg py-2 pl-10 pr-4 text-xs text-white focus:ring-1 focus:ring-[#db1f25] outline-none"
              />
            </div>
          </div>
        </div>

        <div className="flex-1 bg-[#1a0d0e]/90 backdrop-blur-md border border-red-500/20 p-6 rounded-2xl shadow-2xl pointer-events-auto overflow-hidden flex flex-col">
          <h3 className="text-sm font-black text-white uppercase tracking-widest mb-4">Active Sectors</h3>
          <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 pr-2">
            <SectorItem from="SGN" to="HAN" flight="VJ122" status="On Time" />
            <SectorItem from="HAN" to="DAD" flight="VJ456" status="Delayed" isDelayed />
            <SectorItem from="SGN" to="CXR" flight="VJ801" status="On Time" />
            <SectorItem from="DAD" to="SGN" flight="VJ156" status="On Time" />
            <SectorItem from="SGN" to="PQC" flight="VJ201" status="On Time" />
            <SectorItem from="HAN" to="HUI" flight="VJ332" status="On Time" />
          </div>
        </div>
      </div>

      {/* Right Controls */}
      <div className="absolute top-24 right-6 z-10 flex flex-col gap-2">
        <MapControlButton icon={Globe} />
        <MapControlButton icon={Layers} />
        <MapControlButton icon={Filter} />
        <div className="h-px bg-red-500/20 my-2"></div>
        <MapControlButton icon={Navigation} />
      </div>

      {/* Main Map Canvas (Mock) */}
      <div className="flex-1 relative">
        {/* Grid Background */}
        <div className="absolute inset-0 bg-[#0a0506]">
          <div className="absolute inset-0 opacity-10" style={{ 
            backgroundImage: 'linear-gradient(#db1f25 1px, transparent 1px), linear-gradient(90deg, #db1f25 1px, transparent 1px)',
            backgroundSize: '100px 100px'
          }}></div>
          
          {/* Mock Flight Paths */}
          <svg className="absolute inset-0 w-full h-full opacity-40">
            <path d="M 400 300 Q 600 400 800 500" stroke="#db1f25" strokeWidth="1" fill="none" strokeDasharray="5,5" />
            <path d="M 300 600 Q 500 500 700 400" stroke="#db1f25" strokeWidth="1" fill="none" strokeDasharray="5,5" />
            <path d="M 800 200 Q 600 300 400 400" stroke="#db1f25" strokeWidth="1" fill="none" strokeDasharray="5,5" />
          </svg>

          {/* Mock Aircraft Icons */}
          <AircraftMarker x="45%" y="35%" rotation={45} flight="VJ122" />
          <AircraftMarker x="65%" y="65%" rotation={135} flight="VJ456" isDelayed />
          <AircraftMarker x="55%" y="45%" rotation={220} flight="VJ801" />
          <AircraftMarker x="35%" y="55%" rotation={310} flight="VJ156" />
        </div>

        {/* Map Bottom Info */}
        <div className="absolute bottom-6 right-6 bg-[#1a0d0e]/90 backdrop-blur-md border border-red-500/20 px-6 py-3 rounded-xl shadow-2xl flex items-center gap-8">
          <div className="flex flex-col">
            <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Current View</span>
            <span className="text-xs font-black text-white">South East Asia / Vietnam</span>
          </div>
          <div className="h-8 w-px bg-red-500/20"></div>
          <div className="flex flex-col">
            <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Active Objects</span>
            <span className="text-xs font-black text-white">124 Tracking</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const MapTab = ({ label, active, icon: Icon }: any) => (
  <button className={cn(
    "flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
    active ? "bg-[#db1f25] text-white" : "text-slate-500 hover:text-white"
  )}>
    <Icon className="size-3" />
    {label}
  </button>
);

const NetworkStat = ({ label, value, total, color }: any) => (
  <div>
    <div className="flex justify-between text-[10px] font-black text-white uppercase tracking-widest mb-2">
      <span>{label}</span>
      <span>{value}</span>
    </div>
    <div className="h-1.5 bg-red-500/10 rounded-full overflow-hidden">
      <div className={cn("h-full rounded-full", color)} style={{ width: typeof value === 'string' ? value : `${(Number(value) / Number(total)) * 100}%` }}></div>
    </div>
  </div>
);

const SectorItem = ({ from, to, flight, status, isDelayed }: any) => (
  <div className="p-3 bg-red-500/5 border border-red-500/10 rounded-xl hover:bg-red-500/10 transition-colors cursor-pointer group">
    <div className="flex justify-between items-center mb-1">
      <span className="text-[10px] font-black text-[#db1f25]">{flight}</span>
      <span className={cn("text-[8px] font-bold px-1.5 py-0.5 rounded uppercase", isDelayed ? "bg-red-500/20 text-red-500" : "bg-emerald-500/20 text-emerald-500")}>
        {status}
      </span>
    </div>
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="text-xs font-black text-white">{from}</span>
        <Navigation className="size-3 text-slate-600 rotate-90" />
        <span className="text-xs font-black text-white">{to}</span>
      </div>
      <span className="text-[10px] font-bold text-slate-500 group-hover:text-white transition-colors">TRACK</span>
    </div>
  </div>
);

const MapControlButton = ({ icon: Icon }: any) => (
  <button className="size-10 bg-[#1a0d0e]/90 backdrop-blur-md border border-red-500/20 rounded-xl flex items-center justify-center text-slate-400 hover:text-[#db1f25] hover:border-[#db1f25] transition-all shadow-xl">
    <Icon className="size-5" />
  </button>
);

const AircraftMarker = ({ x, y, rotation, flight, isDelayed }: any) => (
  <div className="absolute flex flex-col items-center group cursor-pointer" style={{ left: x, top: y }}>
    <div 
      className={cn(
        "size-6 rounded-full flex items-center justify-center shadow-2xl transition-transform group-hover:scale-125",
        isDelayed ? "bg-red-500 text-white" : "bg-white text-[#db1f25]"
      )}
      style={{ transform: `rotate(${rotation}deg)` }}
    >
      <Plane className="size-4" />
    </div>
    <div className="mt-2 bg-[#1a0d0e]/90 border border-red-500/20 px-2 py-0.5 rounded text-[8px] font-black text-white opacity-0 group-hover:opacity-100 transition-opacity">
      {flight}
    </div>
  </div>
);
