import React from "react";
import { Battery50Icon, ClockIcon, MapPinIcon } from "@heroicons/react/24/solid";

type Latest = {
  device_id?: string;
  rf_dbm?: number;
  lat?: number;
  lng?: number;
  timestamp?: number;
  battery?: number; // optional if you add it later
};

type Props = {
  latest?: Latest;
  status?: "online" | "offline" | "idle";
};

export default function Sidebar({ latest, status = "idle" }: Props) {
  const lastSeen = latest?.timestamp
    ? new Date(latest.timestamp).toLocaleString()
    : "--";

  return (
    <aside className="w-80 bg-linear-to-b from-slate-900 to-slate-800 text-white p-6 flex flex-col gap-6 shadow-xl">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">RF Monitor</h1>
        <p className="text-sm text-slate-300 mt-1">Campus heatmap · Live</p>
      </div>

      <div className="mt-2">
        <div className="flex items-center gap-2">
          <span
            className={`h-3 w-3 rounded-full ${
              status === "online" ? "bg-green-400" : status === "offline" ? "bg-red-500" : "bg-yellow-400"
            }`}
            aria-hidden
          />
          <p className="text-sm text-slate-300">Status: <span className="font-medium text-white ml-1">{status}</span></p>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {/* Device Card */}
        <div className="p-4 bg-slate-800/60 rounded-xl backdrop-blur-sm border border-slate-700">
          <p className="text-xs text-slate-300">Device ID</p>
          <p className="text-lg font-semibold">{latest?.device_id ?? "NODE_1"}</p>
        </div>

        {/* RF Power Card */}
        <div className="p-4 bg-slate-800/60 rounded-xl border border-slate-700">
          <p className="text-xs text-slate-300">RF Power (dBm)</p>
          <p className="text-3xl font-extrabold">{latest?.rf_dbm ?? "--"}</p>
          <div className="mt-2 h-1 bg-slate-700 rounded-full overflow-hidden">
            {/* visual bar: map -120..-20 to 0..100 */}
            <div
              style={{
                width: `${Math.max(0, Math.min(100, ((latest?.rf_dbm ?? -120) + 120) / (100) * 100))}%`,
              }}
              className={`h-1 bg-linear-to-r from-indigo-400 to-cyan-300 transition-all duration-300`}
            />
          </div>
          <p className="text-xs text-slate-400 mt-1">Higher = stronger noise</p>
        </div>

        {/* GPS Card */}
        <div className="p-4 bg-slate-800/60 rounded-xl border border-slate-700 flex items-center gap-3">
          <MapPinIcon className="h-6 w-6 text-cyan-300" />
          <div>
            <p className="text-xs text-slate-300">Coordinates</p>
            <p className="text-sm">{latest?.lat ?? "--"}, {latest?.lng ?? "--"}</p>
          </div>
        </div>

        {/* Timestamp + battery */}
        <div className="p-4 bg-slate-800/60 rounded-xl border border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ClockIcon className="h-5 w-5 text-slate-300" />
            <div>
              <p className="text-xs text-slate-300">Last Update</p>
              <p className="text-sm">{lastSeen}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Battery50Icon className="h-6 w-6 text-green-400" />
            <p className="text-sm">{latest?.battery ? `${latest.battery}%` : "—"}</p>
          </div>
        </div>
      </div>

      <div className="mt-auto text-xs text-slate-400">
        <p>Tip: Zoom & pan the map to inspect hotspots</p>
      </div>
    </aside>
  );
}
