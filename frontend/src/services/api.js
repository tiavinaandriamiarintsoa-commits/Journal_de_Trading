import axios from 'axios';

// En développement local, VITE_API_URL est absent et on passe par le proxy
// Vite ('/api' → http://localhost:3001). En production, on pointe directement
// vers l'URL du backend déployé (définie au moment du build).
const baseURL = import.meta.env.VITE_API_URL || '/api';
const api = axios.create({ baseURL });

// Attache automatiquement le token JWT à chaque requête, s'il existe
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Si le serveur renvoie 401 (session invalide, compte introuvable, token expiré),
// on nettoie la session locale et on force un retour à l'écran de connexion.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      if (!window.location.pathname.includes('login')) {
        window.location.reload();
      }
    }
    return Promise.reject(error);
  }
);

export const EMOTIONS = [
  'Calme',
  'Confiant',
  'Impatient',
  'Frustré',
  'Peur',
  'Euphorique',
  'Déçu',
];

// --- Authentification ---

export async function inscription(username, motDePasse) {
  const { data } = await api.post('/auth/inscription', { username, motDePasse });
  return data;
}

export async function connexion(username, motDePasse) {
  const { data } = await api.post('/auth/connexion', { username, motDePasse });
  return data;
}

// --- Trades ---

export async function listerTrades(params = {}) {
  const { data } = await api.get('/trades', { params });
  return data;
}

export async function creerTrade(trade) {
  const { data } = await api.post('/trades', trade);
  return data;
}

export async function modifierTrade(id, trade) {
  const { data } = await api.put(`/trades/${id}`, trade);
  return data;
}

export async function supprimerTrade(id) {
  await api.delete(`/trades/${id}`);
}

export async function recupererStats(params = {}) {
  const { data } = await api.get('/trades/stats', { params });
  return data;
}

export async function recupererEvolution(params = {}) {
  const { data } = await api.get('/trades/evolution', { params });
  return data;
}

export default api;
