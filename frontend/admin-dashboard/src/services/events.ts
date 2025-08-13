export type EventMessage = {
  topic: string;
  key?: string;
  timestamp?: number;
  headers?: Record<string, string>;
  value: unknown;
};

export type EventsClientOptions = {
  url?: string;
  topics: string[];
  onMessage: (event: EventMessage) => void;
  onError?: (err: any) => void;
};

export function connectEvents({ url, topics, onMessage, onError }: EventsClientOptions) {
  const defaultSse = `${window.location.protocol}//${window.location.hostname}:8080/ws/events`;
  const targetUrl = url || (import.meta.env.VITE_EVENTS_WS_URL as string) || defaultSse;
  if (targetUrl.startsWith('ws')) {
    const ws = new WebSocket(targetUrl + '?topics=' + encodeURIComponent(topics.join(',')));
    ws.onmessage = ev => {
      try {
        const raw = JSON.parse(ev.data);
        const normalized: EventMessage = {
          ...raw,
          value: tryParseValue(raw.value)
        };
        onMessage(normalized);
      } catch (e) { /* ignore */ }
    };
    ws.onerror = onError || (() => {});
    return () => ws.close();
  } else {
    const es = new EventSource(targetUrl + '?topics=' + encodeURIComponent(topics.join(',')));
    es.onmessage = ev => {
      try {
        const raw = JSON.parse(ev.data);
        const normalized: EventMessage = {
          ...raw,
          value: tryParseValue(raw.value)
        };
        onMessage(normalized);
      } catch (e) { /* ignore */ }
    };
    es.onerror = onError || (() => {});
    return () => es.close();
  }
}

function tryParseValue(value: any): unknown {
  if (typeof value === 'string') {
    try { return JSON.parse(value); } catch { return value; }
  }
  return value;
} 