import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import type { Alert } from '../types/database';

interface AlertsData {
    alerts: Alert[];
    stats: { total24h: number; avgResTime: number };
}

export function useAlerts() {
    const [data, setData] = useState<AlertsData>({ alerts: [], stats: { total24h: 0, avgResTime: 0 } });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = async () => {
        try {
            const { data: alerts, error: err } = await supabase
                .from('alerts')
                .select('*')
                .order('created_at', { ascending: false });

            if (err) throw err;

            const all = alerts || [];
            const activeCount = all.filter(a => a.status === 'active').length;

            setData({
                alerts: all,
                stats: { total24h: all.length, avgResTime: 18 },
            });
            setError(null);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const acknowledgeAlert = async (alertId: string) => {
        const { error: err } = await supabase
            .from('alerts')
            .update({ status: 'acknowledged' })
            .eq('id', alertId);
        if (!err) fetchData();
    };

    useEffect(() => {
        fetchData();

        const channel = supabase
            .channel('alerts-feed')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'alerts' }, () => fetchData())
            .subscribe();

        return () => { supabase.removeChannel(channel); };
    }, []);

    return { ...data, loading, error, refetch: fetchData, acknowledgeAlert };
}
