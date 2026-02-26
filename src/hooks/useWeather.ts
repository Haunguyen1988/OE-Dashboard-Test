import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import type { WeatherReport, Airport } from '../types/database';

interface WeatherData {
    reports: WeatherReport[];
    sigmets: WeatherReport[];
    airports: Airport[];
}

export function useWeather() {
    const [data, setData] = useState<WeatherData>({ reports: [], sigmets: [], airports: [] });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = async () => {
        try {
            const [reportsRes, sigmetsRes, airportsRes] = await Promise.all([
                supabase.from('weather_reports').select('*').is('sigmet_id', null).order('severity', { ascending: false }),
                supabase.from('weather_reports').select('*').not('sigmet_id', 'is', null),
                supabase.from('airports').select('*'),
            ]);

            setData({
                reports: reportsRes.data || [],
                sigmets: sigmetsRes.data || [],
                airports: airportsRes.data || [],
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
        // Auto-refresh weather every 5 mins
        const interval = setInterval(fetchData, 5 * 60 * 1000);
        return () => clearInterval(interval);
    }, []);

    return { ...data, loading, error, refetch: fetchData };
}
