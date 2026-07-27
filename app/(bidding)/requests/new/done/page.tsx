import { redirect } from 'next/navigation';

import { SuccessCard } from '@/components/requests/success-card';
import { SessionExpiredError } from '@/lib/api/client';
import { getRequest } from '@/lib/api/requests';
import { endSession, requireSession } from '@/lib/auth/session';
import type { RequestResponse } from '@/types/request';

export default async function DonePage({ searchParams }: { searchParams: Promise<{ id?: string }>;}) {
  const { id } = await searchParams;
  const requestId = Number(id);
  if (!id || Number.isNaN(requestId)) redirect('/');

  const session = await requireSession();

  let request: RequestResponse | null = null;
  try {
    request = await getRequest(requestId, session.accessToken);
  } catch (err) {
    if (err instanceof SessionExpiredError) await endSession(); // redirect la login
    // Cererea s-a creat; dacă recapitularea nu se poate încărca, arătăm succesul generic.
    request = null;
  }

  return <SuccessCard request={request} />;
}
