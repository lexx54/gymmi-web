# Login Memory

## Web Flow

- Login route: `/login`.
- API call: `POST /auth/login` through `loginApi`.
- API base URL comes from `VITE_API_URL`, falling back to `http://localhost:3000`.
- Form fields:
  - email or username input is registered as `identifier`
  - password input is registered as `password`
- Successful login saves access and refresh tokens, sets the auth user, and redirects to `/dashboard`.
- Invalid credentials show the API error message in a toast (currently
  `Invalid email/password`). The web `auth.invalidCredentials` locale key mirrors
  that wording but is not referenced by any component today.
- A `429` response triggers the local lockout countdown UI.

## E2E Coverage

- Playwright config lives in `playwright.config.ts`.
- Login browser tests live in `e2e/login.spec.ts`.
- Covered cases:
  - login form renders
  - empty submit shows client validation errors
  - invalid credentials stay on `/login` and show `Invalid email/password`
  - successful login redirects to `/dashboard`
- The happy-path test creates a disposable `Client` user through the API before logging in.
- The signup helper uses `E2E_API_URL`, falling back to `http://localhost:3000`.

## Commands

Run the login e2e suite with the API already running:

```bash
npm run test:e2e -- e2e/login.spec.ts
```

Open Playwright UI mode with:

```bash
npm run test:e2e:ui
```
