import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

type Reading = {
  device_id: string;
  rf_dbm: number;
  timestamp: number;
};

export default function GraphsPanel({ data = [] as Reading[] }) {
  // aggregate last 20 readings for the main device
  const main = data.filter(d => d.device_id === (data[data.length-1]?.device_id ?? "NODE_1"));
  const chartData = main.slice(-20).map(d => ({ time: new Date(d.timestamp).toLocaleTimeString(), rf: d.rf_dbm }));

  return (
    <div className="w-full h-60">
      <h3 className="text-sm font-medium mb-2">RF (last readings)</h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <XAxis dataKey="time" tick={{ fontSize: 10 }} />
          <YAxis domain={[-120, -20]} />
          <Tooltip />
          <Line type="monotone" dataKey="rf" stroke="#06b6d4" strokeWidth={2} dot={{ r: 2 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
