'use client';

import { useActionState } from 'react';

import { toggleUserSuspension } from '@/actions/admin';
import { IDLE } from '@/actions/action-types';
import { cn } from '@/lib/utils';

/**
 * Comută starea de suspendare a unui cont.
 *
 * `suspend` trimite starea DORITĂ (opusul celei curente)
 */
export function SuspendButton({ userId, suspended }: { userId: number; suspended: boolean }) {
  const [state, action, isPending] = useActionState(toggleUserSuspension, IDLE);

  return (
    <form action={action} className="flex flex-col items-end gap-1">
      <input type="hidden" name="userId" value={userId} />
      <input type="hidden" name="suspend" value={String(!suspended)} />

      <button
        type="submit"
        disabled={isPending}
        className={cn(
          'rounded-full border px-3 py-1.5 text-sm font-medium transition-colors disabled:opacity-50',
          suspended
            ? 'border-green-600/30 text-green-700 hover:bg-green-600/10'
            : 'border-red-600/30 text-red-700 hover:bg-red-600/10',
        )}
      >
        {isPending ? 'Se procesează…' : suspended ? 'Reactivează' : 'Suspendă'}
      </button>

      {state.status === 'error' && (
        <p className="text-xs text-red-600">{state.message}</p>
      )}
    </form>
  );
}
