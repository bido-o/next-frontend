'use client';

import { useActionState } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { SparklesIcon } from '@hugeicons/core-free-icons';

import { requestOtp } from '@/actions/auth';
import { IDLE } from '@/actions/action-types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SubmitButton } from '@/components/ui/submit-button';

export function EmailForm({ defaultEmail }: { defaultEmail?: string }) {
  const [state, action, isPending] = useActionState(requestOtp, IDLE);
  const fieldErrors = state.status === 'error' ? state.fieldErrors : undefined;

  return (
    <form action={action} className="space-y-6">
      <div className="space-y-3">
        <h2 className="text-3xl font-serif italic text-orange">
          Salut! Hai să începem.
        </h2>
        <p className="text-sm text-dark/70">
          Fără parole — îți trimitem un cod pe email și te logăm instant.
        </p>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-cream px-3 py-1 text-xs text-dark/60">
          <HugeiconsIcon icon={SparklesIcon} size={14} className="text-orange" />
          Cont nou? Se creează automat.
        </span>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Adresă email</Label>
        <Input
          id="email"
          name="email"
          type="text"
          defaultValue={defaultEmail}
          placeholder="ex@gmail.com"
          autoComplete="email"
          autoFocus
          className="h-12 rounded-xl"
        />
        {fieldErrors?.email?.[0] && (
          <p className="text-sm text-red-600">{fieldErrors.email[0]}</p>
        )}
      </div>

      {state.status === 'error' && !fieldErrors?.email && (
        <p className="text-sm text-red-600">{state.message}</p>
      )}

      <SubmitButton isPending={isPending}>Continuă →</SubmitButton>
    </form>
  );
}
