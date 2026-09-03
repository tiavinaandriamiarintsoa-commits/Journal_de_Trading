import { useState } from 'react';
import { creerTrade, EMOTIONS } from '../services/api';

const ETAT_INITIAL = {
  symbole: '',
  type: 'Achat',
  volume: '',
  rr_realise: '',
  heure_ouverture: '',
  heure_cloture: '',
  resultat_net: '',
  solde_avant: '',
  solde_apres: '',
  emotion: '',
  commentaire: '',
  respect_plan: 1,
};

export default function TradeForm({ onTradeCree }) {
  const [form, setForm] = useState(ETAT_INITIAL);
  const [erreur, setErreur] = useState('');
  const [envoiEnCours, setEnvoiEnCours] = useState(false);
  const [confirmation, setConfirmation] = useState(false);

  function majChamp(champ, valeur) {
    setForm((f) => ({ ...f, [champ]: valeur }));
  }

  async function gererEnvoi(e) {
    e.preventDefault();
    setErreur('');

    if (!form.emotion) {
      setErreur('Sélectionne une émotion pour ce trade.');
      return;
    }

    setEnvoiEnCours(true);
    try {
      const payload = {
        ...form,
        volume: parseFloat(form.volume),
        rr_realise: parseFloat(form.rr_realise),
        resultat_net: parseFloat(form.resultat_net),
        solde_avant: form.solde_avant ? parseFloat(form.solde_avant) : null,
        solde_apres: form.solde_apres ? parseFloat(form.solde_apres) : null,
        respect_plan: form.respect_plan ? 1 : 0,
      };
      const trade = await creerTrade(payload);
      setForm({ ...ETAT_INITIAL, solde_avant: trade.solde_apres ?? '' });
      setConfirmation(true);
      setTimeout(() => setConfirmation(false), 2500);
      onTradeCree?.(trade);
    } catch (err) {
      setErreur(err.response?.data?.erreur || 'Erreur lors de l\'enregistrement du trade.');
    } finally {
      setEnvoiEnCours(false);
    }
  }

  return (
    <div className="max-w-2xl">
      <h2 className="font-display text-3xl text-ivory mb-1">Nouveau trade</h2>
      <p className="text-sm text-slate mb-6">Consigne les faits, puis ce que tu as ressenti.</p>

      <form onSubmit={gererEnvoi} className="bg-panel border border-line rounded-lg px-6 py-6 flex flex-col gap-5">
        {/* Faits du trade */}
        <div>
          <p className="text-xs text-slate tracking-wide mb-3">Les faits</p>
          <div className="grid grid-cols-2 gap-4">
            <Champ label="Symbole">
              <input
                required
                value={form.symbole}
                onChange={(e) => majChamp('symbole', e.target.value.toUpperCase())}
                placeholder="XAUUSD"
                className="input-base"
              />
            </Champ>

            <Champ label="Type">
              <select value={form.type} onChange={(e) => majChamp('type', e.target.value)} className="input-base">
                <option value="Achat">Achat</option>
                <option value="Vente">Vente</option>
              </select>
            </Champ>

            <Champ label="Volume (lots)">
              <input
                required
                type="number"
                step="0.01"
                value={form.volume}
                onChange={(e) => majChamp('volume', e.target.value)}
                placeholder="0.50"
                className="input-base font-mono"
              />
            </Champ>

            <Champ label="Résultat net">
              <input
                required
                type="number"
                step="0.01"
                value={form.resultat_net}
                onChange={(e) => majChamp('resultat_net', e.target.value)}
                placeholder="385.00"
                className="input-base font-mono"
              />
            </Champ>

            <Champ label="RR réalisé">
              <input
                required
                type="number"
                step="0.1"
                value={form.rr_realise}
                onChange={(e) => majChamp('rr_realise', e.target.value)}
                placeholder="ex: 2.5 ou -1"
                className="input-base font-mono"
              />
            </Champ>

            <Champ label="Heure d'ouverture">
              <input
                required
                type="datetime-local"
                value={form.heure_ouverture}
                onChange={(e) => majChamp('heure_ouverture', e.target.value.replace('T', ' ') + ':00')}
                className="input-base"
              />
            </Champ>

            <Champ label="Heure de clôture">
              <input
                required
                type="datetime-local"
                value={form.heure_cloture}
                onChange={(e) => majChamp('heure_cloture', e.target.value.replace('T', ' ') + ':00')}
                className="input-base"
              />
            </Champ>

            <Champ label="Solde avant (optionnel)">
              <input
                type="number"
                step="0.01"
                value={form.solde_avant}
                onChange={(e) => majChamp('solde_avant', e.target.value)}
                className="input-base font-mono"
              />
            </Champ>

            <Champ label="Solde après (optionnel)">
              <input
                type="number"
                step="0.01"
                value={form.solde_apres}
                onChange={(e) => majChamp('solde_apres', e.target.value)}
                className="input-base font-mono"
              />
            </Champ>
          </div>
        </div>

        <div className="h-px bg-line-soft" />

        {/* Ressenti */}
        <div>
          <p className="text-xs text-slate tracking-wide mb-3">Ce que tu as ressenti</p>

          <div className="grid grid-cols-1 gap-2 mb-4">
            {EMOTIONS.map((em) => (
              <button
                type="button"
                key={em}
                onClick={() => majChamp('emotion', em)}
                className={`text-left px-3.5 py-2 rounded-md text-sm border transition-colors ${
                  form.emotion === em
                    ? 'border-gold/50 bg-gold-dim text-gold-soft'
                    : 'border-line text-slate hover:text-ivory hover:border-slate-dim'
                }`}
              >
                {em}
              </button>
            ))}
          </div>

          <Champ label="Commentaire (optionnel, 200 caractères max)">
            <textarea
              value={form.commentaire}
              maxLength={200}
              onChange={(e) => majChamp('commentaire', e.target.value)}
              rows={3}
              placeholder="Contexte, ce qui a motivé la décision..."
              className="input-base resize-none"
            />
          </Champ>

          <label className="flex items-center gap-2.5 mt-4 text-sm text-slate cursor-pointer select-none">
            <input
              type="checkbox"
              checked={!!form.respect_plan}
              onChange={(e) => majChamp('respect_plan', e.target.checked)}
              className="accent-[#C9A227] w-4 h-4"
            />
            Ce trade a respecté mon plan de trading
          </label>
        </div>

        {erreur && <p className="text-sm text-loss">{erreur}</p>}
        {confirmation && <p className="text-sm text-gain">Trade enregistré.</p>}

        <button
          type="submit"
          disabled={envoiEnCours}
          className="mt-1 bg-gold text-ink font-medium text-sm px-5 py-2.5 rounded-md hover:bg-gold-soft transition-colors disabled:opacity-50 self-start"
        >
          {envoiEnCours ? 'Enregistrement...' : 'Enregistrer le trade'}
        </button>
      </form>
    </div>
  );
}

function Champ({ label, children }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs text-slate-dim">{label}</span>
      {children}
    </label>
  );
}
