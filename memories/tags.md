# Tags Module

## What it does

Exercise-builder tag catalog backed by `GET/POST /tags`.

Admin-created tags are global. Tags created by Gym/Trainer/Client users are private to that user.

## Main flows

1. Builder loads `useTags()` for chips the current user may apply.
2. **Create Tag** opens `CreateTagModal` → `POST /tags` → selected on the draft.
3. Catalog chips that are not already selected can be clicked to add.

## Key files

- API: `src/services/api/tags.ts`
- Hooks: `src/hooks/useTags.ts`
- UI: `src/components/exercises/CreateTagModal.tsx`, `MetadataTagsCard.tsx`
- Page: `src/pages/ExerciseBuilderPage.tsx`
- E2E: `e2e/tags.spec.ts`

## Constraints

- Exercises still persist tag **names** (`string[]`).
- No tag edit/delete UI.
