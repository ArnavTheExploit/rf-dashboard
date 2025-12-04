'use client';

import { useState } from 'react';
import { RFReading } from '@/types';

interface ExportModalProps {
    isOpen: boolean;
    onClose: () => void;
    data: RFReading[];
}

export default function ExportModal({ isOpen, onClose, data }: ExportModalProps) {
    if (!isOpen) return null;

    const headers = [
        'device_id',
        'device_name',
        'latitude',
        'longitude',
        'battery_percentage',
        'noise_floor',
        'rssi',
        'signal_strength',
        'frequency',
        'timestamp'
    ];

    const formatCSV = () => {
        const csvRows = [
            headers.join(','), // Header row
            ...data.map(row => {
                const signalStrength = Math.min(100, Math.max(0, (row.rssi + 100) * 2)); // Approx 0-100 scale
                return [
                    row.device_id,
                    `"${row.device_name || 'Unknown'}"`, // Quote to handle commas
                    row.lat,
                    row.lng,
                    row.battery || 0,
                    row.noise_floor,
                    row.rssi,
                    signalStrength,
                    row.frequency,
                    `"${new Date(row.timestamp).toISOString()}"`
                ].join(',');
            })
        ];
        return csvRows.join('\n');
    };

    const handleDownload = () => {
        const csvData = formatCSV();
        const blob = new Blob([csvData], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `rf-intel-export-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-slate-900 border border-cyan-500/30 rounded-2xl shadow-[0_0_50px_rgba(6,182,212,0.2)] w-full max-w-4xl flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/50 rounded-t-2xl">
                    <div>
                        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                            <span className="w-2 h-8 bg-cyan-500 rounded-full shadow-[0_0_10px_cyan]"></span>
                            Export Intelligence Report
                        </h2>
                        <p className="text-slate-400 mt-1">Previewing {data.length} records ready for extraction</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Preview Table */}
                <div className="flex-1 overflow-auto p-6 custom-scrollbar bg-slate-950/30">
                    <div className="border border-slate-800 rounded-lg overflow-hidden">
                        <table className="w-full text-left text-sm text-slate-400">
                            <thead className="bg-slate-900 text-cyan-400 font-medium uppercase tracking-wider text-xs sticky top-0 z-10">
                                <tr>
                                    {headers.map(header => (
                                        <th key={header} className="px-4 py-3 border-b border-slate-800 bg-slate-900">
                                            {header.replace('_', ' ')}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/50">
                                {data.slice(0, 50).map((row, idx) => (
                                    <tr key={idx} className="hover:bg-slate-800/30 transition-colors">
                                        <td className="px-4 py-2 font-mono text-slate-300">{row.device_id}</td>
                                        <td className="px-4 py-2 text-white font-medium">{row.device_name}</td>
                                        <td className="px-4 py-2">{row.lat.toFixed(6)}</td>
                                        <td className="px-4 py-2">{row.lng.toFixed(6)}</td>
                                        <td className="px-4 py-2">{row.battery}%</td>
                                        <td className="px-4 py-2">{row.noise_floor}</td>
                                        <td className="px-4 py-2">{row.rssi}</td>
                                        <td className="px-4 py-2">
                                            <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-cyan-500"
                                                    style={{ width: `${Math.min(100, Math.max(0, (row.rssi + 100) * 2))}%` }}
                                                />
                                            </div>
                                        </td>
                                        <td className="px-4 py-2">{row.frequency}</td>
                                        <td className="px-4 py-2 font-mono text-xs">{new Date(row.timestamp).toLocaleTimeString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {data.length > 50 && (
                            <div className="p-4 text-center text-slate-500 border-t border-slate-800 bg-slate-900/50">
                                ... and {data.length - 50} more records
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="p-6 border-t border-slate-800 bg-slate-900/50 rounded-b-2xl flex justify-end gap-4">
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white transition-all font-medium"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleDownload}
                        className="px-6 py-2.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] transition-all flex items-center gap-2"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                        </svg>
                        Download CSV Report
                    </button>
                </div>
            </div>
        </div>
    );
}
