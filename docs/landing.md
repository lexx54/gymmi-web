# Landing Page Module

## What the module currently does

The Landing Page (`/`) serves as the primary marketing, onboarding, and ecosystem showcase for Gymmi. It presents a unified view of the dual-platform architecture (Web Portal for Trainers, Mobile App for Clients), showcases core system capabilities (Routine Builder, Interactive Muscle Body Map, Active Workout execution, and Coach-to-Client pipeline), and displays role-based pricing plans (Free, Plus, and disabled Pro [Coming Soon]) with a monthly/annual billing frequency toggle.

## Main flows, files, and integration points

- **Root Routing**: Mounted at `/` in `src/App.tsx`. Accessible to both unauthenticated and authenticated visitors.
- **Dynamic Navigation Header (`LandingNavbar.tsx`)**:
  - Sticky glassmorphic navbar with smooth-scrolling anchors (`#features`, `#ecosystem`, `#pricing`, `#faq`).
  - Dynamic auth states: shows "Go to Dashboard" button when authenticated (`useAuth()`), or "Log In" (`/login`) and "Get Started" (`/signup`) buttons when unauthenticated.
  - Inline instant language toggle (EN / ES) leveraging `react-i18next`.
- **Interactive Hero Section (`HeroSection.tsx`)**:
  - Main value proposition: "Coaching Meets Execution. Elevate Every Rep."
  - Metrics strip highlighting curated exercises and live active session logging.
  - Interactive live workout card preview with checkable exercise sets and real-time active timer.
- **Tabbed Features Showcase (`FeaturesShowcase.tsx`)**:
  - Interactive tabs covering Routine Builder, Muscle Body Map (with live muscle group selector and exercise filtering), Active Workout Mode, and Coach-to-Client system.
- **Dual Audience Deep Dive (`AudienceDeepDive.tsx`)**:
  - Highlights specific workflows for Fitness Coaches (roster management, multi-week programs, custom exercises, routine sharing).
  - Highlights specific benefits for Athletes & Clients (mobile logging, coach oversight, solo routines, anatomical guidance).
- **Pricing & Plans Section (`PricingSection.tsx`)**:
  - Centralized plan configurations in `src/constants/pricing.constants.ts`.
  - Role switcher tab: "For Coaches & Trainers" vs "For Athletes & Clients".
  - Billing cadence switch: Monthly vs Annual (with 20% discount badge).
  - Accurately represents server-enforced quotas:
    - Trainer: Free (2 clients, 2 routines), Plus (8 clients, 8 routines, 5 custom exercises, template editing, routine sharing), Pro (Disabled, Coming Soon).
    - Client: Free (1 solo routine, 1 trainer), Plus (8 solo routines, 5 custom exercises, full history), Pro (Disabled, Coming Soon).
  - Informational disclaimer explaining that in-app self-serve checkout is in active development.
- **FAQ Section (`FAQSection.tsx`)**:
  - Interactive accordion addressing Covered Client status, Free vs Plus switching, mobile app availability, Gemini AI translation, and Pro tier launch.
- **Footer (`LandingFooter.tsx`)**:
  - Platform branding, quick links, language indicator, and copyright.

## Important implementation decisions & constraints

- **Public Access with Dynamic Navbar**: Authenticated users can freely visit `/` to review plan perks without being forcefully redirected to `/dashboard`, but receive an instant "Go to Dashboard" button in the header and hero CTA.
- **Role & Plan Fidelity**: Feature lists and quotas in pricing cards precisely match the backend `EntitlementsService` limits (`users.hasPaid`).
- **Pro Tier Gating**: The Pro plan is visually distinguished with a "Coming Soon" badge and a disabled CTA button (`disabled`, `aria-disabled="true"`), preventing broken checkout interactions while building anticipation.
- **Full Localization**: All strings, feature lists, pricing titles, and FAQs are localized under the `landing` namespace in both `src/i18n/locales/en.json` and `es.json`.

## Changes made by the current task

- Created `src/constants/pricing.constants.ts` for centralized pricing tiers.
- Added English and Spanish translation trees under `landing` in `en.json` and `es.json`.
- Built all modular landing components under `src/components/landing/`: `LandingNavbar`, `HeroSection`, `FeaturesShowcase`, `AudienceDeepDive`, `PricingSection`, `FAQSection`, `LandingFooter`.
- Created `src/pages/LandingPage.tsx` and mounted it at `/` in `src/App.tsx`.
- Added unit tests in `src/pages/LandingPage.test.tsx` (all 6 tests passing).
- Added Playwright end-to-end tests in `e2e/landing.spec.ts`.
