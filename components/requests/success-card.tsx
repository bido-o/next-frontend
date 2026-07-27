import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { BidoLogo } from '@/components/bido-logo';
import type { RequestResponse } from '@/types/request';
import { LOCATION_CITIES } from '@/lib/constants';

const dateFmt = new Intl.DateTimeFormat('ro-RO', { dateStyle: 'long', timeStyle: 'short' });

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full bg-cream px-3 py-1 text-xs text-dark/70">
      {children}
    </span>
  );
}

export function SuccessCard({ request }: { request: RequestResponse | null; }) {
  const cityLabel = request?.locationCity
    ? LOCATION_CITIES.find((c) => c.value === request.locationCity)?.label ?? request.locationCity
    : null;

  return (
    <div className="space-y-6 text-center">
      <div className="flex justify-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-orange text-white">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </span>
      </div>

      <div>
        <h1 className="text-3xl font-serif font-bold">Cererea ta e</h1>
        <h2 className="text-3xl font-serif italic text-orange">live!</h2>
        <p className="mx-auto mt-3 max-w-xs text-sm text-dark/60">
          Furnizorii relevanți au fost notificați. Primești ofertele direct pe email.
        </p>
      </div>

      {request && (
        <div className="rounded-2xl border border-black/10 bg-white p-4 text-left">
          <div className="mb-3 flex items-center justify-between">
            <span className="font-serif text-lg font-semibold">
              {request.eventTypeName}
              {request.nrPersons ? ` — ${request.nrPersons} persoane` : ''}
            </span>
            <span className="text-xs font-medium text-dark/40">#REQ-{request.id}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <Chip>{dateFmt.format(new Date(request.eventDate))}</Chip>
            {cityLabel && <Chip>{cityLabel}</Chip>}
            <Chip>
              {request.budgetTotal} RON{request.budgetFlexible ? ' · flexibil' : ''}
            </Chip>
            {request.deliveryIncluded && <Chip>Livrare inclusă</Chip>}
          </div>
        </div>
      )}

      <Button asChild className="h-12 w-full rounded-full bg-orange text-white hover:bg-orange/90">
        <Link href="/">
          Înapoi la <BidoLogo />
        </Link>
      </Button>
    </div>
  );
}
