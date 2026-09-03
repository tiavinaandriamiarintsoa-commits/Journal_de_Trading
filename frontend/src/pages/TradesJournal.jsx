import { useEffect, useState } from 'react';
import { listerTrades, supprimerTrade, recupererStats } from '../services/api';
import { calculerPlagePeriode, formatDateHeure, formatMonnaie } from '../utils/format';
import { exporterJournalPDF } from '../utils/exportPdf';
import FilterBar from '../components/FilterBar';
import BadgeEmotion from '../components/BadgeEmotion';

const LABELS_PERIODE = {
  tout: 'Tous les trades',
  aujourd_hui: "Aujourd'hui",
  semaine: 'Cette semaine',
  mois: 'Ce mois',
  personnalise: 'Plage personnalisée',
};

export default function TradesJournal() {
  const [periode, setPeriode] = useState('tout');
  const [plagePersonnalisee, setPlagePersonnalisee] = useState({ debut: '', fin: '' });
  const [trades, setTrades] = useState([]);
  const [chargement, setChargement] = useState(true);

  useEffect(() => {
    charger();
  }, [periode, plagePersonnalisee]);

  async function charger() {
    if (periode === 'personnalise' && (!plagePersonnalisee.debut || !plagePersonnalisee.fin)) return;
    setChargement(true);
    const plage = calculerPlagePeriode(periode, plagePersonnalisee) || {};
    const data = await listerTrades(plage);
    setTrades(data);
    setChargement(false);
  }

  async function gererSuppression(id) {
    if (!confirm('Supprimer ce trade ? Cette action est irréversible.')) return;
    await supprimerTrade(id);
    charger();
  }

  async function gererExportPdf() {
    const plage = calculerPlagePeriode(periode, plagePersonnalisee) || {};
    const stats = await recupererStats(plage);
    exporterJournalPDF({ trades, stats, periodeLabel: LABELS_PERIODE[periode] });
  }

  return (
    <div className="max-w-6xl">
      <div className="flex items-baseline justify-between mb-6">
        <div>
          <h2 className="font-display text-3xl text-ivory">Journal</h2>
          <p className="text-sm text-slate mt-1">L'historique complet de tes trades</p>
        </div>
        <button
          onClick={gererExportPdf}
          disabled={trades.length === 0}
          className="border border-line text-ivory text-sm px-4 py-2 rounded-md hover:border-gold-soft transition-colors disabled:opacity-40"
        >
          Exporter en PDF
        </button>
      </div>

      <div className="mb-5">
        <FilterBar
          periode={periode}
          onChangerPeriode={setPeriode}
          plagePersonnalisee={plagePersonnalisee}
          onChangerPlage={setPlagePersonnalisee}
        />
      </div>

      <div className="bg-panel border border-line rounded-lg overflow-hidden">
        {chargement ? (
          <p className="text-slate-dim text-sm px-6 py-8">Chargement...</p>
        ) : trades.length === 0 ? (
          <p className="text-slate-dim text-sm px-6 py-12 text-center">Aucun trade sur cette période.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line text-left">
                <Th>Clôture</Th>
                <Th>Symbole</Th>
                <Th>Type</Th>
                <Th align="right">Volume</Th>
                <Th align="right">RR</Th>
                <Th align="right">Résultat</Th>
                <Th>Émotion</Th>
                <Th>Plan</Th>
                <Th></Th>
              </tr>
            </thead>
            <tbody>
              {trades.map((t) => (
                <tr key={t.id} className="border-b border-line-soft last:border-0 hover:bg-panel-raised/40">
                  <Td className="text-slate">{formatDateHeure(t.heure_cloture)}</Td>
                  <Td className="font-mono">{t.symbole}</Td>
                  <Td>{t.type}</Td>
                  <Td align="right" className="font-mono">{t.volume}</Td>
                  <Td align="right" className={`font-mono ${t.rr_realise >= 0 ? 'text-gain' : 'text-loss'}`}>
                    {t.rr_realise > 0 ? '+' : ''}{t.rr_realise}R
                  </Td>
                  <Td align="right" className={`font-mono ${t.resultat_net >= 0 ? 'text-gain' : 'text-loss'}`}>
                    {formatMonnaie(t.resultat_net)}
                  </Td>
                  <Td><BadgeEmotion emotion={t.emotion} /></Td>
                  <Td>
                    <span className={t.respect_plan ? 'text-gain text-xs' : 'text-loss text-xs'}>
                      {t.respect_plan ? 'Respecté' : 'Écart'}
                    </span>
                  </Td>
                  <Td align="right">
                    <button
                      onClick={() => gererSuppression(t.id)}
                      className="text-slate-dim hover:text-loss text-xs transition-colors"
                    >
                      Supprimer
                    </button>
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function Th({ children, align = 'left' }) {
  const alignClasse = align === 'right' ? 'text-right' : 'text-left';
  return (
    <th className={`px-4 py-3 text-xs text-slate font-normal tracking-wide ${alignClasse}`}>{children}</th>
  );
}

function Td({ children, align = 'left', className = '' }) {
  const alignClasse = align === 'right' ? 'text-right' : 'text-left';
  return <td className={`px-4 py-3 ${alignClasse} ${className}`}>{children}</td>;
}
