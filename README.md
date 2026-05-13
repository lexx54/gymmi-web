# gymmi-web

Frontend app for Gymmi built with React + TypeScript + Vite.

## Stack

- React 19
- React Router 7
- TanStack Query 5
- Axios
- React Hook Form + Zod
- Styled Components
- Sonner (toasts)
- Vitest + Testing Library

## Run

```bash
npm install
npm run dev
```

Default dev URL: `http://localhost:5173`

## Environment

Create `.env` in `gymmi-web` root:

```env
VITE_API_URL=http://localhost:3000
```

If missing, API client falls back to `http://localhost:3000`.

## Scripts

```bash
npm run dev
npm run build
npm run preview
npm run lint
npm run test
```

## App composition

Entry tree in `src/main.tsx`:

- `BrowserRouter`
- `QueryClientProvider`
- `AuthProvider`
- `App`

Route map in `src/App.tsx`:

- Public:
  - `/login`
  - `/signup`
- Private:
  - `/dashboard`
  - `/analytics`
  - `/workouts`
  - `/exercises`
  - `/exercises/new`
  - `/settings`
- Fallback:
  - `* -> /login`

Auth gating:

- `PrivateRoute` blocks unauthenticated access.
- `PublicRoute` prevents logged-in users from revisiting auth pages.

## Auth/data flow

Core files:

- `src/context/AuthContext.tsx`
- `src/services/api/client.ts`
- `src/services/api/auth.ts`
- `src/services/storage/tokenStorage.ts`
- `src/hooks/useAuthApi.ts`

Behavior:

1. Login/signup calls API through `useAuthApi`/`auth.ts`.
2. `AuthContext` stores `user` and token state in memory.
3. Tokens are persisted via `tokenStorage`.
4. Axios request interceptor adds `Authorization: Bearer <accessToken>`.
5. Axios response interceptor handles `401`:
   - skips `/auth/*` endpoints
   - performs one refresh flow with queueing for concurrent failed requests
   - retries queued requests with new access token
   - clears tokens when refresh fails

Lockout behavior in auth pages:

- `LoginPage` and `SignupPage` apply local 3-minute lockout UI when API returns `429`.

## Current feature state

### Implemented against backend

- Auth API:
  - `POST /auth/login`
  - `POST /auth/signup`
  - `POST /auth/refresh`
  - `POST /auth/forgot-password`
  - `POST /auth/reset-password`
  - `POST /auth/logout`
- List API:
  - `GET /list/equipments` via `useListData('equipments')`

### Local/mock UI state

- `ExercisesPage` uses local in-file `CATALOG` data.
- `WorkoutsPage` uses local `LIBRARY_EXERCISES` and `INITIAL_ROUTINE`.
- `ExerciseBuilderPage` maintains local `ExerciseDraft` state and currently does not POST yet.

## Exercise model reference

Primary types: `src/components/exercises/types.ts`

- `ExerciseDraft`:
  - `name`
  - `targetMuscle`
  - `equipment`
  - `instructions`
  - `difficulty`
  - `movementType`
  - `tags`
- `ExerciseSummary`:
  - `id`
  - `name`
  - `targetMuscle`
  - `equipment`
  - `difficulty`
  - `tags`

## Folder map

```text
src/
  App.tsx
  main.tsx

  components/
    analytics/
    dashboard/
    exercises/
    layout/
    settings/
    workouts/
    PrivateRoute.tsx
    PublicRoute.tsx

  context/
    AuthContext.tsx

  hooks/
    useAuthApi.ts
    useListData.ts

  pages/
    LoginPage.tsx
    SignupPage.tsx
    Dashboard/Analytics/Workouts/Exercises/Settings pages

  schemas/
    auth.ts

  services/
    api/
      client.ts
      auth.ts
    storage/
      tokenStorage.ts

  types/
    auth.ts
```

## Tests

```bash
npm run test
```

Test setup:

- `src/setupTests.ts`
- Unit/component tests colocated as `*.test.tsx` and `*.test.ts`

## Add new API-backed feature pattern

1. Add typed request/response models under `src/types/`.
2. Add endpoint wrappers under `src/services/api/`.
3. Add query/mutation hooks under `src/hooks/`.
4. Consume hooks in page/component.
5. Keep auth/token handling in `api/client.ts` only (no duplicate refresh logic).
6. Add tests near the new hook/component/page.
