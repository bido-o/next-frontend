import { HugeiconsIcon } from '@hugeicons/react';
import { Store01Icon, CheckmarkCircle02Icon, Cash01Icon } from '@hugeicons/core-free-icons';

import { StatusBadge } from '@/components/dashboard/status-badge';
import type { OfferResponse } from '@/lib/api/offers';

const budgetFmt = new Intl.NumberFormat('ro-RO');
const dateFmt = new Intl.DateTimeFormat('ro-RO', { day: 'numeric', month: 'short' });

export function ReceivedOfferCard({
  offer,
  nrPersons,
}: {
  offer: OfferResponse;
  nrPersons: number;
}) {
  const perPerson = nrPersons > 0 ? Math.round(offer.totalPrice / nrPersons) : null;

  return (
    <article className="rounded-2xl border border-black/5 bg-white p-4">
      {/* Antet: furnizor (generic) + preț */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-cream text-orange">
            <HugeiconsIcon icon={Store01Icon} size={20} strokeWidth={1.8} />
          </span>
          <div>
            <p className="text-sm font-medium">Furnizor</p>
            {offer.status !== 'PENDING' && (
              <div className="mt-0.5">
                <StatusBadge status={offer.status} variant="offer" />
              </div>
            )}
          </div>
        </div>
        <div className="text-right">
          <p className="font-serif text-xl font-bold leading-none">
            {budgetFmt.format(offer.totalPrice)}
          </p>
          <p className="text-xs text-dark/40">
            RON{perPerson != null && ` · ${perPerson}/pers`}
          </p>
        </div>
      </div>

      {offer.description && (
        <p className="mt-3 text-sm text-dark/70">{offer.description}</p>
      )}

      {/* Meta: avans, plată online, dată */}
      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
        <span className="inline-flex items-center gap-1 rounded-full bg-black/5 px-2.5 py-1 text-dark/60">
          <HugeiconsIcon icon={Cash01Icon} size={13} strokeWidth={1.8} />
          {offer.upfrontPayment > 0 ? `Avans ${budgetFmt.format(offer.upfrontPayment)} RON` : 'Fără avans'}
        </span>
        {offer.onlinePaymentAvailable && (
          <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-1 text-green-700">
            <HugeiconsIcon icon={CheckmarkCircle02Icon} size={13} strokeWidth={1.8} />
            Plată online
          </span>
        )}
        <span className="text-dark/40">{dateFmt.format(new Date(offer.createdAt))}</span>
      </div>

      {/* Acțiuni (vizuale deocamdată) */}
      <div className="mt-4 flex items-center gap-2">
        <button
          type="button"
          className="flex-1 rounded-full border border-black/10 py-2 text-sm font-medium text-dark/70 transition-colors hover:bg-cream"
        >
          Vezi profilul
        </button>
        <button
          type="button"
          className="flex-1 rounded-full bg-orange py-2 text-sm font-medium text-white transition-transform active:translate-y-px"
        >
          Acceptă →
        </button>
      </div>
    </article>
  );
}
