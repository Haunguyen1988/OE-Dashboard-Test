import { useState, useEffect, useRef, useCallback } from 'react';
import { fetchLiveStates } from '../lib/openSkyClient';
import type { LiveAircraft } from '../types/opensky';

const REFRESH_INTERVAL = 30_000; // 30 seconds
const BACKOFF_INTERVAL = 120_000; // 2 minutes on rate limit

interface UseOpenSkyResult {
    liveAircraft: LiveAircraft[];
    loading: boolean;
    error: string | null;
    lastUpdated: Date | null;
    isRateLimited: boolean;
}

export function useOpenSky(): UseOpenSkyResult {
    const [liveAircraft, setLiveAircraft] = useState<LiveAircraft[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
    const [isRateLimited, setIsRateLimited] = useState(false);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const fetchData = useCallback(async () => {
        try {
            const aircraft = await fetchLiveStates();
            setLiveAircraft(aircraft);
            setLastUpdated(new Date());
            setError(null);
            setIsRateLimited(false);
        } catch (err: any) {
            const msg = err.message || 'Failed to fetch OpenSky data';

            if (msg.includes('Rate limited')) {
                setIsRateLimited(true);
                setError('OpenSky API rate limited — using cached data');
                // Switch to longer interval
                if (intervalRef.current) {
                    clearInterval(intervalRef.current);
                    intervalRef.current = setInterval(fetchData, BACKOFF_INTERVAL);
                }
            } else {
                setError(msg);
            }
            // Keep previous data on error (graceful degradation)
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
        intervalRef.current = setInterval(fetchData, REFRESH_INTERVAL);

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [fetchData]);

    return { liveAircraft, loading, error, lastUpdated, isRateLimited };
}
