# Contracts Module

Trainer Clients page (`/clients`, `/clients/:id`) and client Trainers page (`/trainers`). Includes pending accept/reject, roster, assignment history, session stop notes, assignment-fork editing, client request/cancel, and accepted-contract End.

## Key files

- `src/pages/ClientsPage.tsx`, `src/pages/TrainersPage.tsx`
- `src/services/api/contracts.ts`, `src/hooks/useContracts.ts`
- Sidebar role items in `src/components/layout/Sidebar.tsx`

## UI notes

- Pending requests card on `/clients` is a styled list: avatar initial, username + email, period pill, `contracts.requested` date, gradient Accept / outlined Reject buttons disabled while that row's mutation runs, dashed empty state.
- Every `/clients` card now uses the same language (`SectionTitle` + lucide icon + optional `CountBadge`, item rows built from the shared `itemSurface` block, dashed `EmptyState`): roster rows are whole-row `Link`s with avatar, email, and chevron; current assignment and history rows show routine name, date range, period pill, and a gradient `PrimaryLink` (edit) or outlined `OutlinedLink` (view); current assignment shows both View and Edit. Session notes pair a date pill with the stop reason note. The old plain `Row` component is gone.

## Current task changes

- Added Clients/Trainers nav and basic contract UI.
- Client `/trainers` uses the same card language: selectable trainer rows with avatar + email, period chips, optional message textarea, gradient Send, contract rows with period/status pills, requested date, client message, outlined Cancel, dashed empty states. Status copy lives in `contracts.status.*`.
- Trainer pending rows show the client message when present.
- Restyled the remaining `/clients` cards (roster, current assignment, history, session notes) to match the pending-request card; no new i18n keys were needed.
- Trainer seat usage comes from entitlements. Full-seat accepts open the Plus modal, server messages remain authoritative, covered clients cannot request a second trainer, and successful accept/end/request mutations refresh entitlement state.
