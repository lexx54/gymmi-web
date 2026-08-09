import { expect, test } from '@playwright/test';

const apiUrl = process.env.E2E_API_URL ?? 'http://localhost:3000';
const password = 'secret12';

function uniqueUser() {
  const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  return {
    email: `login-e2e-${id}@example.com`,
    username: `logine2e${id.replace(/[^a-zA-Z0-9]/g, '')}`,
  };
}

test.describe('login', () => {
  test('renders the login form', async ({ page }) => {
    await page.goto('/login');

    await expect(page.getByPlaceholder('email@mail.com')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.getByRole('button', { name: /^login$/i })).toBeVisible();
  });

  test('shows client validation errors for empty submit', async ({ page }) => {
    await page.goto('/login');

    await page.getByRole('button', { name: /^login$/i }).click();

    await expect(page.getByText('Email is required')).toBeVisible();
    await expect(page.getByText('Password is required')).toBeVisible();
    await expect(page).toHaveURL(/\/login$/);
  });

  test('stays on login and shows an error for invalid credentials', async ({
    page,
  }) => {
    await page.goto('/login');

    await page.getByPlaceholder('email@mail.com').fill('unknown@example.com');
    await page.locator('input[type="password"]').fill('wrong12');
    await page.getByRole('button', { name: /^login$/i }).click();

    await expect(page.getByText('Invalid credentials')).toBeVisible();
    await expect(page).toHaveURL(/\/login$/);
  });

  test('logs in and redirects to the dashboard', async ({ page }) => {
    const user = uniqueUser();

    const signupResponse = await page.request.post(`${apiUrl}/auth/signup`, {
      headers: { 'X-Client-Id': `playwright-signup-${user.username}` },
      data: {
        ...user,
        password,
        role: 'Client',
      },
    });
    expect(signupResponse.status()).toBe(201);

    await page.goto('/login');
    await page.getByPlaceholder('email@mail.com').fill(user.email);
    await page.locator('input[type="password"]').fill(password);
    await page.getByRole('button', { name: /^login$/i }).click();

    await expect(page).toHaveURL(/\/dashboard$/);
    await expect(
      page.getByText(`Good Morning, ${user.username.toUpperCase()}`),
    ).toBeVisible();
  });
});
