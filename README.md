# ToyBoxing — Frontend

Interface web de **ToyBoxing**, un service de box à jouets par abonnement pour enfants.
Les abonnés s'inscrivent, choisissent leurs préférences, et reçoivent une box personnalisée de jouets.
L'administration gère le stock d'articles, les abonnés et les campagnes d'envoi.

> Application déployée sur [toyboxing.th-fchs.fr](https://toyboxing.th-fchs.fr)

## Stack technique

- **React 19** avec **Vite 7** (plugin SWC)
- **React Router DOM 7** (HashRouter)
- **Axios** pour les appels API
- Pas de librairie de composants ni de state manager externe

## Lancer le projet en local

```bash
cd front/frontend
npm install
npm run dev
```

L'application démarre sur `http://localhost:5173`.

Par défaut, les appels API pointent vers le backend de production (`https://toyboxing.th-fchs.fr`).
Pour travailler avec un backend local, décommenter la configuration proxy dans `vite.config.js` et commenter la `baseURL` dans `src/api.js`.

## Scripts disponibles

| Commande | Description |
|---|---|
| `npm run dev` | Serveur de développement avec HMR |
| `npm run build` | Build de production dans `dist/` |
| `npm run preview` | Prévisualisation du build de production |
| `npm run lint` | Linting ESLint |

## Structure du projet

```
front/frontend/src/
├── main.jsx                  # Point d'entrée React
├── App.jsx                   # Router, navigation, guard d'authentification
├── api.js                    # Client Axios, routes API, enums partagés
├── pages/
│   ├── subscriber/
│   │   ├── Register.jsx      # Formulaire d'inscription (drag & drop des préférences)
│   │   └── SubscriberBox.jsx # Consultation de sa box par email
│   └── admin/
│       ├── Login.jsx         # Connexion administrateur
│       ├── Dashboard.jsx     # Tableau de bord avec statistiques
│       ├── Articles.jsx      # Gestion du stock (ajout + liste paginée)
│       ├── Subscribers.jsx   # Liste des abonnés
│       └── Campaigns.jsx     # Création, optimisation et validation des campagnes
```

## Authentification

L'accès admin est protégé par un token JWT stocké dans `localStorage` (clé `admin_token`).
Un intercepteur Axios l'injecte automatiquement dans le header `Authorization` de chaque requête.
Les routes admin sont protégées par un composant `PrivateRoute` qui redirige vers `/login`.

## Déploiement

Le déploiement est automatique via **GitHub Actions** à chaque push sur `main` :

1. Build avec Node 20
2. Synchronisation de `dist/` vers un bucket **Google Cloud Storage**
3. Purge du cache **Cloudflare**

### Secrets GitHub requis

| Secret | Description |
|---|---|
| `GCP_SA_KEY` | Clé JSON du service account Google Cloud |
| `CLOUDFLARE_ZONE_ID` | ID de la zone Cloudflare |
| `CLOUDFLARE_API_TOKEN` | Token API Cloudflare |
