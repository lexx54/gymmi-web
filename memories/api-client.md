# API Client / Services

## What it does

Shared Axios client with auth header injection and refresh-token queueing, plus feature API modules.

## Client (`src/services/api/client.ts`)

- Base URL: `VITE_API_URL` || `http://localhost:3000`
- Default headers: `Content-Type: application/json`
- Request interceptor: set per-browser `X-Client-Id` (`localStorage` key `gymmi-client-id`) and attach `Bearer` access token from `tokenStorage`
- Response interceptor on 401 (non-`/auth/*`): single-flight refresh via `POST /auth/refresh`, retry queued requests; failure clears tokens

## API modules

| File | Purpose |
|------|---------|
| `auth.ts` | Login, signup, logout, refresh, forgot/reset |
| `exercises.ts` | CRUD + bulk CSV |
| `permissions.ts` | `GET /me/permissions` |
| `admin.ts` | Roles, role permissions, users |

Storage: `src/services/storage/tokenStorage.ts` (access + refresh tokens in localStorage).

## Constraints

- Keep refresh logic only in `client.ts` — do not duplicate elsewhere.
- Tests: `client.test.ts`, `auth.test.ts`, `exercises.test.ts`.
- Only modules above call the backend; workouts/settings/analytics have no API modules.
