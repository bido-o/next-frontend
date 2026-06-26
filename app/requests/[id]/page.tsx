import Link from 'next/link';
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowLeft01Icon } from '@hugeicons/core-free-icons';

import { TopBar } from '@/components/dashboard/top-bar';
import { BottomNav } from '@/components/dashboard/bottom-nav';
import { StatusBadge } from '@/components/dashboard/status-badge';
import { ReceivedOfferCard } from '@/components/dashboard/client/received-offer-card';
import { getClientProfile } from '@/lib/api/profiles';
import { getRequest, type RequestResponse } from '@/lib/api/requests';
import { listRequestOffers, type OfferResponse } from '@/lib/api/offers';
import { decodeJwt } from '@/lib/auth/jwt';
import { requireSession } from '@/lib/auth/session';
import { LOCATION_CITIES } from '@/lib/constants';

const dateFmt = new Intl.DateTimeFormat('ro-RO', { day: 'numeric', month: 'short', year: 'numeric' });
const budgetFmt = new Intl.NumberFormat('ro-RO');

function initialsFrom(name: string): string {
  return (
    name.trim().split(/\s+/).map((w) => w[0]).filter(Boolean).slice(0, 2).join('').toUpperCase() || '?'
  );
}

export default async function RequestDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const requestId = Number(id);
  const session = await requireSession();
  const role = decodeJwt(session.accessToken)?.role;

  const [profileRes, requestRes, offersRes] = await Promise.allSettled([
    getClientProfile(session.accessToken),
    getRequest(requestId, session.accessToken),
    listRequestOffers(requestId, session.accessToken),
  ]);

  const profile = profileRes.status === 'fulfilled' ? profileRes.value : null;
  const request: RequestResponse | null = requestRes.status === 'fulfilled' ? requestRes.value : null;
  const offers: OfferResponse[] = offersRes.status === 'fulfilled' ? offersRes.value : [];

  const initials =
    profile?.firstName || profile?.lastName
      ? initialsFrom(`${profile?.firstName ?? ''} ${profile?.lastName ?? ''}`)
      : '?';

  const cityLabel = request?.locationCity
    ? LOCATION_CITIES.find((c) => c.value === request!.locationCity)?.label ?? request.locationCity
    : null;

  // Cele mai bune oferte întâi (preț crescător).
  const sortedOffers = [...offers].sort((a, b) => a.totalPrice - b.totalPrice);

  return (
    <div className="min-h-screen bg-cream">
      <TopBar initials={initials} />
      <main className="mx-auto max-w-3xl px-4 pb-28 pt-6 sm:px-6">
        <Link
          href="/"
          className="mb-4 inline-flex items-center gap-1 text-sm text-dark/50 transition-colors hover:text-dark"
        >
          <HugeiconsIcon icon={ArrowLeft01Icon} size={16} strokeWidth={2} />
          Înapoi
        </Link>

        {!request ? (
          <p className="rounded-2xl border border-dashed border-black/10 bg-white/50 p-8 text-center text-sm text-dark/60">
            Cererea nu a fost găsită.
          </p>
        ) : (
          <div className="space-y-6">
            {/* Detalii cerere */}
            <div className="rounded-2xl border border-black/5 bg-white p-5">
              <div className="mb-2 flex items-center justify-between gap-2">
                <StatusBadge status={request.status} />
                <span className="text-xs font-medium text-dark/30">#{request.id}</span>
              </div>
              <h1 className="font-serif text-2xl font-bold leading-tight">{request.eventTypeName}</h1>
              <p className="mt-1 text-sm text-dark/50">
                {[dateFmt.format(new Date(request.eventDate)), `${request.nrPersons} pers.`, cityLabel]
                  .filter(Boolean)
                  .join(' · ')}
              </p>
              {request.message && (
                <p className="mt-3 border-t border-dashed border-black/10 pt-3 text-sm text-dark/70">
                  {request.message}
                </p>
              )}
              <div className="mt-3 flex items-center justify-between border-t border-dashed border-black/10 pt-3">
                <span className="text-sm text-dark/50">Buget</span>
                <span className="text-sm font-semibold">
                  {budgetFmt.format(request.budgetTotal)} RON
                  {request.budgetFlexible && <span className="font-normal text-dark/40"> · flexibil</span>}
                </span>
              </div>
            </div>

            {/* Oferte primite */}
            <section className="space-y-3">
              <h2 className="font-serif text-xl font-bold">
                Oferte primite {offers.length > 0 && <span className="text-dark/40">· {offers.length}</span>}
              </h2>

              {sortedOffers.length === 0 ? (
                <p className="rounded-2xl border border-dashed border-black/10 bg-white/50 p-6 text-center text-sm text-dark/50">
                  Încă nu ai primit oferte pentru această cerere.
                </p>
              ) : (
                <div className="space-y-3">
                  {sortedOffers.map((offer) => (
                    <ReceivedOfferCard key={offer.id} offer={offer} nrPersons={request.nrPersons} />
                  ))}
                </div>
              )}
            </section>
          </div>
        )}
      </main>
      <BottomNav role={role} />
    </div>
  );
}
