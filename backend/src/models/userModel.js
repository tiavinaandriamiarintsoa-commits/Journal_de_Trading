const { pool } = require('../db/init');
const { hacherMotDePasse, verifierMotDePasse } = require('../auth/auth');

async function creerUtilisateur(username, motDePasse) {
  const hash = hacherMotDePasse(motDePasse);
  const result = await pool.query(
    'INSERT INTO users (username, password_hash) VALUES ($1, $2) RETURNING id, username',
    [username, hash]
  );
  return result.rows[0];
}

async function trouverParUsername(username) {
  const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
  return result.rows[0] || null;
}

async function trouverParId(id) {
  const result = await pool.query('SELECT id, username FROM users WHERE id = $1', [id]);
  return result.rows[0] || null;
}

async function validerIdentifiants(username, motDePasse) {
  const user = await trouverParUsername(username);
  if (!user) return null;
  if (!verifierMotDePasse(motDePasse, user.password_hash)) return null;
  return { id: user.id, username: user.username };
}

module.exports = { creerUtilisateur, trouverParUsername, trouverParId, validerIdentifiants };
