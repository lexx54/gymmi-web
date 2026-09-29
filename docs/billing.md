# Billing & Manual Payments Module

## Overview
The Billing & Manual Payments module enables multiplatform subscription management and off-app manual payments (Pago Móvil, Bank Transfer, Zinli, Binance Pay USDT, Zelle). It allows athletes, personal trainers, and gyms to upgrade to Plus, view official payment coordinates with one-click copy buttons, upload receipt proof to Cloudflare R2, and submit reference numbers for admin verification.
Administrators review, approve, or reject payment requests through a dedicated verification dashboard, which updates user entitlements and restores hidden routines immediately.

This architecture fully complies with **Apple App Store Guideline 3.1.3(b) (Multiplatform Services)**: payments are processed externally on the web platform, while the mobile client remains strictly informational without checkout links or prices.

---

## Main Flows

### 1. User Billing & Upgrade Flow (`/billing`)
1. User navigates to `/billing` (via Sidebar, Settings card, or Landing page pricing section).
2. Page displays current subscription status (Free Tier badge or Plus Active with days remaining).
3. If user has a pending verification, an informational banner appears with reference number, payment method, amount, and submission timestamp.
4. User selects billing cycle (Monthly vs Annual with ~20% discount) and plan tier (Free vs Plus).
5. User selects desired payment method tab (Pago Móvil, Transferencia Bancaria, Binance Pay, Zinli, Zelle).
6. Coordinates and copy buttons display destination coordinates and BCV rate note.
7. User fills reference number, originating bank, payer phone/ID, optional notes, and uploads receipt screenshot directly to Cloudflare R2 (`payment-receipt` purpose).
8. Submitting calls `POST /payments` and displays recent submissions in a history table.

### 2. Admin Verification Flow (`/admin/payments`)
1. Administrator accesses `/admin/payments` (accessible via Admin sidebar).
2. Filter tabs allow viewing `PENDING`, `APPROVED`, `REJECTED`, or `ALL` payments with pagination.
3. For each submission, table shows user details (avatar, username, email, role), plan & cycle, method, reference #, amounts (USD & Bs), and receipt thumbnail.
4. Clicking receipt thumbnail opens high-resolution inspection modal with external link to full image.
5. Clicking **Approve** opens confirmation dialog explaining continuous subscription stacking (+30 or +365 days). On submit, calls `PATCH /admin/payments/:id/approve`.
6. Clicking **Reject** opens reason dialog. On submit, calls `PATCH /admin/payments/:id/reject` with explanation.

### 3. Settings Integration (`/settings`)
- `SubscriptionSettingsCard.tsx` renders on the `/settings` page, showing current tier, days remaining if monthly, and a direct CTA to `/billing`.

---

## Key Files & Structure

- **Types**:
  - `src/types/payments.ts`: `Payment`, `PaymentStatus`, `PaymentMethod`, `BillingCycle`, `PaymentConfig`, `CreatePaymentPayload`.
  - `src/types/auth.ts`: Added `paidUntil?: string | null` to `AuthUser` and `FullUserProfile`.
- **API Client**:
  - `src/services/api/payments.ts`: `fetchPaymentConfig`, `fetchMyPayments`, `createPayment`, `fetchAdminPayments`, `approveAdminPayment`, `rejectAdminPayment`.
  - `src/services/api/auth.ts`: Added `'payment-receipt'` to `AllowedUploadPurpose`.
  - `src/utils/imageUpload.ts`: Presigned URL image upload support for receipts.
- **Pages & Components**:
  - `src/pages/BillingPage.tsx`: User billing and payment submission page.
  - `src/pages/admin/AdminPaymentsPage.tsx`: Admin payment verification console.
  - `src/components/settings/SubscriptionSettingsCard.tsx`: Settings dashboard subscription widget.
  - `src/components/layout/Sidebar.tsx`: Added `Billing & Plans` to general navigation and `Payments` to Admin navigation.
  - `src/components/landing/PricingSection.tsx`: Directs authenticated users to `/billing`.
  - `src/App.tsx`: Registered `/billing` and `/admin/payments` routes protected by `PrivateRoute`.
- **Localization**:
  - `src/i18n/locales/en.json` & `es.json`: Full English and Spanish translations for all billing and admin verification UI keys.
- **Automated Tests**:
  - `src/pages/BillingPage.test.tsx`: Tests rendering status, cadence toggle, coordinate display, submission mutation, and history.
  - `src/pages/admin/AdminPaymentsPage.test.tsx`: Tests rendering table, filter tabs, approval modal/mutation, rejection modal/mutation, and receipt viewer.

---

## Important Decisions & Constraints

1. **Apple Guideline 3.1.3(b) Compliance**:
   - Digital entitlements are managed at the account level across platforms.
   - Mobile app (`gymmi`) remains informational without checkout links, prices, or payment steering.
   - Web application handles plan selection, payment instructions, and proof submission.
2. **Direct Storage Upload**:
   - Receipt screenshots are uploaded directly to Cloudflare R2 using presigned URLs (`purpose: 'payment-receipt'`), minimizing backend bandwidth.
3. **Pure Date Handling**:
   - Timestamp calculations use `useState(() => Date.now())` to ensure strict compliance with React Compiler and React hooks purity rules.
4. **Subscription Extension Stacking**:
   - If an approved user already has active time remaining on their subscription, approval stacks 30 or 365 days onto their existing `paidUntil`, rather than resetting from the approval date.

---

## Changes Made in This Task
1. Added full i18n support in `en.json` and `es.json` for `billing.*`, `admin.payments.*`, `nav.billing`, and `nav.payments`.
2. Created comprehensive unit test suites `BillingPage.test.tsx` and `AdminPaymentsPage.test.tsx` (10 tests, 100% pass rate).
3. Configured type safety for `'payment-receipt'` upload purpose and verified production build with `tsc -b && vite build`.
4. Resolved React purity lint checks using `useState` date initializers.
