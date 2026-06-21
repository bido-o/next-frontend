import { redirect } from 'next/navigation';

import { SuccessCard } from '@/components/requests/success-card';
import { getRequest, type RequestResponse } from '@/lib/api/requests';
import { requireSession } from '@/lib/auth/session';

export default async function DonePage({ searchParams }: { searchParams: Promise<{ id?: string }>;}) {
  const { id } = await searchParams;
  const requestId = Number(id);
  if (!id || Number.isNaN(requestId)) redirect('/');

  const session = await requireSession();

  let request: RequestResponse | null = null;
  try {
    request = await getRequest(requestId, session.accessToken);
  } catch {
    // Cererea s-a creat; dacă recapitularea nu se poate încărca, arătăm succesul generic.
    request = null;
  }

  return <SuccessCard request={request} />;
}
