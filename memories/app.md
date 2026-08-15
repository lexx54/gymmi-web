# App / Routing

## What it does

SPA bootstrap and route table for Gymmi web (React + Vite).

## Bootstrap

`src/main.tsx` wraps `App` with:

- `BrowserRouter`
- `QueryClientProvider` (TanStack Query)
- `AuthProvider`

`App.tsx` mounts global Sonner `<Toaster />` and defines routes.

## Routes

| Path | Guard | Page |
|------|-------|------|
| `/login`, `/signup` | `PublicRoute` | Login / Signup |
| `/dashboard` | `PrivateRoute` | `DashboardLayout` |
| `/analytics` | Private | `AnalyticsPage` |
| `/workouts` | Private | Redirect → `/workout/new` |
| `/workout` | Private | `WorkoutLibraryPage` |
| `/workout/new` | Private | `WorkoutsPage` |
| `/exercises` | Private | `ExercisesPage` |
| `/exercises/new` | Private | `ExerciseBuilderPage` |
| `/settings` | Private | `SettingsPage` |
| `/admin/permissions`, `/admin/users` | Private + `RoleRoute role="Admin"` | Admin pages |
| `*` | — | Redirect → `/login` |

## Key files

- `src/main.tsx`, `src/App.tsx`
- `src/components/PrivateRoute.tsx`, `PublicRoute.tsx`, `RoleRoute.tsx`

## Constraints

- Auth gating is binary (logged in vs not). Fine-grained RBAC is via `Can` / admin role routes.
- No `/exercises/:id` edit route; builder is create-only.
- Unknown paths go to `/login`, not dashboard.
- Env: `VITE_API_URL` (fallback `http://localhost:3000`).
