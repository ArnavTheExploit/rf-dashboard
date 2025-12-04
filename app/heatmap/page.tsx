'use client';

import dynamic from 'next/dynamic';
import { useRFData } from '@/hooks/useRFData';
import { Suspense } from 'react';
import { useVoiceAssistant, ExplainButton, generateExplanation } from '@/components/VoiceAssistant';

// Dynamically import MapComponent to avoid SSR issues with Leaflet
const MapComponent = dynamic(() => import('@/components/MapComponent'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-slate-900/50 rounded-xl animate-pulse">
      <p className="text-cyan-400">Loading Heatmap...</p>
    </div>
  ),
});

function HeatmapContent() {
  const { data, status } = useRFData();
  const { speak, isSpeaking } = useVoiceAssistant();

  const handleExplainHeatmap = () => {
    if (data.length === 0) {
      speak('No heatmap data available to explain.');
      return;
    }

    // Analyze heatmap data
    const avgRssi = data.reduce((acc, curr) => acc + curr.rssi, 0) / data.length;
    const maxRssi = Math.max(...data.map(d => d.rssi));
    const minRssi = Math.min(...data.map(d => d.rssi));
    const intensity = (avgRssi + 100) / 70; // Normalize to 0-1

    const explanation = `
      RF Heatmap Analysis. This visualization shows signal strength distribution across your monitoring area.
      ${generateExplanation('heatmap_region', { intensity, pointCount: data.length })}
      The average signal strength is ${avgRssi.toFixed(1)} decibels per milliwatt, ranging from ${minRssi} to ${maxRssi} decibels per milliwatt.
      ${intensity > 0.7 ? 'The heatmap shows strong overall coverage with most areas having good signal strength.' : intensity > 0.4 ? 'The heatmap shows moderate coverage with some areas that may need attention.' : 'The heatmap indicates areas with weaker signals that may require additional access points or signal boosters.'}
      Red and yellow regions represent areas with the strongest signals, ideal for device placement. Blue regions indicate areas where signal strength is weaker and may experience connectivity issues.
    `;
    speak(explanation);
  };

  const handleExplainStats = () => {
    if (data.length === 0) {
      speak('No statistics available to explain.');
      return;
    }

    const avgRssi = data.reduce((acc, curr) => acc + curr.rssi, 0) / data.length;
    const deviceCount = new Set(data.map(d => d.device_id)).size;

    const explanation = `
      Heatmap Statistics. You are viewing ${data.length} total readings from ${deviceCount} active devices.
      ${generateExplanation('rssi_trend', { avgRssi })}
      The heatmap provides a visual representation of RF signal distribution, helping you identify optimal coverage areas and potential dead zones.
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
      <div className="absolute inset-0 bg-linear-to-b from-slate-900/95 via-slate-800/90 to-slate-900/95 z-0" />

      {/* House VantEdge Crest Header */}
      <header className="glass-header sticky top-0 z-40 px-6 py-4 flex justify-between items-center bg-slate-900/80 backdrop-blur-md border-b border-cyan-500/20 shadow-[0_4px_20px_rgba(6,182,212,0.1)]">
        <div className="flex items-center gap-4 pl-16 md:pl-0">
          <div className="w-16 h-16 rounded-full bg-linear-to-br from-cyan-500/20 to-slate-800/80 border-2 border-cyan-400/50 flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.3)] backdrop-blur-sm">
            <span className="text-cyan-300 font-bold text-2xl">V</span>
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-cyan-300 via-blue-300 to-cyan-400 bg-clip-text text-transparent">
              House VantEdge
            </h1>
            <p className="text-xs text-cyan-400/80 font-medium tracking-wide uppercase">
              RF Heatmap • Winter Watch
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/50 border border-cyan-500/30">
            <div className={`w-2 h-2 rounded-full ${status === 'online' ? 'bg-emerald-400 animate-pulse shadow-[0_0_8px_emerald]' : 'bg-red-400'} `}></div>
            <span className="text-xs text-slate-300">{status === 'online' ? 'Live Feed' : 'Offline Mode'}</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-6 flex flex-col gap-6 overflow-hidden relative z-10">
        {/* Stats Row */}
        <div className="shrink-0 grid grid-cols-2 md:grid-cols-4 gap-4 relative">
          <div className="absolute top-2 right-2 z-10">
            <ExplainButton onClick={handleExplainStats} isSpeaking={isSpeaking} size="sm" />
          </div>
          <div className="glass-panel-got p-4 rounded-xl border border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.1)]">
            <h3 className="text-gray-400 text-sm uppercase tracking-wider">Total Readings</h3>
            <p className="text-2xl font-bold mt-1 text-cyan-300">{data.length}</p>
          </div>
          <div className="glass-panel-got p-4 rounded-xl border border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.1)]">
            <h3 className="text-gray-400 text-sm uppercase tracking-wider">Active Devices</h3>
            <p className="text-2xl font-bold mt-1 text-cyan-300">
              {new Set(data.map(d => d.device_id)).size}
            </p>
          </div>
          <div className="glass-panel-got p-4 rounded-xl border border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.1)]">
            <h3 className="text-gray-400 text-sm uppercase tracking-wider">Avg Signal</h3>
            <p className="text-2xl font-bold mt-1 text-cyan-300">
              {data.length > 0 ? (data.reduce((acc, curr) => acc + curr.rssi, 0) / data.length).toFixed(1) : '0'} <span className="text-sm font-normal text-gray-400">dBm</span>
            </p>
          </div>
          <div className="glass-panel-got p-4 rounded-xl border border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.1)]">
            <h3 className="text-gray-400 text-sm uppercase tracking-wider">Coverage Area</h3>
            <p className="text-2xl font-bold mt-1 text-cyan-300">Active</p>
          </div>
        </div>

        {/* Map Container - Full Height */}
        <div className="flex-1 glass-panel-got rounded-2xl p-1 overflow-hidden relative group border-cyan-500/30 min-h-[500px] shadow-[0_0_30px_rgba(6,182,212,0.2)]">
          <div className="absolute top-4 right-4 z-400 flex items-center gap-2">
            <ExplainButton onClick={handleExplainHeatmap} isSpeaking={isSpeaking} size="sm" />
            <div className="bg-slate-900/90 backdrop-blur text-xs px-3 py-1 rounded-md border border-cyan-500/30 text-cyan-400 shadow-lg">
              Sector: Winterfell
            </div>
          </div>
          <MapComponent data={data} selectedParam="rssi" />
        </div>
      </main>
    </div>
  );
}

export default function HeatmapPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#050505] flex items-center justify-center text-cyan-500">Initializing Heatmap...</div>}>
      <HeatmapContent />
    </Suspense>
  );
}

