# Settings & Profile Module

Provides user profile inspection, physical body metric management, professional coaching credentials editing, and account configuration.

## What it does

- Renders the Settings & Profile page with role-dependent sections:
  1. **Profile Hero Card**: Displays user avatar initials, dynamic role status line ("Athlete" vs "Personal Trainer"), real bio (primary goal for athletes, services bio for trainers), and relevant tags (age/height/weight for athletes, rate & specializations for trainers).
  2. **Account Settings Card**: Displays real email, username, and role badge alongside security settings.
  3. **Physical Profile Card**: Replaces mock training metrics card. Displays Age, Gender, Height, Weight, and Fitness Goal with live `cm`/`ft` and `kg`/`lbs` toggles. Offers inline "Edit Profile" mode with live validation and mutation saving.
  4. **Coaching Profile Card (Trainers Only)**: Displayed exclusively for users with the `Trainer` role. Shows Monthly Rate ($ USD), Specializations, Gym Affiliations, and Services Bio. Offers inline "Edit Credentials" mode with preset chips, custom tag adder, gym chip manager, and services textarea.
  5. **Language & Data Cards**: Preferences and data management options.

## Key files

- `src/pages/SettingsPage.tsx`: Main page assembling hero, account, physical profile, coaching profile, and preferences.
- `src/components/settings/PhysicalProfileCard.tsx`: Card for viewing and editing physical metrics with unit conversions.
- `src/components/settings/CoachingProfileCard.tsx`: Card for viewing and editing trainer coaching credentials.
- `src/components/settings/ProfileHeroCard.tsx`: Hero card dynamically adapting to Client vs Trainer roles.
- `src/components/settings/AccountSettingsCard.tsx`: Account credentials and security controls.
- `src/services/api/user.ts`: API service with `fetchUserProfileApi` and `updateUserProfileApi`.
- `src/hooks/useUserProfile.ts`: React Query hooks `useUserProfile` and `useUpdateUserProfile`.
- `src/types/auth.ts`: Types for `FullUserProfile` and `UpdateProfilePayload`.
- `src/i18n/locales/en.json` & `es.json`: Full English and Spanish localization strings.

## Constraints and decisions

- **Role-Adaptive Layout**: `CoachingProfileCard` is conditionally rendered only when `role.name === 'Trainer'`. For Athletes (`Client`), it is completely omitted.
- **Inline Editing**: Instead of redirects or modals, cards switch between view and edit modes inline, preserving user context and flow.
- **Unit Conversions**: Toggling between `cm`/`ft` or `kg`/`lbs` updates the display on the fly and automatically normalizes to metric (`cm`, `kg`) before saving to the backend.

## Changes made by current task

- Created `PhysicalProfileCard.tsx` and `CoachingProfileCard.tsx` with view/edit states and live unit toggles.
- Created `useUserProfile` and `useUpdateUserProfile` hooks and `src/services/api/user.ts`.
- Updated `ProfileHeroCard.tsx` and `AccountSettingsCard.tsx` to display real authenticated profile data.
- Updated `SettingsPage.tsx` to replace mock training metrics card with `PhysicalProfileCard` and add `CoachingProfileCard` for trainers.
- Added comprehensive unit tests in `PhysicalProfileCard.test.tsx`, `CoachingProfileCard.test.tsx`, and updated `SettingsPage.test.tsx`.
- Synchronized English and Spanish translation keys.
