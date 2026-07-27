'use client';

import { useActionState, useState } from 'react';

import { publishRequest } from '@/actions/requests';
import { IDLE } from '@/actions/action-types';
import { SubmitButton } from '@/components/ui/submit-button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RequestToggle } from '@/components/requests/request-toggle';
import { EXPIRY_OPTIONS, DEFAULT_EXPIRY_HOURS } from '@/lib/constants';
import { cn } from '@/lib/utils';

export function BudgetForm({
  nrPersons,
  defaultBudget,
  defaultFlexible = false,
  defaultMessage,
  defaultExpiry = DEFAULT_EXPIRY_HOURS,
}: {
  nrPersons?: number;
  defaultBudget?: number;
  defaultFlexible?: boolean;
  defaultMessage?: string;
  defaultExpiry?: number;
}) {
  const [state, action, isPending] = useActionState(publishRequest, IDLE);
  const [budget, setBudget] = useState<string>(defaultBudget != null ? String(defaultBudget) : '');
  const [expiry, setExpiry] = useState<number>(defaultExpiry);
  const errs = state.status === 'error' ? state.fieldErrors ?? {} : {};

  const budgetNum = Number.parseFloat(budget);
  const perPerson = nrPersons && nrPersons > 0 && Number.isFinite(budgetNum) && budgetNum > 0
                      ? Math.round(budgetNum / nrPersons)
                      : null;

  return (
    <form action={action} className="space-y-6">
      <input type="hidden" name="expiresInHours" value={expiry} />

      <div>
        <h1 className="text-3xl font-serif font-bold">Buget</h1>
        <h2 className="text-3xl font-serif italic text-orange">și detalii finale</h2>
      </div>

      {/* Buget total */}
      <div className="space-y-2">
        <Label htmlFor="budgetTotal">Buget total</Label>
        <div className="relative">
          <Input
            id="budgetTotal"
            name="budgetTotal"
            inputMode="decimal"
            value={budget}
            onChange={(e) => setBudget(e.target.value.replace(/[^\d.]/g, ''))}
            placeholder="0"
            className="h-14 rounded-xl pr-16 text-2xl font-serif font-bold"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-dark/50">RON</span>
        </div>
        {perPerson != null && (
          <p className="text-xs text-dark/50">~{perPerson} RON / persoană</p>
        )}
        {errs.budgetTotal?.[0] && <p className="text-sm text-red-600">{errs.budgetTotal[0]}</p>}
      </div>

      {/* Buget flexibil */}
      <RequestToggle
        name="budgetFlexible"
        label="Buget flexibil"
        description="Primești și oferte premium, peste buget."
        defaultChecked={defaultFlexible}
      />

      {/* Mesaj */}
      <div className="space-y-2">
        <Label htmlFor="message">
          Mesaj pentru furnizori <span className="text-dark/40">(opțional)</span>
        </Label>
        <Textarea
          id="message"
          name="message"
          defaultValue={defaultMessage}
          placeholder="Detalii despre meniu, atmosferă, restricții alimentare..."
          rows={4}
        />
        {errs.message?.[0] && <p className="text-sm text-red-600">{errs.message[0]}</p>}
      </div>

      {/* Expirare */}
      <div className="space-y-2">
        <span className="text-sm font-medium">Cererea expiră în</span>
        <div className="grid grid-cols-4 gap-2">
          {EXPIRY_OPTIONS.map((opt) => {
            const active = expiry === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => setExpiry(opt.value)}
                className={cn(
                  'rounded-xl border-2 py-2 text-sm transition-all',
                  active
                    ? 'border-orange bg-orange text-white font-medium'
                    : 'border-black/10 hover:border-black/20',
                )}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
        {errs.expiresInHours?.[0] && <p className="text-sm text-red-600">{errs.expiresInHours[0]}</p>}
      </div>

      {state.status === 'error' && !Object.keys(errs).length && (
        <p className="text-sm text-red-600">{state.message}</p>
      )}

      <SubmitButton isPending={isPending}>Publică cererea gratuit</SubmitButton>
    </form>
  );
}
