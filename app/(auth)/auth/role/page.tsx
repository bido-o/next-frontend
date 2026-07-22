import { redirect } from 'next/navigation';

import { AuthHeader } from '@/components/auth/auth-header';
import { RoleSelector } from '@/components/auth/role-selector';
import { getFlowState } from '@/lib/auth/auth-flow';
import { AUTH_ROUTES } from '@/lib/constants';

export default async function RolePage() {
  const flow = await getFlowState();
  if (!flow.email) redirect(AUTH_ROUTES.EMAIL);

  return (
    <>
      <AuthHeader />
      <RoleSelector />
    </>
  );
}
