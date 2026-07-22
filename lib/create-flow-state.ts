import 'server-only';

import { cookies } from 'next/headers';

/**
 * Fabrică pentru starea unui flow multi-pas persistat într-un cookie httpOnly.
 *
 * Ambele flow-uri (înregistrare, creare cerere) au aceeași mecanică:
 * citește → actualizează (cu merge pe `completedSteps`) → marchează pas → șterge.
 * Aici stă logica comună, tipată generic peste forma stării (`T`) și pașii ei (`S`).
 */
export function createFlowState<S extends string, T extends { completedSteps: S[] }>(
  cookieName: string,
  maxAge: number,
) {
  const opts = {
    httpOnly: true,
    sameSite: 'lax' as const,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge,
  };

  // Starea goală: doar `completedSteps`. Restul câmpurilor din T sunt opționale,
  // dar TS nu poate demonstra asta generic → dublu cast prin `unknown`.
  const empty = () => ({ completedSteps: [] as S[] }) as unknown as T;

  async function get(): Promise<T> {
    const store = await cookies();
    const raw = store.get(cookieName)?.value;
    if (!raw) return empty();

    try {
      return JSON.parse(raw) as T;
    } catch {
      return empty();
    }
  }

  async function update(patch: Partial<T>): Promise<T> {
    const current = await get();
    const merged = {
      ...current,
      ...patch,
      completedSteps: Array.from(
        new Set([...(current.completedSteps ?? []), ...(patch.completedSteps ?? [])]),
      ),
    } as T;

    const store = await cookies();
    store.set(cookieName, JSON.stringify(merged), opts);
    return merged;
  }

  function mark(step: S, patch: Partial<T> = {}): Promise<T> {
    return update({ ...patch, completedSteps: [step] } as Partial<T>);
  }

  async function clear(): Promise<void> {
    const store = await cookies();
    store.delete(cookieName);
  }

  return { get, update, mark, clear };
}
