# Common Components

## What it does

Shared UI primitives used across features. Currently a single modal shell.

## Key files

- `src/components/common/Modal.tsx`

## Behavior

- Overlay dialog with title, optional description, children, click-outside close, accessible dialog attributes.

## Usage

- `ExerciseBulkCsvModal` wraps this Modal for CSV upload UX.

## Constraints

- No shared Button/Input/Form kit — pages generally use styled-components inline.
- Route guards (`PrivateRoute`, `PublicRoute`, `RoleRoute`, `Can`) live under `src/components/` root, not `common/`.
