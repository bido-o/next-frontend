import Link from 'next/link';
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowLeft01Icon } from '@hugeicons/core-free-icons';

import { BidoLogo } from '@/components/bido-logo';
import { OfferForm } from '@/components/dashboard/supplier/offer-form';
import { StatusBadge } from '@/components/dashboard/status-badge';
import { listAvailableRequests } from '@/lib/api/requests';
import { requireSession } from '@/lib/auth/session';
import { LOCATION_CITIES } from '@/lib/constants';

const dateFmt = new Intl.DateTimeFormat('ro-RO', { day: 'numeric', month: 'short', year: 'numeric' });
const budgetFmt = new Intl.NumberFormat('ro-RO');

export default async function OfferPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const requestId = Number(id);
  const session = await requireSession();

  let request = null;
  try {
    const available = await listAvailableRequests(session.accessToken);
    request = available.find((r) => r.id === requestId) ?? null;
  } catch {
    request = null;
  }

  const cityLabel = request?.locationCity
    ? LOCATION_CITIES.find((c) => c.value === request!.locationCity)?.label ?? request.locationCity
    : null;

  return (
    <div className="min-h-screen bg-cream">
      <header className="sticky top-0 z-20 border-b border-black/5 bg-cream/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-2xl items-center gap-2 px-4 sm:px-6">
          <Link
            href="/supplier/requests"
            aria-label="Înapoi"
            className="rounded-full p-1 transition-colors hover:bg-white/60"
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} size={20} strokeWidth={2} />
          </Link>
          <Link href="/" className="text-xl">
            <BidoLogo />
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 pb-16 pt-6 sm:px-6">
        {!request ? (
          <div className="rounded-2xl border border-dashed border-black/10 bg-white/50 p-8 text-center">
            <p className="text-sm text-dark/60">
              Această cerere nu mai este disponibilă pentru ofertare.
            </p>
            <Link href="/supplier/requests" className="mt-3 inline-block text-sm font-medium text-orange">
              ← Înapoi la cereri
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            <div>
              <h1 className="font-serif text-3xl font-bold leading-tight">
                Trimite o <span className="italic text-orange">ofertă</span>
              </h1>
              <p className="mt-1 text-sm text-dark/50">Cererea #{request.id}</p>
            </div>

            {/* Contextul cererii */}
            <div className="rounded-2xl border border-black/5 bg-white p-4">
              <div className="mb-2 flex items-center justify-between gap-2">
                <StatusBadge status={request.status} />
                <span className="text-sm font-semibold">
                  {budgetFmt.format(request.budgetTotal)} RON
                  {request.budgetFlexible && (
                    <span className="font-normal text-dark/40"> · flexibil</span>
                  )}
                </span>
              </div>
              <h2 className="font-serif text-lg font-semibold leading-tight">
                {request.eventTypeName}
              </h2>
              <p className="mt-0.5 text-sm text-dark/50">
                {[
                  dateFmt.format(new Date(request.eventDate)),
                  `${request.nrPersons} pers.`,
                  cityLabel,
                ]
                  .filter(Boolean)
                  .join(' · ')}
              </p>
              {request.message && (
                <p className="mt-2 border-t border-dashed border-black/10 pt-2 text-sm text-dark/70">
                  {request.message}
                </p>
              )}
            </div>

            <div className="rounded-3xl border border-black/5 bg-white p-5 sm:p-6">
              <OfferForm
                requestId={request.id}
                nrPersons={request.nrPersons}
                clientBudget={request.budgetTotal}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
