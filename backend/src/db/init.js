const { Pool } = require('pg');

// DATABASE_URL est fourni par ton hébergeur Postgres (Neon, Render, etc.)
// En local sans variable définie, on retombe sur une base locale par défaut.
const connectionString = process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/journal_test';

// Neon (et la plupart des Postgres managés) exigent SSL, sauf en local.
const utiliseSSL = /neon\.tech|render\.com|sslmode=require/.test(connectionString);

const pool = new Pool({
  connectionString,
  ssl: utiliseSSL ? { rejectUnauthorized: false } : false,
});

// Émotions autorisées — gardées ici comme référence unique (utilisée aussi côté frontend)
const EMOTIONS = ['Calme', 'Confiant', 'Impatient', 'Frustré', 'Peur', 'Euphorique', 'Déçu'];

async function initDb() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS trades (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id),
      symbole TEXT NOT NULL,
      type TEXT NOT NULL CHECK (type IN ('Achat', 'Vente')),
      volume REAL NOT NULL,
      rr_realise REAL NOT NULL,
      heure_ouverture TEXT NOT NULL,
      heure_cloture TEXT NOT NULL,
      resultat_net REAL NOT NULL,
      solde_avant REAL,
      solde_apres REAL,
      emotion TEXT NOT NULL,
      commentaire TEXT DEFAULT '',
      respect_plan INTEGER DEFAULT 1,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `);

  await pool.query(`CREATE INDEX IF NOT EXISTS idx_trades_heure_cloture ON trades(heure_cloture);`);
  await pool.query(`CREATE INDEX IF NOT EXISTS idx_trades_user_id ON trades(user_id);`);

  console.log('Base de données PostgreSQL initialisée avec succès');
}

module.exports = { pool, EMOTIONS, initDb };
