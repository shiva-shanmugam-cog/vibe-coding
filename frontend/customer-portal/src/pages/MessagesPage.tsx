import React, { useEffect, useState } from 'react';
import { sendAgentMessage } from '@/services/api';
import { connectEvents, EventMessage } from '@/services/events';

export default function MessagesPage() {
	const [targetAgentId, setTargetAgentId] = useState<string>('onboarding-assistant');
	const [message, setMessage] = useState<string>('Hello');
	const [conversationId, setConversationId] = useState<string | undefined>();
	const [log, setLog] = useState<Array<{ dir: 'in' | 'out' | 'event'; payload: unknown }>>([]);

	useEffect(() => {
		const disconnect = connectEvents({ url: '/ws/events', topics: ['agent.outbound', 'agent.events'], onMessage: onEvent });
		return () => disconnect();
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [conversationId]);

	const onEvent = (msg: EventMessage) => {
		try {
			const payload = typeof msg.value === 'string' ? JSON.parse(msg.value) : (msg.value as any);
			if (msg.topic === 'agent.outbound') {
				setLog((prev) => [...prev, { dir: 'in', payload }]);
			}
			if (msg.topic === 'agent.events') {
				setLog((prev) => [...prev, { dir: 'event', payload }]);
			}
		} catch {}
	};

	const send = async () => {
		await sendAgentMessage({ targetAgentId, type: 'CUSTOMER_QUERY', payload: { intent: message } }, conversationId);
		setLog((prev) => [...prev, { dir: 'out', payload: { targetAgentId, intent: message } }]);
		setMessage('');
	};

	return (
		<div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
			<section className="bg-white rounded shadow p-4 lg:col-span-1">
				<h2 className="font-semibold mb-3">Compose</h2>
				<select className="border rounded px-3 py-2 w-full mb-2" value={targetAgentId} onChange={e => setTargetAgentId(e.target.value)}>
					<option value="onboarding-assistant">Onboarding Agent</option>
					<option value="fraud-detection-engine">Fraud Detection Agent</option>
				</select>
				<textarea className="border rounded px-3 py-2 w-full h-32" value={message} onChange={e => setMessage(e.target.value)} placeholder="Type a message..." />
				<button onClick={send} className="mt-3 bg-blue-600 text-white px-4 py-2 rounded">Send</button>
			</section>
			<section className="bg-white rounded shadow p-4 lg:col-span-2">
				<h2 className="font-semibold mb-3">Conversation</h2>
				<div className="space-y-2 max-h-[60vh] overflow-auto">
					{log.map((entry, idx) => (
						<div key={idx} className={`flex ${entry.dir === 'out' ? 'justify-end' : 'justify-start'}`}>
							<div className={`px-3 py-2 rounded ${entry.dir === 'out' ? 'bg-blue-600 text-white' : entry.dir === 'event' ? 'bg-gray-100' : 'bg-green-100'}`}>
								<pre className="text-xs whitespace-pre-wrap">{JSON.stringify(entry.payload, null, 2)}</pre>
							</div>
						</div>
					))}
				</div>
			</section>
		</div>
	);
} 