# Layout & Navigation Bar Module

Provides the persistent application shell, sidebar navigation, and standardized top header bar across all web application views.

## What it does

- Renders a standardized `<TopBar title={...} actions={...} />` across all authenticated sections:
  1. **Title Section (Left)**: Renders the section title using `'Plus Jakarta Sans'`, bold weight, with clean responsive scaling on smaller viewports. When omitted (e.g. on the Main Dashboard), the left space collapses gracefully into a spacer.
  2. **Actions Slot (Right)**: Allows page-specific utility buttons (such as "+ Create Routine", "+ Create Exercise", or custom filters) to be positioned neatly alongside global controls.
  3. **Language Toggle Pill (Right)**: Global segmented pill control with `EN | ES` toggle. Displays active language state (`#313349` on `#181a2e`) and dynamically invokes `setAppLanguage` from `src/i18n`.
- Replaces legacy heterogeneous header bars and duplicate `HeaderRow` / `SettingsPageTitle` declarations with a single, uniform component.

## Key files

- `src/components/layout/TopBar.tsx`: Core standardized top header component with title and language toggle.
- `src/components/layout/TopBar.test.tsx`: Comprehensive unit test suite covering title rendering, custom React node titles, action slots, language selection, and click handlers.
- `src/components/layout/Sidebar.tsx`: Persistent left navigation sidebar.
- `src/components/layout/DashboardLayout.tsx`: Shell for the main dashboard (renders `<TopBar />` without a title above the hero greeting).
- `src/i18n/index.ts`: Application internationalization configuration and language persistence (`gymmi.language`).

## Adopted Pages

- `SettingsPage.tsx`: `<TopBar title={t('settings.title')} />`
- `BillingPage.tsx`: `<TopBar title={t('billing.pageTitle', 'Subscription & Billing')} />`
- `AnalyticsPage.tsx`: `<TopBar title={t('nav.analytics')} />`
- `TrainersPage.tsx`: `<TopBar title={t('nav.trainers')} />`
- `ClientsPage.tsx`: `<TopBar title={selected ? selected.client.username : t('nav.clients')} />`
- `ClassificationsPage.tsx`: `<TopBar title={t('classifications.title')} />`
- `ArticlesPage.tsx`: `<TopBar title={t('nav.articles')} />`
- `GymArticlesPage.tsx`: `<TopBar title={t('gym.articles.title')} />`
- `GymCatalogPage.tsx`: `<TopBar title={t('gym.catalog.title')} />`
- `GymMembersPage.tsx`: `<TopBar title={t('gym.members.title')} />`
- `GymCoachesPage.tsx`: `<TopBar title={t('gym.coaches.title')} />`
- `ExercisesPage.tsx`: `<TopBar title={t('nav.exercises')} actions={...} />`
- `ExerciseBuilderPage.tsx`: `<TopBar title={...} />`
- `WorkoutLibraryPage.tsx`: `<TopBar title={t('nav.workouts')} actions={...} />`
- `AdminUsersPage.tsx`: `<TopBar title={t('admin.userManagement')} />`
- `AdminPaymentsPage.tsx`: `<TopBar title={t('admin.payments.pageTitle')} />`
- `AdminPermissionsPage.tsx`: `<TopBar title={t('admin.rolePermissions')} />`

## Constraints and decisions

- **TopBar Controls Composition**: Placeholder notification bell and avatar dots were removed in favor of a clean, dedicated segmented language toggle pill (`EN | ES`).
- **Standardized Spacing & Padding**: Standardized all main view containers (`<main>`) to `padding: 1.4rem 2rem 2.5rem;` (dropping to `1rem` on `< 640px` viewports) across `ExercisesShell`, `ArticlesPage`, `ClassificationsPage`, `WorkoutLibraryPage`, and all `Gym*` pages to match `AnalyticsPage`, `BillingPage`, and `SettingsPage`.
- **Consistent Title Sizing**: Titles across all pages use clean, single translation strings rendered by `TopBar`'s `TitleHeading` (`1.6rem`, font-weight 700, `'Plus Jakarta Sans'`), eliminating oversized titles (e.g. previously on `ArticlesPage` at 1.85rem with bulky subtitles).
- **Dashboard Separation**: Main Dashboard renders `<TopBar />` without a title so the language toggle sits flush on the top right, preserving the visual impact of the personalized hero greeting below.
- **Single Source for Language Preferences**: The redundant `LanguageSettingsCard` was removed from `SettingsPage` since language switching is now accessible globally from any page via the top bar.

## Changes made by current task

- Refactored `TopBar.tsx` into a standardized top bar accepting `title` and `actions` props, containing a segmented `[EN | ES]` language toggle pill.
- Standardized top headers across all user, gym, catalog, and admin pages.
- Fixed 0-spacing issue on `ExercisesShell` (affecting `ExercisesPage`, `AdminUsersPage`, `AdminPaymentsPage`, `AdminPermissionsPage`) by applying `padding: 1.4rem 2rem 2.5rem;` to `ExercisesMain` and resetting outer content margins.
- Fixed oversized titles on `ArticlesPage` and `ClassificationsPage`, bringing them into conformity with `Analytics`, `Billing`, and `Settings`.
- Moved primary action buttons on `ExercisesPage` (Bulk CSV & Create Exercise) and `WorkoutLibraryPage` (Create Routine) into `TopBar actions={...}` and removed redundant second title rows.
- Removed redundant `LanguageSettingsCard` from `SettingsPage.tsx`.
- Added unit test suite in `TopBar.test.tsx` (7 passing tests).
- Verified full test suite (194 tests passing across 46 test files) and production bundle build.
