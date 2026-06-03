'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowLeft01Icon } from '@hugeicons/core-free-icons';
import { BidoLogo } from '@/components/bido-logo';

export function AuthHeader({ showBack = true }: { showBack?: boolean;}) {
  const router = useRouter();
  
  return (
    <header className="flex items-center mb-6 w-full">
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
    </header>
  );
}
