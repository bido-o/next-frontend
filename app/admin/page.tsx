import { redirect } from 'next/navigation';

import { verifyAdmin } from '@/lib/api/admin';
import { SessionExpiredError } from '@/lib/api/client';
import { endSession, requireSession } from '@/lib/auth/session';

/**
 * Panoul de admin.
 *
 * Rolul NU se citește din token: `decodeJwt` doar decodează, fără să verifice
 * semnătura, iar cookie-ul poate fi rescris din DevTools. Confirmarea vine de la
 * backend — singurul care deține secretul și poate valida tokenul.
 */
export default async function AdminPage() {
  const session = await requireSession();

  let isAdmin = false;
  try {
    await verifyAdmin(session.accessToken);
    isAdmin = true;
  } catch (err) {
    // Token respins (falsificat sau expirat) → sesiune moartă → logout.
    if (err instanceof SessionExpiredError) await endSession();
  }

// 403 (cont valid, dar nu admin) → cade în redirect-ul de mai jos.
  if (!isAdmin) redirect('/');

  return (
    <div className="flex min-h-screen items-center justify-center bg-cream px-4">
      <h1 className="text-2xl font-semibold">Te-ai logat ca Admin</h1>
    </div>
  );
}
