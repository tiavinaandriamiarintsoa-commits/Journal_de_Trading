export default function StatCard({ label, valeur, tonalite = 'neutre', sousTexte }) {
  const couleurValeur =
    tonalite === 'gain' ? 'text-gain' : tonalite === 'perte' ? 'text-loss' : 'text-ivory';

  return (
    <div className="bg-panel border border-line rounded-lg px-5 py-4">
      <p className="text-xs text-slate tracking-wide">{label}</p>
      <p className={`font-mono text-2xl mt-1.5 ${couleurValeur}`}>{valeur}</p>
      {sousTexte && <p className="text-xs text-slate-dim mt-1">{sousTexte}</p>}
    </div>
  );
}
