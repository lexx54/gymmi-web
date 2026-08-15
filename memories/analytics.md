# Analytics Module

## What it does

Static analytics dashboard with chart cards and hardcoded training metrics.

## Route

- `/analytics` → `AnalyticsPage`

## UI pieces

- `VolumeTrendsCard`
- `MuscleLoadCard`
- `ConsistencyHeatmapCard`
- `PersonalRecordsCard`
- Shell: `AnalyticsShell`

## Key files

- `src/pages/AnalyticsPage.tsx`
- `src/components/analytics/*`

## Constraints

- Explicitly static/mock metrics (SVG charts, hardcoded numbers).
- **UI-only.** No analytics API.
