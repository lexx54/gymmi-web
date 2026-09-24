# Dashboard Module

Web dashboard delivering role-tailored training overviews, weekly charts, and key performance metrics for Athletes and Trainers.

## What it does

- Renders the primary dashboard based on user role:
  1. `DashboardHeader`: Personalized greeting ("Good Morning, <User>") and motivational hero banner ("YOU'RE IN THE PEAK ZONE TODAY").
  2. `ActiveWorkoutCard`: Direct overview and link to active assigned routine (for Clients).
  3. `WeeklyProgressCard`:
     - **Clients**: Dynamic 7-day "Volume Training" chart (Mon–Sun of current week) with live volume bars, active day indicator, and goal completion percentage.
     - **Trainers**: Dynamic 7-day "Client Activity" chart (Mon–Sun of current week) showing unique active contracted clients who trained each day, scaled against total contracted clients, with top-right weekly active client rate percentage.
  4. `StatStack` (3-card right-hand metric stack):
     - **Clients**: Weekly Volume (KG moved this week), Active Time (MINS trained this week), Daily Streak (consecutive training days).
     - **Trainers**: Total Clients (count of active contracted clients), Available Workouts (count of visible workout routines), Coming Soon (clean placeholder card with "—").
  5. `RecentActivity`: Overview of recent training sessions.
  6. `StartWorkoutButton`: Quick action button to trigger an active routine.

## Key files

- `src/components/layout/DashboardLayout.tsx`
- `src/components/dashboard/StatStack.tsx`
- `src/components/dashboard/WeeklyProgressCard.tsx`
- `src/components/dashboard/DashboardHeader.tsx`
- `src/components/dashboard/ActiveWorkoutCard.tsx`
- `src/components/dashboard/RecentActivity.tsx`
- `src/hooks/useAnalytics.ts`
- `src/hooks/useTrainerDashboard.ts`
- `src/services/api/analytics.ts`
- `src/services/api/dashboard.ts`
- `src/components/dashboard/StatStack.test.tsx`
- `src/components/dashboard/WeeklyProgressCard.test.tsx`

## Constraints and decisions

- Role-based separation: `isTrainer` renders "Client Activity" and Trainer metrics (`GET /dashboard/trainer`); `isClient` continues to render personal volume and athlete metrics (`GET /analytics/me`).
- Daily bar heights for Trainers scale proportionally against the trainer's total contracted clients (`(activeClients / Math.max(1, totalClients)) * 92%`).
- Coming Soon card in `StatStack` maintains vertical alignment with `WeeklyProgressCard` while reserving space for future trainer features.
- Card titles and icons in `StatStack` share a compact single row using space-between flex alignment.

## Changes made by current task

- Added `useTrainerDashboard` hook and `fetchTrainerDashboard` API client.
- Updated `WeeklyProgressCard` to support Trainers with the "Client Activity" 7-day chart, active client counts above bars, and active rate percentage.
- Updated `StatStack` for Trainers to display Total Clients, Available Workouts, and Coming Soon placeholder card.
- Added i18n keys for English and Spanish locales (`clientActivity`, `activeRate`, `totalClients`, `availableWorkouts`, `comingSoon`, `clients`, `workouts`).
- Added comprehensive unit tests in `WeeklyProgressCard.test.tsx` and `StatStack.test.tsx` verifying Trainer views.
