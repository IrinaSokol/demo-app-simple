# ProjectOps Admin — Playwright demo

Small **TypeScript** Playwright suite that mirrors a typical enterprise split:

- **`api/`** — HTTP clients, shared API test fixture, contract-style API specs.
- **`ui/`** — page objects, component objects (sidebar, base/child dashboards, table), UI specs.

UI specs intentionally call the **API in `beforeEach`** (e.g. reset seed) so you can teach **setup/teardown** without touching the database.

## What this demonstrates

| Idea | Where |
|------|--------|
| API vs UI separation | `api/` vs `ui/` |
| Page objects | `ui/pages/` |
| Component objects + scoped roots | `ui/components/` |
| Base → child dashboards | `BaseDashboardComponent`, `ProjectsDashboardComponent`, `AssetsDashboardComponent` |
| API setup in UI hooks | `ui/specs/dashboards.*.spec.ts` → `beforeEach(({ api, token }) => …)` |
| Authenticated default + one raw login spec | `globalSetup` + `storageState` (`ui` project) vs `auth.login-ui.spec.ts` (`ui-guest`) |
| No selectors in specs | Locators live under `pages/` and `components/` only |

## Folder structure

```text
playwright/
  config/           env, users, seed constants (aligned with the app)
  api/
    clients/        HttpClient + domain clients
    fixtures/       apiTest (api + optional token)
    specs/          API tests
  ui/
    components/     Sidebar, dashboards, DataTable
    pages/          Login, AppShell, dashboard pages
    fixtures/       uiTest (extends apiTest), data.fixture, auth.fixture helper
  globalSetup.ts    Writes .auth/admin.json (localStorage auth_token)
  playwright.config.ts
```

## Prerequisites

1. **Demo app running** (API must match `API_URL`, UI must match `BASE_URL`).

   Typical dev (from **repo root**, not `playwright/`):

   ```bash
   npm install
   npm run dev
   ```

   This starts **Vite on 5173** (proxies `/api` → **Express on 3001**).

   Alternative: `npm run build && npm start` at repo root → single server (default **3001**). Then set **both** `BASE_URL` and `API_URL` to `http://localhost:3001` in `.env`.

2. **Install Playwright deps** (from `playwright/`):

   ```bash
   cd playwright
   npm install
   npx playwright install chromium
   ```

## Environment

Copy the example file and adjust if your ports differ:

```bash
cp .env.example .env
```

| Variable | Default in `.env.example` | Notes |
|----------|---------------------------|--------|
| `BASE_URL` | `http://localhost:5173` | Where the browser opens the SPA |
| `API_URL` | `http://localhost:3001` | Direct Express base for `request` clients |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | demo admin | Must match the app (`admin@demo.com` / `admin123`) |

`globalSetup` loads the same `.env` and visits `BASE_URL/login` to capture **`storageState`** (it seeds `localStorage` key **`auth_token`** with **`demo-token`**, matching the real app).

## Run tests

From **`playwright/`**:

| Command | What it runs |
|---------|----------------|
| `npm test` | All projects (`api`, `ui`, `ui-guest`) |
| `npm run test:api` | API specs only |
| `npm run test:ui` | Authenticated dashboard specs + login UI spec |
| `npm run test:headed` | All tests, headed browser |
| `npm run test:report` | Open the last HTML report |

Examples:

```bash
npm test
npx playwright test --project=api
npx playwright test --project=ui --headed
```

## Architecture rules (short)

1. **Selectors** — only inside `ui/pages` and `ui/components`, scoped under a **root** locator where possible.
2. **Specs** — call **pages/components**; avoid raw `data-testid` strings in spec files.
3. **Data setup** — UI tests may use **`api` + `token`** from `apiTest` / `uiTest` in hooks.
4. **`token` fixture** — **optional** (`{ option: true }`): it runs only when your test or hook lists `token` in the arguments (avoids an extra login in `auth.token.spec.ts`).

## Alignment with the real app (verified)

| Topic | Actual value |
|--------|----------------|
| UI routes | `/login`, `/projects`, `/assets` |
| API | `POST /api/auth/login`, `GET /api/projects`, `GET /api/assets`, `POST /api/admin/reset` |
| Auth header | `Authorization: Bearer demo-token` |
| localStorage | key `auth_token` |
| Dev ports | UI **5173**, API **3001** (not 3000) |
| Seeded names | Projects **Demo Project 1–3**, Assets **Demo Asset A–C** |

If you assumed **one** server on port 3000, update `.env` to match how you actually run the demo (see above).
