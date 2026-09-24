# Multi-Step Signup Module

Interactive multi-step registration slider with live validation, physical metric conversion, and review/confirmation step for Athletes and Trainers.

## What it does

- Guides users through a multi-step registration flow:
  - **Step 1 (Account Credentials & Role)**: Email, username, password, confirm password, and interactive role selector cards (Athlete / Personal Trainer).
  - **Step 2 (Physical Profile)**: Age, gender, height (with cm/ft live toggle, normalized to cm), weight (with kg/lbs live toggle, normalized to kg), fitness goals (preset chips + custom goal).
  - **Step 3 for Trainers (Coaching Profile)**: Services description, monthly rate ($ USD), specialization tags (preset chips + custom tag adder), and gym affiliations (up to 3 chips).
  - **Confirmation Step (Step 3 for Clients, Step 4 for Trainers)**: Complete breakdown cards with quick "Edit" jump links to amend any step, followed by the final "Confirm & Create Account" submission.
- Real-time step validation ensuring fields are complete and valid before advancing to subsequent steps.
- Handles rate-limit lockouts (429 status) with a 3-minute cooldown timer.

## Key files

- `src/pages/SignupPage.tsx`: Main component managing slider state, unit conversions, multi-step navigation, review cards, and mutation submission.
- `src/schemas/auth.ts`: Zod validation schemas for Step 1 (`createStep1Schema`), Step 2 (`createStep2Schema`), Trainer Step 3 (`createStep3TrainerSchema`), and full form (`createSignupSchema`).
- `src/types/auth.ts`: TypeScript types for `UserProfileParams`, `TrainerProfileParams`, and `SignupParams`.
- `src/services/api/auth.ts`: `signupApi` supporting the expanded payload.
- `src/i18n/locales/en.json` & `es.json`: Full bilingual translations for step indicators, form labels, units, goal chips, specialization presets, summary cards, and validation errors.
- `src/pages/SignupPage.test.tsx`: Comprehensive unit tests covering step transitions, role differences, edit navigation, validation errors, and mutation calls.

## Constraints and decisions

- **Step Pathing by Role**:
  - `Client`: Step 1 -> Step 2 -> Step 3 (Confirmation). Total steps = 3.
  - `Trainer`: Step 1 -> Step 2 -> Step 3 (Coaching) -> Step 4 (Confirmation). Total steps = 4.
- **Role-Aware Physical Profile**: Primary fitness goals (preset chips and custom text input) are only shown to and required for Athletes (Clients). For Personal Trainers, the goal field is omitted on Step 2 and excluded from the Physical Profile review card and submitted payload.
- **Unit Conversion**: Internal state stores height in cm and weight in kg to conform with backend API contracts, while presentation values dynamically convert between metric and imperial.
- **Confirmation Review**: The final confirmation step provides a clean summary review with dedicated Edit buttons that navigate back to the appropriate step without losing state.
- **Step-by-step Validation**: Each step transition validates only that step's fields using its dedicated Zod schema to avoid premature cross-step validation errors.

## Changes made by current task

- Implemented multi-step slider layout in `SignupPage.tsx` with animated step transitions.
- Added role selector cards with Athlete and Personal Trainer descriptions.
- Added unit toggles for height and weight.
- Added presets and custom input for goals, specialization tags, and gym affiliations.
- Implemented summary confirmation cards with quick "Edit" navigation.
- Added complete English and Spanish translations.
- Updated `src/pages/SignupPage.test.tsx` with 7 passing test suites covering all workflows.
