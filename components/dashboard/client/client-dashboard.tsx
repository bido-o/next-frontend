import { NewRequestCta } from '@/components/dashboard/client/new-request-cta';
import { RequestList } from '@/components/dashboard/client/request-list';
import { StatCard } from '@/components/dashboard/client/stat-card';
import type { ClientProfile } from '@/lib/api/profiles';
import type { RequestResponse } from '@/lib/api/requests';

export function ClientDashboard({ profile, requests }: {
  profile: ClientProfile | null;
  requests: RequestResponse[];
}) {
  const active = requests.filter((r) => r.status === 'OPEN').length;
  const finished = requests.filter((r) => r.status === 'CLOSED').length;
  const expired = requests.filter((r) => r.status === 'EXPIRED').length;

  return (
    <div className="space-y-6">
      {/* Salut */}
      <div>
        {profile?.firstName && (
          <p className="text-sm text-dark/50">Bună, {profile.firstName}</p>
        )}
        <h1 className="mt-1 font-serif text-3xl font-bold leading-tight">
          Ce mâncăm la <span className="italic text-orange">următorul eveniment?</span>
        </h1>
      </div>

      <NewRequestCta />

      {/* Statistici */}
      <div className="grid grid-cols-3 gap-3">
        <StatCard label="Active" value={active} />
        <StatCard label="Finalizate" value={finished} />
        <StatCard label="Expirate" value={expired} />
      </div>

      <RequestList requests={requests} />
    </div>
  );
}
