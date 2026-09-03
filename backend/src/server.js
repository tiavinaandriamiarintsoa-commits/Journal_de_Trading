const express = require('express');
const cors = require('cors');
const { initDb } = require('./db/init');

const tradesRouter = require('./routes/trades');
const authRouter = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 3001;

const originsAutorisees = process.env.ALLOWED_ORIGIN
  ? process.env.ALLOWED_ORIGIN.split(',').map((o) => o.trim())
  : true;

app.use(cors({ origin: originsAutorisees }));
app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/trades', tradesRouter);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

initDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Serveur backend démarré sur http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Échec de l\'initialisation de la base de données :', err);
    process.exit(1);
  });
