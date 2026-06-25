import { StatusBadge } from '@/components/dashboard/status-badge';
import type { RequestPublicResponse } from '@/lib/api/requests';
import { LOCATION_CITIES } from '@/lib/constants';

const dateFmt = new Intl.DateTimeFormat('ro-RO', { day: 'numeric', month: 'short' });
const budgetFmt = new Intl.NumberFormat('ro-RO');

// Câmpuri PLACEHOLDER, complet false — NU date reale ascunse.
// Detaliile adevărate ale clientului se dezvăluie abia după acceptarea ofertei.
const LOCKED = {
  clientName: 'Client Bido',
  address: 'Str. Exemplu nr. 00, et. 0',
  phone: '07xx xxx xxx',
} as const;

// "Expiră în 3 zile" / "Expiră în 5h" / "Expirată".
function expiryLabel(expiresAt: string | null): string | null {
  if (!expiresAt) return null;
  const diffMs = new Date(expiresAt).getTime() - Date.now();
  if (diffMs <= 0) return 'Expirată';
  const hours = Math.floor(diffMs / 3_600_000);
  if (hours < 24) return `Expiră în ${hours}h`;
  return `Expiră în ${Math.floor(hours / 24)} zile`;
}

export function AvailableRequestCard({ request }: { request: RequestPublicResponse }) {
  const cityLabel = request.locationCity
    ? LOCATION_CITIES.find((c) => c.value === request.locationCity)?.label ?? request.locationCity
    : null;

  const meta = [
    dateFmt.format(new Date(request.eventDate)),
    `${request.nrPersons} pers.`,
    cityLabel,
  ]
    .filter(Boolean)
    .join(' · ');

  const expiry = expiryLabel(request.expiresAt);

  return (
    <article className="rounded-2xl border border-black/5 bg-white p-4">
      <div className="mb-2 flex items-center justify-between gap-2">
        <StatusBadge status={request.status} />
        {expiry && <span className="text-xs font-medium text-dark/40">{expiry}</span>}
      </div>

      <h3 className="font-serif text-lg font-semibold leading-tight">{request.eventTypeName}</h3>
      <p className="mt-0.5 text-sm text-dark/50">{meta}</p>

      {request.message && (
        <p className="mt-2 line-clamp-2 text-sm text-dark/70">{request.message}</p>
      )}

      {/* Detalii client — blurate (placeholder fals), se deblochează după acceptare */}
      <div className="mt-3 rounded-xl bg-cream/60 p-3">
        <div className="grid grid-cols-3 gap-2 text-xs">
          <LockedField label="Client" value={LOCKED.clientName} />
          <LockedField label="Adresă" value={LOCKED.address} />
          <LockedField label="Telefon" value={LOCKED.phone} />
        </div>
        <p className="mt-2 text-[11px] text-dark/40">
          Datele clientului se deblochează când oferta ta e acceptată.
        </p>
      </div>

      <div className="mt-3 flex items-center justify-between border-t border-dashed border-black/10 pt-3">
        <span className="text-sm font-semibold">
          {budgetFmt.format(request.budgetTotal)} RON
          {request.budgetFlexible && <span className="font-normal text-dark/40"> · flexibil</span>}
        </span>
        <button
          type="button"
          className="rounded-full bg-dark px-4 py-2 text-sm font-medium text-white transition-transform active:translate-y-px"
        >
          Ofertează →
        </button>
      </div>
    </article>
  );
}

function LockedField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-dark/40">{label}</p>
      <p className="select-none truncate font-medium text-dark/70 blur-sm" aria-hidden>
        {value}
      </p>
    </div>
  );
}
