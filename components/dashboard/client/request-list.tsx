'use client';

import { useMemo, useState } from 'react';

import { RequestCard } from '@/components/dashboard/client/request-card';
import type { RequestResponse, RequestStatus } from '@/lib/api/requests';
import { cn } from '@/lib/utils';

type Filter = 'ALL' | RequestStatus;

const FILTERS: { value: Filter; label: string }[] = [
  { value: 'ALL', label: 'Toate' },
  { value: 'OPEN', label: 'Active' },
  { value: 'CLOSED', label: 'Finalizate' },
  { value: 'EXPIRED', label: 'Expirate' },
];

export function RequestList({ requests }: { requests: RequestResponse[] }) {
  const [filter, setFilter] = useState<Filter>('ALL');

  const counts = useMemo(() => {
    const c: Record<string, number> = { ALL: requests.length };
    
    for (const r of requests) {
      c[r.status] = (c[r.status] ?? 0) + 1;
    }
    
    return c;
  }, [requests]);

  const visible = useMemo(
    () => (filter === 'ALL' ? requests : requests.filter((r) => r.status === filter)),
    [requests, filter],
  );

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-xl font-bold">Cererile mele</h2>
        <span className="text-sm text-dark/40">{requests.length} total</span>
      </div>

      {/* Chip-uri de filtrare */}
      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => {
          const active = filter === f.value;
          const count = counts[f.value] ?? 0;
          return (
            <button
              key={f.value}
              type="button"
              onClick={() => setFilter(f.value)}
              className={cn(
                'rounded-full px-3 py-1.5 text-sm transition-colors',
                active
                  ? 'bg-dark text-white font-medium'
                  : 'bg-white text-dark/60 ring-1 ring-black/5 hover:text-dark',
              )}
            >
              {f.label}
              {f.value !== 'ALL' && count > 0 && (
                <span className={cn('ml-1', active ? 'text-white/60' : 'text-dark/30')}>
                  · {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Listă / stare goală */}
      {visible.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-black/10 bg-white/50 p-6 text-center text-sm text-dark/50">
          Nicio cerere aici încă.
        </p>
      ) : (
        <div className="space-y-3">
          {visible.map((r) => (
            <RequestCard key={r.id} request={r} />
          ))}
        </div>
      )}
    </section>
  );
}
