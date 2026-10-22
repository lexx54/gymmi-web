# Terms of Service Module

Public legal page holding Gymmi's Terms of Service. It is also the Terms / EULA URL for the App Store and Google Play listings.

## What it does

- Renders `/terms` (`TermsPage`) for both signed-out and signed-in visitors. It sits outside `PublicRoute`/`PrivateRoute`.
- It is linked from the landing footer ("Terms of Service" → `/terms`).
- It has a sticky table of contents on desktop, 20 numbered sections, a contact card (`mailto:`), and an EN/ES toggle.
- Sections cover acceptance, eligibility (minimum age), accounts, the service, a health and fitness disclaimer, trainers/gyms as independent third parties, plans and manual payments (web only, no in-app purchase), user content license, zero-tolerance community rules and reporting, third-party services (Cloudflare R2, Google Gemini), privacy, account deletion, IP, app-store clauses (Apple's minimum EULA terms), disclaimers, liability, indemnity, changes, governing law, and contact.

## Key files

- `src/pages/TermsPage.tsx`
- `src/constants/legal.constants.ts`: company name, contact email, jurisdiction, last-updated date, and minimum age. Copy is interpolated from these values.
- `src/i18n/locales/en.json` / `es.json`: the `terms` namespace (`terms.sections` is an array read with `returnObjects`).
- `src/components/landing/LandingFooter.tsx`: footer link.

## Constraints

- When the Terms text changes, bump `LEGAL_CONFIG.lastUpdated`.
- Keep `LEGAL_CONFIG.minimumAge` in sync with the signup schema (`src/schemas/auth.ts`, currently 14).
- Section 12 (`termination`) describes self-service account deletion (app: Profile → Delete account; web: Settings → Delete account, reachable without the app as Google Play requires) and keeps email to the contact address as a fallback for users who can't sign in. Keep it in sync with `DELETE /user/me` (see `gymmi-api/docs/profile.md`).
- Section 9 (`conduct`) describes in-app Report / Block (see `docs/moderation.md`) with email as a fallback.
