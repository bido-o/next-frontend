import { AuthCard } from '@/components/auth/auth-card';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen flex items-center justify-center bg-cream p-4 sm:p-6">
      <AuthCard>{children}</AuthCard>
    </main>
  );
}
