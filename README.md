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

### If you see `EADDRINUSE` / “address already in use :::3001”

That means **something else is already listening on port 3001** (often an old Express/`tsx` process from a previous `npm run dev` or `npm start`). The **API process exits**, but Vite may still start — then `/api` is proxied to whatever is on 3001, which may be the **wrong** app or an outdated server → confusing errors (e.g. “Not Found” on save).

**Fix:** stop the process using 3001, then run `npm run dev` again.

- **Windows (PowerShell):** see which PID owns the port, then end it:

  ```powershell
  netstat -ano | findstr :3001
  taskkill /PID <pid_from_last_column> /F
  ```

- **macOS / Linux:** `lsof -i :3001` then `kill <pid>`.

You do **not** need to change application code for this; it is a **local port conflict**.

### If “Save” on Create Project / Create Asset shows “Not Found”

That almost always means the browser got **HTTP 404** on `POST /api/projects` or `POST /api/assets` (the UI surfaces `statusText` as “Not Found” when the body is not JSON).

Common causes:

1. **Stale Node process on port 3001** — An older Express instance without the POST routes is still running. Stop it, then run `npm run dev` again (or restart `dev:server`).
2. **`vite` or `vite preview` without Express** — The UI must reach the API on **3001**. Use **`npm run dev`** (starts both), or **`npm start`** after `npm run build`, or run the server separately and optionally set **`VITE_API_BASE_URL=http://localhost:3001`** in `.env.local` so the browser calls Express directly (CORS is enabled).
3. **`vite preview`** — The dev proxy does not apply unless configured. This repo sets **`preview.proxy`** in `vite.config.ts` so `/api` is forwarded to **3001** when you use `npm run preview`, but Express must still be running.

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

1. Create a Heroku app and connect this repository (or use Heroku Git). The **Node** buildpack should run automatically.
2. After `npm install`, Heroku runs **`heroku-postbuild`** → **`npm run build`** (Vite output in `dist/`).
3. The **`web`** process runs **`npm start`**: Express with `NODE_ENV=production` serves `/api` and the SPA from `dist/`. Heroku sets **`PORT`**; the server already reads `process.env.PORT`.
4. Optional: `engines.node` in `package.json` documents supported Node (**>=20**).

```bash
heroku create your-app-name
git push heroku main
```

Open the app URL. Use the same demo credentials.

Playwright tests live in a **separate** repo (**demo-app-simple-e2e**); point `BASE_URL` and `API_URL` at your Heroku URL to run tests against the deployed app.

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
| GET | `/api/projects` | `Authorization: Bearer demo-token` | List projects (response delayed ~300–800ms) |
| POST | `/api/projects` | `Authorization: Bearer demo-token` | Body: `{ "name", "owner", "status" }` → `201` + created project |
| GET | `/api/assets` | `Authorization: Bearer demo-token` | List assets (response delayed ~300–800ms) |
| POST | `/api/assets` | `Authorization: Bearer demo-token` | Body: `{ "name", "type", "status" }` → `201` + created asset |
| POST | `/api/admin/reset` | `Authorization: Bearer demo-token` | Resets in-memory data to the initial seed |

Base URL in dev (from tests): `http://localhost:3001` for direct API calls, or use the app origin in production.

## Playwright / E2E tests

End-to-end and API tests are maintained in a **separate project** (**demo-app-simple-e2e**), next to this repo. That project is not deployed to Heroku; configure its `.env` with your **local** URLs or your **Heroku** app URL (`BASE_URL` and `API_URL` both set to `https://<your-app>.herokuapp.com`).

See the e2e project’s **README** for install, `npx playwright install chromium`, and `npm test`.

## Project layout

- `src/` — React app (pages, components, API helpers, routes)
- `server/` — Express app, seed data, route modules
- `dist/` — Production frontend build (generated)
- `Procfile` — Heroku `web` process (`npm start`)

## License

Demo only; no warranty.
