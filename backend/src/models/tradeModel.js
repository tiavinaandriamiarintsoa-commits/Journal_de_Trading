const { pool } = require('../db/init');

// --- CRUD de base (scopé par utilisateur) ---

async function creerTrade(userId, data) {
  const complet = {
    commentaire: '',
    respect_plan: 1,
    solde_avant: null,
    solde_apres: null,
    ...data,
  };

  const result = await pool.query(
    `INSERT INTO trades (
      user_id, symbole, type, volume, rr_realise,
      heure_ouverture, heure_cloture, resultat_net,
      solde_avant, solde_apres, emotion, commentaire, respect_plan
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
    RETURNING *`,
    [
      userId,
      complet.symbole,
      complet.type,
      complet.volume,
      complet.rr_realise,
      complet.heure_ouverture,
      complet.heure_cloture,
      complet.resultat_net,
      complet.solde_avant,
      complet.solde_apres,
      complet.emotion,
      complet.commentaire,
      complet.respect_plan,
    ]
  );

  return result.rows[0];
}

async function recupererTradeParId(userId, id) {
  const result = await pool.query('SELECT * FROM trades WHERE id = $1 AND user_id = $2', [id, userId]);
  return result.rows[0] || null;
}

async function listerTrades(userId, { dateDebut, dateFin } = {}) {
  if (dateDebut && dateFin) {
    const result = await pool.query(
      'SELECT * FROM trades WHERE user_id = $1 AND heure_cloture BETWEEN $2 AND $3 ORDER BY heure_cloture DESC',
      [userId, dateDebut, dateFin]
    );
    return result.rows;
  }
  const result = await pool.query('SELECT * FROM trades WHERE user_id = $1 ORDER BY heure_cloture DESC', [userId]);
  return result.rows;
}

async function modifierTrade(userId, id, data) {
  const existant = await recupererTradeParId(userId, id);
  if (!existant) return null;

  const f = { ...existant, ...data };
  const result = await pool.query(
    `UPDATE trades SET
      symbole = $1, type = $2, volume = $3, rr_realise = $4,
      heure_ouverture = $5, heure_cloture = $6,
      resultat_net = $7, solde_avant = $8, solde_apres = $9,
      emotion = $10, commentaire = $11, respect_plan = $12
    WHERE id = $13 AND user_id = $14
    RETURNING *`,
    [
      f.symbole,
      f.type,
      f.volume,
      f.rr_realise,
      f.heure_ouverture,
      f.heure_cloture,
      f.resultat_net,
      f.solde_avant,
      f.solde_apres,
      f.emotion,
      f.commentaire,
      f.respect_plan,
      id,
      userId,
    ]
  );

  return result.rows[0] || null;
}

async function supprimerTrade(userId, id) {
  const result = await pool.query('DELETE FROM trades WHERE id = $1 AND user_id = $2', [id, userId]);
  return result.rowCount > 0;
}

// --- Statistiques (dashboard) ---

async function calculerStats(userId, { dateDebut, dateFin } = {}) {
  const trades = await listerTrades(userId, { dateDebut, dateFin });

  if (trades.length === 0) {
    return {
      nombreTrades: 0,
      winRate: 0,
      profitTotal: 0,
      profitMoyen: 0,
      plusGrosGain: 0,
      plusGrossePerte: 0,
      rrTotal: 0,
      rrMoyen: 0,
      resultatParEmotion: {},
      tauxDiscipline: 0,
    };
  }

  const gagnants = trades.filter((t) => t.resultat_net > 0);
  const profitTotal = trades.reduce((sum, t) => sum + Number(t.resultat_net), 0);
  const rrTotal = trades.reduce((sum, t) => sum + Number(t.rr_realise), 0);
  const resultats = trades.map((t) => Number(t.resultat_net));
  const tradesDisciplines = trades.filter((t) => t.respect_plan === 1);

  const resultatParEmotion = {};
  for (const t of trades) {
    if (!resultatParEmotion[t.emotion]) {
      resultatParEmotion[t.emotion] = { profit: 0, nombreTrades: 0 };
    }
    resultatParEmotion[t.emotion].profit += Number(t.resultat_net);
    resultatParEmotion[t.emotion].nombreTrades += 1;
  }

  return {
    nombreTrades: trades.length,
    winRate: Math.round((gagnants.length / trades.length) * 1000) / 10,
    profitTotal: Math.round(profitTotal * 100) / 100,
    profitMoyen: Math.round((profitTotal / trades.length) * 100) / 100,
    plusGrosGain: Math.max(...resultats),
    plusGrossePerte: Math.min(...resultats),
    rrTotal: Math.round(rrTotal * 100) / 100,
    rrMoyen: Math.round((rrTotal / trades.length) * 100) / 100,
    resultatParEmotion,
    tauxDiscipline: Math.round((tradesDisciplines.length / trades.length) * 1000) / 10,
  };
}

// --- Courbe d'évolution (equity curve) ---

async function courbeEvolution(userId, { dateDebut, dateFin } = {}) {
  const trades = (await listerTrades(userId, { dateDebut, dateFin })).slice().reverse();
  let cumul = 0;
  return trades.map((t) => {
    cumul += Number(t.resultat_net);
    return {
      date: t.heure_cloture,
      resultatCumule: Math.round(cumul * 100) / 100,
    };
  });
}

module.exports = {
  creerTrade,
  recupererTradeParId,
  listerTrades,
  modifierTrade,
  supprimerTrade,
  calculerStats,
  courbeEvolution,
};
