# SIR Frontend

Application frontend React + TypeScript pour la gestion de concerts, de tickets et de dashboards par role (`CUSTOMER`, `ORGANIZER`, `ADMIN`).

Le projet est construit avec Vite, PrimeReact, React Router, Zod et Axios.

## 1. Fonctionnalites couvertes

- Espace public:
  - landing page concerts
  - recherche de concerts
  - navigation vers inscription/connexion
- Authentification:
  - inscription (`CUSTOMER` ou `ORGANIZER`)
  - connexion
  - rafraichissement de session
  - deconnexion
- Espace customer:
  - consultation des concerts publics
  - detail d un concert
  - achat de billets
  - consultation des tickets achetes
  - affichage code-barres ticket
- Espace organizer:
  - creation de concert
  - dashboard de statistiques avancees (periode, granularite, top N, breakdowns, ranking, timeline)
- Espace admin:
  - moderation des concerts (pending / approved / rejected)
  - validation et rejet d un concert
- Gestion d erreurs:
  - page erreur dediee par code (HTTP et codes applicatifs)
  - fallback React global via error boundary
- Theme:
  - bascule light/dark sur les headers

## 2. Stack technique

- Runtime: React 19, React DOM 19
- Build tool: Vite 7
- Langage: TypeScript 5.9
- UI: PrimeReact + PrimeIcons
- Routing: React Router DOM 6
- Formulaires: React Hook Form + Zod
- HTTP: Axios + interceptors
- Validation runtime: Zod
- Lint: ESLint 9
- Documentation API TS: TypeDoc

## 3. Prerequis

- Node.js recent (LTS recommande)
- npm
- Backend SIR accessible (par defaut `http://localhost:8081`)

## 4. Installation

```bash
npm install
```

## 5. Configuration environnement

Variables gerees dans `src/shared/config/env.ts`.

| Variable | Obligatoire | Exemple | Description |
| --- | --- | --- | --- |
| `VITE_API_BASE_URL` | Oui | `http://localhost:8081` | URL de base du backend |

Fichiers disponibles:

- `.env.example`
- `.env.development`

Exemple minimal:

```env
VITE_API_BASE_URL=http://localhost:8081
```

## 6. Scripts npm

| Commande | Description |
| --- | --- |
| `npm run dev` | Lance le serveur Vite en dev |
| `npm run build` | Compile TypeScript puis build production Vite |
| `npm run preview` | Sert le build localement |
| `npm run lint` | Lance ESLint |
| `npm run docs` | Genere la documentation TypeDoc dans `docs/api` |

## 7. Demarrage rapide

1. Verifier que le backend tourne et expose les endpoints attendus.
2. Verifier/adapter `VITE_API_BASE_URL`.
3. Lancer:

```bash
npm run dev
```

4. Ouvrir l URL affichee par Vite (souvent `http://localhost:5173`).

## 8. Architecture du projet

Le projet suit une separation par domaines fonctionnels:

```text
src/
  app/        # bootstrap, router, providers, layouts
  entities/   # modeles de base (user, erreurs)
  features/   # logique metier/API par domaine (auth, concert, ticket, stats, theme)
  pages/      # pages de navigation
  shared/     # infra transverse (api, auth store, config, ui, utils)
  widgets/    # blocs UI reutilisables (headers/footers)
```

Points techniques importants:

- Alias TS/Vite: `@` -> `src` (voir `vite.config.ts` et `tsconfig.app.json`)
- Bootstrap app: `src/app/main.tsx`
- Router principal: `src/app/router/createAppRouter.tsx`
- Provider auth: `src/app/providers/AuthProvider.tsx`
- Client HTTP: `src/shared/api/http.ts`

## 9. Gestion des roles et acces

Roles frontend:

- `CUSTOMER`
- `ORGANIZER`
- `ADMIN`

Roles backend supportes:

- `ROLE_CUSTOMER`
- `ROLE_ORGANIZER`
- `ROLE_ADMIN`

Inscription publique autorisee uniquement pour:

- `CUSTOMER`
- `ORGANIZER`

Protection d acces:

- `RoleGuard` protege les routes par role
- `RoleHomeRedirect` redirige `/dashboard` vers la home role

## 10. Routes applicatives

| Route | Acces | Description |
| --- | --- | --- |
| `/` | Public | Landing page |
| `/login` | Public | Connexion |
| `/register` | Public | Inscription |
| `/dashboard` | Auth | Redirection selon role |
| `/customer` | CUSTOMER | Home customer |
| `/customer/tickets` | CUSTOMER | Liste tickets |
| `/customer/concerts/:concertId` | CUSTOMER | Detail + achat |
| `/organizer` | ORGANIZER | Dashboard stats |
| `/organizer/concerts/create` | ORGANIZER | Creation concert |
| `/admin` | ADMIN | Moderation concerts |
| `/errors/:statusCode` | Public | Page erreur |
| `*` | Public | 404 |

## 11. Endpoints backend consommes

Base path: `VITE_API_BASE_URL`.

### Auth / Users

- `POST /auth/login`
- `POST /auth/logout`
- `POST /auth/refresh`
- `GET /users/me`
- `POST /users/register`

### Concerts

- `GET /concerts/public/places`
- `POST /concerts/create`
- `GET /concerts/pending`
- `GET /concerts/approved`
- `GET /concerts/rejected`
- `POST /concerts/:concertId/validate`
- `POST /concerts/:concertId/reject`

### Tickets

- `POST /tickets/purchase`
- `GET /tickets/me`

### Places

- `GET /places/all`

### Stats

- `GET /stats/me/concerts`

## 12. Flux auth/session

Strategie implementee:

- Access token stocke en memoire (`authTokenStore`)
- Refresh token gere cote backend (cookie `withCredentials`)
- Interceptor request:
  - ajoute `Authorization: <tokenType> <accessToken>` si requis
- Interceptor response:
  - sur `401`, tente un refresh (une seule fois)
  - rejoue la requete initiale apres refresh
  - nettoie le token store si refresh impossible
- Exclusions auth (pas de bearer injecte):
  - `/auth/login`
  - `/auth/refresh`
  - `/users/register`

Bootstrap de session (`AuthProvider`):

- Sur routes publiques (`/`, `/login`, `/register`): pas de bootstrap force
- Sur autres routes:
  - tente `me()` si token present
  - sinon tente `refresh()` puis `me()`

## 13. Validation et robustesse des donnees

Les payloads API sont valides avec Zod:

- avant envoi (input schemas)
- apres reception (response schemas)

Exemples:

- login: email valide + mot de passe min 8
- creation concert: titre/artiste min 2, description min 12, prix > 0, quantite > 0
- achat tickets: `concertId` UUID + `quantity` entier positif
- stats organizer:
  - periode `from/to` ISO datetime
  - `granularity`: `DAY | WEEK | MONTH`
  - `top`: 1..100

## 14. Gestion d erreurs

- Mapping central des erreurs API: `src/shared/api/map-api-error.ts`
- Codes supportes:
  - HTTP standards (`400`, `401`, `403`, `404`, `409`, `422`, `500`, etc.)
  - codes applicatifs `offline`, `unexpected`
- Catalogue UI: `src/entities/error/model/errorCatalog.ts`
- Page erreur dediee: `src/pages/ErrorPage/ui/ErrorPage.tsx`
- Fallback React global: `src/app/providers/AppErrorBoundary.tsx`

## 15. Theme et UI

- Theme PrimeReact charge dynamiquement (`light`/`dark`)
- Preference initiale basee sur `prefers-color-scheme`
- Attributs document maintenus:
  - `data-color-mode`
  - `color-scheme`

## 16. Documentation TypeScript (TypeDoc)

Generation:

```bash
npm run docs
```

Sortie:

- dossier `docs/api`

Configuration:

- fichier `typedoc.json`
- utilise `tsconfig.app.json`
- validation TypeDoc adaptee pour eviter le bruit sur symboles non exportes

## 17. Qualite et verification

Commandes de verification recommandees avant merge:

```bash
npm run lint
npm run build
npm run docs
```

## 18. Troubleshooting

### Ecran erreur `offline`

Ca signifie generalement que le backend est injoignable.

- verifier le backend
- verifier `VITE_API_BASE_URL`
- verifier CORS/cookies si auth

### Redirections vers `/errors/401` ou `/errors/403`

- verifier la session utilisateur
- verifier le role retourne par `/users/me`
- verifier les routes protegees (`RoleGuard`)

### Session perdue apres refresh page

- normal si refresh token backend absent/invalide
- verifier la route `/auth/refresh`
- verifier la politique cookie cote backend

### Build Vite signale un chunk > 500kB

- avertissement non bloquant
- envisager du code splitting si necessaire

## 19. Etat actuel du repository

Ce frontend est pret pour:

- execution locale (`dev`)
- build de production
- lint
- generation de documentation TypeScript

README maintenu pour refleter le code courant (routes, API, auth, scripts).
