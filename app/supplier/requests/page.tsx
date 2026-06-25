import { TopBar } from '@/components/dashboard/top-bar';
import { BottomNav } from '@/components/dashboard/bottom-nav';
import { AvailableRequestCard } from '@/components/dashboard/supplier/available-request-card';
import { getSupplierProfile } from '@/lib/api/profiles';
import { listAvailableRequests, type RequestPublicResponse } from '@/lib/api/requests';
import { decodeJwt } from '@/lib/auth/jwt';
import { requireSession } from '@/lib/auth/session';
import { ROLES } from '@/lib/constants';

function initialsFrom(name: string): string {
  return (
    name.trim().split(/\s+/).map((w) => w[0]).filter(Boolean).slice(0, 2).join('').toUpperCase() || '?'
  );
}

export default async function SupplierRequestsPage() {
  const session = await requireSession();
  const role = decodeJwt(session.accessToken)?.role;

  let initials = '?';
  try {
    const profile = await getSupplierProfile(session.accessToken);
    initials = profile?.companyName ? initialsFrom(profile.companyName) : '?';
  } catch {
    // fallback
  }

  let requests: RequestPublicResponse[] = [];
  try {
    requests = await listAvailableRequests(session.accessToken);
  } catch {
    // fallback
  }

  const sorted = [...requests].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  return (
    <div className="min-h-screen bg-cream">
      <TopBar initials={initials} />
      <main className="mx-auto max-w-3xl px-4 pb-28 pt-6 sm:px-6">
        <div className="space-y-6">
          <div>
            <h1 className="font-serif text-3xl font-bold leading-tight">
              Cereri <span className="italic text-orange">disponibile</span>
            </h1>
            <p className="mt-1 text-sm text-dark/50">{requests.length} cereri deschise</p>
          </div>

          {sorted.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-black/10 bg-white/50 p-6 text-center text-sm text-dark/50">
              Nicio cerere disponibilă momentan.
            </p>
          ) : (
            <div className="space-y-3">
              {sorted.map((r) => (
                <AvailableRequestCard key={r.id} request={r} />
              ))}
            </div>
          )}
        </div>
      </main>
      <BottomNav role={role} />
    </div>
  );
}
