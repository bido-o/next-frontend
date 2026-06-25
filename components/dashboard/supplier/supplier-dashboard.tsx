import type { SupplierProfile } from '@/lib/api/profiles';

export function SupplierDashboard({ profile }: { profile: SupplierProfile | null }) {
  return (
    <div className="space-y-6">
      <div>
        {profile?.companyName && (
          <p className="text-sm text-dark/50">Bună, {profile.companyName}</p>
        )}
        <h1 className="mt-1 font-serif text-3xl font-bold leading-tight">
          Găsește <span className="italic text-orange">următoarea colaborare.</span>
        </h1>
      </div>

      <p className="rounded-2xl border border-dashed border-black/10 bg-white/50 p-6 text-center text-sm text-dark/50">
        Feed-ul de cereri pentru furnizori vine în curând.
      </p>
    </div>
  );
}
