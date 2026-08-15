# Permissions / RBAC

## What it does

Fine-grained permission checks from the API matrix, plus a coarse Admin role route guard.

## Main flows

- `useMyPermissions()` → `GET /me/permissions` → `PermissionCell[]` (`resource`, `action`, `allowed`)
- `useHasPermission(resource, action)` → memoized lookup
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

- Permissions query: `staleTime: 0`, refetch on window focus.
- Admin permission saves invalidate `['me', 'permissions']`.
- `workouts` is typed but no workout UI consumes it yet.
- Real API integration.
