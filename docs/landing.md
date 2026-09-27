# Landing Page Module

## What the module currently does

The Landing Page (`/`) serves as the primary marketing, onboarding, and ecosystem showcase for Gymmi. It presents a unified view of the dual-platform architecture (Web Portal for Trainers & Gyms, Mobile App for Clients), showcases core system capabilities (Routine Builder, Interactive Muscle Body Map, Active Workout execution, Coach-to-Client pipeline, and Facility Catalog & Strength Standards), and displays role-based pricing plans across Trainers, Clients, and Gym Facilities with a monthly/annual billing frequency toggle.

## Main flows, files, and integration points

- **Root Routing**: Mounted at `/` in `src/App.tsx`. Accessible to both unauthenticated and authenticated visitors.
- **Dynamic Navigation Header (`LandingNavbar.tsx`)**:
  - Sticky glassmorphic navbar with smooth-scrolling anchors (`#features`, `#ecosystem`, `#pricing`, `#faq`).
  - Dynamic auth states: shows "Go to Dashboard" button when authenticated (`useAuth()`), or "Log In" (`/login`) and "Get Started" (`/signup`) buttons when unauthenticated.
  - Inline instant language toggle (EN / ES) leveraging `react-i18next`.
- **Interactive Hero Section (`HeroSection.tsx`)**:
  - Main value proposition: "Coaching Meets Execution. Elevate Every Rep."
  - Metrics strip highlighting curated exercises, strength leaderboards, and live active session logging.
  - Interactive live workout card preview with checkable exercise sets and real-time active timer.
- **Tabbed Features Showcase (`FeaturesShowcase.tsx`)**:
  - Interactive tabs covering Routine Builder, Muscle Body Map (with live muscle group selector and exercise filtering), Active Workout Mode, Coach-to-Client system, and Strength Standards & Leaderboards.
- **Dual Audience Deep Dive (`AudienceDeepDive.tsx`)**:
  - Highlights specific workflows for Fitness Coaches (roster management, multi-week programs, custom exercises, routine sharing).
  - Highlights specific benefits for Athletes & Clients (mobile logging, coach oversight, solo routines, anatomical guidance).
- **Pricing & Plans Section (`PricingSection.tsx`)**:
  - Centralized plan configurations in `src/constants/pricing.constants.ts`.
  - 3-way role switcher tabs: "For Coaches & Trainers", "For Athletes & Clients", and "For Gym Facilities".
  - Billing cadence switch: Monthly vs Annual (with 20% discount badge).
  - Accurately represents quotas and rates:
    - Trainer: Free ($0/mo, 2 clients, 2 routines), Plus ($3.99/mo or $3.19/mo billed annually, 8 clients, 8 routines, 5 custom exercises, template editing, routine sharing), Pro ($6.99/mo or $5.59/mo billed annually, unlimited clients/templates, disabled/Coming Soon).
    - Client: Free ($0/mo, 1 solo routine, 1 trainer), Plus ($1.99/mo or $1.59/mo billed annually, 8 solo routines, 5 custom exercises, full history), Pro ($2.99/mo or $2.39/mo billed annually, unlimited routines/exercises, disabled/Coming Soon).
    - Gym Facility: Plus ($25/mo or $20/mo billed annually, up to 100 members, curated routines, coach affiliations, 30-day free trial), Pro ($50/mo or $40/mo billed annually, up to 300 members, retention analytics, Most Popular), Maximum ($100/mo or $80/mo billed annually, unlimited members/coaches/routines, dedicated onboarding).
  - Decimal-aware price formatting supporting whole numbers without `.00` and precision cents for discounted rates.
  - Informational disclaimer explaining that in-app self-serve checkout is in active development.
- **FAQ Section (`FAQSection.tsx`)**:
  - Interactive accordion addressing Covered Client status, Free vs Plus switching, mobile app availability, Gemini AI translation, and Pro tier launch.
- **Footer (`LandingFooter.tsx`)**:
  - Platform branding, quick links, language indicator, and copyright.

## Important implementation decisions & constraints

- **Public Access with Dynamic Navbar**: Authenticated users can freely visit `/` to review plan perks without being forcefully redirected to `/dashboard`, but receive an instant "Go to Dashboard" button in the header and hero CTA.
- **Role & Plan Fidelity**: Feature lists and quotas in pricing cards precisely match the backend `EntitlementsService` limits (`users.hasPaid`) and Gym facility membership limits.
- **Pro Tier Gating**: The Pro plan for coaches and athletes is visually distinguished with a "Coming Soon" badge and a disabled CTA button (`disabled`, `aria-disabled="true"`), preventing broken checkout interactions while building anticipation. Gym plans are active and link to `/signup` with a 30-day trial CTA for Gym Plus.
- **Full Localization**: All strings, feature lists, pricing titles, badges, and FAQs are localized under the `landing` namespace in both `src/i18n/locales/en.json` and `es.json`.

## Changes made by the current task

- **Gym Pricing & Rates Update**:
  - Configured Gym Facility pricing tiers in `src/constants/pricing.constants.ts`:
    - Plus: $25 monthly ($20 annual) with 30-day free trial badge.
    - Pro: $50 monthly ($40 annual) with Most Popular badge.
    - Maximum: $100 monthly ($80 annual).
  - Updated Coach and Athlete pricing in `src/constants/pricing.constants.ts`:
    - Coach Plus: $3.99 monthly ($3.19 annual).
    - Coach Pro: $6.99 monthly ($5.59 annual).
    - Athlete Plus: $1.99 monthly ($1.59 annual).
    - Athlete Pro: $2.99 monthly ($2.39 annual).
  - Extended `PricingSection.tsx`:
    - Added 3rd role switcher tab for Gym Facilities (`tabGym`).
    - Added decimal-aware pricing formatter (`Number.isInteger(price) ? price : price.toFixed(2)`).
    - Added `TrialBadge` with cyan gradient alongside `PopularBadge` and `ComingSoonBadge`.
    - Integrated dynamic card highlighting for Most Popular tier across all roles.
  - Added full English and Spanish translations for gym pricing cards, features, and badges in `en.json` and `es.json`.
  - Extended unit tests in `src/pages/LandingPage.test.tsx` validating gym role tab switching, new rates, trial badges, and annual discount calculations.
