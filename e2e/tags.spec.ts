import { expect, test } from '@playwright/test';
import { applyAuthToPage, signupViaApi } from './helpers/auth';

test.describe('tags', () => {
  test('user can create a private tag in the builder modal', async ({
    page,
    request,
  }) => {
    test.setTimeout(60_000);
    const stamp = Date.now();
    const privateName = `Gym Private ${stamp}`;

    const gymA = await signupViaApi(request, { role: 'Gym', prefix: 'taga' });
    const gymB = await signupViaApi(request, { role: 'Gym', prefix: 'tagb' });

    await applyAuthToPage(page, gymA);
    await page.goto('/exercises/new');
    await page.getByRole('button', { name: /create tag/i }).click();
    await page.getByLabel('Tag name').fill(privateName);
    await page.getByRole('button', { name: /save tag/i }).click();
    await expect(page.getByText(privateName)).toBeVisible();

    await applyAuthToPage(page, gymB);
    await page.goto('/exercises/new');
    await expect(page.getByRole('button', { name: /create tag/i })).toBeVisible();
    await expect(page.getByText(privateName)).toHaveCount(0);
  });
});
