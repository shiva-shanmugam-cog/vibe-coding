import { useEffect, useState } from 'react';
import { getAgentsMetrics, getPrometheusRaw, AgentsMetrics } from '@/services/api';
import { parsePrometheusText, pickLatest } from '@/services/prometheus';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function PerformancePage() {
  const [agents, setAgents] = useState<AgentsMetrics>({});
  const [samples, setSamples] = useState<any[]>([]);

  async function load() {
    const [m, raw] = await Promise.all([getAgentsMetrics(), getPrometheusRaw()]);
    setAgents(m);
    const parsed = parsePrometheusText(raw);
    const cpu = pickLatest(parsed, 'process_cpu_usage').map(s => ({ name: 'CPU', value: s.value }));
    const heap = pickLatest(parsed, 'jvm_memory_used_bytes', l => l.area === 'heap').reduce((sum, s) => sum + s.value, 0);
    const nonheap = pickLatest(parsed, 'jvm_memory_used_bytes', l => l.area === 'nonheap').reduce((sum, s) => sum + s.value, 0);
    setSamples(prev => [...prev.slice(-60), { ts: Date.now(), cpu: cpu[0]?.value ?? null, heap, nonheap }]);
  }

  useEffect(() => { load(); const t = setInterval(load, 5000); return () => clearInterval(t); }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">Performance</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {Object.entries(agents).map(([id, a]) => (
          <div key={id} className="bg-white border rounded-lg p-4">
            <div className="font-medium">{a.displayName}</div>
            <div className="text-xs text-gray-500">{id} · v{a.version}</div>
            <div className={`mt-2 inline-block px-2 py-1 rounded-full text-xs ${a.health === 'UP' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{a.health}</div>
          </div>
        ))}
      </div>

      <div className="bg-white border rounded-lg p-4">
        <div className="font-medium mb-2">CPU Usage</div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={samples} margin={{ left: 16, right: 16 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="ts" tickFormatter={(v) => new Date(v).toLocaleTimeString()} />
              <YAxis domain={[0, 1]} />
              <Tooltip labelFormatter={(v) => new Date(Number(v)).toLocaleTimeString()} />
              <Legend />
              <Line type="monotone" dataKey="cpu" stroke="#2563eb" dot={false} name="CPU" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white border rounded-lg p-4">
        <div className="font-medium mb-2">Memory Usage</div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={samples} margin={{ left: 16, right: 16 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="ts" tickFormatter={(v) => new Date(v).toLocaleTimeString()} />
              <YAxis />
              <Tooltip labelFormatter={(v) => new Date(Number(v)).toLocaleTimeString()} />
              <Legend />
              <Line type="monotone" dataKey="heap" stroke="#16a34a" dot={false} name="Heap" />
              <Line type="monotone" dataKey="nonheap" stroke="#f59e0b" dot={false} name="Non-Heap" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
} 