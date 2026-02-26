import React, { useState } from 'react';
import { Bell, Search, AlertTriangle, CheckCircle, CloudRain, Shield, Filter } from 'lucide-react';
import { cn } from '../utils';
import { useAlerts } from '../hooks/useAlerts';
import { LoadingSpinner, ErrorMessage } from './ui/LoadingSpinner';
import { format, formatDistanceToNow } from 'date-fns';

export const AlertsView: React.FC = () => {
  const { alerts, stats, loading, error, refetch, acknowledgeAlert } = useAlerts();
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState<string>('all');

  if (loading) return <LoadingSpinner message="Loading alerts..." />;
  if (error) return <ErrorMessage message={error} onRetry={refetch} />;

  const filtered = alerts.filter(a => {
    const matchSearch = !searchTerm || a.title.toLowerCase().includes(searchTerm.toLowerCase()) || (a.flight_id && a.flight_id.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchSeverity = severityFilter === 'all' || a.severity === severityFilter;
    return matchSearch && matchSeverity;
  });

  const activeCount = alerts.filter(a => a.status === 'active').length;
  const criticalCount = alerts.filter(a => a.severity === 'critical' && a.status === 'active').length;

  const severityConfig: Record<string, { color: string; bg: string; icon: React.ReactNode }> = {
    critical: { color: 'text-[#db1f25]', bg: 'bg-red-500/10 border-[#db1f25]/30', icon: <AlertTriangle className="size-4" /> },
    major: { color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-400/30', icon: <Shield className="size-4" /> },
    minor: { color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-400/30', icon: <Bell className="size-4" /> },
  };

  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full custom-scrollbar">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-[#211112] p-4 rounded-xl border border-red-500/10">
          <p className="text-xs text-white/40 uppercase tracking-wider mb-1">Active Alerts</p>
          <p className="text-2xl font-bold text-white">{activeCount}</p>
        </div>
        <div className="bg-[#211112] p-4 rounded-xl border border-red-500/10">
          <p className="text-xs text-white/40 uppercase tracking-wider mb-1">Critical</p>
          <p className="text-2xl font-bold text-[#db1f25]">{criticalCount}</p>
        </div>
        <div className="bg-[#211112] p-4 rounded-xl border border-red-500/10">
          <p className="text-xs text-white/40 uppercase tracking-wider mb-1">24h Total</p>
          <p className="text-2xl font-bold text-white">{stats.total24h}</p>
        </div>
        <div className="bg-[#211112] p-4 rounded-xl border border-red-500/10">
          <p className="text-xs text-white/40 uppercase tracking-wider mb-1">Avg Resolution</p>
          <p className="text-2xl font-bold text-white">{stats.avgResTime}m</p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex gap-4 items-center bg-[#2d1617] p-4 rounded-xl border border-red-500/10">
        <div className="flex items-center gap-2 flex-1 bg-[#211112] rounded-lg px-3 py-2 border border-red-500/10">
          <Search className="size-4 text-white/40" />
          <input
            type="text"
            placeholder="Search alerts..."
            className="bg-transparent text-xs text-white placeholder-white/30 outline-none w-full"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="size-4 text-[#db1f25]" />
          <select
            className="bg-[#211112] border border-red-500/20 rounded-md px-2 py-1.5 text-xs text-white focus:outline-none"
            value={severityFilter}
            onChange={e => setSeverityFilter(e.target.value)}
          >
            <option value="all">All Severity</option>
            <option value="critical">Critical</option>
            <option value="major">Major</option>
            <option value="minor">Minor</option>
          </select>
        </div>
      </div>

      {/* Alerts Feed */}
      <div className="space-y-4">
        {filtered.length > 0 ? filtered.map(alert => {
          const cfg = severityConfig[alert.severity];
          return (
            <div key={alert.id} className={cn("p-4 rounded-xl border transition-all", cfg.bg)}>
              <div className="flex justify-between items-start">
                <div className="flex items-start gap-3">
                  <div className={cn("size-8 rounded-lg flex items-center justify-center", cfg.color, cfg.bg)}>
                    {cfg.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={cn("text-[10px] font-bold uppercase", cfg.color)}>{alert.severity}</span>
                      <span className="text-[10px] text-white/30">|</span>
                      <span className="text-[10px] text-white/60">{alert.category}</span>
                      {alert.flight_id && (
                        <>
                          <span className="text-[10px] text-white/30">|</span>
                          <span className="text-[10px] font-bold text-[#db1f25]">{alert.flight_id}</span>
                        </>
                      )}
                    </div>
                    <p className="text-sm font-bold text-white">{alert.title}</p>
                    {alert.description && <p className="text-xs text-white/60 mt-1">{alert.description}</p>}
                    <p className="text-[10px] text-white/30 mt-2">
                      {formatDistanceToNow(new Date(alert.created_at), { addSuffix: true })}
                    </p>
                  </div>
                </div>
                {alert.status === 'active' && (
                  <button
                    onClick={() => acknowledgeAlert(alert.id)}
                    className="px-3 py-1.5 bg-[#db1f25] text-white rounded-lg text-[10px] font-bold hover:bg-[#db1f25]/80 transition-colors flex items-center gap-1"
                  >
                    <CheckCircle className="size-3" /> Acknowledge
                  </button>
                )}
                {alert.status === 'acknowledged' && (
                  <span className="px-2 py-0.5 bg-orange-500/10 text-orange-400 rounded-full text-[10px] font-bold">Acknowledged</span>
                )}
                {alert.status === 'resolved' && (
                  <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-500 rounded-full text-[10px] font-bold">Resolved</span>
                )}
              </div>
            </div>
          );
        }) : (
          <div className="text-center py-12 text-white/40 text-xs">No alerts match your search</div>
        )}
      </div>
    </div>
  );
};
