import Link from 'next/link';
import { HugeiconsIcon } from '@hugeicons/react';
import { Notification03Icon } from '@hugeicons/core-free-icons';

import { BidoLogo } from '@/components/bido-logo';

// Bara de sus: logo + notificări + avatar. Identică pentru ambele roluri.
export function TopBar({ initials }: { initials: string }) {
  return (
    <header className="sticky top-0 z-20 border-b border-black/5 bg-cream/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-3xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="text-xl">
          <BidoLogo />
        </Link>

        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Notificări"
            className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white text-dark/70 ring-1 ring-black/5 transition-colors hover:bg-white/70"
          >
            <HugeiconsIcon icon={Notification03Icon} size={20} strokeWidth={1.8} />
            <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-orange ring-2 ring-white" />
          </button>
          <span
            aria-hidden
            className="flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-br from-orange to-orange/60 text-sm font-medium text-white"
          >
            {initials}
          </span>
        </div>
      </div>
    </header>
  );
}
