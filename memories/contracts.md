# Contracts Module

Trainer Clients page (`/clients`, `/clients/:id`) and client Trainers page (`/trainers`). Basic list/detail: pending accept/reject, roster, assignment history, session stop notes, edit assignment fork via `/workout/:id/edit`. Clients request/cancel contracts.

## Key files

- `src/pages/ClientsPage.tsx`, `src/pages/TrainersPage.tsx`
- `src/services/api/contracts.ts`, `src/hooks/useContracts.ts`
- Sidebar role items in `src/components/layout/Sidebar.tsx`

## UI notes

- Pending requests card on `/clients` is a styled list: avatar initial, username + email, period pill, `contracts.requested` date, gradient Accept / outlined Reject buttons disabled while that row's mutation runs, dashed empty state. Other cards on the page still use the plain `Row` layout.

## Current task changes

- Added Clients/Trainers nav and basic contract UI.
- Client `/trainers` uses the same card language: selectable trainer rows with avatar + email, period chips, optional message textarea, gradient Send, contract rows with period/status pills, requested date, client message, outlined Cancel, dashed empty states. Status copy lives in `contracts.status.*`.
- Trainer pending rows show the client message when present.
