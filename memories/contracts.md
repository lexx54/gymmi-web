# Contracts Module

Trainer Clients page (`/clients`, `/clients/:id`) and client Trainers page (`/trainers`). Basic list/detail: pending accept/reject, roster, assignment history, session stop notes, edit assignment fork via `/workout/:id/edit`. Clients request/cancel contracts.

## Key files

- `src/pages/ClientsPage.tsx`, `src/pages/TrainersPage.tsx`
- `src/services/api/contracts.ts`, `src/hooks/useContracts.ts`
- Sidebar role items in `src/components/layout/Sidebar.tsx`

## Current task changes

- Added Clients/Trainers nav and basic contract UI.
