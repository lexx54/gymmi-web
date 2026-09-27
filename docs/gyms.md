# Gym Management Module

Web console interface for Gym facilities to manage their curated workout catalog, coach affiliations, and member roster.

## What it does

- **Curated Routine Catalog (`/gym/catalog`)**:
  - Displays all workout routines created by the Gym or authorized affiliated coaches.
  - Search filter by name or description.
  - Quick action buttons to edit, delete, or create new routines.
- **Coach Affiliation Management (`/gym/coaches`)**:
  - Lists pending coach affiliation requests with Approve and Reject actions.
  - Lists approved affiliated coaches with trainer profile details (username, email, avatar).
  - Permission toggle (`canPublishRoutines`) allowing facility admins to grant or revoke routine publishing rights to specific trainers.
  - Option to remove coaches from the facility.
- **Member Roster Management (`/gym/members`)**:
  - Displays facility capacity visual progress bar with count of active members vs tier capacity (Plus 100, Pro 300, Maximum unlimited).
  - Search filter by athlete name or email.
  - Member table displaying join date, status, and option to remove members from the roster.
- **Dedicated Facility Navigation**:
  - Distinct navigation sidebar for Gym accounts: Dashboard, Catalog, Coaches, Members, Exercises, Settings.
  - Top trial banner showing remaining free trial days (30-day trial) and tier upgrade action.

## Key files

- `src/pages/gym/GymCatalogPage.tsx`: Curated workout library catalog for facility.
- `src/pages/gym/GymCoachesPage.tsx`: Coach affiliation approval, permissions, and list.
- `src/pages/gym/GymMembersPage.tsx`: Member roster list with capacity progress indicator.
- `src/pages/gym/GymPages.test.tsx`: Unit tests for catalog, coaches, and members management pages.
- `src/types/gym.ts`: Gym domain models (`GymProfile`, `GymMember`, `GymCoach`, `GymDashboardData`, `PublicGymItem`, `GymTier`).
- `src/services/api/gyms.ts`: API clients for `/gyms`, `/gyms/me`, `/gyms/me/members`, `/gyms/me/coaches`, and tier upgrades.
- `src/hooks/useGyms.ts`: React Query hooks (`useMyGym`, `useMyGymMembers`, `useMyGymCoaches`, `useApproveGymCoach`, `useRejectGymCoach`, `useUpdateCoachPermissions`, `useRemoveGymCoach`, `useRemoveGymMember`, `useUpgradeGymTier`).
- `src/components/layout/Sidebar.tsx`: Dedicated Gym menu items.
- `src/App.tsx`: Protected routes under `<RoleRoute role="Gym">`.

## Constraints and decisions

- **Scoped Authority**: Only users with the role `Gym` can access `/gym/*` routes, enforced via `RoleRoute`.
- **Capacity Monitoring**: Member roster computes percentage against `gymData.capacity` (fallback to 100).
- **Coach Permissions**: Coaches affiliated with a gym cannot publish workouts to the gym's public catalog unless `canPublishRoutines` is explicitly enabled by the facility admin.
- **Routines & Exercises Scoping**: Workout routines created while logged in as a Gym account are automatically attached to `gymProfile.id` on the backend.

## Changes made by current task

- Implemented `GymCatalogPage`, `GymCoachesPage`, and `GymMembersPage`.
- Added gym API service (`src/services/api/gyms.ts`) and React Query hooks (`src/hooks/useGyms.ts`).
- Created TypeScript interfaces in `src/types/gym.ts`.
- Configured routes in `src/App.tsx` and sidebar navigation in `Sidebar.tsx`.
- Added unit tests in `GymPages.test.tsx` verifying catalog searching, coach approvals, and member roster.
