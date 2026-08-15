# Types Module

## What it does

Shared TypeScript contracts for auth and RBAC/admin. Feature-local types live next to components.

## Key files

- `src/types/auth.ts` — `AuthUser`, `AuthResponse`, login/signup/reset params
- `src/types/rbac.ts` — `RoleName`, `PermissionCell`, `RoleDto`, `AdminUserDto`, `PaginatedUsers`
- Component-local: `src/components/exercises/types.ts`, `src/components/workouts/types.ts`

## Notable fields

- `AuthUser.hasPaid: boolean` — populated from JWT / auth response; not used for UI gating
- `PermissionResource` includes `workouts` though workouts UI is mock-only

## Constraints

- Prefer shared types under `src/types/` for API-backed features; keep draft/UI-only shapes colocated with components.
