# Hooks Module

## What it does

Cross-cutting React Query / mutation hooks that wrap API services for pages and components.

## Hooks

| Hook file | Purpose | Backend |
|-----------|---------|---------|
| `useAuthApi.ts` | Login / signup / forgot / reset mutations | Auth endpoints |
| `usePermissions.ts` | Current-user permission matrix + helpers | `GET /me/permissions` |
| `useListData.ts` | Reference catalogs | `GET /list/:resource` |
| `useExercises.ts` | List/get/create/update/delete + bulk CSV | `/exercises*` |
| `useTags.ts` | List/create visible tags | `/tags` |

## Pattern

- Queries for reads; mutations invalidate related query keys.
- Auth login goes through `AuthContext.signIn`; signup page uses `signupApi` via `useSignup` without auto-login.

## Key files

- `src/hooks/useAuthApi.ts`, `usePermissions.ts`, `useListData.ts`, `useExercises.ts`
- Tests: `useAuthApi.test.ts`, `usePermissions.test.ts`, `useListData.test.ts`

## Constraints

- No workout/settings/analytics hooks (those features are mock UI).
