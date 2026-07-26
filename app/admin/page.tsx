import { redirect } from 'next/navigation';

import { decodeJwt } from '@/lib/auth/jwt';
import { requireSession } from '@/lib/auth/session';
import { ROLES } from '@/lib/constants';

export default async function AdminPage() {
  const session = await requireSession();
  const role = decodeJwt(session.accessToken)?.role;

  if (role !== ROLES.ADMIN) redirect('/');

  return (
    <div className="flex min-h-screen items-center justify-center bg-cream px-4">
      <h1 className="text-2xl font-semibold">Te-ai logat ca Admin</h1>
    </div>
  );
}
