type Reading = {
  device_id: string;
  lat: number;
  lng: number;
  rf_dbm: number;
  timestamp: number;
  battery?: number;
};

export default function DeviceTable({ data = [] as Reading[] }) {
  return (
    <div className="w-full">
      <h3 className="text-sm font-medium mb-2">Devices</h3>
      <div className="divide-y divide-gray-100">
        {data.map((d) => (
          <div key={d.device_id + d.timestamp} className="py-2 flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold">{d.device_id}</div>
              <div className="text-xs text-slate-500">{new Date(d.timestamp).toLocaleString()}</div>
            </div>
            <div className="text-right">
              <div className="text-sm">{d.rf_dbm} dBm</div>
              <div className="text-xs text-slate-400">{d.battery ? `${d.battery}%` : "—"}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
