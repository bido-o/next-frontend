import Link from 'next/link';
import { HugeiconsIcon } from '@hugeicons/react';
import { Search01Icon, Note01Icon } from '@hugeicons/core-free-icons';

import { AvailableRequestCard } from '@/components/dashboard/supplier/available-request-card';
import { SupplierStatCard } from '@/components/dashboard/supplier/supplier-stat-card';
import type { SupplierProfile } from '@/lib/api/profiles';
import type { SentOfferResponse } from '@/lib/api/offers';
import type { RequestPublicResponse } from '@/lib/api/requests';

const RECENT_LIMIT = 3;

export function SupplierDashboard({
  profile,
  requests,
  sentOffers,
}: {
  profile: SupplierProfile | null;
  requests: RequestPublicResponse[];
  sentOffers: SentOfferResponse[];
}) {
  const recent = [...requests]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, RECENT_LIMIT);

  // Statistici calculate din ofertele reale, nu din contoarele denormalizate din profil.
  const submitted = sentOffers.length;
  const won = sentOffers.filter((o) => o.status === 'ACCEPTED').length;
  const winRate = submitted > 0 ? Math.round((won / submitted) * 100) : 0;
  const rating = profile?.avgRating ?? 4.5;

  return (
    <div className="space-y-6">
      <div>
        {profile?.companyName && (
          <p className="text-sm text-dark/50">Bună, {profile.companyName}</p>
        )}
        <h1 className="mt-1 font-serif text-3xl font-bold leading-tight">
          Ai <span className="italic text-orange">{requests.length} cereri</span> noi
          {' '}pe care poți licita.
        </h1>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <SupplierStatCard label="Oferte trimise" value={submitted} />
        <SupplierStatCard
          label="Câștigate"
          value={won}
          hint={submitted > 0 ? `${winRate}% rată de câștig` : undefined}
        />
        <SupplierStatCard
          label="Rating"
          value={rating}
          hint="medie recenzii"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <ShortcutCard icon={Search01Icon} label="Cereri disponibile" hint="Vezi tot feed-ul" href="/supplier/requests" />
        <ShortcutCard icon={Note01Icon} label="Ofertele mele" hint="Trimise & câștigate" href="/supplier/offers" />
      </div>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-xl font-bold">Cereri recente</h2>
          {requests.length > RECENT_LIMIT && (
            <Link href="/supplier/requests" className="text-sm text-dark/40 hover:text-dark">
              Vezi toate ({requests.length})
            </Link>
          )}
        </div>

        {recent.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-black/10 bg-white/50 p-6 text-center text-sm text-dark/50">
            Nicio cerere disponibilă momentan.
          </p>
        ) : (
          <div className="space-y-3">
            {recent.map((r) => (
              <AvailableRequestCard key={r.id} request={r} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function ShortcutCard({
  icon,
  label,
  hint,
  href,
}: {
  icon: typeof Search01Icon;
  label: string;
  hint: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 rounded-2xl border border-black/5 bg-white p-4 transition-colors hover:bg-white/70"
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-cream text-orange">
        <HugeiconsIcon icon={icon} size={20} strokeWidth={1.8} />
      </span>
      <span className="min-w-0">
        <span className="block truncate text-sm font-medium">{label}</span>
        <span className="block truncate text-xs text-dark/50">{hint}</span>
      </span>
    </Link>
  );
}
