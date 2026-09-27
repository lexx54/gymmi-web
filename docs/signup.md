# Multi-Step Signup Module

Interactive multi-step registration slider with live validation, physical metric conversion, and review/confirmation step for Athletes, Trainers, and Gyms.

## What it does

- Guides users through a multi-step registration flow:
  - **Step 1 (Account Credentials & Role)**: Email, username, password, confirm password, interactive role selector cards (Athlete / Personal Trainer / Gym), optional profile photo uploader (all users), and optional trainer logo / gym logo uploader.
  - **Step 2 (Physical Profile for Athlete/Trainer)**: Age, gender, height (with cm/ft live toggle, normalized to cm), weight (with kg/lbs live toggle, normalized to kg), fitness goals (preset chips + custom goal).
  - **Step 2 (Facility Profile for Gyms)**: Facility name, description, address, city, website, phone number, amenities selector (preset chips + custom chips), and facility cover image. Displays 30-Day Free Trial (100 members capacity) onboarding banner.
  - **Step 3 for Trainers (Coaching Profile)**: Services description, monthly rate ($ USD), specialization tags (preset chips + custom tag adder), and gym affiliations (up to 3 chips).
  - **Confirmation Step (Step 3 for Clients & Gyms, Step 4 for Trainers)**: Complete breakdown cards including photo/logo thumbnail previews with quick "Edit" jump links to amend any step, followed by the final "Confirm & Create Account" submission.
- Direct Cloudflare R2 image upload: Client compresses images using canvas (<1024x1024, ~0.82 quality), obtains presigned S3 PUT URL via `POST /auth/presigned-url`, and uploads binary directly with progress spinners and remove capabilities.
- Real-time step validation ensuring fields are complete and valid before advancing to subsequent steps.
- Handles rate-limit lockouts (429 status) with a 3-minute cooldown timer.

## Key files

- `src/pages/SignupPage.tsx`: Main component managing slider state, unit conversions, image uploads, multi-step navigation, review cards, and mutation submission.
- `src/utils/imageUpload.ts`: Utility for client-side image compression (`compressImage`) and direct PUT upload to Cloudflare R2 via presigned URLs (`uploadImageDirectly`).
- `src/schemas/auth.ts`: Zod validation schemas for Step 1 (`createStep1Schema`), Step 2 (`createStep2Schema`, `createStep2GymSchema`), Trainer Step 3 (`createStep3TrainerSchema`), and full form (`createSignupSchema`).
- `src/types/auth.ts`: TypeScript types for `UserProfileParams`, `TrainerProfileParams`, `GymProfileParams`, `AuthUser`, and `SignupParams` supporting `avatarUrl`, `logoUrl`, and `gymProfile`.
- `src/services/api/auth.ts`: `signupApi` supporting the expanded payload, and `getPresignedUrlApi`.
- `src/i18n/locales/en.json` & `es.json`: Full bilingual translations for step indicators, form labels, units, goal chips, specialization presets, summary cards, photo/logo uploaders, gym facility details, and validation errors.
- `src/pages/SignupPage.test.tsx`: Comprehensive unit tests covering step transitions, role differences (including Gym registration), image upload and preview, edit navigation, validation errors, and mutation calls.

## Constraints and decisions

- **Step Pathing by Role**:
  - `Client`: Step 1 -> Step 2 (Physical) -> Step 3 (Confirmation). Total steps = 3.
  - `Trainer`: Step 1 -> Step 2 (Physical) -> Step 3 (Coaching) -> Step 4 (Confirmation). Total steps = 4.
  - `Gym`: Step 1 -> Step 2 (Facility Details & Amenities) -> Step 3 (Confirmation). Total steps = 3.
- **Gym Physical Metrics Omission**: Gym organizations do not collect personal biometric info (age, gender, height, weight, fitness goals). Only facility name and optional details (address, city, phone, website, amenities, cover image) are submitted under `gymProfile`.
- **Client-Side Image Resizing**: Uploaded images are resized on a hidden canvas down to max 1024x1024 at ~0.82 quality to guarantee fast upload speeds and modest storage usage.
- **Direct Presigned PUT URLs**: Images bypass the web server and the backend API server, streaming directly to Cloudflare R2 via presigned URLs obtained from `POST /auth/presigned-url`. Authorization headers are stripped during R2 upload to preserve S3 signature validity.
- **Confirmation Review**: The final confirmation step provides a clean summary review with dedicated Edit buttons that navigate back to the appropriate step without losing state.
- **Step-by-step Validation**: Each step transition validates only that step's fields using its dedicated Zod schema to avoid premature cross-step validation errors.

## Changes made by current task

- Added 3rd role option (`Gym`) to Step 1 with building icon and gym logo upload support.
- Added dedicated Step 2 for Gym role with 30-Day Free Trial banner, facility details, and amenities chips.
- Added Gym confirmation summary card with edit jump link.
- Added `createStep2GymSchema(t)` and integrated into `createSignupSchema(t)`.
- Added unit tests in `SignupPage.test.tsx` verifying Gym signup flow.
