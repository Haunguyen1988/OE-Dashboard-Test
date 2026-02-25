export type ViewType = 
  | 'dashboard' 
  | 'ground-ops' 
  | 'fleet' 
  | 'flight-detail' 
  | 'alerts' 
  | 'weather' 
  | 'network';

export interface Flight {
  id: string;
  route: string;
  std: string;
  atd_etd: string;
  delay: string;
  status: 'DEPARTED' | 'BOARDING' | 'DELAYED' | 'ON-TIME' | 'CANCELLED';
}
