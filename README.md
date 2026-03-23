# ProjectOps Admin (Playwright demo)

Small React + Express demo that mimics a simple enterprise-style admin shell: login, sidebar, and two dashboard tables backed by in-memory REST APIs. Use it to practice UI automation, API setup/teardown, and component-style page objects.

## Demo credentials

- **Email:** `admin@demo.com`
- **Password:** `admin123`
- **API token (after login):** `demo-token` (stored in `localStorage` as `auth_token`)

## Install

```bash
npm install
```

## Run locally (development)

Runs the API on port **3001** and the Vite dev server on **5173** (with `/api` proxied to the server).

```bash
npm run dev
```

Open **http://localhost:5173**.

## Build

```bash
npm run build
```

Outputs the frontend to `dist/`.

## Run production build locally

```bash
npm run build
npm start
```

Open **http://localhost:3001** (or the port in `PORT`). The server serves the API under `/api` and the SPA from `dist/`.

## Deploy (Heroku)

1. Create a Heroku app and connect the repo (or use Heroku Git).
2. Ensure the Node buildpack is used. Heroku runs `npm install` and, if present, **`npm run build`**.
3. The `start` script runs the Express server with `NODE_ENV=production`, which serves `dist/`.
4. Set no extra config unless you need a custom stack.

```bash
heroku create your-app-name
git push heroku main
```

Open the app URL. Use the same demo credentials.

## Deploy (Render)

1. New **Web Service**, connect the repository.
2. **Build command:** `npm install && npm run build`
3. **Start command:** `npm start`
4. **Environment:** `NODE_ENV=production` (Render often sets this automatically).

Render injects `PORT`; the server listens on `process.env.PORT`.

## API quick reference (for Playwright `request`)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/auth/login` | No | Body: `{ "email", "password" }` → `{ "token": "demo-token" }` or 401 |
| GET | `/api/projects` | `Authorization: Bearer demo-token` | Seeded projects (response delayed ~300–800ms) |
| GET | `/api/assets` | `Authorization: Bearer demo-token` | Seeded assets (response delayed ~300–800ms) |
| POST | `/api/admin/reset` | `Authorization: Bearer demo-token` | Resets in-memory data to the initial seed |

Base URL in dev (from tests): `http://localhost:3001` for direct API calls, or use the app origin in production.

## Playwright automation

A separate TypeScript Playwright project lives in **`playwright/`**. It splits **API** and **UI** tests, uses page/component objects, and shows **API setup in `beforeEach`** (e.g. reset seed before dashboard checks).

**Quick start**

1. Start the demo app (see **Run locally** above).
2. In another terminal:

```bash
cd playwright
npm install
npx playwright install chromium
```

Copy `playwright/.env.example` to `playwright/.env` and adjust URLs if your dev ports differ.

3. Run tests from `playwright/`: `npm test` (or `npm run test:api` / `npm run test:ui`).

Full setup, env vars (`BASE_URL` / `API_URL`), architecture notes, and report commands are documented in **[playwright/README.md](playwright/README.md)**.

## Project layout

- `src/` — React app (pages, components, API helpers, routes)
- `server/` — Express app, seed data, route modules
- `dist/` — Production frontend build (generated)
- `playwright/` — Playwright tests (API + UI, fixtures, page objects)

## License

Demo only; no warranty.
