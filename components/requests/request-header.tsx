'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowLeft01Icon } from '@hugeicons/core-free-icons';

import { BidoLogo } from '@/components/bido-logo';
import { cn } from '@/lib/utils';

export function RequestHeader({
  step,
  total = 3,
  showBack = true,
}: {
  step: number;
  total?: number;
  showBack?: boolean;
}) {
  const router = useRouter();

  return (
    <header className="mb-6 w-full space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {showBack && (
            <button
              type="button"
              onClick={() => router.back()}
              aria-label="Înapoi"
              className="p-1 rounded-full hover:bg-cream transition-colors"
            >
              <HugeiconsIcon icon={ArrowLeft01Icon} size={20} strokeWidth={2} />
            </button>
          )}
          <Link href="/" className="text-xl">
            <BidoLogo />
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-medium text-dark/50">
            Pasul {step} / {total}
          </span>
          <Link
            href="/"
            aria-label="Închide"
            className="p-1 rounded-full hover:bg-cream transition-colors text-dark/60"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </Link>
        </div>
      </div>

      <div className="flex gap-1.5" aria-hidden>
        {Array.from({ length: total }).map((_, i) => (
          <span
            key={i}
            className={cn('h-1.5 flex-1 rounded-full transition-colors', i < step ? 'bg-orange' : 'bg-black/10')}
          />
        ))}
      </div>
    </header>
  );
}
