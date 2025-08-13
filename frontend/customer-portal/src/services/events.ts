export type EventMessage = {
	topic: string;
	key?: string;
	timestamp?: number;
	headers?: Record<string, string>;
	value: unknown;
};

export type EventsClientOptions = {
	url: string;
	topics: string[];
	onMessage: (event: EventMessage) => void;
	onError?: (err: unknown) => void;
};

export function connectEvents({ url, topics, onMessage, onError }: EventsClientOptions): () => void {
	const es = new EventSource(url + '?topics=' + encodeURIComponent(topics.join(',')));
	es.onmessage = ev => {
		try { const msg = JSON.parse(ev.data) as EventMessage; onMessage(msg); } catch {}
	};
	es.onerror = (onError as any) || (() => {});
	return () => es.close();
} 