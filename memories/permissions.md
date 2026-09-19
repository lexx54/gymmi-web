# Permissions / RBAC

## What it does

Fine-grained permission checks from the API matrix, plus a coarse Admin role route guard.

## Main flows

- `useMyPermissions()` → `GET /me/permissions` → full response (`permissions`, optional `hasPaid`, `plan`, `role`, `entitlements`)
- `useHasPermission(resource, action)` → memoized lookup
- `useEntitlements()` exposes the optional rollout-safe snapshot while sharing the same query/cache.
- `<Can resource action fallback?>` → conditional render
- `<RoleRoute role="Admin">` → compares `user.role.name`; else redirect `/dashboard`

## Key files

- `src/hooks/usePermissions.ts`
- `src/components/Can.tsx`
- `src/components/RoleRoute.tsx`
- `src/services/api/permissions.ts`
- `src/types/rbac.ts`

## Typed resources / actions

- Resources: `exercises`, `workouts`, `list`, `users`, `roles`
- Actions: `READ`, `CREATE`, `EDIT`, `DELETE`

## Where used

- `Can` gates exercise create/bulk UI (`ExercisesPage`, `NoExercises`, `BuilderPageHeader`).
- Admin pages use `RoleRoute` (role name), not the permission matrix.
- Workouts/settings/analytics do not enforce permissions in UI.

## Constraints

- Permissions query: `staleTime: 0`, refetch on window focus. Relevant workout, contract, and exercise mutations invalidate it.
- Admin permission saves invalidate `['me', 'permissions']`.
- `workouts` is typed but no workout UI consumes it yet.
- Capability hints fail open when an optional rollout field is absent; limits only block locally when both limit and usage are numeric. API enforcement remains authoritative.
