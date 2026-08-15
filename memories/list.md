# List Data Module

## What it does

Generic React Query hook for public/reference list catalogs from `/list/*`.

## Main flows

- `useListData(resource)` → `GET /list/{resource}`
- Wrappers: `useListEquipments()` → `/list/equipments`, `useListMuscles()` → `/list/muscles`
- Consumed by `ExerciseBuilderPage` for dropdown options and activation-map suggestions

## Key files

- `src/hooks/useListData.ts` (+ `useListData.test.ts`)

## Shape / cache

- Item: `{ id, name, type, description }`
- `staleTime`: 10 minutes

## Constraints

- **Real API.** Relies on authenticated axios client (backend list routes are `@Public()`).
- No dedicated list UI page — data is used inside the exercise builder.

## E2E

- Playwright: `e2e/list.spec.ts` asserts builder muscle/equipment `<select>` options load from API.
