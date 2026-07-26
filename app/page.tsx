import { TopBar } from '@/components/dashboard/top-bar';
import { BottomNav } from '@/components/dashboard/bottom-nav';
import { ClientDashboard } from '@/components/dashboard/client/client-dashboard';
import { SupplierDashboard } from '@/components/dashboard/supplier/supplier-dashboard';
import {
  getClientProfile,
  getSupplierProfile,
  type ClientProfile,
  type SupplierProfile,
} from '@/lib/api/profiles';
import { listRequests, type RequestResponse } from '@/lib/api/requests';
import { SessionExpiredError } from '@/lib/api/client';
import { decodeJwt } from '@/lib/auth/jwt';
import { endSession, requireSession } from '@/lib/auth/session';
import { ADMIN_ROUTE, ROLES } from '@/lib/constants';
import { redirect } from 'next/navigation';

// Inițialele pentru avatar (max 2 litere).
function initialsFrom(name: string): string {
  return (
    name
      .trim()
      .split(/\s+/)
      .map((w) => w[0])
      .filter(Boolean)
      .slice(0, 2)
      .join('')
      .toUpperCase() || '?'
  );
}

export default async function Home() {
  const session = await requireSession();
  const role = decodeJwt(session.accessToken)?.role;

  // Adminul n-are dashboard de client/furnizor → panoul lui.
  if (role === ROLES.ADMIN) redirect(ADMIN_ROUTE);

  let content: React.ReactNode;
  let initials = '?';

  if (role === ROLES.SUPPLIER) {
    let profile: SupplierProfile | null = null;
    try {
      profile = await getSupplierProfile(session.accessToken);
    } catch (err) {
      if (err instanceof SessionExpiredError) await endSession(); // redirect la login
      profile = null;
    }
    const companyName = profile?.companyName;
    initials = companyName ? initialsFrom(companyName) : '?';
    content = <SupplierDashboard profile={profile} />;
  } else {
    // Fetch independent — un eșec pe un endpoint nu golește tot dashboard-ul.
    const [profileRes, requestsRes] = await Promise.allSettled([
      getClientProfile(session.accessToken),
      listRequests(session.accessToken),
    ]);

    // allSettled nu aruncă: dacă un endpoint a picat pe sesiune moartă, redirect la login.
    for (const res of [profileRes, requestsRes]) {
      if (res.status === 'rejected' && res.reason instanceof SessionExpiredError) {
        await endSession();
      }
    }

    const profile: ClientProfile | null =
      profileRes.status === 'fulfilled' ? profileRes.value : null;
    
    const requests: RequestResponse[] =
      requestsRes.status === 'fulfilled' ? requestsRes.value : [];
    
    initials = profile?.firstName || profile?.lastName
                ? initialsFrom(`${profile?.firstName ?? ''} ${profile?.lastName ?? ''}`)
                : '?';
    
    content = <ClientDashboard profile={profile} requests={requests} />;
  }

  return (
    <div className="min-h-screen bg-cream">
      <TopBar initials={initials} />
      <main className="mx-auto max-w-3xl px-4 pb-28 pt-6 sm:px-6">{content}</main>
      <BottomNav role={role} />
    </div>
  );
}
