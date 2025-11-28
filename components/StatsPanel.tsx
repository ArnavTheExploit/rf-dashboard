'use client';

import Link from 'next/link';

interface DataPoint {
    id: string;
    lat: number;
    lng: number;
    rssi: number;
    noise_floor: number;
    frequency: number;
}

export default function StatsPanel({ data }: { data: DataPoint[] }) {
    if (data.length === 0) return null;

    const avgRssi = (data.reduce((acc, curr) => acc + curr.rssi, 0) / data.length).toFixed(1);
    const avgNoise = (data.reduce((acc, curr) => acc + curr.noise_floor, 0) / data.length).toFixed(1);
    const maxRssi = Math.max(...data.map(d => d.rssi));
    const activeFreq = data[data.length - 1].frequency; // Most recent frequency

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
            <Link href="/graphs" className="block transition-transform hover:scale-105">
                <div className="glass-panel-got p-4 rounded-xl border border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.1)] h-full cursor-pointer hover:border-cyan-500/50">
                    <h3 className="text-gray-400 text-sm uppercase tracking-wider">Avg Signal (RSSI)</h3>
                    <p className="text-2xl font-bold mt-1 text-cyan-300">{avgRssi} <span className="text-sm font-normal text-gray-400">dBm</span></p>
                </div>
            </Link>
            <Link href="/graphs" className="block transition-transform hover:scale-105">
                <div className="glass-panel-got p-4 rounded-xl border border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.1)] h-full cursor-pointer hover:border-cyan-500/50">
                    <h3 className="text-gray-400 text-sm uppercase tracking-wider">Avg Noise Floor</h3>
                    <p className="text-2xl font-bold mt-1 text-cyan-300">{avgNoise} <span className="text-sm font-normal text-gray-400">dBm</span></p>
                </div>
            </Link>
            <Link href="/heatmap" className="block transition-transform hover:scale-105">
                <div className="glass-panel-got p-4 rounded-xl border border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.1)] h-full cursor-pointer hover:border-cyan-500/50">
                    <h3 className="text-gray-400 text-sm uppercase tracking-wider">Peak Signal</h3>
                    <p className="text-2xl font-bold mt-1 text-cyan-300">{maxRssi} <span className="text-sm font-normal text-gray-400">dBm</span></p>
                </div>
            </Link>
            <Link href="/devices" className="block transition-transform hover:scale-105">
                <div className="glass-panel-got p-4 rounded-xl border border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.1)] h-full cursor-pointer hover:border-cyan-500/50">
                    <h3 className="text-gray-400 text-sm uppercase tracking-wider">Active Freq</h3>
                    <p className="text-2xl font-bold mt-1 text-cyan-300">{activeFreq} <span className="text-sm font-normal text-gray-400">MHz</span></p>
                </div>
            </Link>
        </div>
    );
}
