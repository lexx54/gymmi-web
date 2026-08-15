# Layout Module

## What it does

Shared navigation shell: sidebar, top bar, and dashboard home layout.

## Sidebar

Nav for all authenticated users:

- Dashboard → `/dashboard`
- Workouts → `/workout`
- Exercises → `/exercises`
- Analytics → `/analytics`
- Settings → `/settings`

Admin-only section when `user.role.name === 'Admin'`:

- Permissions → `/admin/permissions`
- Users → `/admin/users`

Also shows truncated username, role name, hardcoded “7 DAY STREAK”, and Sign Out.

Sidebar is desktop-only (`display` from `1024px` up).

## Other layout pieces

- `TopBar`: notification bell + avatar placeholders (no actions).
- `DashboardLayout` (`/dashboard`): static hero, weekly progress, recent activity, stats, start-workout FAB.

## Key files

- `src/components/layout/Sidebar.tsx`, `TopBar.tsx`, `DashboardLayout.tsx`
- `src/components/dashboard/*` (`DashboardHeader`, `WeeklyProgressCard`, `RecentActivity`, `StatStack`, `StartWorkoutButton`)
- `Sidebar.test.tsx`

## Constraints

- Nav + sign-out are real; dashboard content and streak are mock.
- Brand label in sidebar is currently “KINETIC”.
