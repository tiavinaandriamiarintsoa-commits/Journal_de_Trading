const PERIODES = [
  { id: 'tout', label: 'Tout' },
  { id: 'aujourd_hui', label: "Aujourd'hui" },
  { id: 'semaine', label: 'Cette semaine' },
  { id: 'mois', label: 'Ce mois' },
  { id: 'personnalise', label: 'Plage personnalisée' },
];

export default function FilterBar({ periode, onChangerPeriode, plagePersonnalisee, onChangerPlage }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {PERIODES.map((p) => (
        <button
          key={p.id}
          onClick={() => onChangerPeriode(p.id)}
          className={`px-3.5 py-1.5 rounded-md text-sm border transition-colors ${
            periode === p.id
              ? 'border-gold/50 bg-gold-dim text-gold-soft'
              : 'border-line text-slate hover:text-ivory hover:border-slate-dim'
          }`}
        >
          {p.label}
        </button>
      ))}

      {periode === 'personnalise' && (
        <div className="flex items-center gap-2 ml-1">
          <input
            type="date"
            value={plagePersonnalisee.debut}
            onChange={(e) => onChangerPlage({ ...plagePersonnalisee, debut: e.target.value })}
            className="bg-panel border border-line rounded-md px-2.5 py-1.5 text-sm text-ivory"
          />
          <span className="text-slate-dim text-sm">au</span>
          <input
            type="date"
            value={plagePersonnalisee.fin}
            onChange={(e) => onChangerPlage({ ...plagePersonnalisee, fin: e.target.value })}
            className="bg-panel border border-line rounded-md px-2.5 py-1.5 text-sm text-ivory"
          />
        </div>
      )}
    </div>
  );
}
