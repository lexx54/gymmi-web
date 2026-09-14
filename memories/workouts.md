# Workouts Module

## What it does

API-backed routine library, multi-day routine builder, role-aware sharing/assignment flows, and active client assignment display.

## Routes

| Path | Page |
|------|------|
| `/workout` | API-backed routine library |
| `/workout/new` | New routine builder |
| `/workout/:id` | Read-only routine detail |
| `/workout/:id/edit` | Creator-only routine editor (non-creators remain read-only) |
| `/workouts` | Redirect → `/workout` |

## Main flows

- Library: `GET /workouts`, functional name/description search, Mine/Assigned filters, ownership/read-only/assigned badges.
- Empty/status states use `NoRoutines` (loading, error, empty catalog, no-results), matching `NoExercises`: empty offers create; no-results offers clear filters.
- Builder: real exercise catalog, Monday–Sunday canvases, add/remove/reorder exercises and sets, editable weight/reps/rest seconds/RPE, fixed superset palette, validation, and create/update mutations. Adding a set uses default values; a second action copies the latest set. Both actions apply to every exercise in the same-day superset group.
- Builder layout: from 901px up, `LibraryPane` is sticky with `height: 0; min-height: 100%` so it matches the routine column height instead of driving the grid row, capped at `calc(100vh - 4rem)`; the exercise list scrolls inside it. Below 901px the pane keeps its `max-height: 25rem`. The category tab row sets `flex-shrink: 0` (it is an `overflow-x: auto` flex item, so it would otherwise collapse inside the bounded pane) plus vertical padding for the pill focus ring.
- Creator actions: detail, edit, and delete. Trainer creators can replace the trainer share list; trainers can assign visible routines to eligible clients.
- Client actions: self-assignment with WEEK/BIWEEK/MONTH/TRIMESTER/CUSTOM periods. The current assignment is highlighted in the library and dashboard.
- Dashboard: `ActiveWorkoutCard` links the single active client assignment to read-only detail.

## Key files

- `src/pages/WorkoutsPage.tsx`, `WorkoutLibraryPage.tsx`
- `src/components/workouts/*` (`NoRoutines`, `WorkoutsShell`, `ExerciseLibrary`, `ExerciseCard`, `RoutineToolbar`, `SetRow`, `StartFab`, etc.)
- `src/components/workouts/types.ts`
- `src/services/api/workouts.ts`, `src/hooks/useWorkouts.ts`
- `src/components/dashboard/ActiveWorkoutCard.tsx`

## Dependencies / integration

- Typed API supports routine CRUD, shares, trainer assignment, self-assignment, active assignment, and eligible user lists.
- React Query invalidates routine/detail and active-assignment caches after writes.
- API permission/payment failures remain authoritative; UI action visibility additionally follows role and routine ownership.
- Sidebar nav points to `/workout`.

## Constraints

- Existing routine reads do not include `shares`, so the share dialog cannot pre-populate current trainer shares. It states that saving replaces the complete list.
- A superset color must be used by at least two exercises on the same day.
- Builder cards use an internally scrollable set table on phones; page shells set `min-width: 0` and collapse to one column below 900px.
- `StartFab` / dashboard start workout control still have no workout-session execution API.

## Tests

- Vitest: workout API contract, editable/read-only `ExerciseCard` snapshot coverage, and `NoRoutines` empty/no-results actions.
- Playwright: trainer creator actions, 390px overflow regression, active client assignment, and read-only detail.
