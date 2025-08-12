import { useState } from 'react';
import { sendAgentMessage } from '@/services/api';

export default function SimulationPage() {
  const [log, setLog] = useState<any[]>([]);
  const [conversationId, setConversationId] = useState<string>('');
  const [intent, setIntent] = useState('open account');

  async function send(type: string, payload: Record<string, unknown>) {
    const req = { targetAgentId: 'onboarding-assistant', type, payload };
    const res = await sendAgentMessage(req, conversationId || undefined);
    setLog(prev => [...prev, { me: req }, { agent: res }]);
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Customer Onboarding – Live Simulation</h2>

      <div className="bg-white border rounded p-3 grid grid-cols-1 md:grid-cols-3 gap-3">
        <div>
          <label className="block text-sm text-gray-600 mb-1">Conversation Id</label>
          <input className="w-full border rounded px-3 py-2" value={conversationId} onChange={e => setConversationId(e.target.value)} />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm text-gray-600 mb-1">Intent</label>
          <input className="w-full border rounded px-3 py-2" value={intent} onChange={e => setIntent(e.target.value)} />
        </div>
        <div className="md:col-span-3 flex gap-2">
          <button className="px-3 py-2 rounded-md bg-brand-600 text-white" onClick={() => send('CUSTOMER_QUERY', { intent })}>Send Query</button>
          <button className="px-3 py-2 rounded-md bg-gray-100" onClick={() => setLog([])}>Clear</button>
        </div>
      </div>

      <div className="bg-white border rounded p-3 space-y-2">
        <div className="text-sm text-gray-600">Conversation</div>
        <div className="space-y-2">
          {log.map((m, idx) => (
            <div key={idx} className={`max-w-2xl ${m.me ? 'ml-auto text-right' : ''}`}>
              <div className={`inline-block px-3 py-2 rounded-lg ${m.me ? 'bg-brand-600 text-white' : 'bg-gray-100'}`}>
                <pre className="text-xs whitespace-pre-wrap break-all">{JSON.stringify(m.me || m.agent, null, 2)}</pre>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 