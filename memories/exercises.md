# Exercises Module

## What it does

Exercise catalog (list/search), create builder, and bulk CSV import — backed by gymmi-api.

## Routes

| Path | Page |
|------|------|
| `/exercises` | Catalog list |
| `/exercises/new` | Create builder |

## Main flows

1. **Catalog:** `useExercises()` → `GET /exercises` → client-side search → grid cards.
2. **Create:** Multi-card builder → validate name/instructions → `POST /exercises` → redirect to catalog.
3. **Bulk CSV:** Modal → `POST /exercises/bulk-csv` (multipart) → shows `created` count + per-row errors.

### Bulk CSV modal feedback (`ExerciseBulkCsvModal.tsx`)

- **No file:** dashed drop zone with "Choose CSV file" + hint; upload button disabled.
- **File selected:** replaces the drop zone with a green card showing a file icon, file name, `File selected · <size>`, and an X to remove it, plus a "Choose a different file" label link. This is the main selection feedback (previously only the file name swapped inside the same label, which read as "nothing happened").
- **Invalid type:** non-`.csv` selections are rejected locally with an inline `role="alert"` message; the file is not set.
- **Uploading:** file card shows an indeterminate progress bar and a spinner; the submit button shows a spinner + "Uploading...".
- **Result:** banner with icon — green when all rows imported, amber when some were skipped — keeping the sentence `Created N exercises, skipped M rows.` intact, followed by the per-row error list.
- **Duplicate guard:** once a result is shown the "Upload CSV" button is **removed** (not just disabled) and `handleSubmit` early-returns while `showResult` is true, so the same rows cannot be imported twice. Only "Cancel" plus the "Choose a different file" link remain; picking another file clears `hasSubmitted`, hides the result, and brings the upload button back.
- Local state resets when the modal closes; picking a new file hides the previous result (`hasSubmitted` gate) so a stale banner never lingers.
- i18n keys added: `exercises.fileSelected`, `removeFile`, `changeFile`, `csvInvalidType` (en + es).

Create payload sent: `name`, `targetMuscle`, `equipment`, `instructions`, `difficulty`, `movementType`, `tags`. Tags are chosen from `GET /tags` (global + own). New tags are created in a modal (`POST /tags`). Activation map extras and media are UI-only and not POSTed.

## Key files

- Pages: `src/pages/ExercisesPage.tsx`, `ExerciseBuilderPage.tsx`
- Hooks: `src/hooks/useExercises.ts`
- API: `src/services/api/exercises.ts`
- Components under `src/components/exercises/` (catalog, bulk modal, builder cards, shell/header)
- Types: `src/components/exercises/types.ts`

## Permissions / payment

- Create/bulk buttons gated by `<Can resource="exercises" action="CREATE">`.
- Route `/exercises/new` is reachable by any authenticated user; publish button hidden without permission.
- Errors use generic toasts — no special UX for payment-required (402).
- `hasPaid` is not checked client-side.

## Constraints

- List/create/bulk: **real API**.
- Hooks exist for update/delete/fetch-one but no edit/delete UI or detail route yet.
- Catalog cards are read-only (no navigate to edit).
- Muscle/equipment options from `useListMuscles` / `useListEquipments`.
- Tag catalog from `useTags` / `useCreateTag`. Builder no longer accepts free-typed tags.
- Media upload, visual inspiration, live preview, activation-map persistence: UI-only.

## E2E

- Playwright: `e2e/exercises.spec.ts` (client cannot create; paid gym publish; unpaid publish error; paid gym bulk CSV modal).
- Playwright: `e2e/tags.spec.ts` (admin tag shared; user tag private).
- See `memories/e2e.md`.
