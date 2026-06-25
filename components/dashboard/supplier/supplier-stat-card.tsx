// Tile de statistică pentru furnizor: etichetă, valoare mare, hint opțional.
// Aceeași estetică cu StatCard-ul clientului, dar cu o linie de context dedesubt.
export function SupplierStatCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string | number;
  hint?: string;
}) {
  return (
    <div className="rounded-2xl border border-black/5 bg-white p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-dark/40">{label}</p>
      <p className="mt-1 font-serif text-3xl font-bold leading-none">{value}</p>
      {hint && <p className="mt-1.5 text-xs text-dark/50">{hint}</p>}
    </div>
  );
}
