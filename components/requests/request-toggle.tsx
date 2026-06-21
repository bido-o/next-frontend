'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

/**
 * Toggle (switch) controlat care emite un hidden input "true"/"false",
 * ca server action-ul să poată citi valoarea din FormData.
 */
export function RequestToggle({
  name,
  label,
  description,
  defaultChecked = false,
}: {
  name: string;
  label: string;
  description?: string;
  defaultChecked?: boolean;
}) {
  const [on, setOn] = useState(defaultChecked);

  return (
    <button
      type="button"
      onClick={() => setOn((v) => !v)}
      aria-pressed={on}
      className={cn(
        'flex w-full items-center gap-3 rounded-2xl border-2 p-4 text-left transition-all',
        on ? 'border-orange bg-orange/5' : 'border-black/10 hover:border-black/20',
      )}
    >
      <input type="hidden" name={name} value={on ? 'true' : 'false'} />
      <div className="flex-1">
        <div className="font-medium">{label}</div>
        {description && <p className="mt-0.5 text-sm text-dark/60">{description}</p>}
      </div>
      <span
        className={cn(
          'relative h-6 w-11 shrink-0 rounded-full transition-colors',
          on ? 'bg-orange' : 'bg-black/15',
        )}
      >
        <span
          className={cn(
            'absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform',
            on && 'translate-x-5',
          )}
        />
      </span>
    </button>
  );
}
