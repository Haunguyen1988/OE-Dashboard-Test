import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import type { GroundOpsMetric } from '../types/database';

interface GroundOpsData {
    metrics: GroundOpsMetric[];
    airports: string[];
    stages: string[];
}

export function useGroundOps() {
    const [data, setData] = useState<GroundOpsData>({ metrics: [], airports: [], stages: [] });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = async () => {
        try {
            const { data: metrics, error: err } = await supabase
                .from('ground_ops_metrics')
                .select('*')
                .order('airport_code')
                .order('stage');

            if (err) throw err;

            const airports = [...new Set((metrics || []).map(m => m.airport_code))];
            const stages = [...new Set((metrics || []).map(m => m.stage))];

            setData({ metrics: metrics || [], airports, stages });
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
