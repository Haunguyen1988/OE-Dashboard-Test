import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import type { Flight, FlightToday, Alert, WeatherReport, DashboardKpis, AirportOtp } from '../types/database';

interface DashboardData {
    kpis: DashboardKpis | null;
    flights: FlightToday[];
    irregularities: Alert[];
    weatherAlerts: WeatherReport[];
    airportOtp: AirportOtp[];
}

export function useDashboard() {
    const [data, setData] = useState<DashboardData>({
        kpis: null,
        flights: [],
        irregularities: [],
        weatherAlerts: [],
        airportOtp: [],
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = async () => {
        try {
            const [kpisRes, flightsRes, alertsRes, weatherRes, otpRes] = await Promise.all([
                supabase.from('view_dashboard_kpis').select('*').single(),
                supabase.from('v_flights_today').select('*').order('std', { ascending: true }).limit(30),
                supabase.from('alerts').select('*').eq('status', 'active').order('created_at', { ascending: false }).limit(5),
                supabase.from('weather_reports').select('*').in('severity', ['warning', 'critical']).is('sigmet_id', null).limit(5),
                supabase.from('view_airport_otp').select('*').limit(5),
            ]);

            setData({
                kpis: kpisRes.data,
                flights: flightsRes.data || [],
                irregularities: alertsRes.data || [],
                weatherAlerts: weatherRes.data || [],
                airportOtp: otpRes.data || [],
            });
            setError(null);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();

        const channel = supabase
            .channel('dashboard-changes')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'flights' }, () => fetchData())
            .on('postgres_changes', { event: '*', schema: 'public', table: 'alerts' }, () => fetchData())
            .subscribe();

        return () => { supabase.removeChannel(channel); };
    }, []);

    return { ...data, loading, error, refetch: fetchData };
}
