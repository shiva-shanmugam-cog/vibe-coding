export type PromSample = { metric: string; labels: Record<string, string>; value: number };

export function parsePrometheusText(text: string): PromSample[] {
  const lines = text.split('\n').map(l => l.trim()).filter(l => l && !l.startsWith('#'));
  const result: PromSample[] = [];
  for (const l of lines) {
    // e.g., jvm_memory_used_bytes{area="heap",id="G1 Eden Space",} 6.2096e+07
    const match = l.match(/^(?<metric>[a-zA-Z_:][a-zA-Z0-9_:]*)(\{(?<labels>[^}]*)\})?\s+(?<value>[-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?)/);
    if (!match || !match.groups) continue;
    const metric = match.groups.metric;
    const value = Number(match.groups.value);
    const labels: Record<string, string> = {};
    const rawLabels = match.groups.labels || '';
    rawLabels.split(',').forEach(pair => {
      const [k, v] = pair.split('=');
      if (k && v) labels[k.trim()] = v.split('"').join('').trim();
    });
    result.push({ metric, labels, value });
  }
  return result;
}

export function pickLatest(samples: PromSample[], metric: string, labelFilter?: (labels: Record<string,string>) => boolean) {
  return samples.filter(s => s.metric === metric && (!labelFilter || labelFilter(s.labels)));
} 