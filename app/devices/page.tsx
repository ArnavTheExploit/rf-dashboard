'use client';

import { useRFData } from '@/hooks/useRFData';
import { Suspense, useMemo } from 'react';
import Snowfall from '@/components/Snowfall';
import { RFReading } from '@/types';
import { useVoiceAssistant, ExplainButton, generateExplanation } from '@/components/VoiceAssistant';

function DevicesContent() {
  const { data, status } = useRFData();
  const { speak, isSpeaking } = useVoiceAssistant();

  // Group readings by device and get latest reading for each
  const deviceStats = useMemo(() => {
    const deviceMap = new Map<string, {
      device_id: string;
      latestReading: RFReading;
      readingCount: number;
      avgRssi: number;
      avgSnr: number;
      lastSeen: string;
    }>();

    data.forEach((reading) => {
      const existing = deviceMap.get(reading.device_id);
      if (!existing || new Date(reading.timestamp) > new Date(existing.latestReading.timestamp)) {
        const deviceReadings = data.filter(d => d.device_id === reading.device_id);
        deviceMap.set(reading.device_id, {
          device_id: reading.device_id,
          latestReading: reading,
          readingCount: deviceReadings.length,
          avgRssi: deviceReadings.reduce((sum, r) => sum + r.rssi, 0) / deviceReadings.length,
          avgSnr: deviceReadings.reduce((sum, r) => sum + (r.snr || (r.rssi - r.noise_floor)), 0) / deviceReadings.length,
          lastSeen: reading.timestamp,
        });
      }
    });

    return Array.from(deviceMap.values()).sort((a, b) => 
      new Date(b.lastSeen).getTime() - new Date(a.lastSeen).getTime()
    );
  }, [data]);

  const handleExplainDevices = () => {
    if (deviceStats.length === 0) {
      speak('No devices available to explain.');
      return;
    }

    const explanation = `
      Device Monitor Overview. You are currently monitoring ${deviceStats.length} active devices with a total of ${data.length} readings.
      ${deviceStats.map(device => generateExplanation('device_status', { device })).join(' ')}
      All devices are reporting data and contributing to the RF noise mapping system.
    `;
    speak(explanation);
  };

  const handleExplainDevice = (device: typeof deviceStats[0]) => {
    const explanation = generateExplanation('device_status', { device });
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
      <Snowfall />
      
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
              Device Monitor • Watchtower
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
        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 relative">
          <div className="absolute top-2 right-2 z-10">
            <ExplainButton onClick={handleExplainDevices} isSpeaking={isSpeaking} size="sm" />
          </div>
          <div className="glass-panel-got p-4 rounded-xl border border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.1)]">
            <h3 className="text-gray-400 text-sm uppercase tracking-wider">Active Devices</h3>
            <p className="text-2xl font-bold mt-1 text-cyan-300">{deviceStats.length}</p>
          </div>
          <div className="glass-panel-got p-4 rounded-xl border border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.1)]">
            <h3 className="text-gray-400 text-sm uppercase tracking-wider">Total Readings</h3>
            <p className="text-2xl font-bold mt-1 text-cyan-300">{data.length}</p>
          </div>
          <div className="glass-panel-got p-4 rounded-xl border border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.1)]">
            <h3 className="text-gray-400 text-sm uppercase tracking-wider">Avg Signal</h3>
            <p className="text-2xl font-bold mt-1 text-cyan-300">
              {data.length > 0 ? (data.reduce((acc, curr) => acc + curr.rssi, 0) / data.length).toFixed(1) : '0'} <span className="text-sm font-normal text-gray-400">dBm</span>
            </p>
          </div>
          <div className="glass-panel-got p-4 rounded-xl border border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.1)]">
            <h3 className="text-gray-400 text-sm uppercase tracking-wider">System Health</h3>
            <p className="text-2xl font-bold mt-1 text-emerald-400">Good</p>
          </div>
        </div>

        {/* Device Table */}
        <div className="glass-panel-got rounded-2xl p-6 border border-cyan-500/20 shadow-[0_0_30px_rgba(6,182,212,0.2)] relative">
          <div className="absolute top-6 right-6 z-10">
            <ExplainButton onClick={handleExplainDevices} isSpeaking={isSpeaking} size="sm" />
          </div>
          <h2 className="text-xl font-bold mb-6 text-cyan-300 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25m18 0A2.25 2.25 0 0 0 18.75 3H5.25A2.25 2.25 0 0 0 3 5.25m18 0V12a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 12V5.25" />
            </svg>
            Device Status
          </h2>
          
          {deviceStats.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-cyan-400 text-lg">No devices detected</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-cyan-500/20">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-cyan-300 uppercase tracking-wider">Device ID</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-cyan-300 uppercase tracking-wider">Location</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-cyan-300 uppercase tracking-wider">RSSI</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-cyan-300 uppercase tracking-wider">SNR</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-cyan-300 uppercase tracking-wider">Noise Floor</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-cyan-300 uppercase tracking-wider">Battery</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-cyan-300 uppercase tracking-wider">Readings</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-cyan-300 uppercase tracking-wider">Last Seen</th>
                  </tr>
                </thead>
                <tbody>
                  {deviceStats.map((device) => {
                    const timeAgo = Math.floor((Date.now() - new Date(device.lastSeen).getTime()) / 1000);
                    const minutesAgo = Math.floor(timeAgo / 60);
                    const isRecent = timeAgo < 60;
                    
                    return (
                      <tr 
                        key={device.device_id} 
                        className="border-b border-slate-700/30 hover:bg-slate-800/30 transition-colors cursor-pointer"
                        onClick={() => handleExplainDevice(device)}
                        title="Click to hear device explanation"
                      >
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${isRecent ? 'bg-emerald-400 animate-pulse' : 'bg-yellow-400'}`}></div>
                            <span className="font-medium text-white">{device.device_id}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-sm text-slate-300">
                          {device.latestReading.lat.toFixed(4)}, {device.latestReading.lng.toFixed(4)}
                        </td>
                        <td className="py-4 px-4">
                          <span className={`font-semibold ${device.latestReading.rssi > -60 ? 'text-emerald-400' : device.latestReading.rssi > -80 ? 'text-yellow-400' : 'text-red-400'}`}>
                            {device.latestReading.rssi} dBm
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span className="font-semibold text-purple-400">
                            {device.avgSnr.toFixed(1)} dB
                          </span>
                        </td>
                        <td className="py-4 px-4 text-sm text-slate-300">
                          {device.latestReading.noise_floor} dBm
                        </td>
                        <td className="py-4 px-4">
                          {device.latestReading.battery !== undefined ? (
                            <div className="flex items-center gap-2">
                              <div className="w-16 h-2 bg-slate-700 rounded-full overflow-hidden">
                                <div 
                                  className={`h-full ${device.latestReading.battery > 70 ? 'bg-emerald-400' : device.latestReading.battery > 40 ? 'bg-yellow-400' : 'bg-red-400'}`}
                                  style={{ width: `${device.latestReading.battery}%` }}
                                ></div>
                              </div>
                              <span className="text-xs text-slate-300">{device.latestReading.battery}%</span>
                            </div>
                          ) : (
                            <span className="text-slate-500">—</span>
                          )}
                        </td>
                        <td className="py-4 px-4 text-sm text-slate-300">
                          {device.readingCount}
                        </td>
                        <td className="py-4 px-4 text-sm text-slate-400">
                          {isRecent ? 'Just now' : minutesAgo < 60 ? `${minutesAgo}m ago` : new Date(device.lastSeen).toLocaleTimeString()}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default function DevicesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#050505] flex items-center justify-center text-cyan-500">Initializing Device Monitor...</div>}>
      <DevicesContent />
    </Suspense>
  );
}

