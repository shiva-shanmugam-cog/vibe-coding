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
  onError?: (err: any) => void;
};

export function connectEvents({ url, topics, onMessage, onError }: EventsClientOptions) {
  if (url.startsWith('ws')) {
    const ws = new WebSocket(url + '?topics=' + encodeURIComponent(topics.join(',')));
    ws.onmessage = ev => {
      try { const msg = JSON.parse(ev.data); onMessage(msg); } catch (e) { /* ignore */ }
    };
    ws.onerror = onError || (() => {});
    return () => ws.close();
  } else {
    const es = new EventSource(url + '?topics=' + encodeURIComponent(topics.join(',')));
    es.onmessage = ev => {
      try { const msg = JSON.parse(ev.data); onMessage(msg); } catch (e) { /* ignore */ }
    };
    es.onerror = onError || (() => {});
    return () => es.close();
  }
} 