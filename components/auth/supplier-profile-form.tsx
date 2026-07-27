'use client';

import { useActionState } from 'react';

import { completeSupplierProfile } from '@/actions/auth';
import { IDLE } from '@/actions/action-types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SubmitButton } from '@/components/ui/submit-button';

export function SupplierProfileForm() {
  const [state, action, isPending] = useActionState(completeSupplierProfile, IDLE);
  const errs = state.status === 'error' ? state.fieldErrors ?? {} : {};

  return (
    <form action={action} className="space-y-5">
      <div>
        <h1 className="text-3xl font-serif font-bold">Detalii business</h1>
        <h2 className="text-3xl font-serif italic text-orange">și ești gata.</h2>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="companyName">Nume companie</Label>
        <Input
          id="companyName"
          name="companyName"
          required
          placeholder="ex: Catering Express SRL"
          className="h-11 rounded-xl"
        />
        {errs.companyName?.[0] && <p className="text-sm text-red-600">{errs.companyName[0]}</p>}
      </div>

      {state.status === 'error' && !Object.keys(errs).length && (
        <p className="text-sm text-red-600">{state.message}</p>
      )}

      <SubmitButton isPending={isPending}>Finalizează →</SubmitButton>
    </form>
  );
}
