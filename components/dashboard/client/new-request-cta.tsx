import Link from 'next/link';
import { HugeiconsIcon } from '@hugeicons/react';
import { PlusSignIcon } from '@hugeicons/core-free-icons';

import { REQUEST_ROUTES } from '@/lib/constants';

export function NewRequestCta() {
  return (
    <Link
      href={REQUEST_ROUTES.TYPE}
      className="group relative block overflow-hidden rounded-3xl bg-dark p-6 text-white transition-transform active:translate-y-px"
    >
      <span className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-orange/30 blur-2xl" />

      <div className="relative flex items-center justify-between gap-4">
        <div className="space-y-2">
          <span className="text-xs font-medium uppercase tracking-wider text-white/50">
            New request
          </span>
          <h2 className="font-serif text-2xl italic leading-tight">
            Publică o cerere nouă
          </h2>
          <p className="text-sm text-white/60">
            ~3 minute · gratuit · primești oferte în câteva ore
          </p>
        </div>

        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-orange text-white shadow-lg shadow-orange/30 transition-transform group-hover:scale-105">
          <HugeiconsIcon icon={PlusSignIcon} size={26} strokeWidth={2.5} />
        </span>
      </div>
    </Link>
  );
}
