import { expect, test } from '@playwright/test';
import {
  adminEmail,
  adminPassword,
  loginViaUi,
  signupViaApi,
} from './helpers/auth';

test.describe('admin', () => {
  test('non-admin is redirected away from admin users', async ({
    page,
    request,
  }) => {
    const client = await signupViaApi(request, {
      role: 'Client',
      prefix: 'admweb',
    });

    await loginViaUi(page, client.user.email);
    await page.goto('/admin/users');

    await expect(page).toHaveURL(/\/dashboard$/);
  });

  test('admin can open users and permissions pages', async ({ page }) => {
    await loginViaUi(page, adminEmail, adminPassword);

    await page.goto('/admin/users');
    await expect(page.getByText('User Management')).toBeVisible();
    await expect(page.getByText(adminEmail)).toBeVisible();

    await page.goto('/admin/permissions');
    await expect(page.getByText('Role Permissions')).toBeVisible();
    await expect(page.getByRole('button', { name: /^save$/i })).toBeVisible();
  });

  test('admin sidebar shows admin section', async ({ page }) => {
    await loginViaUi(page, adminEmail, adminPassword);
    await page.goto('/dashboard');

    await expect(page.getByRole('link', { name: /^permissions$/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /^users$/i })).toBeVisible();
  });
});
