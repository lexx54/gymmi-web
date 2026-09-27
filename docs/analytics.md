# Analytics Module

Web training analytics dashboard powered by the authoritative `/analytics` backend API.

## What it does

- Renders an athlete's comprehensive training analytics across 3 primary layout tiers:
  1. `MuscleLoadCard` (Top, Full Width): Responsive horizontal bar chart displaying sets, percentage, and distinct exercise count across specific muscle groups (`Chest`, `Back`, `Legs`, `Shoulders`, `Arms`, `Core`).
  2. `SplitGrid` (Middle, 50% / 50% Split):
     - `VolumeTrendsCard`: Live 4-week volume trend curve, total kg volume, and delta vs previous 4 weeks.
     - `ConsistencyHeatmapCard`: Live 7x5 day intensity heatmap (duration-based tiers 0–4), day streak, completion percentage against planned routine days, and total workouts.
  3. `PersonalRecordsCard` (Bottom): Top personal records list displaying max weight, dates, reps, and progression status pills (`ALL-TIME BEST`, `NEW PR`, `STEADY`).
- For Trainer users, includes a Client Selector dropdown to seamlessly toggle between "My Training" and any contracted client's training analytics.

## Route

- `/analytics` → `AnalyticsPage`

## Key files

- `src/pages/AnalyticsPage.tsx`
- `src/components/analytics/MuscleLoadCard.tsx`
- `src/components/analytics/VolumeTrendsCard.tsx`
- `src/components/analytics/ConsistencyHeatmapCard.tsx`
- `src/components/analytics/PersonalRecordsCard.tsx`
- `src/components/analytics/AnalyticsShell.tsx`
- `src/services/api/analytics.ts`
- `src/pages/AnalyticsPage.test.tsx`
- `e2e/analytics.spec.ts`

## Constraints and decisions

- Trainer client roster is loaded from `/contracts/clients` and gates the client picker.
- Empty states are provided for athletes with no recorded sessions or personal records.
- React Query manages cache and loading states.
- `MuscleLoadCard` uses a 2-column responsive grid on desktop and 1-column on mobile/tablet. For each muscle group, it displays a color indicator dot, muscle name, exercise count pill (`X exercises`), sets count, percentage, and an animated progress bar track.
- `SplitGrid` divides `VolumeTrendsCard` and `ConsistencyHeatmapCard` equally into 50% / 50% on desktop (`repeat(2, minmax(0, 1fr))`) and collapses to a single column on tablet/mobile screens (<= 1024px).

## Recent Changes

- **Layout Rearrangement & Muscle Load Chart**:
  - Moved `MuscleLoadCard` to the top taking full width (100%).
  - Replaced SVG donut chart with a responsive horizontal bar chart with colored tracks.
  - Enhanced backend (`gymmi-api`) `computeMuscleLoad` to classify sets and track distinct exercise counts into specific muscle groups (`chest`, `back`, `legs`, `shoulders`, `arms`, `core`).
  - Added `exercisesCount` to `MuscleSegmentDto` and `MuscleSegment`.
  - Grouped `VolumeTrendsCard` and `ConsistencyHeatmapCard` side-by-side in `SplitGrid` sharing 50% / 50% width.
