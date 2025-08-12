import { describe, it, expect } from 'vitest';
import { parsePrometheusText, pickLatest } from './prometheus';

describe('prometheus parser', () => {
  it('parses simple metrics', () => {
    const text = `# HELP process_cpu_usage
process_cpu_usage 0.1
jvm_memory_used_bytes{area="heap",id="G1 Eden Space"} 123
`;
    const samples = parsePrometheusText(text);
    expect(samples.find(s => s.metric === 'process_cpu_usage')?.value).toBe(0.1);
    const heap = pickLatest(samples, 'jvm_memory_used_bytes', l => l.area === 'heap');
    expect(heap[0].labels.id).toBe('G1 Eden Space');
  });
}); 