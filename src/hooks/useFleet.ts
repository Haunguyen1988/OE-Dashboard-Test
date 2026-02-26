import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import type { Aircraft, FleetSummary } from '../types/database';

interface FleetData {
    summary: FleetSummary | null;
    aircraft: Aircraft[];
}

export function useFleet() {
    const [data, setData] = useState<FleetData>({ summary: null, aircraft: [] });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = async () => {
        try {
            const [summaryRes, aircraftRes] = await Promise.all([
                supabase.from('view_fleet_summary').select('*').single(),
                supabase.from('aircraft').select('*').order('registration'),
            ]);

            setData({
                summary: summaryRes.data,
                aircraft: aircraftRes.data || [],
            });
            setError(null);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    return { ...data, loading, error, refetch: fetchData };
}
