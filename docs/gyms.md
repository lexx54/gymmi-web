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
- **Single Active Gym Rule**: A client can belong to only one active gym at a time. The UI disables request buttons when already in an active gym, prompting the client to leave their existing gym first.
- **Capacity Monitoring**: Member roster computes percentage against `gymData.capacity` (fallback to 100).
- **Coach Permissions**: Coaches affiliated with a gym cannot publish workouts to the gym's public catalog unless `canPublishRoutines` is explicitly enabled by the facility admin.
- **Routines & Exercises Scoping**: Workout routines created while logged in as a Gym account are automatically attached to `gymProfile.id` on the backend.
- **Trial & Tier Status**: Backend `GET /gyms/me` returns `isTrialActive`, `trialDaysRemaining`, and `capacity`. Frontend gracefully handles trial vs paid tiers without showing expired banners to active accounts.

## Changes made by current task

- **Client Gym Affiliation & Request Flows**:
  - Evolved client navigation item to "Trainers & Gyms" (`/trainers` or `/affiliations`) with segmented tabs `[ Trainers | Gyms ]`.
  - Created `ClientGymsSection.tsx` with:
    - Active gym card displaying cover, branding, address, amenities, and "Leave Gym" action.
    - Pending membership request banner displaying status and "Cancel Request" action.
    - Empty state when no gym is joined.
    - Instant join form by code / QR deep-link query parameter (`?code=...` / `?joinCode=...`).
    - Searchable explore gyms directory with member counts and "Request Membership" button.
- **Gym Facility QR & Pending Requests Management**:
  - Added "Facility QR & Join Code" action button in `GymMembersPage` opening a modal with:
    - Facility logo and branding.
    - Printable/scannable QR code deep linking to `${window.location.origin}/trainers?tab=gyms&code=${joinCode}`.
    - Alphanumeric join code with copy-to-clipboard action.
    - Print QR button.
  - Added "Pending Member Requests" section in `GymMembersPage` with athlete information and Approve / Reject actions.
- **Added Comprehensive Unit Tests**:
  - Added `TrainersPage.test.tsx` testing tab switching, active gym card, pending request banner, URL query param auto-fill, and directory membership requests (5 tests passing).
  - Extended `GymPages.test.tsx` with pending member approvals/rejections and facility QR modal tests (6 tests passing).
- Fixed discrepancy between backend `/gyms/me` payload and frontend `GymDashboardData` properties (`isTrialActive`, `trialDaysRemaining`, `capacity`).
- Added test coverage in `DashboardLayout.test.tsx` and updated test fixtures in `GymPages.test.tsx`.
- Removed workaround in `imageUpload.ts` that mapped `gym-cover` to `trainer-logo`; gym covers and gym logos now use native `gym-cover` and `gym-logo` upload purposes directly.
- Added `Cache-Control: public, max-age=31536000, immutable` headers to all image uploads.
- Fixed empty coach affiliation request cards in `GymCoachesPage.tsx`:
  - Enriched `GymCoach` type with top-level fallback properties (`username`, `email`, `avatarUrl`, `logoUrl`, `monthlyPrice`, `description`, `specializations`).
  - Added robust property resolution in `GymCoachesPage.tsx` supporting nested and flat fields.
  - Added fallback `UserRound` icon inside `<Avatar>` when no trainer avatar/logo image is present.
  - Rendered rate (`${monthlyPrice} / mo`), bio, and specialization chips for both pending and approved coaches.
  - Added test coverage for flat and nested coach payloads in `GymPages.test.tsx`.


