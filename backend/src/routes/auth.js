const express = require('express');
const router = express.Router();
const { creerUtilisateur, trouverParUsername, validerIdentifiants } = require('../models/userModel');
const { genererToken } = require('../auth/auth');

router.post('/inscription', async (req, res) => {
  try {
    const { username, motDePasse } = req.body;

    if (!username || !motDePasse) {
      return res.status(400).json({ erreur: "Nom d'utilisateur et mot de passe requis" });
    }
    if (motDePasse.length < 6) {
      return res.status(400).json({ erreur: 'Le mot de passe doit faire au moins 6 caractères' });
    }
    if (await trouverParUsername(username)) {
      return res.status(409).json({ erreur: 'Ce nom d\'utilisateur est déjà pris' });
    }

    const user = await creerUtilisateur(username, motDePasse);
    const token = genererToken(user);
    res.status(201).json({ token, username: user.username });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erreur: 'Erreur serveur, réessaie plus tard' });
  }
});

router.post('/connexion', async (req, res) => {
  try {
    const { username, motDePasse } = req.body;

    if (!username || !motDePasse) {
      return res.status(400).json({ erreur: "Nom d'utilisateur et mot de passe requis" });
    }

    const user = await validerIdentifiants(username, motDePasse);
    if (!user) {
      return res.status(401).json({ erreur: 'Identifiants incorrects' });
    }

    const token = genererToken(user);
    res.json({ token, username: user.username });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erreur: 'Erreur serveur, réessaie plus tard' });
  }
});

module.exports = router;
