import { AuthHeader } from '@/components/auth/auth-header';
import { EmailForm } from '@/components/auth/email-form';
import { getFlowState } from '@/lib/auth/flow-state';

export default async function EmailPage() {
  const flow = await getFlowState();

  return (
    <>
      <AuthHeader showBack={false} />
      <EmailForm defaultEmail={flow.email} />
    </>
  );
}
