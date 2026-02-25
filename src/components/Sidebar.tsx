import React from 'react';
import { 
  LayoutDashboard, 
  Plane, 
  Globe, 
  BarChart3, 
  FileText, 
  Radar, 
  Bell, 
  Settings, 
  AlertTriangle,
  Users,
  CloudLightning,
  Wrench
} from 'lucide-react';
import { ViewType } from '../types';
import { cn } from '../utils';

interface SidebarProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onViewChange }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'ground-ops', label: 'Ground Ops', icon: Users },
    { id: 'fleet', label: 'Fleet Status', icon: Plane },
    { id: 'network', label: 'Network Map', icon: Globe },
    { id: 'weather', label: 'Weather Ops', icon: CloudLightning },
    { id: 'reports', label: 'Reports', icon: FileText },
  ];

  const systemItems = [
    { id: 'alerts', label: 'Alerts Center', icon: Bell },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 border-r border-red-500/20 bg-[#211112] flex flex-col shrink-0 h-screen">
      <div className="p-6 flex items-center gap-3 border-b border-red-500/10">
        <div className="size-10 bg-[#db1f25] rounded-full flex items-center justify-center text-white">
          <Plane className="size-6" />
        </div>
        <div>
          <h1 className="font-bold text-sm tracking-tight text-[#db1f25]">VIETJET AIR</h1>
          <p className="text-[10px] uppercase tracking-widest opacity-60 text-white">OMC Executive</p>
        </div>
      </div>
      
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id as ViewType)}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm font-medium",
              currentView === item.id 
                ? "bg-[#db1f25] text-white" 
                : "text-slate-400 hover:bg-red-500/10 hover:text-white"
            )}
          >
            <item.icon className="size-5" />
            <span>{item.label}</span>
          </button>
        ))}

        <div className="pt-6">
          <p className="px-3 text-[10px] font-bold uppercase opacity-40 mb-2 text-white">Systems</p>
          {systemItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id as ViewType)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm font-medium",
                currentView === item.id 
                  ? "bg-[#db1f25] text-white" 
                  : "text-slate-400 hover:bg-red-500/10 hover:text-white"
              )}
            >
              <item.icon className="size-5" />
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </nav>

      <div className="p-4 mt-auto border-t border-red-500/10">
        <button className="w-full bg-[#db1f25] hover:bg-[#db1f25]/90 text-white py-2 px-4 rounded-lg text-sm font-bold flex items-center justify-center gap-2">
          <AlertTriangle className="size-4" />
          EMERGENCY ALERT
        </button>
      </div>
    </aside>
  );
};
