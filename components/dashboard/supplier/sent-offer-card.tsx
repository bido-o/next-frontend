'use client';

import { useState } from 'react';

import { StatusBadge } from '@/components/dashboard/status-badge';
import type { SentOfferResponse } from '@/lib/api/offers';

const budgetFmt = new Intl.NumberFormat('ro-RO');
const dateFmt = new Intl.DateTimeFormat('ro-RO', { day: 'numeric', month: 'short', year: 'numeric' });

export function SentOfferCard({ offer }: { offer: SentOfferResponse }) {
  const [open, setOpen] = useState(false);
  const hasDetails = Boolean(offer.requestMessage || offer.description);

  return (
    <article className="rounded-2xl border border-black/5 bg-white p-4">
      <div className="mb-2 flex items-center justify-between gap-2">
        <StatusBadge status={offer.status} variant="offer" />
        <span className="text-xs text-dark/40">{dateFmt.format(new Date(offer.createdAt))}</span>
      </div>

      {/* Titlu cerere — mereu vizibil */}
      <h3 className="font-serif text-lg font-semibold leading-tight">{offer.eventTypeName}</h3>
      <p className="mt-0.5 text-sm text-dark/50">Cererea #{offer.requestId}</p>

      {/* Detalii — vizibile doar la click */}
      {open && (
        <div className="mt-3 space-y-3 border-t border-dashed border-black/10 pt-3">
          {offer.requestMessage && (
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-dark/40">
                Mesajul clientului
              </p>
              <p className="mt-1 text-sm text-dark/70">{offer.requestMessage}</p>
            </div>
          )}
          {offer.description && (
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-dark/40">Oferta ta</p>
              <p className="mt-1 text-sm text-dark/70">{offer.description}</p>
            </div>
          )}
        </div>
      )}

      <div className="mt-3 flex items-center justify-between border-t border-dashed border-black/10 pt-3">
        <div className="text-sm">
          <span className="text-dark/50">Avans: </span>
          <span className="font-medium">{budgetFmt.format(offer.upfrontPayment)} RON</span>
        </div>
        <span className="text-sm font-semibold">{budgetFmt.format(offer.totalPrice)} RON</span>
      </div>

      {hasDetails && (
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="mt-3 w-full rounded-xl bg-cream/70 py-2 text-xs font-medium text-dark/60 transition-colors hover:text-dark"
        >
          {open ? 'Ascunde detaliile' : 'Vezi detaliile'}
        </button>
      )}
    </article>
  );
}
