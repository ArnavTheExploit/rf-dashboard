'use client';

import StatsPanel from '@/components/StatsPanel';
import NoiseChart from '@/components/NoiseChart';
import { useRFData } from '@/hooks/useRFData';
import Snowfall from '@/components/Snowfall';
import { useVoiceAssistant, ExplainButton, generateExplanation } from '@/components/VoiceAssistant';

export default function AnalyticsPage() {
    const { data, status } = useRFData();
    const { speak, isSpeaking } = useVoiceAssistant();

    const handleExplainAnalytics = () => {
        if (data.length === 0) {
            speak('No analytics data available to explain.');
            return;
        }

        const avgRssi = data.reduce((acc, curr) => acc + curr.rssi, 0) / data.length;
        const avgNoise = data.reduce((acc, curr) => acc + curr.noise_floor, 0) / data.length;

        const explanation = `
            Analytics Overview. You are viewing ${data.length} signal intercepts.
            ${generateExplanation('rssi_trend', { avgRssi })}
            ${generateExplanation('noise_floor', { noiseFloor: avgNoise })}
            The charts show historical trends of signal strength and noise floor over time, helping identify patterns and anomalies in your RF environment.
        `;
        speak(explanation);
    };

    return (
        <div className="min-h-screen text-white flex flex-col relative overflow-hidden">
            {/* GOT Winter Background */}
            <div
                className="fixed inset-0 bg-cover bg-center bg-no-repeat opacity-20 z-0"
                style={{ backgroundImage: 'url(/background-got.jpg)' }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-slate-900/95 via-slate-800/90 to-slate-900/95 z-0" />
            <Snowfall />

            {/* House VantEdge Crest Header */}
            <header className="glass-header sticky top-0 z-40 px-6 py-4 flex justify-between items-center bg-slate-900/80 backdrop-blur-md border-b border-cyan-500/20 shadow-[0_4px_20px_rgba(6,182,212,0.1)]">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500/20 to-slate-800/80 border-2 border-cyan-400/50 flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.3)] backdrop-blur-sm">
                        <span className="text-cyan-300 font-bold text-2xl">V</span>
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-cyan-300 via-blue-300 to-cyan-400 bg-clip-text text-transparent">
                            House VantEdge
                        </h1>
                        <p className="text-xs text-cyan-400/80 font-medium tracking-wide uppercase">
                            Analytics • RF Signal Intelligence
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/50 border border-cyan-500/30">
                        <div className={`w-2 h-2 rounded-full ${status === 'online' ? 'bg-emerald-400 animate-pulse shadow-[0_0_8px_emerald]' : 'bg-red-400'} `}></div>
                        <span className="text-xs text-slate-300">{status === 'online' ? 'Live Feed' : 'Offline Mode'}</span>
                    </div>
                    <button className="bg-cyan-600/20 hover:bg-cyan-600/40 border border-cyan-500/50 text-cyan-400 px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-[0_0_10px_rgba(6,182,212,0.2)]">
                        Export Report
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 p-4 md:p-6 flex flex-col gap-6 overflow-hidden relative z-10 max-w-7xl mx-auto w-full">

                {/* Stats Row */}
                <div className="shrink-0 relative">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold text-cyan-300 tracking-wide flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
                            </svg>
                            Key Metrics
                        </h2>
                        <ExplainButton onClick={handleExplainAnalytics} isSpeaking={isSpeaking} size="sm" />
                    </div>
                    <StatsPanel data={data} />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
                    {/* Charts Column - Takes up 2/3 space on large screens */}
                    <div className="lg:col-span-2 glass-panel-got rounded-2xl overflow-hidden border border-cyan-500/20 flex flex-col shadow-[0_0_20px_rgba(6,182,212,0.1)]" style={{ minHeight: '500px' }}>
                        <div className="p-4 border-b border-cyan-500/20 bg-slate-900/40">
                            <h3 className="text-lg font-semibold text-cyan-300 flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0 0 20.25 18V6A2.25 2.25 0 0 0 18 3.75H6A2.25 2.25 0 0 0 3.75 6v12A2.25 2.25 0 0 0 6 20.25Z" />
                                </svg>
                                Noise Floor Analysis
                            </h3>
                        </div>
                        <div className="flex-1 p-2">
                            <NoiseChart data={data} />
                        </div>
                    </div>

                    {/* Signal Intercepts Column - Takes up 1/3 space */}
                    <div className="glass-panel-got rounded-2xl flex flex-col overflow-hidden border border-cyan-500/20 shadow-[0_0_20px_rgba(6,182,212,0.1)]" style={{ maxHeight: '600px' }}>
                        <div className="p-4 border-b border-cyan-500/20 bg-slate-900/40 sticky top-0 z-10 backdrop-blur-md">
                            <h3 className="text-lg font-semibold flex items-center gap-2 text-cyan-300">
                                <span className="w-1.5 h-6 bg-cyan-500 rounded-full shadow-[0_0_8px_cyan]"></span>
                                Recent Intercepts
                                <span className="ml-auto text-xs font-normal text-slate-400 bg-slate-800/50 px-2 py-1 rounded-full border border-slate-700">{data.length} Total</span>
                            </h3>
                        </div>
                        <div className="space-y-2 flex-1 overflow-y-auto p-4 custom-scrollbar">
                            {data.length === 0 ? (
                                <div className="text-center py-12 text-slate-400 flex flex-col items-center gap-3">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 opacity-50">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                    </svg>
                                    <p>No signal intercepts available</p>
                                </div>
                            ) : (
                                data.slice().reverse().map((item, idx) => (
                                    <div key={idx} className="group flex items-start gap-3 p-3 rounded-lg glass-panel border border-slate-700/50 hover:border-cyan-500/40 hover:bg-slate-800/60 transition-all duration-200">
                                        <div className={`w-2.5 h-2.5 mt-1.5 rounded-full shrink-0 ${item.rssi > -50 ? 'bg-red-500 shadow-[0_0_8px_red]' : 'bg-emerald-500 shadow-[0_0_8px_emerald]'}`}></div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start">
                                                <p className="text-sm font-medium text-slate-200 group-hover:text-cyan-300 transition-colors">{item.frequency} MHz</p>
                                                <span className="text-[10px] text-slate-500 font-mono bg-slate-900/50 px-1.5 py-0.5 rounded border border-slate-800">{new Date(item.timestamp).toLocaleTimeString()}</span>
                                            </div>
                                            <div className="flex items-center gap-3 mt-1">
                                                <p className="text-xs text-slate-400">RSSI: <span className={item.rssi > -60 ? 'text-emerald-400' : 'text-slate-300'}>{item.rssi}</span> dBm</p>
                                                <p className="text-xs text-slate-400">Noise: {item.noise_floor}</p>
                                            </div>
                                            <p className="text-[10px] text-slate-600 font-mono mt-1 truncate opacity-60 group-hover:opacity-100 transition-opacity">ID: {item.id}</p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

            </main>
        </div>
    );
}
