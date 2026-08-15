# E2E Module

## What it does

Playwright browser tests for real API-backed flows against a live Vite app + gymmi-api.

## Key files

- `e2e/login.spec.ts` — login form, validation, invalid credentials, happy path
- `e2e/signup.spec.ts` — signup form, validation, create → `/login`
- `e2e/exercises.spec.ts` — client catalog (no create), paid gym publish, unpaid gym 402 toast
- `e2e/admin.spec.ts` — non-admin redirect, admin users/permissions pages, sidebar admin links
- `e2e/list.spec.ts` — muscle/equipment options loaded in builder from `/list/*`
- `e2e/helpers/auth.ts` — signup/login/markPaid helpers + deterministic e2e admin
- `e2e/global-setup.ts` — upserts `e2e-admin@gymmi.local` via gymmi-api TypeORM helper
- `playwright.config.ts`

## Deterministic admin

- Email: `e2e-admin@gymmi.local`
- Password: `secret12`
- Created/reset by Playwright `globalSetup` (calls `gymmi-api/test/helpers/ensure-e2e-admin-cli.ts`)

## Throttling note

API auth is throttled per `X-Client-Id`. The web axios client assigns a per-browser UUID client id (`localStorage` key `gymmi-client-id`) so parallel Playwright workers do not share one bucket.

## Commands

```bash
# API must be running (default http://localhost:3000)
npm run test:e2e
npm run test:e2e:ui
```

## Constraints

- Skips mock-only modules (dashboard, workouts, analytics, settings).
- Requires gymmi-api DB + migrations; Chromium via `npx playwright install chromium`.
