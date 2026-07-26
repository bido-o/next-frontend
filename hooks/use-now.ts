'use client';

import { useSyncExternalStore } from 'react';

// Ceas partajat: o singură valoare (ms), citită de toți consumatorii prin
// useSyncExternalStore. Cache-uită (stabilă în cadrul unui render) și
// reîmprospătată o dată pe secundă în subscribe.
let nowMs = Date.now();

function subscribe(onStoreChange: () => void) {
  // Valoare proaspătă la montare; React re-verifică snapshot-ul imediat după
  // subscribe și re-randează dacă s-a schimbat față de render.
  nowMs = Date.now();
  const id = setInterval(() => {
    nowMs = Date.now();
    onStoreChange();
  }, 1000);
  return () => clearInterval(id);
}

/**
 * Returnează timpul curent (ms), actualizat o dată pe secundă.
 *
 * Server snapshot-ul e `seed` — o valoare stabilă, identică pe server și client —
 * ca să evite hydration mismatch-ul. După hidratare, se citește timpul real
 * (`Date.now()`) și apoi ticăie din secundă în secundă.
 */
export function useNow(seed: number) {
  return useSyncExternalStore(
    subscribe,
    () => nowMs,   // client snapshot
    () => seed,    // server snapshot (stabil → fără hydration mismatch)
  );
}
