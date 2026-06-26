import Link from 'next/link';

import { StatusBadge } from '@/components/dashboard/status-badge';
import type { RequestResponse } from '@/lib/api/requests';
import { LOCATION_CITIES } from '@/lib/constants';

const dateFmt = new Intl.DateTimeFormat('ro-RO', { day: 'numeric', month: 'short' });
const budgetFmt = new Intl.NumberFormat('ro-RO');

export function RequestCard({ request }: { request: RequestResponse }) {
  const cityLabel = request.locationCity
    ? LOCATION_CITIES.find((c) => c.value === request.locationCity)?.label ?? request.locationCity
    : null;

  const meta = [
    dateFmt.format(new Date(request.eventDate)),
    request.nrPersons ? `${request.nrPersons} pers.` : null,
    cityLabel,
  ]
    .filter(Boolean)
    .join(' · ');

  return (
    <Link
      href={`/requests/${request.id}`}
      className="block rounded-2xl border border-black/5 bg-white p-4 transition-colors hover:bg-white/70"
    >
      <div className="mb-2 flex items-center justify-between gap-2">
        <StatusBadge status={request.status} />
        <span className="text-xs font-medium text-dark/30">#{request.id}</span>
      </div>

      <h3 className="font-serif text-lg font-semibold leading-tight">{request.eventTypeName}</h3>
      <p className="mt-0.5 text-sm text-dark/50">{meta}</p>

      <div className="mt-3 flex items-center justify-between border-t border-dashed border-black/10 pt-3">
        <span className="text-sm text-dark/50">Buget</span>
        <span className="text-sm font-semibold">
          {budgetFmt.format(request.budgetTotal)} RON
          {request.budgetFlexible && <span className="font-normal text-dark/40"> · flexibil</span>}
        </span>
      </div>
    </Link>
  );
}
