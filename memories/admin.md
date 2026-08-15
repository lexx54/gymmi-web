# Admin Module

## What it does

Admin-only user management and role permission editing against the gymmi-api admin endpoints.

## Routes

| Path | Guard | Page |
|------|-------|------|
| `/admin/users` | Private + Admin `RoleRoute` | `AdminUsersPage` |
| `/admin/permissions` | Private + Admin `RoleRoute` | `AdminPermissionsPage` |

Sidebar shows Admin section only when `user.role.name === 'Admin'`.

## Main flows

- **Users:** Paginated table; inline role select, active checkbox, paid checkbox → `PATCH /admin/users/:id` (`roleId`, `isActive`, `hasPaid`).
- **Permissions:** Select non-system role → checkbox matrix → `PUT /admin/roles/:roleId/permissions`.

## Key files

- `src/pages/admin/AdminUsersPage.tsx`
- `src/pages/admin/AdminPermissionsPage.tsx`
- `src/services/api/admin.ts`
- Types in `src/types/rbac.ts`

## API

- `GET /admin/roles`
- `GET /admin/roles/:roleId/permissions`
- `PUT /admin/roles/:roleId/permissions`
- `GET /admin/users?page&limit&roleId?`
- `PATCH /admin/users/:userId`

## Constraints

- Reuses exercises page shell (`ExercisesPageShell`, `ExercisesHeader`) for layout consistency.
- System roles excluded from permissions editor; save disabled for system roles.
- Default selected role: first non-system role.
- `hasPaid` is admin-toggled here — primary frontend surface for the payment flag.
- Fully real API integration.

## E2E

- Playwright: `e2e/admin.spec.ts` (non-admin redirect, users/permissions pages, sidebar).
- See `memories/e2e.md`.
