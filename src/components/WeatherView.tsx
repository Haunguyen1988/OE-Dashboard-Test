import React from 'react';
import { CloudRain, Wind, Eye, Droplets, AlertTriangle, Thermometer, MapPin } from 'lucide-react';
import { cn } from '../utils';
import { useWeather } from '../hooks/useWeather';
import { LoadingSpinner, ErrorMessage } from './ui/LoadingSpinner';
import { format } from 'date-fns';

export const WeatherView: React.FC = () => {
  const { reports, sigmets, airports, loading, error, refetch } = useWeather();

  if (loading) return <LoadingSpinner message="Loading weather data..." />;
  if (error) return <ErrorMessage message={error} onRetry={refetch} />;

  const severityColor: Record<string, string> = {
    info: 'text-emerald-500',
    warning: 'text-orange-400',
    critical: 'text-[#db1f25]',
  };

  const severityBg: Record<string, string> = {
    info: 'bg-emerald-500/10 border-emerald-500/20',
    warning: 'bg-orange-500/10 border-orange-400/20',
    critical: 'bg-red-500/10 border-[#db1f25]/20',
  };

  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full custom-scrollbar">
      {/* Map + Weather Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weather Map Placeholder */}
        <div className="lg:col-span-2 bg-[#211112] rounded-xl border border-red-500/10 overflow-hidden relative">
          <div className="h-80 bg-red-500/5 flex items-center justify-center relative">
            <p className="text-xs text-white/40 z-10">Weather Map — Connect to mapping service</p>
            {/* Airport pins */}
            {airports.filter(a => a.lat && a.lng).slice(0, 6).map((ap, i) => {
              const weather = reports.find(r => r.airport_code === ap.code);
              return (
                <div
                  key={ap.code}
                  className="absolute"
                  style={{ left: `${15 + i * 14}%`, top: `${30 + (i % 3) * 15}%` }}
                >
                  <div className={cn(
                    "size-8 rounded-full flex items-center justify-center text-[8px] font-bold border-2",
                    weather ? severityBg[weather.severity] : 'bg-emerald-500/10 border-emerald-500/20',
                    weather ? severityColor[weather.severity] : 'text-emerald-500'
                  )}>
                    {ap.code}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Weather Sidebar */}
        <div className="space-y-6">
          {/* Hub Status */}
          <div className="bg-[#211112] p-4 rounded-xl border border-red-500/10">
            <h4 className="text-sm font-bold mb-4 flex items-center gap-2 text-white">
              <MapPin className="size-4 text-[#db1f25]" />
              Critical Hub Status
            </h4>
            <div className="space-y-3">
              {reports.map(r => (
                <div key={r.id} className={cn("p-3 rounded-lg border", severityBg[r.severity])}>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-white">{r.airport_code}</span>
                    <span className={cn("text-[10px] font-bold uppercase", severityColor[r.severity])}>{r.severity}</span>
                  </div>
                  <p className="text-xs text-white/60 mt-1">{r.condition}</p>
                  <div className="flex gap-4 mt-2 text-[10px] text-white/40">
                    {r.wind_speed_kts && <span>💨 {r.wind_speed_kts}kts</span>}
                    {r.visibility_m && <span>👁 {r.visibility_m >= 9999 ? '>10km' : `${r.visibility_m}m`}</span>}
                    {r.temperature_c && <span>🌡 {r.temperature_c}°C</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SIGMETs */}
          <div className="bg-[#211112] p-4 rounded-xl border border-red-500/10">
            <h4 className="text-sm font-bold mb-4 flex items-center gap-2 text-white">
              <AlertTriangle className="size-4 text-[#db1f25]" />
              Active SIGMETs
            </h4>
            <div className="space-y-3">
              {sigmets.length > 0 ? sigmets.map(s => (
                <div key={s.id} className="border-l-2 border-[#db1f25] pl-3 py-1">
                  <p className="text-xs font-bold text-[#db1f25]">{s.sigmet_id}</p>
                  <p className="text-xs text-white mt-1">{s.sigmet_desc}</p>
                  <p className="text-[10px] text-white/40 mt-1">
                    Type: {s.sigmet_type} | {s.airport_code}
                    {s.valid_from && s.valid_to && ` | ${format(new Date(s.valid_from), 'HH:mm')}-${format(new Date(s.valid_to), 'HH:mm')}`}
                  </p>
                </div>
              )) : (
                <p className="text-xs text-white/40">No active SIGMETs</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Weather Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {reports.slice(0, 4).map(r => (
          <div key={r.id} className="bg-[#211112] p-4 rounded-xl border border-red-500/10">
            <p className="text-xs font-bold text-[#db1f25] mb-3">{r.airport_code}</p>
            <div className="space-y-2">
              <MetricRow icon={<Wind className="size-3" />} label="Wind" value={`${r.wind_speed_kts ?? 0} kts${r.wind_gust_kts ? ` (G${r.wind_gust_kts})` : ''}`} />
              <MetricRow icon={<Eye className="size-3" />} label="Vis" value={r.visibility_m ? (r.visibility_m >= 9999 ? '>10 km' : `${r.visibility_m}m`) : '—'} />
              <MetricRow icon={<Droplets className="size-3" />} label="Humidity" value={r.humidity_pct ? `${r.humidity_pct}%` : '—'} />
              <MetricRow icon={<Thermometer className="size-3" />} label="Temp" value={r.temperature_c ? `${r.temperature_c}°C` : '—'} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const MetricRow = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
  <div className="flex items-center justify-between text-xs">
    <span className="text-white/40 flex items-center gap-1">{icon} {label}</span>
    <span className="text-white font-medium">{value}</span>
  </div>
);
