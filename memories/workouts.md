# Workouts Module

## What it does

Routine library browser and routine builder UI. Entirely client-side mock data — no backend workouts API.

## Routes

| Path | Page |
|------|------|
| `/workout` | `WorkoutLibraryPage` (static routine/protocol cards) |
| `/workout/new` | `WorkoutsPage` (local routine builder) |
| `/workouts` | Redirect → `/workout/new` |

## Main flows

- Library: hardcoded routine cards; filters/search are non-functional; Play navigates to `/workout/new`.
- Builder: hardcoded `LIBRARY_EXERCISES` + `INITIAL_ROUTINE` in component state; add/remove sets and edit weight/reps/RPE locally; no save/submit.

## Key files

- `src/pages/WorkoutsPage.tsx`, `WorkoutLibraryPage.tsx`
- `src/components/workouts/*` (`WorkoutsShell`, `ExerciseLibrary`, `ExerciseCard`, `RoutineToolbar`, `SetRow`, `StartFab`, etc.)
- `src/components/workouts/types.ts`

## Dependencies / integration

- No `services/api/workouts.ts` and no workout API calls.
- RBAC type includes `workouts` resource but this UI does not enforce it.
- Sidebar nav points to `/workout`.

## Constraints

- Exercise library shows a large total count but only a few hardcoded exercises.
- `StartFab` / dashboard start workout control have no real session start flow.
- **100% mock / local state.**
