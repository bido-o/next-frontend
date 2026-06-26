'use client';

import Link from 'next/link';
import { useEffect } from 'react';

import { BidoLogo } from '@/components/bido-logo';

// Error boundary pentru rutele aplicației (erori la randare / fetch).
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-cream px-6 text-center">
      <Link href="/" className="mb-8 text-2xl">
        <BidoLogo />
      </Link>

      <p className="font-serif text-6xl font-bold text-orange">Oops</p>
      <h1 className="mt-2 font-serif text-2xl font-bold">Ceva nu a mers bine</h1>
      <p className="mt-2 max-w-sm text-sm text-dark/50">
        A apărut o eroare neașteptată. Încearcă din nou.
      </p>

      <div className="mt-6 flex items-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="rounded-full bg-orange px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-orange/90"
        >
          Reîncearcă
        </button>
        <Link
          href="/"
          className="rounded-full border border-black/10 px-6 py-3 text-sm font-medium text-dark/70 transition-colors hover:bg-white/60"
        >
          Pagina principală
        </Link>
      </div>
    </div>
  );
}
