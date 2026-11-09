import { expect, test } from '@playwright/test';
import { password, signupViaApi } from './helpers/auth';

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

    await expect(
      page.getByText('Email or username is required'),
    ).toBeVisible();
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

    await expect(page.getByText('Incorrect email, username or password.')).toBeVisible();
    await expect(page).toHaveURL(/\/login$/);
  });

  test('logs in and redirects to the dashboard', async ({ page, request }) => {
    const { user } = await signupViaApi(request, { role: 'Client', prefix: 'logine2e' });

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
