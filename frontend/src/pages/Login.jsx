import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { connecter, inscrire } = useAuth();
  const [mode, setMode] = useState('connexion'); // 'connexion' | 'inscription'
  const [username, setUsername] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [erreur, setErreur] = useState('');
  const [envoiEnCours, setEnvoiEnCours] = useState(false);

  async function gererEnvoi(e) {
    e.preventDefault();
    setErreur('');
    setEnvoiEnCours(true);
    try {
      if (mode === 'connexion') {
        await connecter(username, motDePasse);
      } else {
        await inscrire(username, motDePasse);
      }
    } catch (err) {
      setErreur(err.response?.data?.erreur || 'Une erreur est survenue');
    } finally {
      setEnvoiEnCours(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-ink px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl text-ivory">Journal de Trading</h1>
          <p className="text-sm text-slate mt-1">by Tiavina</p>
        </div>

        <div className="bg-panel border border-line rounded-lg px-6 py-7">
          <div className="flex gap-1 mb-6 bg-panel-raised rounded-md p-1">
            <button
              type="button"
              onClick={() => setMode('connexion')}
              className={`flex-1 text-sm py-1.5 rounded transition-colors ${
                mode === 'connexion' ? 'bg-panel text-ivory' : 'text-slate'
              }`}
            >
              Connexion
            </button>
            <button
              type="button"
              onClick={() => setMode('inscription')}
              className={`flex-1 text-sm py-1.5 rounded transition-colors ${
                mode === 'inscription' ? 'bg-panel text-ivory' : 'text-slate'
              }`}
            >
              Inscription
            </button>
          </div>

          <form onSubmit={gererEnvoi} className="flex flex-col gap-4">
            <label className="flex flex-col gap-1.5">
              <span className="text-xs text-slate-dim">Nom d'utilisateur</span>
              <input
                required
                autoFocus
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="input-base"
                placeholder="tiavina"
              />
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-xs text-slate-dim">Mot de passe</span>
              <input
                required
                type="password"
                minLength={mode === 'inscription' ? 6 : undefined}
                value={motDePasse}
                onChange={(e) => setMotDePasse(e.target.value)}
                className="input-base"
                placeholder="••••••••"
              />
            </label>

            {erreur && <p className="text-sm text-loss">{erreur}</p>}

            <button
              type="submit"
              disabled={envoiEnCours}
              className="mt-1 bg-gold text-ink font-medium text-sm py-2.5 rounded-md hover:bg-gold-soft transition-colors disabled:opacity-50"
            >
              {envoiEnCours
                ? 'Un instant...'
                : mode === 'connexion'
                ? 'Se connecter'
                : 'Créer mon compte'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
