# Client Dashboard Module

Web dashboard delivering athlete workout metrics, active routine overview, weekly volume breakdown, and recent activity.

## What it does

- Renders the primary dashboard for authenticated Client athletes:
  1. `DashboardHeader`: Personalized greeting and hero motivation banner.
  2. `ActiveWorkoutCard`: Direct link to current active assigned routine with dates and exercise count.
  3. `WeeklyProgressCard`: Dynamic 7-day volume chart (Mon–Sun of current week) with live volume bars, active day indicator, and goal completion percentage.
  4. `RecentActivity`: Overview of recent training sessions.
  5. `StatStack`: Right-column 3-card stack displaying real training metrics:
     - **Weekly Volume**: Total KG moved in current week (Dumbbell icon).
     - **Active Time**: Total minutes trained this week (Timer icon).
     - **Daily Streak**: Current consecutive days of training (Flame icon).
  6. `StartWorkoutButton`: Quick action button to trigger an active routine.

## Key files

- `src/components/layout/DashboardLayout.tsx`
- `src/components/dashboard/StatStack.tsx`
- `src/components/dashboard/WeeklyProgressCard.tsx`
- `src/components/dashboard/DashboardHeader.tsx`
- `src/components/dashboard/ActiveWorkoutCard.tsx`
- `src/components/dashboard/RecentActivity.tsx`
- `src/hooks/useAnalytics.ts`
- `src/services/api/analytics.ts`
- `src/components/dashboard/StatStack.test.tsx`
- `src/components/dashboard/WeeklyProgressCard.test.tsx`

## Constraints and decisions

- Uncollected mock metrics (Calories and Hydration) have been removed in favor of authentic collected training metrics (Weekly Volume, Active Time, and Daily Streak).
- Trainer/Admin dashboard modifications are intentionally deferred per product direction; changes currently target Client experience.
- The 7 daily bars in `WeeklyProgressCard` use responsive `BarTrack` flex containers to ensure bar heights scale visibly and proportionally against the peak day's volume.

## Changes made by current task

- Updated `StatStack` to replace static Calories and Hydration cards with live Weekly Volume (KG) and Daily Streak alongside Active Time (MINS).
- Connected `WeeklyProgressCard` to `useMyAnalytics` to display live Mon–Sun daily volume bars with peak scaling and goal completion %.
- Added `useMyAnalytics` hook in `src/hooks/useAnalytics.ts`.
- Added unit tests in `StatStack.test.tsx` and `WeeklyProgressCard.test.tsx`.
- Enhanced `WeeklyProgressCard` styling so any completed day with volume renders with the primary coral/red gradient and glow, while the active day shows a subtle dashed indicator if volume is yet to be logged for today.

