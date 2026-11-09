import { expect, test } from '@playwright/test';
import {
  adminEmail,
  applyAuthToPage,
  loginAdminViaApi,
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

    await applyAuthToPage(page, client);
    await page.goto('/admin/users');

    await expect(page).toHaveURL(/\/dashboard$/);
  });

  test('admin can open users and permissions pages', async ({ page, request }) => {
    await applyAuthToPage(page, await loginAdminViaApi(request));

    await page.goto('/admin/users');
    await expect(page.getByText('User Management')).toBeVisible();
    await expect(page.getByText(adminEmail)).toBeVisible();

    await page.goto('/admin/permissions');
    await expect(page.getByText('Role Permissions')).toBeVisible();
    await expect(page.getByRole('button', { name: /^save$/i })).toBeVisible();
  });

  test('admin sidebar shows admin section', async ({ page, request }) => {
    await applyAuthToPage(page, await loginAdminViaApi(request));
    await page.goto('/dashboard');

    await expect(page.getByRole('link', { name: /^permissions$/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /^users$/i })).toBeVisible();
    await expect(page.getByTestId('admin-overview')).toBeVisible();
    await expect(page.getByText('Needs attention')).toBeVisible();
  });
});
