import { useEffect, useMemo, useState } from 'react';
import { auditApi } from '@/services/api';
import { resolveAuditBase } from '@/config/env';

interface AuditEvent { id?: string; actor?: string; action?: string; resource?: string; timestamp?: string; details?: Record<string, unknown>; }

export default function AuditLogsPage() {
  const [actor, setActor] = useState('');
  const [resource, setResource] = useState('');
  const [rows, setRows] = useState<AuditEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function search() {
    setLoading(true); setError(null);
    try {
      const res = await auditApi.get('/api/audit/search', { params: { actor: actor || undefined, resource: resource || undefined } });
      setRows(res.data);
    } catch (e: any) {
      setError(e?.message || 'Failed to load audit logs');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { search(); }, []);

  const csv = useMemo(() => {
    const header = ['actor', 'action', 'resource', 'timestamp'];
    const lines = [header.join(',')];
    for (const r of rows) { lines.push([r.actor, r.action, r.resource, r.timestamp].map(v => (v ?? '')).join(',')); }
    return new Blob([lines.join('\n')], { type: 'text/csv' });
  }, [rows]);

  const base = resolveAuditBase();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Audit Logs</h2>
        {base && (
          <div className="text-xs text-gray-500">{base}</div>
        )}
      </div>

      <div className="bg-white border rounded p-3 grid grid-cols-1 md:grid-cols-4 gap-3">
        <div>
          <label className="block text-sm text-gray-600 mb-1">Actor</label>
          <input className="w-full border rounded px-3 py-2" value={actor} onChange={e => setActor(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Resource</label>
          <input className="w-full border rounded px-3 py-2" value={resource} onChange={e => setResource(e.target.value)} />
        </div>
        <div className="flex items-end gap-2">
          <button className="px-3 py-2 rounded-md bg-brand-600 text-white" onClick={search} disabled={loading}>Search</button>
          <a className="px-3 py-2 rounded-md bg-gray-100" download={`audit-${Date.now()}.csv`} href={URL.createObjectURL(csv)}>Export CSV</a>
        </div>
      </div>

      {loading && <div>Loading…</div>}
      {error && <div className="text-red-600">{error}</div>}

      <div className="bg-white border rounded overflow-hidden">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-3 py-2">Actor</th>
              <th className="text-left px-3 py-2">Action</th>
              <th className="text-left px-3 py-2">Resource</th>
              <th className="text-left px-3 py-2">Timestamp</th>
              <th className="text-left px-3 py-2">Details</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && !loading && (
              <tr><td className="px-3 py-4 text-gray-500" colSpan={5}>No results</td></tr>
            )}
            {rows.map((r, idx) => (
              <tr key={idx} className="border-t">
                <td className="px-3 py-2">{r.actor}</td>
                <td className="px-3 py-2">{r.action}</td>
                <td className="px-3 py-2">{r.resource}</td>
                <td className="px-3 py-2">{r.timestamp}</td>
                <td className="px-3 py-2"><pre className="whitespace-pre-wrap break-all">{JSON.stringify(r.details)}</pre></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 