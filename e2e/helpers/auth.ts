import { expect, type APIRequestContext, type Page } from '@playwright/test';

export const apiUrl = process.env.E2E_API_URL ?? 'http://localhost:3001';
export const password = 'secret12';

/** Must match gymmi-api/test/helpers/auth.ts E2E_ADMIN_* (created by globalSetup). */
export const adminEmail = 'e2e-admin@gymmi.local';
export const adminPassword = 'secret12';

export type AuthResponse = {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    username: string;
    hasPaid: boolean;
    role: { id: string; name: string };
  };
};

export function uniqueUser(prefix: string) {
  const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const safe = id.replace(/[^a-zA-Z0-9]/g, '');
  return {
    email: `${prefix}-${id}@example.com`,
    username: `${prefix}${safe}`.slice(0, 28),
    clientId: `${prefix}-${id}`,
  };
}

export async function signupViaApi(
  request: APIRequestContext,
  opts: {
    role: 'Gym' | 'Trainer' | 'Client';
    prefix?: string;
  },
): Promise<AuthResponse> {
  const user = uniqueUser(opts.prefix ?? 'webe2e');
  const response = await request.post(`${apiUrl}/auth/signup`, {
    headers: { 'X-Client-Id': `playwright-signup-${user.clientId}` },
    data: {
      email: user.email,
      username: user.username,
      password,
      role: opts.role,
    },
  });
  expect(response.status()).toBe(201);
  return response.json();
}

export async function loginViaApi(
  request: APIRequestContext,
  identifier: string,
  pwd = password,
): Promise<AuthResponse> {
  const response = await request.post(`${apiUrl}/auth/login`, {
    headers: { 'X-Client-Id': `playwright-login-${Date.now()}` },
    data: { identifier, password: pwd },
  });
  expect(response.status()).toBe(201);
  return response.json();
}

export async function loginAdminViaApi(
  request: APIRequestContext,
): Promise<AuthResponse> {
  return loginViaApi(request, adminEmail, adminPassword);
}

export async function markUserPaidViaApi(
  request: APIRequestContext,
  adminToken: string,
  userId: string,
  hasPaid = true,
) {
  const response = await request.patch(`${apiUrl}/admin/users/${userId}`, {
    headers: { Authorization: `Bearer ${adminToken}` },
    data: { hasPaid },
  });
  expect(response.status()).toBe(200);
}

export async function loginViaUi(page: Page, email: string, pwd = password) {
  await page.goto('/login');
  await page.getByPlaceholder('email@mail.com').fill(email);
  await page.locator('input[type="password"]').fill(pwd);
  await page.getByRole('button', { name: /^login$/i }).click();
  await expect(page).toHaveURL(/\/dashboard$/);
}

/** Clears stored JWT so a different user can log in on the same page. */
export async function clearUiSession(page: Page) {
  await page.goto('/login');
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
}

/** Injects API tokens into the browser so the next navigation is authenticated. */
export async function applyAuthToPage(page: Page, auth: AuthResponse) {
  await page.goto('/login');
  await page.evaluate(
    ({ accessToken, refreshToken }) => {
      localStorage.setItem('@gymmi/access_token', accessToken);
      localStorage.setItem('@gymmi/refresh_token', refreshToken);
    },
    { accessToken: auth.accessToken, refreshToken: auth.refreshToken },
  );
}
