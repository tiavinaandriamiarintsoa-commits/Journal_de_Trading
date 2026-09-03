# Déploiement — Journal de Trading by Tiavina

Trois services à mettre en place :
- **Base de données** (Postgres) → Neon (gratuit, sans expiration)
- **Backend** (API) → Render
- **Frontend** (React) → Vercel

## Prérequis
- Le projet doit être sur un repo GitHub

---

## 1. Base de données sur Neon

1. Va sur [neon.tech](https://neon.tech), crée un compte (tu peux te connecter avec GitHub)
2. Crée un nouveau projet — donne-lui un nom, ex. `journal-trading`
3. Une fois le projet créé, Neon affiche une **chaîne de connexion** (Connection String) du type :
   ```
   postgres://utilisateur:motdepasse@ep-xxxx.eu-central-1.aws.neon.tech/neondb?sslmode=require
   ```
4. **Copie cette URL complète** — c'est ta `DATABASE_URL`, tu en auras besoin à l'étape suivante

---

## 2. Backend sur Render

1. Va sur [render.com](https://render.com), crée un compte, clique **New +** → **Web Service**
2. Connecte ton repo GitHub, sélectionne ton dépôt
3. Configure :
   - **Root Directory** : `backend`
   - **Runtime** : Node
   - **Build Command** : `npm install`
   - **Start Command** : `npm start`
   - **Instance Type** : Free

4. **Variables d'environnement** (section **Environment Variables**) :

   | Clé | Valeur |
   |---|---|
   | `JWT_SECRET` | une chaîne aléatoire longue (génère-la avec la commande ci-dessous) |
   | `DATABASE_URL` | l'URL Neon copiée à l'étape 1 |
   | `ALLOWED_ORIGIN` | *(laisse vide pour l'instant)* |

   Génère un `JWT_SECRET` solide en local :
   ```
   node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
   ```

5. Clique **Create Web Service**. Render build et démarre l'app — note l'URL fournie, du type `https://trading-journal-backend.onrender.com`

6. Vérifie : ouvre `https://<ton-url>.onrender.com/api/health`, tu dois voir `{"status":"ok"}`

Sur le plan gratuit, Render met le service en veille après 15 min d'inactivité — le premier appel après une pause prend quelques secondes à réveiller le serveur.

---

## 3. Frontend sur Vercel

1. Va sur [vercel.com](https://vercel.com), crée un compte, clique **Add New** → **Project**
2. Importe ton repo GitHub
3. Configure :
   - **Root Directory** : `frontend`
   - **Framework Preset** : Vite (détecté automatiquement)
   - Dans **Environment Variables**, ajoute :

     | Clé | Valeur |
     |---|---|
     | `VITE_API_URL` | `https://<ton-url>.onrender.com/api` |

4. Clique **Deploy**. Vercel te donne une URL du type `https://trading-journal.vercel.app`

---

## 4. Boucler la boucle : autoriser le frontend sur le backend

Retourne sur Render → ton service backend → **Environment** → modifie `ALLOWED_ORIGIN` :
```
ALLOWED_ORIGIN=https://trading-journal.vercel.app
```
Sauvegarde — Render redéploie automatiquement.

---

## Vérification finale

Ouvre ton URL Vercel, crée un compte, ajoute un trade, vérifie que le dashboard s'affiche. Si une erreur CORS apparaît dans la console du navigateur, vérifie que `ALLOWED_ORIGIN` correspond exactement à l'URL Vercel (sans slash final).

## Mises à jour futures

Chaque `git push` sur la branche principale redéploie automatiquement Render et Vercel.

## Notes pour plus tard
- Le stockage est déjà multi-utilisateur — prêt à partager avec tes amis dès maintenant
- Neon free tier : base mise en pause après inactivité prolongée, se réveille automatiquement au premier appel (peut ajouter 1-2s de latence occasionnelle)
