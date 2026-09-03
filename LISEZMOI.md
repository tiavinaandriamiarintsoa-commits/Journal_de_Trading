# Journal de Trading by Tiavina

## Structure
```
trading-journal/
├── backend/     → API Node/Express + SQLite
└── frontend/    → React + Vite + Tailwind (UI)
```

## Installation (une seule fois)

```bash
cd backend
npm install

cd ../frontend
npm install
```

## Lancer l'application

Il faut **deux terminaux ouverts en même temps** :

**Terminal 1 — Backend**
```bash
cd backend
npm run dev
```
→ démarre sur http://localhost:3001, crée automatiquement `journal.db` (SQLite) au premier lancement.

**Terminal 2 — Frontend**
```bash
cd frontend
npm run dev
```
→ démarre sur http://localhost:5173 — ouvre cette adresse dans ton navigateur.

## Première utilisation
Au premier lancement, va sur l'écran de connexion et clique sur "Inscription" pour créer ton compte (nom d'utilisateur + mot de passe, 6 caractères minimum). Les fois suivantes, utilise "Connexion".

## Notes
- Toutes tes données sont stockées localement dans `backend/journal.db`, liées à ton compte. Sauvegarde ce fichier si tu veux garder ton historique.
- Chaque trade a un champ **RR réalisé** (risk:reward, ex: `2.5` ou `-1`) à la place des prix d'ouverture/clôture.
- Bouton de bascule thème sombre/clair dans le bas de la barre latérale — ton choix est mémorisé.
- Aucune connexion internet requise pour l'usage courant (seules les polices Google Fonts sont chargées en ligne au premier affichage).
- L'export PDF se fait directement depuis la page "Journal", bouton en haut à droite.
- Si tu avais déjà un fichier `journal.db` d'une version précédente, supprime-le avant de relancer — le schéma de base de données a changé (ajout des comptes utilisateurs et du champ RR).

## Installer l'app (PWA)
Une fois déployée (voir `DEPLOIEMENT.md`), l'app s'installe comme une vraie application :
- **Android / Chrome desktop** : une icône d'installation apparaît dans la barre d'adresse, ou "Ajouter à l'écran d'accueil" dans le menu du navigateur
- **iOS (Safari)** : bouton Partager → "Sur l'écran d'accueil"
- Une fois installée, l'app s'ouvre en plein écran, sans barre de navigateur, avec ta propre icône

Note : les appels vers le backend nécessitent toujours une connexion internet (l'app n'est pas encore utilisable hors-ligne pour la saisie de trades) — seul le chargement de l'interface est mis en cache pour un démarrage plus rapide.

## Prochaines étapes possibles
- Déploiement en ligne (pour toi + partage futur avec des amis) : frontend sur Vercel, backend sur Railway ou Render
- Le compte utilisateur existe déjà — plusieurs amis pourront avoir chacun leur propre journal dès le déploiement partagé
