'use client';

import { useRFData } from '@/hooks/useRFData';
import { Suspense, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useVoiceAssistant, ExplainButton, generateExplanation } from '@/components/VoiceAssistant';

function GraphsContent() {
  const { data, status } = useRFData();
  const { speak, isSpeaking } = useVoiceAssistant();

  // Prepare data for charts - take last 50 readings for performance
  const chartData = data
    .slice(-50)
    .map((reading) => ({
      time: new Date(reading.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      timestamp: reading.timestamp,
      rssi: reading.rssi,
      snr: reading.snr || (reading.rssi - reading.noise_floor),
      noiseFloor: reading.noise_floor,
      device: reading.device_id,
    }))
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

  // Calculate trends
  const rssiTrend = useMemo(() => {
    if (chartData.length < 2) return 'stable';
    const first = chartData[0].rssi;
    const last = chartData[chartData.length - 1].rssi;
    if (last > first + 5) return 'increasing';
    if (last < first - 5) return 'decreasing';
    return 'stable';
  }, [chartData]);

  const snrTrend = useMemo(() => {
    if (chartData.length < 2) return 'stable';
    const first = chartData[0].snr;
    const last = chartData[chartData.length - 1].snr;
    if (last > first + 3) return 'increasing';
    if (last < first - 3) return 'decreasing';
    return 'stable';
  }, [chartData]);

  const handleExplainRSSI = () => {
    if (chartData.length === 0) {
      speak('No RSSI data available to explain.');
      return;
    }

    const avgRssi = chartData.reduce((acc, curr) => acc + curr.rssi, 0) / chartData.length;
    const explanation = `
      RSSI Signal Strength Chart. ${generateExplanation('rssi_trend', { avgRssi })}
      ${generateExplanation('graph_trend', { trend: rssiTrend, metric: 'RSSI' })}
      This graph shows how signal strength changes over time. Higher values indicate stronger signals, while lower values suggest weaker connectivity or increased distance from signal sources.
    `;
    speak(explanation);
  };

  const handleExplainSNR = () => {
    if (chartData.length === 0) {
      speak('No SNR data available to explain.');
      return;
    }

    const avgSnr = chartData.reduce((acc, curr) => acc + curr.snr, 0) / chartData.length;
    const explanation = `
      Signal-to-Noise Ratio Chart. ${generateExplanation('snr', { snr: avgSnr })}
      ${generateExplanation('graph_trend', { trend: snrTrend, metric: 'SNR' })}
      This graph displays the ratio between signal strength and background noise. Higher SNR values mean clearer communication and less interference.
    `;
    speak(explanation);
  };

  const handleExplainNoiseFloor = () => {
    if (chartData.length === 0) {
      speak('No noise floor data available to explain.');
      return;
    }

    const avgNoise = chartData.reduce((acc, curr) => acc + curr.noiseFloor, 0) / chartData.length;
    const explanation = `
      Noise Floor Chart. ${generateExplanation('noise_floor', { noiseFloor: avgNoise })}
      This graph shows the background noise level over time. Lower values indicate a cleaner RF environment, while higher values suggest increased interference from other sources.
    `;
    speak(explanation);
  };

  // Custom tooltip with explain functionality
  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload || !payload.length) return null;
    
    const data = payload[0].payload;
    const handleExplainPoint = () => {
      const explanation = generateExplanation('data_point', {
        rssi: data.rssi,
        noise_floor: data.noiseFloor,
        snr: data.snr,
        timestamp: data.timestamp,
        device_id: data.device,
      });
      speak(`Data point at ${data.time}. ${explanation}`);
    };

    return (
      <div className="glass-panel-got p-3 rounded-lg border border-cyan-500/30 shadow-lg">
        <p className="text-cyan-300 font-semibold mb-1">{payload[0].name}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-white text-sm">
            {entry.name}: <span className="text-cyan-400">{entry.value}</span>
          </p>
        ))}
        <p className="text-slate-400 text-xs mt-1">{data.time}</p>
        <button
          onClick={handleExplainPoint}
          disabled={isSpeaking}
          className="mt-2 px-2 py-1 text-xs glass-panel-got border border-cyan-500/30 text-cyan-300 hover:text-cyan-200 rounded transition-all disabled:opacity-50 w-full"
        >
          {isSpeaking ? '🗣 Speaking...' : '🗣 Explain Point'}
        </button>
      </div>
    );
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
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-linear-to-brrom-cyan-500/20 to-slate-800/80 border-2 border-cyan-400/50 flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.3)] backdrop-blur-sm">
            <span className="text-cyan-300 font-bold text-2xl">V</span>
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight bg-linear-to-r from-cyan-300 via-blue-300 to-cyan-400 bg-clip-text text-transparent">
              House VantEdge
            </h1>
            <p className="text-xs text-cyan-400/80 font-medium tracking-wide uppercase">
              RF Analytics • Signal Intelligence
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
      <main className="flex-1 p-4 md:p-6 flex flex-col gap-6 overflow-auto relative z-10">
        {chartData.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-cyan-400 text-lg">No data available</p>
          </div>
        ) : (
          <>
            {/* RSSI vs Time Chart */}
            <div className="glass-panel-got rounded-2xl p-6 border border-cyan-500/20 shadow-[0_0_30px_rgba(6,182,212,0.2)] relative">
              <div className="absolute top-6 right-6 z-10">
                <ExplainButton onClick={handleExplainRSSI} isSpeaking={isSpeaking} size="sm" />
              </div>
              <h2 className="text-xl font-bold mb-4 text-cyan-300 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
                </svg>
                Signal Strength (RSSI) vs Time
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis 
                    dataKey="time" 
                    stroke="#94a3b8"
                    style={{ fontSize: '12px' }}
                  />
                  <YAxis 
                    stroke="#94a3b8"
                    label={{ value: 'RSSI (dBm)', angle: -90, position: 'insideLeft', style: { fill: '#94a3b8' } }}
                    style={{ fontSize: '12px' }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="rssi" 
                    stroke="#06b6d4" 
                    strokeWidth={2}
                    dot={{ fill: '#06b6d4', r: 3 }}
                    name="RSSI (dBm)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* SNR vs Time Chart */}
            <div className="glass-panel-got rounded-2xl p-6 border border-cyan-500/20 shadow-[0_0_30px_rgba(6,182,212,0.2)] relative">
              <div className="absolute top-6 right-6 z-10">
                <ExplainButton onClick={handleExplainSNR} isSpeaking={isSpeaking} size="sm" />
              </div>
              <h2 className="text-xl font-bold mb-4 text-cyan-300 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
                </svg>
                Signal-to-Noise Ratio (SNR) vs Time
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis 
                    dataKey="time" 
                    stroke="#94a3b8"
                    style={{ fontSize: '12px' }}
                  />
                  <YAxis 
                    stroke="#94a3b8"
                    label={{ value: 'SNR (dB)', angle: -90, position: 'insideLeft', style: { fill: '#94a3b8' } }}
                    style={{ fontSize: '12px' }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="snr" 
                    stroke="#8b5cf6" 
                    strokeWidth={2}
                    dot={{ fill: '#8b5cf6', r: 3 }}
                    name="SNR (dB)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Noise Floor vs Time Chart */}
            <div className="glass-panel-got rounded-2xl p-6 border border-cyan-500/20 shadow-[0_0_30px_rgba(6,182,212,0.2)] relative">
              <div className="absolute top-6 right-6 z-10">
                <ExplainButton onClick={handleExplainNoiseFloor} isSpeaking={isSpeaking} size="sm" />
              </div>
              <h2 className="text-xl font-bold mb-4 text-cyan-300 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
                </svg>
                Noise Floor vs Time
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis 
                    dataKey="time" 
                    stroke="#94a3b8"
                    style={{ fontSize: '12px' }}
                  />
                  <YAxis 
                    stroke="#94a3b8"
                    label={{ value: 'Noise Floor (dBm)', angle: -90, position: 'insideLeft', style: { fill: '#94a3b8' } }}
                    style={{ fontSize: '12px' }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="noiseFloor" 
                    stroke="#ef4444" 
                    strokeWidth={2}
                    dot={{ fill: '#ef4444', r: 3 }}
                    name="Noise Floor (dBm)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default function GraphsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#050505] flex items-center justify-center text-cyan-500">Initializing Graphs...</div>}>
      <GraphsContent />
    </Suspense>
  );
}

