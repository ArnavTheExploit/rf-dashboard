"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "@/components/Sidebar";
import Heatmap from "@/components/Heatmap";

type Reading = {
  device_id: string;
  lat: number;
  lng: number;
  rf_dbm: number;
  timestamp: number;
  battery?: number;
};

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:5000";

export default function Page() {
  const [data, setData] = useState<Reading[]>([]);
  const [status, setStatus] = useState<"online" | "offline" | "idle">("idle");
  const [lastFetch, setLastFetch] = useState<number | null>(null);

  // Mock fallback for frontend testing
  const mockData: Reading[] = [
    {
      device_id: "NODE_1",
      lat: 13.135,
      lng: 77.565,
      rf_dbm: -55,
      timestamp: Date.now(),
      battery: 87,
    },
    {
      device_id: "NODE_2",
      lat: 13.136,
      lng: 77.566,
      rf_dbm: -72,
      timestamp: Date.now(),
      battery: 64,
    },
    {
      device_id: "NODE_3",
      lat: 13.134,
      lng: 77.564,
      rf_dbm: -43,
      timestamp: Date.now(),
      battery: 92,
    },
  ];

  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      try {
        const res = await axios.get(`${BACKEND}/api/getData`, { timeout: 3000 });
        if (!mounted) return;

        setData(res.data);
        setStatus("online");
        setLastFetch(Date.now());
      } catch (err) {
        if (!mounted) return;

        // fallback when backend not running
        setData(mockData);
        setStatus("offline");
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 2000);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  const latest = data[data.length - 1];

  // heatmap format → [lat, lng, intensity]
  const heatPoints = data.map((p) => {
    const intensity = Math.max(0.05, (90 + p.rf_dbm) / 90); // normalize dBm → 0-1
    return [p.lat, p.lng, intensity] as [number, number, number];
  });

  return (
    <div className="flex h-screen bg-gray-50 text-gray-900">
      {/* Sidebar */}
      <Sidebar latest={latest} status={status} />

      {/* Main area */}
      <main className="flex-1 p-6 flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">RF Noise Heatmap — Campus</h1>

          <div className="text-sm text-slate-600 flex items-center gap-6">
            {status === "online" ? (
              <span className="inline-flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
                Live
              </span>
            ) : (
              <span className="inline-flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-red-400" />
                Offline (mock)
              </span>
            )}

            <span className="text-xs text-slate-500">
              {lastFetch ? `Updated at ${new Date(lastFetch).toLocaleTimeString()}` : ""}
            </span>
          </div>
        </div>

        {/* Heatmap */}
        <div className="rounded-2xl shadow-lg bg-white h-[75vh] overflow-hidden border border-gray-200">
          <Heatmap points={heatPoints} />
        </div>
      </main>
    </div>
  );
}
