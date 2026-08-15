# Auth Module

## What it does

JWT session management, login/signup UI, token persistence, and auth API wrappers. Optional forgot/reset password hooks exist without dedicated pages.

## Main flows

1. **Cold start:** `AuthContext` reads access token from localStorage, decodes JWT (`sub`, `email`, `username`, `hasPaid`, `roleId`, `roleName`), sets `user`. Invalid token → clear storage.
2. **Login (`/login`):** `useLogin` → `AuthContext.signIn` → `POST /auth/login` → save tokens → navigate `/dashboard`.
3. **Signup (`/signup`):** `useSignup` → `signupApi` (`POST /auth/signup`) → toast → navigate `/login`. Does **not** call `AuthContext.signUp` or persist tokens (no auto-login).
4. **Logout:** Sidebar → `signOut` → `POST /auth/logout` (best-effort) → clear tokens → `/login`.
5. **429 lockout:** Login/Signup show a 3-minute local countdown UI when API returns 429.

## Key files

- `src/context/AuthContext.tsx`
- `src/pages/LoginPage.tsx`, `SignupPage.tsx`
- `src/hooks/useAuthApi.ts`
- `src/services/api/auth.ts`
- `src/services/storage/tokenStorage.ts`
- `src/schemas/auth.ts`, `src/types/auth.ts`

## API

- `POST /auth/login`, `/auth/signup`, `/auth/logout`, `/auth/refresh`
- `POST /auth/forgot-password`, `/auth/reset-password` (hooks only; no UI pages)

## Constraints

- `hasPaid` is stored on `AuthUser` from JWT but not used for client-side gating.
- Login form Zod schema validates `identifier` as email; API also accepts username.
- Forgot-password button and social login buttons on auth pages are UI-only (no handlers).
- `AuthContext.signUp` exists and would save tokens, but SignupPage uses `signupApi` directly instead.
- Login e2e notes live in `memories/login.md`; signup coverage in `e2e/signup.spec.ts`.
- Axios sends a per-browser `X-Client-Id` (`gymmi-client-id` in localStorage) so auth throttling is not shared across tabs/workers.
