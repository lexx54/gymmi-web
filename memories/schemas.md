# Schemas Module

## What it does

Zod validation schemas for auth forms (used with React Hook Form).

## Key file

- `src/schemas/auth.ts`

## Schemas

- `loginSchema`: `identifier` (email), `password` (min 6)
- `signupSchema`: email, username (min 3), password (min 8), confirmPassword, role enum `Trainer | Client`
- `SIGNUP_ROLES` drives signup role radio options. The Client option is labelled User in the UI.

## Constraints

- No Zod schemas yet for exercises, workouts, admin, or settings.
- Login `identifier` is email-validated in the form even though the API accepts username too.
