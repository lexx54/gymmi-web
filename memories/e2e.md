# E2E Module

## What it does

Playwright browser tests for real API-backed flows against a live Vite app + gymmi-api.

## Test database isolation (Option A)

- E2E never touches the dev database (`gymmi`). Playwright + API Jest e2e use a dedicated persistent Postgres database `gymmi_e2e`.
- A dedicated e2e API runs on **port 3001** (`gymmi-api` script `start:e2e` = `ENV_FILE=.env.e2e nest start`). The developer `start:dev` on `:3000`/`gymmi` is left untouched and is **not** reused.
- `gymmi-api/.env.e2e` overrides base `.env`: `DB_NAME=gymmi_e2e`, `PORT=3001`, `NODE_ENV=test` (the `test` value also raises the auth throttle limit). Override is applied in `src/data-source.ts` when `ENV_FILE` is set (`dotenv.config({ path, override: true })`).
- `playwright.config.ts` starts two web servers: the e2e API (`reuseExistingServer: false`, `cwd: ../gymmi-api`, url `http://localhost:3001`) and Vite (`VITE_API_URL` pointed at 3001).
- Test-runner direct API calls default to `http://localhost:3001` (`E2E_API_URL` override), see `e2e/helpers/auth.ts` and `e2e/login.spec.ts`.
- One-time local setup: `CREATE DATABASE gymmi_e2e;` (owner `admin`). Schema is created/kept current by `globalSetup` running `migration:run`.
- `globalSetup` truncates mutable tables each run (`test/helpers/reset-e2e-db-cli.ts`: `exercises`, `tags`, `refresh_tokens`, `users` — `RESTART IDENTITY CASCADE`), keeping seed tables (`roles`, `permissions`, `role_permissions`, `muscles`, `equipments`). This prevents cross-run accumulation. It is required for determinism: `/admin/users` is `createdAt DESC`, page size 20, and the oldest `e2e-admin` row would otherwise fall off page 1 once >20 users pile up.

## Key files

- `e2e/login.spec.ts` — login form, validation, invalid credentials, happy path
- `e2e/signup.spec.ts` — signup form, validation, create → `/login`
- `e2e/exercises.spec.ts` — client catalog (no create), paid gym publish, unpaid gym 402 toast, paid gym bulk CSV modal
- `e2e/admin.spec.ts` — non-admin redirect, admin users/permissions pages, sidebar admin links
- `e2e/list.spec.ts` — muscle/equipment options loaded in builder from `/list/*`
- `e2e/tags.spec.ts` — admin-created tags are global; user-created tags are private
- `e2e/helpers/auth.ts` — signup/login/markPaid helpers + deterministic e2e admin
- `e2e/global-setup.ts` — runs `migration:run`, truncates mutable tables (`reset-e2e-db-cli.ts`), then upserts `e2e-admin@gymmi.local` against `gymmi_e2e` (all via `ENV_FILE=.env.e2e`)
- `playwright.config.ts`

## Deterministic admin

- Email: `e2e-admin@gymmi.local`
- Password: `secret12`
- Created/reset by Playwright `globalSetup` (calls `gymmi-api/test/helpers/ensure-e2e-admin-cli.ts`)

## Throttling note

API auth is throttled per `X-Client-Id`. The web axios client assigns a per-browser UUID client id (`localStorage` key `gymmi-client-id`) so parallel Playwright workers do not share one bucket.

## Commands

```bash
# One-time: create the dedicated test DB
#   psql -U admin -h localhost -d postgres -c 'CREATE DATABASE gymmi_e2e;'
# Playwright boots its own e2e API on :3001 (gymmi_e2e); do not point it at :3000.
npm run test:e2e
npm run test:e2e:ui
```

## Spec gotchas (selector/copy)

- Empty catalog: `ExercisesPage` renders `NoExercises` (`role="status"`) which has its own "Create Exercise" button. Against the fresh `gymmi_e2e` DB the catalog can be empty, so `getByRole('button', { name: /create exercise/i })` matches two buttons — scope to `.first()` (header action) in `exercises.spec.ts`.
- Login empty-submit copy is the identifier message `Email or username is required` (not "Email is required"); password stays `Password is required`.
- Signup password field placeholder is `Password` (`auth.passwordPlaceholder`), not bullets — use `getByPlaceholder('Password', { exact: true })` so it doesn't also match `confirm password`.

## Constraints

- Skips mock-only modules (dashboard, workouts, analytics, settings).
- Requires the `gymmi_e2e` database + migrations; Chromium via `npx playwright install chromium`.
