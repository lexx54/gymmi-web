# Exercise Classifications & Strength Standards Module (Web)

Web console interface for Gym facilities and Personal Trainers to inspect strength tier classifications and leaderboards across their cohort by exercise and timeframe.

## What it does

- **Multi-Cohort Support (`/gym/classifications` & `/classifications`)**:
  - Displays the cohort leaderboard for Gym facilities (all active gym members) or Trainers (all contracted clients).
  - Shows cohort badge, total cohort athletes, and active participants for the selected exercise.
- **Timeframe Filtering**:
  - Pill selector for `Weekly` (current calendar week, Mon–Sun UTC), `Monthly` (current calendar month), and `All-Time`.
- **Core Lift Prioritization & Dynamic Selector**:
  - Primary quick-switch pills for the Big 4 compound lifts: Barbell Back Squat, Bench Press, Deadlift, Overhead Press.
  - Dropdown selector for any other exercise performed by athletes in the cohort.
- **Tier Distribution Progress Bar**:
  - Visual stacked segment bar showing percentage breakdown across strength standard tiers: Diamond, Platinum, Gold, Silver, Bronze, and Unranked.
  - Interactive legend with counts per tier.
- **Ranked Leaderboard Table**:
  - Podium medals (Gold #1, Silver #2, Bronze #3) and standard numbering for ranks #4+.
  - Tier badges styled with tier-specific accents (Diamond cyan, Platinum lavender, Gold amber, Silver slate, Bronze orange, Unranked gray).
  - Athlete username, avatar, Peak 1RM (kg), Best Set breakdown (weight lifted, reps, calculated 1RM, logged date).
  - Inactive / unranked members clearly displayed at the bottom with dashed rank indicator.

## Key files

- `src/types/classifications.ts`: TypeScript models (`StrengthTier`, `ClassificationEntry`, `ClassificationExerciseOption`, `TierDistribution`, `ClassificationsData`, `ClassificationsQueryParams`).
- `src/services/api/classifications.ts`: API client function `fetchClassifications()`.
- `src/hooks/useClassifications.ts`: React Query hook `useClassifications()`.
- `src/pages/classifications/ClassificationsPage.tsx`: Primary classifications and leaderboard page.
- `src/pages/classifications/ClassificationsPage.test.tsx`: Vitest & React Testing Library test suite.
- `src/components/layout/Sidebar.tsx`: Navigation items for Gyms (`/gym/classifications`) and Trainers (`/classifications`) with `Trophy` icon.
- `src/App.tsx`: Protected routes under `<RoleRoute role="Gym">` and `<RoleRoute role="Trainer">`.
- `src/i18n/locales/en.json` & `es.json`: Localized strings for classifications header, metrics, tiers, timeframes, and table headers.

## Constraints and decisions

- **Cohort Parameter Resolution**:
  - When logged in as `Gym`, `cohortType` is set to `'gym'` and `cohortId` uses the active facility ID from `useMyGym()`.
  - When logged in as `Trainer`, `cohortType` is set to `'trainer'` and `cohortId` uses the trainer's user ID.
- **Zero-Log Members**: All members in the cohort are rendered; members without logged sets for the selected exercise appear as `Unranked` with `rank: null` at the bottom.
- **Core Lifts Priority**: Core exercises default to the first available core lift if no specific exercise is selected in query state.

## Changes made by current task

- Implemented `ClassificationsPage` with core lift pills, exercise dropdown, timeframe toggles, tier distribution bar, and ranked table.
- Added classifications API service (`src/services/api/classifications.ts`) and hook (`useClassifications.ts`).
- Created unit tests in `ClassificationsPage.test.tsx` verifying Gym and Trainer cohorts, exercise switching, and timeframe filtering.
- Updated `Sidebar.tsx` and `App.tsx` navigation and routing.
- Localized all UI text in English and Spanish.
