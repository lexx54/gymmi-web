# Settings Module

## What it does

Static profile and preferences UI shell at `/settings`.

## Main flows

Renders profile hero, account settings, training metrics, data management, and footer. Values and toggles are hardcoded / non-functional.

## Key files

- `src/pages/SettingsPage.tsx`
- `src/components/settings/ProfileHeroCard.tsx`
- `src/components/settings/AccountSettingsCard.tsx`
- `src/components/settings/TrainingMetricsCard.tsx`
- `src/components/settings/DataManagementCard.tsx`
- `src/components/settings/SettingsFooter.tsx`
- `src/components/settings/SettingsShell.tsx`
- Colocated `*.test.tsx` for most cards

## Dependencies / integration

- Page uses layout with Sidebar; username comes from auth for the sidebar only.
- Profile hero shows fake profile data, not the authenticated user fields.

## Constraints

- **UI-only.** No settings API.
