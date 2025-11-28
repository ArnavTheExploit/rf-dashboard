'use client';

import Link from 'next/link';
import { Activity, Radio, Wifi, Map, BarChart3, Monitor, LayoutDashboard } from 'lucide-react';
import Snowfall from '@/components/Snowfall';

export default function SelectionPage() {
    const parameters = [
        {
            id: 'rssi',
            name: 'Signal Strength',
            description: 'Visualize Received Signal Strength Indicator (RSSI) levels across the campus.',
            icon: Wifi,
            color: 'text-emerald-400',
            borderColor: 'group-hover:border-emerald-500',
            bgGradient: 'group-hover:from-emerald-900/20',
            path: '/dashboard?param=rssi',
        },
        {
            id: 'noise',
            name: 'Noise Floor',
            description: 'Map the background RF noise levels to identify interference zones.',
            icon: Activity,
            color: 'text-red-400',
            borderColor: 'group-hover:border-red-500',
            bgGradient: 'group-hover:from-red-900/20',
            path: '/dashboard?param=noise',
        },
        {
            id: 'frequency',
            name: 'Frequency Distribution',
            description: 'Analyze the distribution of active frequencies in the spectrum.',
            icon: Radio,
            color: 'text-blue-400',
            borderColor: 'group-hover:border-blue-500',
            bgGradient: 'group-hover:from-blue-900/20',
            path: '/dashboard?param=frequency',
        },
    ];

    const quickNavPages = [
        {
            name: 'War Room',
            description: 'Main dashboard with interactive map',
            icon: LayoutDashboard,
            path: '/dashboard',
            color: 'text-cyan-400',
        },
        {
            name: 'Heatmap',
            description: 'RF signal heatmap visualization',
            icon: Map,
            path: '/heatmap',
            color: 'text-purple-400',
        },
        {
            name: 'Graphs',
            description: 'Analytical charts and trends',
            icon: BarChart3,
            path: '/graphs',
            color: 'text-blue-400',
        },
        {
            name: 'Devices',
            description: 'Device monitoring and status',
            icon: Monitor,
            path: '/devices',
            color: 'text-green-400',
        },
    ];

    return (
        <div className="min-h-screen bg-[#050505] text-white flex relative overflow-hidden">
            {/* Main Content */}
            <div className="flex-1 w-full">
                {/* GOT Winter Background */}
                <div 
                    className="fixed inset-0 bg-cover bg-center bg-no-repeat opacity-20 z-0"
                    style={{ backgroundImage: 'url(/background-got.jpg)' }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-slate-900/95 via-slate-800/90 to-slate-900/95 z-0" />
                <Snowfall />
                
                <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4 md:p-8">
                    <div className="max-w-7xl w-full">
                        {/* Header */}
                        <div className="text-center mb-12">
                            <div className="flex items-center justify-center gap-4 mb-6">
                                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500/20 to-slate-800/80 border-2 border-cyan-400/50 flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.3)] backdrop-blur-sm">
                                    <span className="text-cyan-300 font-bold text-2xl">V</span>
                                </div>
                                <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-cyan-300 via-blue-300 to-cyan-400 bg-clip-text text-transparent">
                                    House VantEdge
                                </h1>
                            </div>
                            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-slate-200">
                                Choose Your Intel
                            </h2>
                            <p className="text-slate-400 text-lg">
                                Select the primary parameter to visualize or navigate to a specific page.
                            </p>
                        </div>

                        {/* Quick Navigation */}
                        <div className="mb-12">
                            <h3 className="text-xl font-semibold mb-4 text-cyan-300">Quick Navigation</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                {quickNavPages.map((page) => (
                                    <Link
                                        key={page.path}
                                        href={page.path}
                                        className="group glass-panel-got p-6 rounded-xl border border-cyan-500/20 hover:border-cyan-400/50 transition-all duration-300 hover:-translate-y-1"
                                    >
                                        <div className={`${page.color} mb-3 group-hover:scale-110 transition-transform duration-300`}>
                                            <page.icon size={28} />
                                        </div>
                                        <h4 className="text-lg font-bold mb-2 text-white">{page.name}</h4>
                                        <p className="text-sm text-slate-400">{page.description}</p>
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Parameter Selection */}
                        <div>
                            <h3 className="text-xl font-semibold mb-4 text-cyan-300">Parameter Selection</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {parameters.map((param) => (
                                    <Link
                                        key={param.id}
                                        href={param.path}
                                        className={`group relative p-8 rounded-xl border border-slate-800 glass-panel-got transition-all duration-300 hover:-translate-y-2 ${param.borderColor}`}
                                    >
                                        <div className={`absolute inset-0 rounded-xl bg-gradient-to-br from-transparent to-transparent ${param.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>

                                        <div className="relative z-10 flex flex-col items-center text-center h-full">
                                            <div className={`p-4 rounded-full bg-slate-800/80 mb-6 ${param.color} group-hover:scale-110 transition-transform duration-300`}>
                                                <param.icon size={32} />
                                            </div>

                                            <h3 className="text-2xl font-bold mb-3 text-slate-200 group-hover:text-white transition-colors">
                                                {param.name}
                                            </h3>

                                            <p className="text-slate-400 text-sm leading-relaxed mb-6 grow">
                                                {param.description}
                                            </p>

                                            <div className="w-full py-3 rounded-lg border border-cyan-500/30 text-cyan-300 text-sm font-medium uppercase tracking-wider group-hover:bg-cyan-900/20 group-hover:border-cyan-400/50 transition-all">
                                                Initialize
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
