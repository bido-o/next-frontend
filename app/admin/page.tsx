import { redirect } from 'next/navigation';

import { SuspendButton } from '@/components/admin/suspend-button';
import { listUsers } from '@/lib/api/admin';
import { ApiError, SessionExpiredError } from '@/lib/api/client';
import { endSession, requireSession } from '@/lib/auth/session';
import { ROLES } from '@/lib/constants';
import type { AdminUserListDto } from '@/types/admin';

/**
 * Panoul de admin.
 *
 * Rolul NU se citește din token: `decodeJwt` doar decodează, fără să verifice
 * semnătura, iar cookie-ul poate fi rescris din DevTools. Cererea de listare e
 * ea însăși verificarea — endpoint-ul cere ADMIN, iar gateway-ul validează
 * semnătura tokenului. Un 403 înseamnă „nu ești admin”.
 */
export default async function AdminPage() {
  const session = await requireSession();

  let users: AdminUserListDto[] = [];
  let forbidden = false;
  let loadError: string | null = null;

  try {
    users = await listUsers(session.accessToken);
  } catch (err) {
    if (err instanceof SessionExpiredError) await endSession(); // token respins → logout
    if (err instanceof ApiError && err.status === 403) {
      forbidden = true;
    } else {
      loadError = 'Nu am putut încărca lista de utilizatori.';
    }
  }

  // redirect() aruncă NEXT_REDIRECT — de aceea stă în afara try/catch.
  if (forbidden) redirect('/');

  return (
    <div className="min-h-screen bg-cream">
      <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <h1 className="font-serif text-3xl font-bold">Te-ai logat ca Admin</h1>
        <p className="mt-1 text-dark/60">
          {loadError ? 'Conturi înregistrate' : `Conturi înregistrate (${users.length})`}
        </p>

        {loadError && <p className="mt-6 text-sm text-red-600">{loadError}</p>}

        {!loadError && users.length === 0 && (
          <p className="mt-6 text-dark/60">Niciun cont înregistrat încă.</p>
        )}

        <ul className="mt-6 space-y-3">
          {users.map((user) => (
            <li
              key={user.id}
              className="flex items-center justify-between gap-4 rounded-2xl border border-black/10 bg-white p-4"
            >
              <div className="min-w-0">
                <p className="truncate font-medium">{user.email}</p>
                <p className="mt-0.5 flex items-center gap-2 text-sm text-dark/60">
                  {user.role === ROLES.SUPPLIER ? 'Furnizor' : 'Client'}
                  {user.suspended && (
                    <span className="rounded-full bg-red-600/10 px-2 py-0.5 text-xs font-medium text-red-700">
                      Suspendat
                    </span>
                  )}
                </p>
              </div>

              <SuspendButton userId={user.id} suspended={user.suspended} />
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
