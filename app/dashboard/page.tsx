'use client';

import { useState, useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';
import StatsPanel from '@/components/StatsPanel';
import { useRFData } from '@/hooks/useRFData';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { useVoiceAssistant, ExplainButton, generateExplanation } from '@/components/VoiceAssistant';
import ExportModal from '@/components/ExportModal';

// Dynamically import MapComponent to avoid SSR issues with Leaflet
const MapComponent = dynamic(() => import('@/components/MapComponent'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-slate-900/50 rounded-xl animate-pulse">
      <p className="text-cyan-400">Loading RF Map...</p>
    </div>
  ),
});

function DashboardContent() {
  const { data, status } = useRFData();
  const searchParams = useSearchParams();
  const selectedParam = searchParams.get('param') || 'rssi';
  const { speak, isSpeaking } = useVoiceAssistant();
  const [isExportOpen, setIsExportOpen] = useState(false);

  const paramLabels: Record<string, string> = {
    rssi: 'Signal Strength',
    noise: 'Noise Floor',
    frequency: 'Frequency'
  };

  // Track previous fetch timestamp to detect updates
  const prevFetchRef = useRef<number | null>(null);
  const { lastFetch } = useRFData();

  const handleExplainStats = (isAuto = false) => {
    if (data.length === 0) {
      if (!isAuto) speak('No data available to explain.');
      return;
    }

    const avgRssi = data.reduce((acc, curr) => acc + curr.rssi, 0) / data.length;
    const avgNoise = data.reduce((acc, curr) => acc + curr.noise_floor, 0) / data.length;
    const avgSnr = data.reduce((acc, curr) => acc + (curr.snr || (curr.rssi - curr.noise_floor)), 0) / data.length;

    const intro = isAuto ? "New data received. Here is the updated status." : "Current RF statistics overview.";

    const explanation = `
      ${intro}
      ${generateExplanation('rssi_trend', { avgRssi })}
      ${generateExplanation('noise_floor', { noiseFloor: avgNoise })}
      ${generateExplanation('snr', { snr: avgSnr })}
      You are viewing ${data.length} total readings from ${new Set(data.map(d => d.device_id)).size} active devices.
    `;
    speak(explanation);
  };

  // Auto-explain when data updates
  useEffect(() => {
    if (lastFetch && prevFetchRef.current !== lastFetch && data.length > 0) {
      // Skip the very first load if desired, or explain it too. 
      // Assuming we want to explain every update including the first one if it's "fresh"
      // But to avoid annoyance on page reload, maybe only if it's an update?
      // The user said "keep on changing... make the AI voice explain".
      // Let's explain every time.
      handleExplainStats(true);
      prevFetchRef.current = lastFetch;
    }
  }, [lastFetch, data]);

  const handleExplainMap = () => {
    if (data.length === 0) {
      speak('No heatmap data available to explain.');
      return;
    }

    const explanation = generateExplanation('heatmap_region', {
      intensity: 0.7,
      pointCount: data.length,
    });
    speak(`Heatmap overview. ${explanation} The color intensity represents ${paramLabels[selectedParam]}. Red and yellow areas indicate stronger values, while blue areas show weaker readings.`);
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
            <h1 className="text-3xl font-bold tracking-tight bg-linear-to-r from-cyan-300 via-blue-300 to-cyan-400 bg-clip-text text-transparent">
              House VantEdge
            </h1>
            <p className="text-xs text-cyan-400/80 font-medium tracking-wide uppercase">
              War Room • RF Noise Mapping • <span className="text-white">{paramLabels[selectedParam]}</span>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/50 border border-cyan-500/30">
            <div className={`w-2 h-2 rounded-full ${status === 'online' ? 'bg-emerald-400 animate-pulse shadow-[0_0_8px_emerald]' : 'bg-red-400'} `}></div>
            <span className="text-xs text-slate-300">{status === 'online' ? 'Live Feed' : 'Offline Mode'}</span>
          </div>
          <button
            onClick={() => setIsExportOpen(true)}
            className="bg-cyan-600/20 hover:bg-cyan-600/40 border border-cyan-500/50 text-cyan-400 px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-[0_0_10px_rgba(6,182,212,0.2)]"
          >
            Export Intel
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-6 flex flex-col gap-6 overflow-hidden relative z-10">

        {/* Stats Row */}
        <div className="shrink-0 relative">
          <div className="absolute top-2 right-2 z-10">
            <ExplainButton onClick={handleExplainStats} isSpeaking={isSpeaking} size="sm" />
          </div>
          <StatsPanel data={data} />
        </div>

        {/* Map Container - Full Height */}
        <div className="flex-1 glass-panel-got rounded-2xl p-1 relative group border-cyan-500/30 min-h-[500px] shadow-[0_0_30px_rgba(6,182,212,0.2)] flex flex-col">
          <div className="absolute top-4 right-4 z-[1000] flex items-center gap-2">
            <ExplainButton onClick={handleExplainMap} isSpeaking={isSpeaking} size="sm" />
            <div className="bg-slate-900/90 backdrop-blur text-xs px-3 py-1 rounded-md border border-cyan-500/30 text-cyan-400 shadow-lg">
              Sector: BMSIT&M
            </div>
          </div>
          <div className="flex-1 w-full h-full relative" style={{ minHeight: '500px' }}>
            <MapComponent data={data} selectedParam={selectedParam} />
          </div>
        </div>

      </main>

      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        data={data}
      />
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#050505] flex items-center justify-center text-cyan-500">Initializing Dashboard...</div>}>
      <DashboardContent />
    </Suspense>
  );
}
