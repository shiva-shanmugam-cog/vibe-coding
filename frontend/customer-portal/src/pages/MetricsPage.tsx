import React, { useEffect, useMemo, useState } from 'react';
import { AgentsMetrics, getAgentsMetrics, getPrometheusRaw } from '@/services/api';

export default function MetricsPage() {
	const [agents, setAgents] = useState<AgentsMetrics | null>(null);
	const [promRaw, setPromRaw] = useState<string>('');

	useEffect(() => {
		getAgentsMetrics().then(setAgents);
		getPrometheusRaw().then(setPromRaw);
	}, []);

	return (
		<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
			<section className="bg-white rounded shadow p-4">
				<h2 className="font-semibold mb-3">Agents</h2>
				<div className="space-y-2">
					{agents && Object.entries(agents).map(([id, m]) => (
						<div key={id} className="border rounded p-3 flex items-center justify-between">
							<div>
								<div className="font-medium">{m.displayName || id}</div>
								<div className="text-xs text-gray-500">v{m.version}</div>
							</div>
							<div className={m.health === 'UP' ? 'text-green-600' : 'text-red-600'}>{m.health}</div>
						</div>
					))}
				</div>
			</section>
			<section className="bg-white rounded shadow p-4">
				<h2 className="font-semibold mb-3">Prometheus</h2>
				<pre className="text-xs max-h-[70vh] overflow-auto whitespace-pre-wrap">{promRaw}</pre>
			</section>
		</div>
	);
} 