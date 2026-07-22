'use client';

import { useActionState } from 'react';

import { completeClientProfile } from '@/actions/auth';
import { IDLE } from '@/actions/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SubmitButton } from '@/components/ui/submit-button';

export function ClientProfileForm() {
  const [state, action, isPending] = useActionState(completeClientProfile, IDLE);
  const errs = state.status === 'error' ? state.fieldErrors ?? {} : {};

  return (
    <form action={action} className="space-y-5">
      <div>
        <h1 className="text-3xl font-serif font-bold">Câteva detalii</h1>
        <h2 className="text-3xl font-serif italic text-orange">și gata.</h2>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="firstName">Prenume</Label>
          <Input id="firstName" name="firstName" required className="h-11 rounded-xl" />
          {errs.firstName?.[0] && <p className="text-sm text-red-600">{errs.firstName[0]}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="lastName">Nume</Label>
          <Input id="lastName" name="lastName" required className="h-11 rounded-xl" />
          {errs.lastName?.[0] && <p className="text-sm text-red-600">{errs.lastName[0]}</p>}
        </div>
      </div>

      {state.status === 'error' && !Object.keys(errs).length && (
        <p className="text-sm text-red-600">{state.message}</p>
      )}

      <SubmitButton isPending={isPending}>Finalizează →</SubmitButton>
    </form>
  );
}
