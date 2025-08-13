import React, { useEffect, useState } from 'react';
import { connectEvents, EventMessage } from '@/services/events';

export default function StatusPage() {
	const [events, setEvents] = useState<EventMessage[]>([]);

	useEffect(() => {
		const disconnect = connectEvents({ url: '/ws/events', topics: ['agent.events', 'transactions.events', 'agent.outbound'], onMessage: (ev: EventMessage) => setEvents((prev) => [ev, ...prev].slice(0, 200)) });
		return () => disconnect();
	}, []);

	return (
		<div className="bg-white rounded shadow p-4">
			<h2 className="font-semibold text-lg mb-3">Live Status</h2>
			<div className="space-y-2 max-h-[70vh] overflow-auto">
				{events.map((e: EventMessage, i: number) => (
					<div key={i} className="border rounded p-2">
						<div className="text-xs text-gray-500">{new Date(e.timestamp || Date.now()).toLocaleString()} • {e.topic}</div>
						<pre className="text-xs whitespace-pre-wrap">{typeof e.value === 'string' ? e.value : JSON.stringify(e.value, null, 2)}</pre>
					</div>
				))}
			</div>
		</div>
	);
} 