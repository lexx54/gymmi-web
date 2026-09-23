# Analytics Module

Web training analytics dashboard powered by the authoritative `/analytics` backend API.

## What it does

- Renders an athlete's comprehensive training analytics across 4 primary cards:
  1. `VolumeTrendsCard`: Live 4-week volume trend curve, total kg volume, and delta vs previous 4 weeks.
  2. `MuscleLoadCard`: Dynamic donut chart showing set distribution across database muscle types (`Lower Body`, `Upper Body`, `Arms`, `Core`) and total completed sets.
  3. `ConsistencyHeatmapCard`: Live 7x5 day intensity heatmap (duration-based tiers 0–4), day streak, completion percentage against planned routine days, and total workouts.
  4. `PersonalRecordsCard`: Top personal records list displaying max weight, dates, reps, and progression status pills (`ALL-TIME BEST`, `NEW PR`, `STEADY`).
- For Trainer users, includes a Client Selector dropdown to seamlessly toggle between "My Training" and any contracted client's training analytics.

## Route

- `/analytics` → `AnalyticsPage`

## Key files

- `src/pages/AnalyticsPage.tsx`
- `src/components/analytics/VolumeTrendsCard.tsx`
- `src/components/analytics/MuscleLoadCard.tsx`
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
- The `MuscleLoadCard` donut center uses flexbox column layout to keep the sets count and "SERIES" unit label vertically and horizontally centered inside the SVG donut hole.

## Recent Changes

- Fixed donut center alignment in `MuscleLoadCard.tsx`: Replaced multi-row grid layout on `DonutCenter` with a centered flex column (`display: flex; flex-direction: column; align-items: center; justify-content: center; pointer-events: none;`) to prevent the set count number and label from splitting across opposing edges of the donut hole.

