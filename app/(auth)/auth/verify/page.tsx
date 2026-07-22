import { redirect } from 'next/navigation';

import { AuthHeader } from '@/components/auth/auth-header';
import { OtpForm } from '@/components/auth/otp-form';
import { getFlowState } from '@/lib/auth/auth-flow';
import { AUTH_ROUTES } from '@/lib/constants';

export default async function VerifyPage() {
  const flow = await getFlowState();
  if (!flow.email) redirect(AUTH_ROUTES.EMAIL);

  return (
    <>
      <AuthHeader />
      <OtpForm email={flow.email} otpSentAt={flow.otpSentAt} />
    </>
  );
}
