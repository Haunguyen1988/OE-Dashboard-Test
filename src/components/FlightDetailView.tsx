import React from 'react';
import { ArrowLeft, Clock, MapPin, AlertTriangle, Users, Package, FileText } from 'lucide-react';
import { cn } from '../utils';
import { useFlightDetail } from '../hooks/useFlightDetail';
import { LoadingSpinner, ErrorMessage } from './ui/LoadingSpinner';

interface FlightDetailViewProps {
  flightId: string;
  onBack: () => void;
}

export const FlightDetailView: React.FC<FlightDetailViewProps> = ({ flightId, onBack }) => {
  const { flight, loading, error, refetch } = useFlightDetail(flightId);

  if (loading) return <LoadingSpinner message="Loading flight details..." />;
  if (error) return <ErrorMessage message={error} onRetry={refetch} />;
  if (!flight) return <ErrorMessage message="Flight not found" />;

  const displayId = `${flight.carrier_code}${flight.flight_number}`;
  const isDelayed = (flight.delay_minutes ?? 0) > 15;

  const fmtTime = (ts: string | null) => {
    if (!ts) return '—';
    try { return ts.slice(11, 16); } catch { return '—'; }
  };

  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full custom-scrollbar">
      {/* Back Button */}
      <button onClick={onBack} className="flex items-center gap-2 text-[#db1f25] text-sm font-medium hover:underline">
        <ArrowLeft className="size-4" /> Back
      </button>

      {/* Hero */}
      <div className={cn(
        "p-6 rounded-xl border shadow-sm",
        isDelayed ? "bg-red-500/5 border-[#db1f25]/30" : "bg-emerald-500/5 border-emerald-500/20"
      )}>
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-2xl font-black text-white">{displayId}</h2>
              <span className={cn(
                "px-3 py-1 rounded-full text-xs font-bold",
                isDelayed ? "bg-[#db1f25]/20 text-[#db1f25]" : "bg-emerald-500/20 text-emerald-500"
              )}>
                {flight.status || 'SCH'}
              </span>
            </div>
            <p className="text-sm text-white/60">{flight.departure} → {flight.arrival} | {flight.aircraft_reg || '—'} | {flight.flight_date}</p>
          </div>
          {isDelayed && (
            <div className="text-right">
              <p className="text-xs text-[#db1f25] font-bold mb-1">
                <AlertTriangle className="size-3 inline mr-1" />
                DELAYED +{flight.delay_minutes}m
              </p>
              <p className="text-[10px] text-white/40">{flight.delay_code || 'No delay code'}</p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <TimeBox label="STD" value={fmtTime(flight.std)} />
          <TimeBox label="ATD" value={fmtTime(flight.atd)} highlight={!!flight.atd} />
          <TimeBox label="STA" value={fmtTime(flight.sta)} />
          <TimeBox label="ATA" value={fmtTime(flight.ata)} highlight={!!flight.ata} />
        </div>
      </div>

      {/* Detail Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Timeline */}
        <div className="bg-[#211112] p-5 rounded-xl border border-red-500/10">
          <h4 className="text-sm font-bold mb-4 flex items-center gap-2 text-white">
            <Clock className="size-4 text-[#db1f25]" />
            Timeline & Milestones
          </h4>
          <div className="space-y-4">
            <MilestoneItem label="Schedule" time={fmtTime(flight.std)} done />
            <MilestoneItem label="Pushback / ATD" time={fmtTime(flight.atd)} done={!!flight.atd} />
            <MilestoneItem label="Takeoff" time={fmtTime(flight.takeoff_time)} done={!!flight.takeoff_time} />
            <MilestoneItem label="Landing" time={fmtTime(flight.landing_time)} done={!!flight.landing_time} />
            <MilestoneItem label="Arrival / ATA" time={fmtTime(flight.ata)} done={!!flight.ata} />
          </div>
        </div>

        {/* Flight Info */}
        <div className="bg-[#211112] p-5 rounded-xl border border-red-500/10">
          <h4 className="text-sm font-bold mb-4 flex items-center gap-2 text-white">
            <Package className="size-4 text-[#db1f25]" />
            Flight Information
          </h4>
          <div className="space-y-3">
            <InfoRow label="Aircraft" value={`${flight.aircraft_reg || '—'} (${flight.aircraft_type || '—'})`} />
            <InfoRow label="Passengers" value={flight.pax_count != null ? String(flight.pax_count) : '—'} />
            <InfoRow label="Block Time" value={flight.block_time ? `${flight.block_time} hrs` : '—'} />
            <InfoRow label="Flight Time" value={flight.flight_time ? `${flight.flight_time} hrs` : '—'} />
            <InfoRow label="Source" value={flight.source || '—'} />
          </div>
        </div>

        {/* Delay Log */}
        <div className="bg-[#211112] p-5 rounded-xl border border-red-500/10">
          <h4 className="text-sm font-bold mb-4 flex items-center gap-2 text-white">
            <FileText className="size-4 text-[#db1f25]" />
            Delay Log
          </h4>
          {(flight.delay_minutes ?? 0) > 0 ? (
            <div className="border-l-2 border-[#db1f25] pl-3 py-1">
              <p className="text-xs font-bold text-[#db1f25]">{flight.delay_code || 'N/A'}</p>
              <p className="text-xs text-white mt-1">Duration: {flight.delay_minutes} minutes</p>
            </div>
          ) : (
            <p className="text-xs text-white/40">No delays recorded</p>
          )}
        </div>

        {/* Route Map Placeholder */}
        <div className="bg-[#211112] p-5 rounded-xl border border-red-500/10">
          <h4 className="text-sm font-bold mb-4 flex items-center gap-2 text-white">
            <MapPin className="size-4 text-[#db1f25]" />
            Route Map
          </h4>
          <div className="h-48 bg-red-500/5 rounded-lg flex items-center justify-center">
            <p className="text-xs text-white/40">{flight.departure} → {flight.arrival}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const TimeBox = ({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) => (
  <div className="text-center">
    <p className="text-[10px] font-bold uppercase tracking-wider text-white/40 mb-1">{label}</p>
    <p className={cn("text-lg font-bold", highlight ? "text-emerald-500" : "text-white")}>{value}</p>
  </div>
);

const MilestoneItem = ({ label, time, done }: { label: string; time: string; done: boolean }) => (
  <div className="flex items-center gap-3">
    <div className={cn("size-3 rounded-full", done ? "bg-emerald-500" : "bg-white/20")}></div>
    <span className={cn("text-xs flex-1", done ? "text-white" : "text-white/40")}>{label}</span>
    <span className="text-xs text-white/60">{time}</span>
  </div>
);

const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-center justify-between text-xs">
    <span className="text-white/40">{label}</span>
    <span className="text-white font-medium">{value}</span>
  </div>
);
