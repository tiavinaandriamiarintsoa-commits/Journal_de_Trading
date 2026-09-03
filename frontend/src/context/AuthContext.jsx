import { createContext, useContext, useState } from 'react';
import { connexion as apiConnexion, inscription as apiInscription } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [username, setUsername] = useState(() => localStorage.getItem('username'));
  const [token, setToken] = useState(() => localStorage.getItem('token'));

  function enregistrerSession(data) {
    localStorage.setItem('token', data.token);
    localStorage.setItem('username', data.username);
    setToken(data.token);
    setUsername(data.username);
  }

  async function connecter(u, motDePasse) {
    const data = await apiConnexion(u, motDePasse);
    enregistrerSession(data);
  }

  async function inscrire(u, motDePasse) {
    const data = await apiInscription(u, motDePasse);
    enregistrerSession(data);
  }

  function deconnecter() {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setToken(null);
    setUsername(null);
  }

  return (
    <AuthContext.Provider value={{ username, token, estConnecte: !!token, connecter, inscrire, deconnecter }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
