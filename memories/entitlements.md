# Entitlements Module

## What it does

Provides rollout-safe Free/Plus UX hints from the server-authoritative `GET /me/permissions` response. It never derives product access from RBAC or starts billing.

## Main flow

- `fetchMyPermissions` caches the complete response: permissions plus optional `hasPaid`, `plan`, `role`, and entitlement snapshot.
- `useEntitlements` shares that query. Missing capabilities fail open; local quota blocking requires numeric limit and usage.
- Relevant workout, contract, and exercise writes invalidate the permissions query.
- `PlusUpsellModal` handles `PLAN_LIMIT` details without checkout. `EntitlementGraceWarning` displays `downgradeEffectiveAt`.
- `getApiErrorMessage` consistently displays localized API messages; non-limit coverage errors are not presented as purchasable upgrades.

## Integration points

- Workouts: template create/edit/share/self-assign hints; assignment-fork edit remains supported.
- Contracts: trainer seat usage/accept hints, covered-client request lock, accepted-contract End.
- Exercises: custom exercise usage plus create/bulk hints.
- Admin Users: derived Free/Plus state, grace metadata, downgrade-block message.
- Active Workout: intentionally entitlement-independent after assignment authorization.

## Constraints

- API enforcement is authoritative because snapshots can become stale after Admin changes.
- Snapshot fields and auth `plan` are optional for mixed-version rollout.
- Free/Plus only: no Pro, checkout, Stripe, or Gym billing behavior.
