import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import type { Airport } from '../types/database';

export function useAirports() {
    const [airports, setAirports] = useState<Airport[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetch() {
            try {
                const { data, error } = await supabase
                    .from('airports')
                    .select('*')
                    .not('latitude', 'is', null)
                    .not('longitude', 'is', null);

                if (error) throw error;
                setAirports(data || []);
            } catch {
                // Silently fail — airports are supplementary
                setAirports([]);
            } finally {
                setLoading(false);
            }
        }
        fetch();
    }, []);

    return { airports, loading };
}
