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
  - Subtitle explicitly incorporates coaches, dedicated athletes, and gym facilities.
- **Tabbed Features Showcase (`FeaturesShowcase.tsx`)**:
  - 6 interactive tabs covering:
    1. Routine Builder
    2. Muscle Body Map (with live muscle group selector and exercise filtering)
    3. Active Workout Mode
    4. Coach-to-Client system
    5. Strength Standards & Leaderboards
    6. Facility Console (with live command center preview showing member capacity progress, coach publishing badges, and curated routine catalog badge)
- **Tri-Role Audience Deep Dive (`AudienceDeepDive.tsx`)**:
  - Row 1: Fitness Coaches (roster management, multi-week programs, custom exercises, routine sharing).
  - Row 2: Athletes & Clients (mobile logging, coach oversight, solo routines, anatomical guidance).
  - Row 3: Gyms & Fitness Facilities (branded routine catalog, coach affiliation approvals with publishing toggles, member capacity monitoring, tier badges, and registration CTA).
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
  - Interactive accordion addressing Covered Client status, Free vs Plus switching, mobile app availability, Gemini AI translation, Pro tier launch, strength leaderboards, and Gym facility & studio capabilities.
- **Footer (`LandingFooter.tsx`)**:
  - Platform branding, quick links, language indicator, and copyright.

## Important implementation decisions & constraints

- **Public Access with Dynamic Navbar**: Authenticated users can freely visit `/` to review plan perks without being forcefully redirected to `/dashboard`, but receive an instant "Go to Dashboard" button in the header and hero CTA.
- **Role & Plan Fidelity**: Feature lists and quotas in pricing cards precisely match the backend `EntitlementsService` limits (`users.hasPaid`) and Gym facility membership limits.
- **Gym Role Parity**: Gym facilities are represented alongside Coaches and Athletes across all key landing sections: Hero subtitle, Features Showcase (Facility Console tab), Audience Deep Dive (Row 3 with capacity and coach publishing preview), Pricing plans (Plus, Pro, Maximum), and FAQ (dedicated facility Q&A).
- **Pro Tier Gating**: The Pro plan for coaches and athletes is visually distinguished with a "Coming Soon" badge and a disabled CTA button (`disabled`, `aria-disabled="true"`), preventing broken checkout interactions while building anticipation. Gym plans are active and link to `/signup` with a 30-day trial CTA for Gym Plus.
- **Full Localization**: All strings, feature lists, pricing titles, badges, and FAQs are localized under the `landing` namespace in both `src/i18n/locales/en.json` and `es.json`.

## Changes made by the current task

- **Gym Role Landing Page Showcase**:
  - **Features Showcase (`FeaturesShowcase.tsx`)**:
    - Added 6th tab: `Facility Console` (`facility`) with `Building2` icon.
    - Added feature descriptions for centralized catalog, coach permissions, capacity tracking, and cohort standards.
    - Designed realistic Facility Hub preview widget showing active member capacity bar (`74/100`), coach affiliations with `CAN PUBLISH` and `AFFILIATED` badges, and curated template catalog indicator.
  - **Audience Deep Dive (`AudienceDeepDive.tsx`)**:
    - Added Row 3: "For Gym Facilities" showcasing key studio benefits, direct registration CTA (`/signup`), and command center preview card.
  - **FAQ Section (`FAQSection.tsx`)**:
    - Added Question 7 explaining how Gymmi operates for gym facilities and boutique studios.
  - **Hero & Section Subtitles**:
    - Updated `landing.hero.subtitle` and `landing.features.subtitle` to explicitly include gym facilities and catalogs.
  - **Translations (`en.json`, `es.json`)**:
    - Added localized copy for all new facility features, audience highlights, and FAQ items in English and Spanish.
  - **Automated Tests (`LandingPage.test.tsx`)**:
    - Added test coverage verifying the Facility tab switch, audience deep dive gym row, and FAQ accordion interaction.
