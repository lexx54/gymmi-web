# Multi-Step Signup Module

Interactive multi-step registration slider with live validation, physical metric conversion, and review/confirmation step for Athletes and Trainers.

## What it does

- Guides users through a multi-step registration flow:
  - **Step 1 (Account Credentials & Role)**: Email, username, password, confirm password, interactive role selector cards (Athlete / Personal Trainer), optional profile photo uploader (all users), and optional trainer logo uploader (Personal Trainers only).
  - **Step 2 (Physical Profile)**: Age, gender, height (with cm/ft live toggle, normalized to cm), weight (with kg/lbs live toggle, normalized to kg), fitness goals (preset chips + custom goal).
  - **Step 3 for Trainers (Coaching Profile)**: Services description, monthly rate ($ USD), specialization tags (preset chips + custom tag adder), and gym affiliations (up to 3 chips).
  - **Confirmation Step (Step 3 for Clients, Step 4 for Trainers)**: Complete breakdown cards including photo/logo thumbnail previews with quick "Edit" jump links to amend any step, followed by the final "Confirm & Create Account" submission.
- Direct Cloudflare R2 image upload: Client compresses images using canvas (<1024x1024, ~0.82 quality), obtains presigned S3 PUT URL via `POST /auth/presigned-url`, and uploads binary directly with progress spinners and remove capabilities.
- Real-time step validation ensuring fields are complete and valid before advancing to subsequent steps.
- Handles rate-limit lockouts (429 status) with a 3-minute cooldown timer.

## Key files

- `src/pages/SignupPage.tsx`: Main component managing slider state, unit conversions, image uploads, multi-step navigation, review cards, and mutation submission.
- `src/utils/imageUpload.ts`: Utility for client-side image compression (`compressImage`) and direct PUT upload to Cloudflare R2 via presigned URLs (`uploadImageDirectly`).
- `src/schemas/auth.ts`: Zod validation schemas for Step 1 (`createStep1Schema`), Step 2 (`createStep2Schema`), Trainer Step 3 (`createStep3TrainerSchema`), and full form (`createSignupSchema`).
- `src/types/auth.ts`: TypeScript types for `UserProfileParams`, `TrainerProfileParams`, `AuthUser`, and `SignupParams` supporting `avatarUrl` and `logoUrl`.
- `src/services/api/auth.ts`: `signupApi` supporting the expanded payload, and `getPresignedUrlApi`.
- `src/i18n/locales/en.json` & `es.json`: Full bilingual translations for step indicators, form labels, units, goal chips, specialization presets, summary cards, photo/logo uploaders, and validation errors.
- `src/pages/SignupPage.test.tsx`: Comprehensive unit tests covering step transitions, role differences, image upload and preview, edit navigation, validation errors, and mutation calls.

## Constraints and decisions

- **Step Pathing by Role**:
  - `Client`: Step 1 -> Step 2 -> Step 3 (Confirmation). Total steps = 3.
  - `Trainer`: Step 1 -> Step 2 -> Step 3 (Coaching) -> Step 4 (Confirmation). Total steps = 4.
- **Client-Side Image Resizing**: Uploaded images are resized on a hidden canvas down to max 1024x1024 at ~0.82 quality to guarantee fast upload speeds and modest storage usage.
- **Direct Presigned PUT URLs**: Images bypass the web server and the backend API server, streaming directly to Cloudflare R2 via presigned URLs obtained from `POST /auth/presigned-url`. Authorization headers are stripped during R2 upload to preserve S3 signature validity.
- **Optional Media**: Both Profile Photo and Trainer Logo are strictly optional during registration.
- **Role-Aware Physical Profile**: Primary fitness goals (preset chips and custom text input) are only shown to and required for Athletes (Clients). For Personal Trainers, the goal field is omitted on Step 2 and excluded from the Physical Profile review card and submitted payload.
- **Unit Conversion**: Internal state stores height in cm and weight in kg to conform with backend API contracts, while presentation values dynamically convert between metric and imperial.
- **Confirmation Review**: The final confirmation step provides a clean summary review with dedicated Edit buttons that navigate back to the appropriate step without losing state.
- **Step-by-step Validation**: Each step transition validates only that step's fields using its dedicated Zod schema to avoid premature cross-step validation errors.

## Changes made by current task

- Implemented profile photo uploader on Step 1 for all users and trainer logo uploader for personal trainers.
- Redesigned Step 1 uploaders into dashed dropzone cards (`DropzoneCard`) matching the file dropzone layout with centered icons (`Camera`, `Dumbbell`), upload prompt text ("Drag and Drop file here or Choose file"), and drag-and-drop support:
  - On Web: Displayed side-by-side in 2 equal columns when role is Trainer (`$twoCols`), single column when Client.
  - When an image is uploaded: The preview image fills the card (`DropzonePreviewImg`), with a floating red circular `(X)` badge (`RemoveBadgeBtn`) in the top-right corner to clear/remove the selection.
- Created `src/utils/imageUpload.ts` for canvas compression and direct presigned S3 upload to Cloudflare R2.
- Updated Zod validation schemas in `src/schemas/auth.ts` to validate `avatarUrl` and `logoUrl`.
- Added thumbnail image previews to Confirmation summary cards (Account Information and Coaching Profile).
- Added bilingual translations in `en.json` and `es.json` for dropzone prompts and photo/logo uploaders.
- Updated `src/pages/SignupPage.test.tsx` with test coverage for upload, preview, removal, role toggle, and submission payloads (all 38 suites, 154 tests pass).
