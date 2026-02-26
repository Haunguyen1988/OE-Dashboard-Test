import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import type { Flight } from '../types/database';

interface NetworkData {
    activeFlights: Flight[];
    airborneCount: number;
    onTimePct: number;
}

export function useNetwork() {
    const [data, setData] = useState<NetworkData>({ activeFlights: [], airborneCount: 0, onTimePct: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = async () => {
        try {
            const today = new Date().toISOString().split('T')[0];
            const { data: flights, error: err } = await supabase
                .from('flights')
                .select('*')
                .eq('flight_date', today)
                .order('std', { ascending: true });

            if (err) throw err;

            const all = flights || [];
            const airborne = all.filter(f => f.status === 'AIR' || f.status === 'DEP').length;
            const onTime = all.filter(f => !f.delay_minutes || f.delay_minutes <= 15).length;

            setData({
                activeFlights: all,
                airborneCount: airborne,
                onTimePct: all.length > 0 ? Math.round((onTime / all.length) * 100) : 0,
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
            .channel('network-flights')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'flights' }, () => fetchData())
            .subscribe();

        return () => { supabase.removeChannel(channel); };
    }, []);

    return { ...data, loading, error, refetch: fetchData };
}
