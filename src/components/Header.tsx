import React from 'react';
import { Bell, Settings, Search, Clock } from 'lucide-react';
import { ViewType } from '../types';

interface HeaderProps {
  title: string;
  view: ViewType;
}

export const Header: React.FC<HeaderProps> = ({ title, view }) => {
  return (
    <header className="h-16 border-b border-red-500/10 bg-[#211112] px-6 flex items-center justify-between shrink-0">
      <div className="flex items-center gap-6">
        <h2 className="text-lg font-bold text-white">{title}</h2>
        <div className="flex items-center gap-2 text-xs opacity-60 text-white">
          <Clock className="size-4" />
          <span>OCT 24, 2023 | 14:45 ICT</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex bg-red-500/10 p-1 rounded-lg">
          <button className="px-3 py-1 text-xs font-semibold rounded bg-[#db1f25] text-white">Domestic</button>
          <button className="px-3 py-1 text-xs font-semibold opacity-60 hover:opacity-100 text-white">International</button>
        </div>
        
        <div className="h-8 w-px bg-red-500/10 mx-2"></div>
        
        <div className="flex items-center gap-3">
          <button className="p-2 hover:bg-red-500/10 rounded-full transition-colors relative text-white">
            <Bell className="size-5" />
            <span className="absolute top-2 right-2 size-2 bg-[#db1f25] rounded-full border border-[#211112]"></span>
          </button>
          <button className="p-2 hover:bg-red-500/10 rounded-full transition-colors text-white">
            <Settings className="size-5" />
          </button>
          <div className="size-8 rounded-full bg-red-500/20 border border-red-500/30 flex items-center justify-center overflow-hidden">
            <img 
              className="w-full h-full object-cover" 
              src="https://picsum.photos/seed/user/100/100" 
              alt="User"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </div>
    </header>
  );
};
