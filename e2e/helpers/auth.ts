import { expect, test, type APIRequestContext, type APIResponse, type Page } from '@playwright/test';
import { LEGAL_CONFIG } from '../../src/constants/legal.constants';

export const apiUrl = process.env.E2E_API_URL ?? 'http://localhost:3001';
export const password = 'secret12';

/** Signup requires accepting the Terms revision the web app currently shows. */
export const signupTerms = {
  acceptTerms: true,
  termsVersion: LEGAL_CONFIG.lastUpdated,
} as const;

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

/**
 * The API rate-limits auth routes per IP (10/min), and every e2e request comes from 127.0.0.1.
 * On 429, wait for the window to reset (Retry-After) and retry, extending the test timeout.
 */
async function postAuth(
  request: APIRequestContext,
  url: string,
  options: Parameters<APIRequestContext['post']>[1],
): Promise<APIResponse> {
  for (let attempt = 0; attempt < 3; attempt += 1) {
    const response = await request.post(url, options);
    if (response.status() !== 429) return response;
    const retryAfter = Number(response.headers()['retry-after']);
    const waitMs = (Number.isFinite(retryAfter) && retryAfter > 0 ? retryAfter : 30) * 1000 + 500;
    test.info().setTimeout(test.info().timeout + waitMs);
    await new Promise((resolve) => setTimeout(resolve, waitMs));
  }
  return request.post(url, options);
}

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
  const response = await postAuth(request, `${apiUrl}/auth/signup`, {
    headers: { 'X-Client-Id': `playwright-signup-${user.clientId}` },
    data: {
      email: user.email,
      username: user.username,
      password,
      role: opts.role,
      ...signupTerms,
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
  const response = await postAuth(request, `${apiUrl}/auth/login`, {
    headers: { 'X-Client-Id': `playwright-login-${Date.now()}` },
    data: { identifier, password: pwd },
  });
  expect(response.status()).toBe(201);
  return response.json();
}

/** One admin login per worker: auth routes are rate-limited per IP and many tests need the admin. */
let adminAuth: Promise<AuthResponse> | null = null;

export async function loginAdminViaApi(
  request: APIRequestContext,
): Promise<AuthResponse> {
  adminAuth ??= loginViaApi(request, adminEmail, adminPassword).catch((error: unknown) => {
    adminAuth = null;
    throw error;
  });
  return adminAuth;
}

export async function markUserPaidViaApi(
  request: APIRequestContext,
  adminToken: string,
  userId: string,
  hasPaid = true,
  paidPlan?: 'plus' | 'pro',
) {
  const response = await request.patch(`${apiUrl}/admin/users/${userId}`, {
    headers: { Authorization: `Bearer ${adminToken}` },
    data: paidPlan ? { hasPaid, paidPlan } : { hasPaid },
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
    // Keep specs in English; the app's own default is Spanish.
    localStorage.setItem('gymmi.language', 'en');
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
