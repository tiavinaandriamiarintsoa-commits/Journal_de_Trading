const { verifierToken } = require('../auth/auth');
const { trouverParId } = require('../models/userModel');

async function authentificationRequise(req, res, next) {
  const enTete = req.headers.authorization;
  if (!enTete || !enTete.startsWith('Bearer ')) {
    return res.status(401).json({ erreur: 'Authentification requise' });
  }

  const token = enTete.slice('Bearer '.length);
  const payload = verifierToken(token);
  if (!payload) {
    return res.status(401).json({ erreur: 'Session invalide ou expirée, reconnecte-toi' });
  }

  // Le token peut être signé valide mais référencer un utilisateur qui n'existe
  // plus (ex: base de données réinitialisée). On vérifie qu'il existe toujours.
  const user = await trouverParId(payload.userId);
  if (!user) {
    return res.status(401).json({ erreur: 'Compte introuvable, reconnecte-toi' });
  }

  req.userId = payload.userId;
  next();
}

module.exports = { authentificationRequise };
