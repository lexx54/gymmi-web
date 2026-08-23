import { expect, test } from '@playwright/test';
import { password, uniqueUser } from './helpers/auth';

test.describe('signup', () => {
  test('renders the signup form', async ({ page }) => {
    await page.goto('/signup');

    await expect(page.getByText('Create account')).toBeVisible();
    await expect(page.getByPlaceholder('email@mail.com')).toBeVisible();
    await expect(page.getByPlaceholder('username')).toBeVisible();
    await expect(page.getByRole('button', { name: /^sign up$/i })).toBeVisible();
  });

  test('shows client validation errors for empty submit', async ({ page }) => {
    await page.goto('/signup');

    await page.getByRole('button', { name: /^sign up$/i }).click();

    await expect(page.getByText('Email is required')).toBeVisible();
    await expect(page).toHaveURL(/\/signup$/);
  });

  test('creates an account and redirects to login', async ({ page }) => {
    const user = uniqueUser('signup');

    await page.goto('/signup');
    await page.getByPlaceholder('email@mail.com').fill(user.email);
    await page.getByPlaceholder('username').fill(user.username);
    await page.getByPlaceholder('Password', { exact: true }).fill(password);
    await page.getByPlaceholder('confirm password').fill(password);
    await page.getByRole('radio', { name: 'Client' }).check();
    await page.getByRole('button', { name: /^sign up$/i }).click();

    await expect(page.getByText('Account created successfully!')).toBeVisible();
    await expect(page).toHaveURL(/\/login$/);
  });
});
