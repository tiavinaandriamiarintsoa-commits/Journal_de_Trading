export function formatMonnaie(valeur, devise = '$') {
  const signe = valeur > 0 ? '+' : '';
  return `${signe}${valeur.toFixed(2)} ${devise}`;
}

export function formatDate(isoString) {
  const d = new Date(isoString);
  return d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function formatDateHeure(isoString) {
  const d = new Date(isoString);
  return d.toLocaleString('fr-FR', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Retourne { dateDebut, dateFin } au format 'YYYY-MM-DD HH:mm:ss'
 * pour une période nommée : 'aujourd_hui' | 'semaine' | 'mois' | { debut, fin } (custom)
 */
export function calculerPlagePeriode(periode, plagePersonnalisee = null) {
  const maintenant = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  const fmt = (d) =>
    `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(
      d.getMinutes()
    )}:${pad(d.getSeconds())}`;

  if (periode === 'personnalise' && plagePersonnalisee) {
    return {
      dateDebut: `${plagePersonnalisee.debut} 00:00:00`,
      dateFin: `${plagePersonnalisee.fin} 23:59:59`,
    };
  }

  if (periode === 'aujourd_hui') {
    const debut = new Date(maintenant);
    debut.setHours(0, 0, 0, 0);
    const fin = new Date(maintenant);
    fin.setHours(23, 59, 59, 999);
    return { dateDebut: fmt(debut), dateFin: fmt(fin) };
  }

  if (periode === 'semaine') {
    const jour = maintenant.getDay(); // 0 = dimanche
    const decalage = jour === 0 ? 6 : jour - 1; // lundi = début de semaine
    const debut = new Date(maintenant);
    debut.setDate(maintenant.getDate() - decalage);
    debut.setHours(0, 0, 0, 0);
    const fin = new Date(debut);
    fin.setDate(debut.getDate() + 6);
    fin.setHours(23, 59, 59, 999);
    return { dateDebut: fmt(debut), dateFin: fmt(fin) };
  }

  if (periode === 'mois') {
    const debut = new Date(maintenant.getFullYear(), maintenant.getMonth(), 1);
    const fin = new Date(maintenant.getFullYear(), maintenant.getMonth() + 1, 0, 23, 59, 59, 999);
    return { dateDebut: fmt(debut), dateFin: fmt(fin) };
  }

  return null; // 'tout' — pas de filtre
}
