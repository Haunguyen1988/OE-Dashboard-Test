import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import type { Flight } from '../types/database';

export function useFlightDetail(flightId: string) {
    const [flight, setFlight] = useState<Flight | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = async () => {
        try {
            // flightId format is like "VJ126" — extract carrier_code and flight_number
            const match = flightId.match(/^([A-Z]{2})(\d+)$/);
            let query = supabase.from('flights').select('*');

            if (match) {
                query = query.eq('carrier_code', match[1]).eq('flight_number', parseInt(match[2]));
            } else {
                // Try as numeric ID
                query = query.eq('id', parseInt(flightId));
            }

            const { data, error: err } = await query.order('flight_date', { ascending: false }).limit(1).single();

            if (err) throw err;
            setFlight(data);
            setError(null);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!flightId) return;
        fetchData();
    }, [flightId]);

    return { flight, loading, error, refetch: fetchData };
}
