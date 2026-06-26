import Link from 'next/link';

import { BidoLogo } from '@/components/bido-logo';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-cream px-6 text-center">
      <Link href="/" className="mb-8 text-2xl">
        <BidoLogo />
      </Link>

      <p className="font-serif text-6xl font-bold text-orange">404</p>
      <h1 className="mt-2 font-serif text-2xl font-bold">Pagina nu a fost găsită</h1>
      <p className="mt-2 max-w-sm text-sm text-dark/50">
        Adresa accesată nu există sau a fost mutată.
      </p>

      <Link
        href="/"
        className="mt-6 rounded-full bg-orange px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-orange/90"
      >
        Înapoi la pagina principală
      </Link>
    </div>
  );
}
