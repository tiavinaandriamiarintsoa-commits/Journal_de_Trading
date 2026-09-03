const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// En production, définis JWT_SECRET dans une variable d'environnement.
// Valeur de secours pour le développement local uniquement.
const JWT_SECRET = process.env.JWT_SECRET || 'journal-trading-dev-secret-a-changer-en-prod';
const DUREE_TOKEN = '30d';

if (process.env.NODE_ENV === 'production' && !process.env.JWT_SECRET) {
  console.warn(
    '⚠️  ATTENTION : JWT_SECRET n\'est pas défini en production. ' +
    'Définis cette variable d\'environnement pour sécuriser les sessions.'
  );
}

function hacherMotDePasse(motDePasse) {
  return bcrypt.hashSync(motDePasse, 10);
}

function verifierMotDePasse(motDePasse, hash) {
  return bcrypt.compareSync(motDePasse, hash);
}

function genererToken(user) {
  return jwt.sign({ userId: user.id, username: user.username }, JWT_SECRET, {
    expiresIn: DUREE_TOKEN,
  });
}

function verifierToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

module.exports = { hacherMotDePasse, verifierMotDePasse, genererToken, verifierToken };
