import { useEffect, useState } from 'react';
import { recupererStats, recupererEvolution } from '../services/api';
import { calculerPlagePeriode, formatMonnaie } from '../utils/format';
import FilterBar from '../components/FilterBar';
import StatCard from '../components/StatCard';
import JaugeDiscipline from '../components/JaugeDiscipline';
import WinRateRing from '../components/WinRateRing';
import GraphiqueEvolution from '../components/GraphiqueEvolution';
import GraphiqueEmotions from '../components/GraphiqueEmotions';

function formatRR(valeur) {
  return `${valeur > 0 ? '+' : ''}${valeur}R`;
}

export default function Dashboard() {
  const [periode, setPeriode] = useState('tout');
  const [plagePersonnalisee, setPlagePersonnalisee] = useState({ debut: '', fin: '' });
  const [stats, setStats] = useState(null);
  const [evolution, setEvolution] = useState([]);
  const [chargement, setChargement] = useState(true);

  // RR semaine/mois : toujours calculés sur la semaine et le mois en cours,
  // indépendamment du filtre choisi ci-dessous — se réinitialisent seuls
  // dès qu'une nouvelle semaine/mois commence, car recalculés à partir d'aujourd'hui.
  const [rrSemaine, setRrSemaine] = useState(null);
  const [rrMois, setRrMois] = useState(null);

  useEffect(() => {
    chargerDonnees();
  }, [periode, plagePersonnalisee]);

  useEffect(() => {
    chargerRRFixes();
  }, []);

  async function chargerDonnees() {
    if (periode === 'personnalise' && (!plagePersonnalisee.debut || !plagePersonnalisee.fin)) {
      return;
    }
    setChargement(true);
    const plage = calculerPlagePeriode(periode, plagePersonnalisee) || {};
    const [s, e] = await Promise.all([recupererStats(plage), recupererEvolution(plage)]);
    setStats(s);
    setEvolution(e);
    setChargement(false);
  }

  async function chargerRRFixes() {
    const [statsSemaine, statsMois] = await Promise.all([
      recupererStats(calculerPlagePeriode('semaine')),
      recupererStats(calculerPlagePeriode('mois')),
    ]);
    setRrSemaine(statsSemaine.rrTotal);
    setRrMois(statsMois.rrTotal);
  }

  return (
    <div className="max-w-6xl">
      <div className="flex items-baseline justify-between mb-6">
        <div>
          <h2 className="font-display text-3xl text-ivory">Tableau de bord</h2>
          <p className="text-sm text-slate mt-1">Vue d'ensemble de ta performance et de ta discipline</p>
        </div>
      </div>

      {/* Bandeau RR semaine/mois — toujours visible, indépendant du filtre */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-panel border border-line rounded-lg px-5 py-4">
          <p className="text-xs text-slate tracking-wide">RR total — cette semaine</p>
          <p
            className={`font-mono text-2xl mt-1.5 ${
              rrSemaine === null ? 'text-slate-dim' : rrSemaine >= 0 ? 'text-gain' : 'text-loss'
            }`}
          >
            {rrSemaine === null ? '—' : formatRR(rrSemaine)}
          </p>
        </div>
        <div className="bg-panel border border-line rounded-lg px-5 py-4">
          <p className="text-xs text-slate tracking-wide">RR total — ce mois</p>
          <p
            className={`font-mono text-2xl mt-1.5 ${
              rrMois === null ? 'text-slate-dim' : rrMois >= 0 ? 'text-gain' : 'text-loss'
            }`}
          >
            {rrMois === null ? '—' : formatRR(rrMois)}
          </p>
        </div>
      </div>

      <div className="mb-6">
        <FilterBar
          periode={periode}
          onChangerPeriode={setPeriode}
          plagePersonnalisee={plagePersonnalisee}
          onChangerPlage={setPlagePersonnalisee}
        />
      </div>

      {chargement || !stats ? (
        <p className="text-slate-dim text-sm">Chargement...</p>
      ) : stats.nombreTrades === 0 ? (
        <div className="bg-panel border border-line rounded-lg px-6 py-12 text-center">
          <p className="text-ivory font-display text-xl">Aucun trade sur cette période</p>
          <p className="text-slate text-sm mt-2">Ajoute un trade pour voir apparaître tes statistiques ici.</p>
        </div>
      ) : (
        <>
          {/* Ligne signature : discipline + résultat global */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
            <div className="bg-panel border border-line rounded-lg px-6 py-6 flex items-center justify-center lg:col-span-1">
              <JaugeDiscipline valeur={stats.tauxDiscipline} />
            </div>

            <div className="bg-panel border border-line rounded-lg px-6 py-6 lg:col-span-2 flex flex-col justify-center">
              <p className="text-xs text-slate tracking-wide mb-2">Résultat net cumulé</p>
              <p
                className={`font-display text-5xl tabular-nums ${
                  stats.profitTotal >= 0 ? 'text-gain' : 'text-loss'
                }`}
              >
                {formatMonnaie(stats.profitTotal)}
              </p>
              <p className="text-sm text-slate-dim mt-2">
                Sur {stats.nombreTrades} trade{stats.nombreTrades > 1 ? 's' : ''} · moyenne{' '}
                {formatMonnaie(stats.profitMoyen)} / trade
              </p>
            </div>
          </div>

          {/* Cartes de stats secondaires */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-panel border border-line rounded-lg px-5 py-4 flex items-center gap-4">
              <WinRateRing valeur={stats.winRate} taille={64} />
              <div>
                <p className="text-xs text-slate tracking-wide">Win rate</p>
                <p className="text-xs text-slate-dim mt-0.5">{stats.nombreTrades} trades</p>
              </div>
            </div>
            <StatCard
              label="RR moyen"
              valeur={`${stats.rrMoyen > 0 ? '+' : ''}${stats.rrMoyen}R`}
              tonalite={stats.rrMoyen >= 0 ? 'gain' : 'perte'}
            />
            <StatCard label="Plus gros gain" valeur={formatMonnaie(stats.plusGrosGain)} tonalite="gain" />
            <StatCard label="Plus grosse perte" valeur={formatMonnaie(stats.plusGrossePerte)} tonalite="perte" />
            <StatCard
              label="Profit moyen"
              valeur={formatMonnaie(stats.profitMoyen)}
              tonalite={stats.profitMoyen >= 0 ? 'gain' : 'perte'}
            />
          </div>

          {/* Graphiques */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-panel border border-line rounded-lg px-5 py-5">
              <p className="text-sm text-ivory mb-1">Évolution du résultat cumulé</p>
              <GraphiqueEvolution donnees={evolution} />
            </div>
            <div className="bg-panel border border-line rounded-lg px-5 py-5">
              <p className="text-sm text-ivory mb-1">Résultat par émotion</p>
              <GraphiqueEmotions resultatParEmotion={stats.resultatParEmotion} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
