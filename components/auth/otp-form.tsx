'use client';

import { useActionState, useState } from 'react';
import { REGEXP_ONLY_DIGITS } from 'input-otp';

import { verifyOtp } from '@/actions/auth';
import { IDLE } from '@/actions/auth-types';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import { OtpCountdown } from './otp-countdown';
import { SubmitButton } from './submit-button';

export function OtpForm({ email, otpSentAt }: { email: string; otpSentAt: number }) {
  const [state, action, isPending] = useActionState(verifyOtp, IDLE);
  const [code, setCode] = useState('');

  return (
    <form action={action} className="space-y-5">
      <h1 className="text-3xl font-serif font-bold">Verifică emailul</h1>
      <p className="text-sm text-dark/70">
        Am trimis un cod pe <strong>{email}</strong>. Introdu-l mai jos.
      </p>

      <InputOTP
        maxLength={6}
        pattern={REGEXP_ONLY_DIGITS}
        value={code}
        onChange={setCode}
        disabled={isPending}
        autoFocus
        containerClassName="justify-center"
      >
        <InputOTPGroup>
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <InputOTPSlot key={i} index={i} className="h-12 w-12 text-lg" />
          ))}
        </InputOTPGroup>
      </InputOTP>
      <input type="hidden" name="otpCode" value={code} />

      <OtpCountdown otpSentAt={otpSentAt} onResent={() => setCode('')} />

      {state.status === 'error' && (
        <p className="text-sm text-red-600">
          {state.fieldErrors?.otpCode?.[0] ?? state.message}
        </p>
      )}

      <SubmitButton disabled={code.length !== 6} isPending={isPending}>
        Verifică și continuă →
      </SubmitButton>
    </form>
  );
}
