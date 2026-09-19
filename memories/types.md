# Types Module

## What it does

Shared TypeScript contracts for auth and RBAC/admin. Feature-local types live next to components.

## Key files

- `src/types/auth.ts` — `AuthUser`, `AuthResponse`, login/signup/reset params
- `src/types/rbac.ts` — RBAC/admin types plus optional `PlanName`, full permissions response, entitlement capabilities/limits/usage snapshot
- Component-local: `src/components/exercises/types.ts`, `src/components/workouts/types.ts`

## Notable fields

- `AuthUser.hasPaid: boolean` and optional derived `plan` — populated from JWT/auth response; action hints use the refreshed permissions entitlement snapshot instead.
- `PermissionResource` includes `workouts` though workouts UI is mock-only

## Constraints

- Prefer shared types under `src/types/` for API-backed features; keep draft/UI-only shapes colocated with components.
- Entitlement fields are optional and capability maps are extensible to tolerate mixed API/web rollout versions.
