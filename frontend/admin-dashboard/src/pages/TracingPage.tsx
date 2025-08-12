import { useEffect, useMemo, useState } from 'react';
import { connectEvents, EventMessage } from '@/services/events';

const DEFAULT_TOPICS = ['agent.inbound', 'agent.outbound', 'agent.events', 'transactions.events'];

export default function TracingPage() {
  const [events, setEvents] = useState<EventMessage[]>([]);
  const [agentId, setAgentId] = useState('');
  const [type, setType] = useState('');
  const [topics, setTopics] = useState<string[]>(DEFAULT_TOPICS);

  useEffect(() => {
    const url = import.meta.env.VITE_EVENTS_WS_URL as string | undefined;
    if (!url) return;
    const disconnect = connectEvents({ url, topics, onMessage: (e) => setEvents(prev => [e, ...prev].slice(0, 500)) });
    return disconnect;
  }, [topics]);

  const filtered = useMemo(() => events.filter(e => {
    const okAgent = agentId ? JSON.stringify(e.value).includes(agentId) : true;
    const okType = type ? JSON.stringify(e.value).includes(type) : true;
    return okAgent && okType;
  }), [events, agentId, type]);

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Tracing & Event Monitoring</h2>

      {!import.meta.env.VITE_EVENTS_WS_URL && (
        <div className="p-3 bg-yellow-50 text-yellow-800 border rounded">
          Set VITE_EVENTS_WS_URL to a Kafka WebSocket bridge for live events.
        </div>
      )}

      <div className="bg-white border rounded p-3 grid grid-cols-1 md:grid-cols-4 gap-3">
        <div>
          <label className="block text-sm text-gray-600 mb-1">Filter by Agent ID</label>
          <input className="w-full border rounded px-3 py-2" value={agentId} onChange={e => setAgentId(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Filter by Event Type</label>
          <input className="w-full border rounded px-3 py-2" value={type} onChange={e => setType(e.target.value)} />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm text-gray-600 mb-1">Topics</label>
          <div className="flex flex-wrap gap-2">
            {DEFAULT_TOPICS.map(t => (
              <label key={t} className="inline-flex items-center gap-2 text-sm">
                <input type="checkbox" checked={topics.includes(t)} onChange={e => setTopics(prev => e.target.checked ? [...prev, t] : prev.filter(x => x !== t))} />
                {t}
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white border rounded p-0 overflow-hidden">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-3 py-2">Topic</th>
              <th className="text-left px-3 py-2">Timestamp</th>
              <th className="text-left px-3 py-2">Value</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((e, idx) => (
              <tr key={idx} className="border-t">
                <td className="px-3 py-2">{e.topic}</td>
                <td className="px-3 py-2">{e.timestamp ? new Date(e.timestamp).toLocaleString() : '-'}</td>
                <td className="px-3 py-2"><pre className="whitespace-pre-wrap break-all">{JSON.stringify(e.value)}</pre></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 