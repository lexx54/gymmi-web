# Privacy Policy Module

Public legal page holding Gymmi's Privacy Policy. It is also the privacy policy URL for the App Store (guideline 5.1.1) and Google Play (User Data policy) listings, and the account-deletion instructions page Google Play asks for.

## What it does

- Renders `/privacy` (`PrivacyPage`) for both signed-out and signed-in visitors. It sits outside `PublicRoute`/`PrivateRoute`.
- It is linked from the landing footer ("Privacy Policy" → `/privacy`) and referenced from Terms section 11.
- It shares the Terms page layout: sticky table of contents on desktop, 15 numbered sections, a contact card (`mailto:`), and an EN/ES toggle.
- Sections cover who we are, data collected, data not collected (no location, ads, tracking SDKs, health integrations), purposes, legal bases, what Trainers and Gyms can see, service providers (cloud hosting, Cloudflare R2, Google Gemini), retention, security, user rights, account deletion by email, children (minimum age), international transfers, changes, and contact.

## Key files

- `src/pages/PrivacyPage.tsx`
- `src/constants/legal.constants.ts`: shared with the Terms page (company name, contact email, jurisdiction, last-updated date, minimum age).
- `src/i18n/locales/en.json` / `es.json`: the `privacy` namespace (`privacy.sections` is an array read with `returnObjects`).
- `src/components/landing/LandingFooter.tsx`: footer link.

## Keeping it accurate

The copy describes what `gymmi-api` actually stores. Update it, and bump `LEGAL_CONFIG.lastUpdated`, when any of these change:

- New personal fields on `User`, `UserProfile`, `TrainerProfile`, `GymProfile`, or `Payment` (payments currently store payer phone and national ID number).
- What Trainers (`contracts`, `analytics`) or Gyms (`gyms.service.ts` member listing) can see about clients.
- New third parties: an email provider, push notifications, crash reporting, or analytics SDKs in the mobile app. The policy currently states there are none, which also drives the App Store privacy labels and the Play Data safety form.
- New upload folders in `storage.service.ts`.
- In-app account deletion. Sections 10 and 11 tell users to delete by email; update them when a delete endpoint exists.
