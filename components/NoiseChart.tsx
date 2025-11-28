'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

interface DataPoint {
    id: string;
    timestamp: string;
    rssi: number;
    noise_floor: number;
}

export default function NoiseChart({ data }: { data: DataPoint[] }) {
    // Format data for charts (maybe just take last 20 points for readability)
    const chartData = data.slice(-20).map(d => ({
        ...d,
        time: new Date(d.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }));

    return (
        <div className="w-full h-full grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
            <div className="glass-panel-got border border-cyan-500/20 p-4 rounded-xl flex flex-col" style={{ minHeight: '300px' }}>
                <h3 className="text-cyan-300 mb-4 font-semibold flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
                    </svg>
                    Signal Strength (RSSI) History
                </h3>
                <div className="flex-1" style={{ minHeight: '250px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                            <XAxis dataKey="time" stroke="#94a3b8" style={{ fontSize: '12px' }} />
                            <YAxis stroke="#94a3b8" domain={[-100, -20]} style={{ fontSize: '12px' }} />
                            <Tooltip
                                contentStyle={{ 
                                    backgroundColor: 'rgba(15, 23, 42, 0.95)', 
                                    border: '1px solid rgba(6, 182, 212, 0.3)',
                                    borderRadius: '8px',
                                    color: '#e2e8f0'
                                }}
                            />
                            <Line type="monotone" dataKey="rssi" stroke="#06b6d4" strokeWidth={2} dot={{ fill: '#06b6d4', r: 3 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="glass-panel-got border border-cyan-500/20 p-4 rounded-xl flex flex-col" style={{ minHeight: '300px' }}>
                <h3 className="text-cyan-300 mb-4 font-semibold flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
                    </svg>
                    Noise Floor Trends
                </h3>
                <div className="flex-1" style={{ minHeight: '250px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                            <XAxis dataKey="time" stroke="#94a3b8" style={{ fontSize: '12px' }} />
                            <YAxis stroke="#94a3b8" domain={[-110, -80]} style={{ fontSize: '12px' }} />
                            <Tooltip
                                contentStyle={{ 
                                    backgroundColor: 'rgba(15, 23, 42, 0.95)', 
                                    border: '1px solid rgba(6, 182, 212, 0.3)',
                                    borderRadius: '8px',
                                    color: '#e2e8f0'
                                }}
                            />
                            <Area type="monotone" dataKey="noise_floor" stroke="#ef4444" fill="#ef4444" fillOpacity={0.3} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
