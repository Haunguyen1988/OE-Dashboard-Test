import React from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { GroundOpsView } from './components/GroundOpsView';
import { FleetView } from './components/FleetView';
import { FlightDetailView } from './components/FlightDetailView';
import { AlertsView } from './components/AlertsView';
import { WeatherView } from './components/WeatherView';
import { NetworkView } from './components/NetworkView';
import { ViewType } from './types';
import { useState } from 'react';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [selectedFlightId, setSelectedFlightId] = useState<string | null>(null);

  const getViewTitle = (view: ViewType) => {
    switch (view) {
      case 'dashboard': return 'OMC Executive Overview';
      case 'ground-ops': return 'Ground Operations Stage Performance';
      case 'fleet': return 'Fleet Management & Utilization';
      case 'flight-detail': return 'Flight Operations Detail';
      case 'alerts': return 'Alerts & Notifications Center';
      case 'weather': return 'Weather Intelligence';
      case 'network': return 'Network Map View';
      default: return 'Vietjet Air OMC';
    }
  };

  const handleFlightClick = (id: string) => {
    setSelectedFlightId(id);
    setCurrentView('flight-detail');
  };

  return (
    <div className="flex h-screen w-full bg-[#1a0d0e] text-slate-100 overflow-hidden font-sans">
      <Sidebar 
        currentView={currentView} 
        onViewChange={(view) => {
          setCurrentView(view);
          setSelectedFlightId(null);
        }} 
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title={getViewTitle(currentView)} view={currentView} />
        
        <main className="flex-1 overflow-hidden relative">
          {currentView === 'dashboard' && (
            <DashboardView onFlightClick={handleFlightClick} />
          )}
          
          {currentView === 'ground-ops' && (
            <GroundOpsView />
          )}

          {currentView === 'fleet' && (
            <FleetView />
          )}

          {currentView === 'flight-detail' && selectedFlightId && (
            <FlightDetailView 
              flightId={selectedFlightId} 
              onBack={() => setCurrentView('dashboard')} 
            />
          )}

          {currentView === 'alerts' && (
            <AlertsView />
          )}

          {currentView === 'weather' && (
            <WeatherView />
          )}

          {currentView === 'network' && (
            <NetworkView />
          )}
        </main>
      </div>
    </div>
  );
}
