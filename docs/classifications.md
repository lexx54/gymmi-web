# Exercise Classifications & Strength Standards Module (Web)

Web console interface for Gym facilities and Personal Trainers to inspect strength tier classifications and leaderboards across their cohort by exercise and timeframe.

## What it does

- **Multi-Cohort Support (`/gym/classifications` & `/classifications`)**:
  - Displays the cohort leaderboard for Gym facilities (all active gym members) or Trainers (all contracted clients).
  - Shows cohort badge, total cohort athletes, and active participants for the selected exercise.
- **Timeframe Filtering**:
  - Pill selector for `Weekly` (current calendar week, Mon–Sun UTC), `Monthly` (current calendar month), and `All-Time`.
- **Exercise Selection Dropdown**:
  - Unified exercise `<select>` dropdown (`data-testid="exercise-select"`) with icon and chevron indicator.
  - Replaced the large multi-row grid of individual exercise pills and separate "other exercises" select with a single clean, categorized dropdown.
  - Organizes exercises into `<optgroup>`s (Main Lifts / Other Exercises) when both are present, avoiding UI clutter.
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
- `src/pages/classifications/ClassificationsPage.tsx`: Primary classifications and leaderboard page with timeframe toggles, unified exercise select dropdown, tier distribution bar, and ranked table.
- `src/pages/classifications/ClassificationsPage.test.tsx`: Vitest & React Testing Library test suite.
- `src/components/layout/Sidebar.tsx`: Navigation items for Gyms (`/gym/classifications`) and Trainers (`/classifications`) with `Trophy` icon.
- `src/App.tsx`: Protected routes under `<RoleRoute role="Gym">` and `<RoleRoute role="Trainer">`.
- `src/i18n/locales/en.json` & `es.json`: Localized strings for classifications header, metrics, tiers, timeframes, and table headers.

## Constraints and decisions

- **Cohort Parameter Resolution**:
  - When logged in as `Gym`, `cohortType` is set to `'gym'` and `cohortId` uses the active facility ID from `useMyGym()`.
  - When logged in as `Trainer`, `cohortType` is set to `'trainer'` and `cohortId` uses the trainer's user ID.
- **Exercise Selector Usability**:
  - Rather than rendering dozens of buttons across multiple rows that clutter the interface when many exercises exist in a facility, a single styled dropdown select allows clean and rapid switching with optgroup organization.
- **Zero-Log Members**: All members in the cohort are rendered; members without logged sets for the selected exercise appear as `Unranked` with `rank: null` at the bottom.
- **Core Lifts Priority**: Core exercises default to the first available core lift if no specific exercise is selected in query state.

## Changes made by current task

- Replaced the multi-row exercise pills grid and separate "Otros ejercicios..." selector with a single, unified styled `<select>` dropdown (`data-testid="exercise-select"`).
- Added optgroup categorization for Main Lifts vs Other Exercises with Dumbbell and ChevronDown icons.
- Updated `ClassificationsPage.test.tsx` to verify switching exercises via the select dropdown.
- Verified test suite passes 100% across all 40 test files in `gymmi-web`.
