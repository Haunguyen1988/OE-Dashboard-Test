import React from 'react';
import { Cloud, CloudRain, CloudLightning, Wind, Sun, Thermometer, Map as MapIcon, Navigation, Info, AlertTriangle, Eye, Droplets } from 'lucide-react';
import { cn } from '../utils';

export const WeatherView: React.FC = () => {
  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full custom-scrollbar bg-[#1a0d0e]">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-3xl font-black text-white">Weather Intelligence</h2>
          <p className="text-slate-400 text-sm mt-1">Global meteorological monitoring for operational safety</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-slate-800 rounded-lg text-sm font-bold text-white flex items-center gap-2">
            <Navigation className="size-4" /> Route Analysis
          </button>
          <button className="px-4 py-2 bg-[#db1f25] text-white rounded-lg text-sm font-bold flex items-center gap-2">
            <CloudLightning className="size-4" /> Active Alerts (3)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Map Area */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-[#211112] rounded-2xl border border-red-500/10 overflow-hidden relative group h-[500px]">
            {/* Mock Map Background */}
            <div className="absolute inset-0 bg-[#0f0708]">
              <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#db1f25 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
              {/* Mock Storm Cells */}
              <div className="absolute top-1/4 left-1/3 size-48 bg-red-500/20 blur-3xl rounded-full animate-pulse"></div>
              <div className="absolute bottom-1/3 right-1/4 size-64 bg-amber-500/10 blur-3xl rounded-full"></div>
              
              {/* Map UI Overlays */}
              <div className="absolute top-6 left-6 flex flex-col gap-2">
                <MapLayerButton label="Radar" active />
                <MapLayerButton label="Wind" />
                <MapLayerButton label="Turbulence" />
                <MapLayerButton label="SIGMET" />
              </div>

              <div className="absolute bottom-6 left-6 bg-[#1a0d0e]/90 border border-red-500/20 p-4 rounded-xl backdrop-blur-md">
                <h4 className="text-xs font-bold text-white mb-3 uppercase tracking-widest">Radar Legend</h4>
                <div className="flex items-center gap-1 h-2 w-48 rounded-full overflow-hidden mb-2">
                  <div className="flex-1 h-full bg-blue-500"></div>
                  <div className="flex-1 h-full bg-emerald-500"></div>
                  <div className="flex-1 h-full bg-yellow-500"></div>
                  <div className="flex-1 h-full bg-orange-500"></div>
                  <div className="flex-1 h-full bg-red-500"></div>
                  <div className="flex-1 h-full bg-purple-500"></div>
                </div>
                <div className="flex justify-between text-[8px] font-bold text-slate-500">
                  <span>LIGHT</span>
                  <span>SEVERE</span>
                </div>
              </div>

              {/* Mock Airport Pins */}
              <AirportPin x="40%" y="30%" code="HAN" status="warning" />
              <AirportPin x="60%" y="70%" code="SGN" status="critical" />
              <AirportPin x="55%" y="50%" code="DAD" status="good" />
            </div>
            
            <div className="absolute top-6 right-6 flex gap-2">
              <button className="size-10 bg-[#1a0d0e]/80 border border-red-500/20 rounded-lg flex items-center justify-center text-white hover:bg-[#db1f25] transition-colors">
                <MapIcon className="size-5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <WeatherMetricCard icon={Wind} label="Wind Speed" value="18 kts" sub="Gusting 24 kts" />
            <WeatherMetricCard icon={Eye} label="Visibility" value="800m" sub="RVR Active" isWarning />
            <WeatherMetricCard icon={Droplets} label="Humidity" value="92%" sub="Dew Point 24°C" />
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <section className="bg-[#211112] rounded-2xl border border-red-500/10 p-6">
            <h3 className="text-sm font-bold text-white mb-6 flex items-center gap-2">
              <AlertTriangle className="size-4 text-[#db1f25]" /> Critical Hubs
            </h3>
            <div className="space-y-4">
              <HubStatus 
                code="SGN" 
                name="Tan Son Nhat" 
                temp="28°C" 
                condition="Thunderstorm" 
                icon={CloudLightning} 
                status="critical" 
              />
              <HubStatus 
                code="HAN" 
                name="Noi Bai" 
                temp="22°C" 
                condition="Heavy Rain" 
                icon={CloudRain} 
                status="warning" 
              />
              <HubStatus 
                code="DAD" 
                name="Da Nang" 
                temp="26°C" 
                condition="Partly Cloudy" 
                icon={Cloud} 
                status="good" 
              />
            </div>
          </section>

          <section className="bg-[#211112] rounded-2xl border border-red-500/10 p-6">
            <h3 className="text-sm font-bold text-white mb-6">SIGMET Alerts</h3>
            <div className="space-y-3">
              <SigmetItem 
                id="SIGMET 04" 
                region="VVTS FIR" 
                type="TS" 
                desc="Severe turbulence expected FL280-FL350" 
              />
              <SigmetItem 
                id="SIGMET 02" 
                region="VVNB FIR" 
                type="ICE" 
                desc="Moderate icing reported by VJ122" 
              />
            </div>
          </section>

          <div className="bg-gradient-to-br from-[#db1f25]/20 to-transparent rounded-2xl border border-red-500/20 p-6">
            <h4 className="text-xs font-bold text-[#db1f25] uppercase tracking-widest mb-2">AI Forecast Insight</h4>
            <p className="text-sm text-white/80 leading-relaxed">
              Expect 45% increase in delays at SGN between 14:00-16:00 UTC due to convective activity. Recommend fuel tankering for inbound flights.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const MapLayerButton = ({ label, active }: any) => (
  <button className={cn(
    "px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest border transition-all",
    active ? "bg-[#db1f25] border-[#db1f25] text-white shadow-lg shadow-red-500/20" : "bg-[#1a0d0e]/80 border-red-500/20 text-slate-400 hover:border-red-500/40"
  )}>
    {label}
  </button>
);

const AirportPin = ({ x, y, code, status }: any) => (
  <div className="absolute flex flex-col items-center group cursor-pointer" style={{ left: x, top: y }}>
    <div className={cn(
      "size-3 rounded-full border-2 border-white shadow-lg mb-1",
      status === 'critical' ? "bg-red-500 animate-ping" : status === 'warning' ? "bg-amber-500" : "bg-emerald-500"
    )}></div>
    <div className="bg-[#1a0d0e] px-2 py-0.5 rounded border border-red-500/20 text-[10px] font-black text-white group-hover:bg-[#db1f25] transition-colors">
      {code}
    </div>
  </div>
);

const WeatherMetricCard = ({ icon: Icon, label, value, sub, isWarning }: any) => (
  <div className="bg-[#211112] p-5 rounded-2xl border border-red-500/10 flex items-center gap-5">
    <div className={cn("size-12 rounded-xl flex items-center justify-center", isWarning ? "bg-red-500/20 text-red-500" : "bg-slate-800 text-slate-400")}>
      <Icon className="size-6" />
    </div>
    <div>
      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{label}</p>
      <p className="text-xl font-black text-white">{value}</p>
      <p className="text-xs text-slate-400">{sub}</p>
    </div>
  </div>
);

const HubStatus = ({ code, name, temp, condition, icon: Icon, status }: any) => (
  <div className="flex items-center gap-4 p-3 rounded-xl bg-red-500/5 border border-red-500/10 hover:bg-red-500/10 transition-colors cursor-pointer">
    <div className={cn(
      "size-10 rounded-lg flex items-center justify-center shrink-0",
      status === 'critical' ? "bg-red-500/20 text-red-500" : status === 'warning' ? "bg-amber-500/20 text-amber-500" : "bg-emerald-500/20 text-emerald-500"
    )}>
      <Icon className="size-5" />
    </div>
    <div className="flex-1 min-w-0">
      <div className="flex justify-between items-center">
        <span className="text-sm font-black text-white">{code}</span>
        <span className="text-xs font-bold text-white">{temp}</span>
      </div>
      <p className="text-[10px] text-slate-500 truncate">{condition}</p>
    </div>
  </div>
);

const SigmetItem = ({ id, region, type, desc }: any) => (
  <div className="p-3 rounded-xl bg-[#1a0d0e] border border-red-500/10">
    <div className="flex justify-between items-center mb-1">
      <span className="text-[10px] font-black text-[#db1f25]">{id}</span>
      <span className="text-[10px] font-bold text-slate-500">{region}</span>
    </div>
    <p className="text-xs font-bold text-white mb-1">{type} ALERT</p>
    <p className="text-[10px] text-slate-400 leading-tight">{desc}</p>
  </div>
);
