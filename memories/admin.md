# Admin Module

## What it does

Admin-only user management and role permission editing against the gymmi-api admin endpoints.

## Routes

| Path | Guard | Page |
|------|-------|------|
| `/admin/users` | Private + Admin `RoleRoute` | `AdminUsersPage` |
| `/admin/permissions` | Private + Admin `RoleRoute` | `AdminPermissionsPage` |

Sidebar shows Admin section only when `user.role.name === 'Admin'`.

## Dashboard

Admins see `AdminOverview` (`src/components/admin-dashboard/`) on `/dashboard`
instead of the training widgets: attention cards linking to payments/users/
reports, account KPIs, SVG signups chart, revenue, expiring plans, plan mix,
platform activity and a recent-activity feed. Data: `useAdminOverview` →
`GET /admin/overview` (refetches every 60s). Copy lives under `admin.overview.*`.

## Main flows

- **Users:** Paginated table; inline role select, active checkbox, and Free/Plus checkbox → `PATCH /admin/users/:id` (`roleId`, `isActive`, `hasPaid`). Rows display the derived plan and optional downgrade grace time.
- **Permissions:** Select non-system role → checkbox matrix → `PUT /admin/roles/:roleId/permissions`.

## Key files

- `src/pages/admin/AdminUsersPage.tsx`
- `src/pages/admin/AdminPermissionsPage.tsx`
- `src/services/api/admin.ts`
- Types in `src/types/rbac.ts`

## API

- `GET /admin/overview`
- `GET /admin/roles`
- `GET /admin/roles/:roleId/permissions`
- `PUT /admin/roles/:roleId/permissions`
- `GET /admin/users?page&limit&roleId?`
- `PATCH /admin/users/:userId`

## Constraints

- Reuses exercises page shell (`ExercisesPageShell`, `ExercisesHeader`) for layout consistency.
- System roles excluded from permissions editor; save disabled for system roles.
- Default selected role: first non-system role.
- `hasPaid` remains the Admin write field, but the UI labels it Free/Plus and reads optional derived plan/grace metadata. Downgrade-block API messages are displayed verbatim.
- Fully real API integration.

## E2E

- Playwright: `e2e/admin.spec.ts` (non-admin redirect, users/permissions pages, sidebar).
- See `memories/e2e.md`.
