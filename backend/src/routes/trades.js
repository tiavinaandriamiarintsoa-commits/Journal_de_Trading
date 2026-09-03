const express = require('express');
const router = express.Router();
const {
  creerTrade,
  listerTrades,
  modifierTrade,
  supprimerTrade,
  calculerStats,
  courbeEvolution,
} = require('../models/tradeModel');
const { EMOTIONS } = require('../db/init');
const { authentificationRequise } = require('../middleware/authMiddleware');

router.use(authentificationRequise);

const CHAMPS_REQUIS = [
  'symbole',
  'type',
  'volume',
  'rr_realise',
  'heure_ouverture',
  'heure_cloture',
  'resultat_net',
  'emotion',
];

function validerTrade(data) {
  const manquants = CHAMPS_REQUIS.filter((champ) => data[champ] === undefined || data[champ] === '');
  if (manquants.length > 0) {
    return `Champs manquants : ${manquants.join(', ')}`;
  }
  if (!EMOTIONS.includes(data.emotion)) {
    return `Émotion invalide. Valeurs autorisées : ${EMOTIONS.join(', ')}`;
  }
  if (!['Achat', 'Vente'].includes(data.type)) {
    return `Type invalide, doit être "Achat" ou "Vente"`;
  }
  if (data.commentaire && data.commentaire.length > 200) {
    return 'Le commentaire ne doit pas dépasser 200 caractères';
  }
  return null;
}

router.get('/', async (req, res) => {
  try {
    const { dateDebut, dateFin } = req.query;
    res.json(await listerTrades(req.userId, { dateDebut, dateFin }));
  } catch (err) {
    console.error(err);
    res.status(500).json({ erreur: 'Erreur serveur' });
  }
});

router.get('/stats', async (req, res) => {
  try {
    const { dateDebut, dateFin } = req.query;
    res.json(await calculerStats(req.userId, { dateDebut, dateFin }));
  } catch (err) {
    console.error(err);
    res.status(500).json({ erreur: 'Erreur serveur' });
  }
});

router.get('/evolution', async (req, res) => {
  try {
    const { dateDebut, dateFin } = req.query;
    res.json(await courbeEvolution(req.userId, { dateDebut, dateFin }));
  } catch (err) {
    console.error(err);
    res.status(500).json({ erreur: 'Erreur serveur' });
  }
});

router.get('/emotions', (req, res) => {
  res.json(EMOTIONS);
});

router.post('/', async (req, res) => {
  try {
    const erreur = validerTrade(req.body);
    if (erreur) return res.status(400).json({ erreur });

    const trade = await creerTrade(req.userId, req.body);
    res.status(201).json(trade);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erreur: 'Erreur serveur' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const erreur = validerTrade(req.body);
    if (erreur) return res.status(400).json({ erreur });

    const trade = await modifierTrade(req.userId, req.params.id, req.body);
    if (!trade) return res.status(404).json({ erreur: 'Trade introuvable' });
    res.json(trade);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erreur: 'Erreur serveur' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const supprime = await supprimerTrade(req.userId, req.params.id);
    if (!supprime) return res.status(404).json({ erreur: 'Trade introuvable' });
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ erreur: 'Erreur serveur' });
  }
});

module.exports = router;
