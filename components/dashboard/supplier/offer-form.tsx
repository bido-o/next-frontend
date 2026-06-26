'use client';

import { useActionState, useState } from 'react';

import { submitOffer } from '@/actions/offers';
import { IDLE } from '@/actions/offer-types';
import { SubmitButton } from '@/components/auth/submit-button';
import { RequestToggle } from '@/components/requests/request-toggle';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const fmt = new Intl.NumberFormat('ro-RO');

export function OfferForm({
  requestId,
  nrPersons,
  clientBudget,
}: {
  requestId: number;
  nrPersons: number;
  clientBudget: number;
}) {
  const [state, action, isPending] = useActionState(submitOffer, IDLE);
  const [total, setTotal] = useState('');
  const errs = state.status === 'error' ? state.fieldErrors ?? {} : {};

  const totalNum = Number.parseFloat(total);
  const perPerson =
    nrPersons > 0 && Number.isFinite(totalNum) && totalNum > 0
      ? Math.round((totalNum / nrPersons) * 10) / 10
      : null;
  const clientPerPerson = nrPersons > 0 ? Math.round(clientBudget / nrPersons) : null;

  return (
    <form action={action} className="space-y-6">
      <input type="hidden" name="requestId" value={requestId} />

      {/* Preț total */}
      <div className="space-y-2">
        <Label htmlFor="totalPrice">Preț total propus</Label>
        <div className="relative">
          <Input
            id="totalPrice"
            name="totalPrice"
            inputMode="decimal"
            value={total}
            onChange={(e) => setTotal(e.target.value.replace(/[^\d.]/g, ''))}
            placeholder="0"
            className="h-14 rounded-xl pr-16 text-2xl font-serif font-bold"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-dark/50">RON</span>
        </div>
        {perPerson != null && (
          <p className="text-xs text-dark/50">
            = {perPerson} RON / persoană
            {clientPerPerson != null && (
              <span className="text-dark/40"> · bugetul clientului ~{clientPerPerson} RON/pers</span>
            )}
          </p>
        )}
        {errs.totalPrice?.[0] && <p className="text-sm text-red-600">{errs.totalPrice[0]}</p>}
      </div>

      {/* Avans */}
      <div className="space-y-2">
        <Label htmlFor="upfrontPayment">
          Avans solicitat <span className="text-dark/40">(opțional)</span>
        </Label>
        <div className="relative">
          <Input
            id="upfrontPayment"
            name="upfrontPayment"
            inputMode="decimal"
            placeholder="0"
            className="h-12 rounded-xl pr-16"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-dark/50">RON</span>
        </div>
        <p className="text-xs text-dark/50">0 = fără avans</p>
        {errs.upfrontPayment?.[0] && <p className="text-sm text-red-600">{errs.upfrontPayment[0]}</p>}
      </div>

      {/* Plată online */}
      <RequestToggle
        name="onlinePaymentAvailable"
        label="Plată online disponibilă"
        description="Clientul poate plăti avansul online prin platformă."
      />

      {/* Mesaj */}
      <div className="space-y-2">
        <Label htmlFor="description">
          Mesaj personal pentru client <span className="text-dark/40">(opțional)</span>
        </Label>
        <Textarea
          id="description"
          name="description"
          placeholder="Descrie ce include oferta ta: meniu, servicii, livrare..."
          rows={4}
        />
        {errs.description?.[0] && <p className="text-sm text-red-600">{errs.description[0]}</p>}
      </div>

      {state.status === 'error' && !Object.keys(errs).length && (
        <p className="text-sm text-red-600">{state.message}</p>
      )}

      <SubmitButton isPending={isPending}>Trimite oferta →</SubmitButton>
    </form>
  );
}
