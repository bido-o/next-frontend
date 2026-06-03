'use client';

import { useState, useTransition } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Clock01Icon, RefreshIcon } from '@hugeicons/core-free-icons';

import { resendOtp } from '@/actions/auth';
import { useNow } from '@/hooks/use-now';
import { cn } from '@/lib/utils';

const EXPIRY_S = 5 * 60; // codul OTP expiră în 5 minute
const COOLDOWN_S = 30; // se poate retrimite un cod nou la fiecare 30s

function formatMMSS(totalSeconds: number) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}


export function OtpCountdown({otpSentAt, onResent}: {
  otpSentAt: number;
  onResent?: () => void;
}) {
  const [sentAt, setSentAt] = useState(otpSentAt);
  const [error, setError] = useState<string | null>(null);
  const [isResending, startResend] = useTransition();
  const now = useNow(otpSentAt);

  const expiresIn = Math.max(0, Math.ceil((sentAt + EXPIRY_S * 1000 - now) / 1000));
  const resendIn = Math.max(0, Math.ceil((sentAt + COOLDOWN_S * 1000 - now) / 1000));
  const expired = expiresIn === 0;
  const canResend = resendIn === 0 && !isResending;

  function handleResend() {
    setError(null);
    startResend(async () => {
      const result = await resendOtp();
      if ('error' in result) {
        setError(result.error);
        return;
      }
      setSentAt(result.otpSentAt);
      onResent?.();
    });
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3 rounded-2xl bg-cream px-4 py-3">
        <span
          className={cn(
            'inline-flex items-center gap-1.5 text-sm tabular-nums',
            expired ? 'text-red-600' : 'text-dark/70',
          )}
        >
          <HugeiconsIcon
            icon={Clock01Icon}
            size={16}
            className={expired ? 'text-red-600' : 'text-orange'}
          />
          {expired ? (
            'Cod expirat'
          ) : (
            <>
              Expiră în <strong className="font-semibold">{formatMMSS(expiresIn)}</strong>
            </>
          )}
        </span>

        <button
          type="button"
          onClick={handleResend}
          disabled={!canResend}
          className={cn(
            'inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-colors tabular-nums',
            canResend
              ? 'bg-orange text-white hover:bg-orange/90'
              : 'cursor-not-allowed bg-black/5 text-dark/40',
          )}
        >
          <HugeiconsIcon
            icon={RefreshIcon}
            size={15}
            className={cn(isResending && 'animate-spin')}
          />
          {isResending
            ? 'Se trimite...'
            : canResend
              ? 'Retrimite codul'
              : `Retrimite (${formatMMSS(resendIn)})`}
        </button>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
