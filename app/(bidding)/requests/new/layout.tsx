import { redirect } from 'next/navigation';

import { ContentCard } from '@/components/ui/content-card';
import { decodeJwt } from '@/lib/auth/jwt';
import { requireSession } from '@/lib/auth/session';
import { ROLES } from '@/lib/constants';

export default async function NewRequestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Doar clienții autentificați pot publica cereri.
  const session = await requireSession();
  if (decodeJwt(session.accessToken)?.role !== ROLES.CLIENT) redirect('/');

  return (
    <main className="min-h-screen flex items-center justify-center bg-cream p-4 sm:p-6">
      <ContentCard className="max-w-lg">{children}</ContentCard>
    </main>
  );
}
