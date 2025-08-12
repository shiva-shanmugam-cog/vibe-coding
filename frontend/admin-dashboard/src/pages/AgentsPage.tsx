import { useEffect, useMemo, useState } from 'react';
import { getAgentsMetrics, sendAgentMessage, AgentMessageReq, AgentsMetrics } from '@/services/api';

export default function AgentsPage() {
  const [metrics, setMetrics] = useState<AgentsMetrics>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState<AgentMessageReq>({ targetAgentId: '', type: 'CUSTOMER_QUERY', payload: { intent: 'open account' } });
  const [conversationId, setConversationId] = useState<string>('');
  const [response, setResponse] = useState<any>(null);

  async function load() {
    setLoading(true); setError(null);
    try { setMetrics(await getAgentsMetrics()); } catch (e: any) { setError(e?.message || 'Failed to load'); } finally { setLoading(false); }
  }

  useEffect(() => { load(); const t = setInterval(load, 10000); return () => clearInterval(t); }, []);

  const agentIds = useMemo(() => Object.keys(metrics || {}), [metrics]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Agents</h2>
        <button onClick={load} className="px-3 py-1.5 rounded-md bg-gray-100 hover:bg-gray-200">Refresh</button>
      </div>

      {loading && <div>Loading...</div>}
      {error && <div className="text-red-600">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {agentIds.map(id => {
          const a = metrics[id];
          const healthy = a.health === 'UP';
          return (
            <div key={id} className="bg-white rounded-lg shadow-sm border p-4 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{a.displayName}</div>
                  <div className="text-xs text-gray-500">{id} · v{a.version}</div>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs ${healthy ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{a.health}</div>
              </div>
              {a.details && <pre className="bg-gray-50 text-xs p-2 rounded overflow-auto max-h-24">{JSON.stringify(a.details, null, 2)}</pre>}
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-4 space-y-3">
        <div className="font-medium">Send Message to Agent</div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Target Agent</label>
            <select className="w-full border rounded-md px-3 py-2" value={form.targetAgentId} onChange={e => setForm({ ...form, targetAgentId: e.target.value })}>
              <option value="">Select agent…</option>
              {agentIds.map(id => <option key={id} value={id}>{id}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Type</label>
            <input className="w-full border rounded-md px-3 py-2" value={form.type || ''} onChange={e => setForm({ ...form, type: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Conversation Id (optional)</label>
            <input className="w-full border rounded-md px-3 py-2" value={conversationId} onChange={e => setConversationId(e.target.value)} />
          </div>
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Payload (JSON)</label>
          <textarea className="w-full border rounded-md px-3 py-2 font-mono text-sm" rows={5}
            value={JSON.stringify(form.payload || {}, null, 2)}
            onChange={e => { try { const v = JSON.parse(e.target.value); setForm({ ...form, payload: v }); } catch {} }}
          />
        </div>
        <div className="flex gap-2">
          <button
            className="px-3 py-2 rounded-md bg-brand-600 text-white hover:bg-brand-700"
            onClick={async () => { const r = await sendAgentMessage(form, conversationId || undefined); setResponse(r); }}
            disabled={!form.targetAgentId}
          >Send</button>
          <button className="px-3 py-2 rounded-md bg-gray-100" onClick={() => setResponse(null)}>Clear</button>
        </div>
        {response && (
          <div>
            <div className="text-sm text-gray-600">Response</div>
            <pre className="bg-gray-50 text-xs p-2 rounded overflow-auto">{JSON.stringify(response, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  );
} 