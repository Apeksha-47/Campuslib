export default function StatCard({ label, value, sub, color = 'text-red-900' }) {
  return (
    <div className="bg-white rounded-xl border border-stone-200 p-5">
      <p className="text-xs text-stone-500 font-medium uppercase tracking-wide mb-1">{label}</p>
      <p className={`text-3xl font-bold font-serif ${color}`}>{value ?? '—'}</p>
      {sub && <p className="text-xs text-stone-400 mt-1">{sub}</p>}
    </div>
  );
}
