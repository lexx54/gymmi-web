# Dashboard Module

Web dashboard delivering role-tailored training overviews, weekly charts, and key performance metrics for Athletes, Trainers, and Gyms.

## What it does

- Renders the primary dashboard based on user role:
  1. `DashboardHeader`: Personalized greeting ("Good Morning, <User>") and motivational hero banner ("YOU'RE IN THE PEAK ZONE TODAY").
  2. `ActiveWorkoutCard`: Direct overview and link to active assigned routine (for Clients).
  3. `GymTrialBanner` (in `DashboardLayout` for Gyms): Displays remaining trial days badge (30-day countdown), current member capacity vs limit, and action buttons ("Create Facility Routine", "Upgrade Tier").
  4. `WeeklyProgressCard`:
     - **Clients**: Dynamic 7-day "Volume Training" chart (Mon–Sun of current week) with live volume bars, active day indicator, and goal completion percentage.
     - **Trainers**: Dynamic 7-day "Client Activity" chart (Mon–Sun of current week) showing unique active contracted clients who trained each day, scaled against total contracted clients, with top-right weekly active client rate percentage.
     - **Gyms**: Member Capacity utilization chart showing current active members vs facility limit (tier threshold: Plus 100, Pro 300, Maximum unlimited).
  5. `StatStack` (3-card right-hand metric stack):
     - **Clients**: Weekly Volume (KG moved this week), Active Time (MINS trained this week), Daily Streak (consecutive training days).
     - **Trainers**: Total Clients (count of active contracted clients), Available Workouts (count of visible workout routines), Coming Soon (clean placeholder card with "—").
     - **Gyms**: Active Members (current active members / tier capacity limit), Affiliated Coaches (count of approved coaches), Curated Routines (count of facility workout routines).
  6. `RecentActivity`: Overview of recent training sessions.
  7. `StartWorkoutButton`: Quick action button to trigger an active routine (hidden for Gym role).

## Key files

- `src/components/layout/DashboardLayout.tsx`
- `src/components/dashboard/StatStack.tsx`
- `src/components/dashboard/WeeklyProgressCard.tsx`
- `src/components/dashboard/DashboardHeader.tsx`
- `src/components/dashboard/ActiveWorkoutCard.tsx`
- `src/components/dashboard/RecentActivity.tsx`
- `src/hooks/useAnalytics.ts`
- `src/hooks/useTrainerDashboard.ts`
- `src/hooks/useGyms.ts`
- `src/services/api/analytics.ts`
- `src/services/api/dashboard.ts`
- `src/services/api/gyms.ts`
- `src/components/dashboard/StatStack.test.tsx`
- `src/components/dashboard/WeeklyProgressCard.test.tsx`

## Constraints and decisions

- Role-based separation:
  - `isGym`: Renders facility trial header, capacity progress bar, and gym metrics (`GET /gyms/me`).
  - `isTrainer`: Renders "Client Activity" and Trainer metrics (`GET /dashboard/trainer`).
  - `isClient`: Renders personal volume and athlete metrics (`GET /analytics/me`).
- Daily bar heights for Trainers scale proportionally against the trainer's total contracted clients (`(activeClients / Math.max(1, totalClients)) * 92%`).
- For Gyms, StartWorkout floating action button is omitted since facilities curate routines rather than log personal sessions directly.
- Card titles and icons in `StatStack` share a compact single row using space-between flex alignment.

## Changes made by current task

- Integrated Gym role into `DashboardLayout`, displaying `GymTrialBanner` with countdown days and capacity pills.
- Added Gym metrics to `StatStack`: Active Members vs Capacity, Affiliated Coaches, and Curated Routines.
- Added Gym capacity utilization calculation to `WeeklyProgressCard`.
- Added unit tests in `StatStack.test.tsx` for Gym role.
