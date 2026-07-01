export function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-black/5 bg-white p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-dark/40">{label}</p>
      <p className="mt-1 font-serif text-3xl font-semibold leading-none">{value}</p>
    </div>
  );
}
