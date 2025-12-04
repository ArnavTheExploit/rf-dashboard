import { useState, useEffect } from 'react';
import axios from 'axios';
import mockData from '@/mock-db.json';

import { RFReading } from '@/types';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

export function useRFData() {
    const [data, setData] = useState<RFReading[]>([]);
    const [status, setStatus] = useState<'online' | 'offline' | 'loading'>('loading');
    const [lastFetch, setLastFetch] = useState<number | null>(null);

    useEffect(() => {
        let mounted = true;

        const fetchData = async () => {
            try {
                // Try Next.js API first, then fallback to backend
                let res;
                try {
                    res = await axios.get('/api/rf/all', { timeout: 3000 });
                } catch (nextApiError) {
                    // Fallback to backend if Next.js API fails
                    res = await axios.get(`${BACKEND_URL}/api/rf/all`, { timeout: 3000 });
                }

                if (!mounted) return;

                // Normalize backend data if needed
                const normalizedData = res.data.map((item: any) => ({
                    ...item,
                    timestamp: new Date(item.timestamp).toISOString(),
                    id: item.id || item.device_id || Math.random().toString(36).substr(2, 9),
                    device_name: item.device_name || 'Unknown Device',
                    lat: item.lat || item.latitude,
                    lng: item.lng || item.longitude,
                    rssi: item.rssi || item.rf_dbm,
                    rf_dbm: item.rf_dbm || item.rssi,
                    frequency: item.frequency || 2412,
                    noise_floor: item.noise_floor || -100,
                    snr: item.snr || (item.signal_strength ? item.signal_strength / 2 : 0), // Approx SNR from signal strength
                    battery: item.battery || item.battery_percentage,
                }));

                setData(normalizedData);
                setStatus('online');
                setLastFetch(Date.now());
            } catch (err) {
                if (!mounted) return;
                console.warn('Backend unreachable, using mock data');

                // Use mock data as fallback
                const normalizedMockData = (mockData as any[]).map(item => ({
                    ...item,
                    id: item.device_id,
                    lat: item.latitude,
                    lng: item.longitude,
                    battery: item.battery_percentage,
                    rf_dbm: item.rssi, // Map RSSI to rf_dbm if missing
                    snr: item.signal_strength ? item.signal_strength / 2 : 0
                }));
                setData(normalizedMockData as any);
                setStatus('offline');
            }
        };

        fetchData();
        const interval = setInterval(fetchData, 10000); // Refresh every 10 seconds

        return () => {
            mounted = false;
            clearInterval(interval);
        };
    }, []);

    return { data, status, lastFetch };
}
