'use client';

import { useEffect, useState } from 'react';

/**
 * Returnează timpul curent (ms), actualizat o dată pe secundă.
 *
 * Inițializat din `seed` — o valoare stabilă, identică pe server și client —
 * ca să evite hydration mismatch-ul. După montare se corectează la timpul real
 * (`Date.now()`) și apoi ticăie din secundă în secundă.
 */
export function useNow(seed: number) {
  const [now, setNow] = useState(() => seed);

  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  return now;
}
