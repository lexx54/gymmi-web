import { expect, test } from '@playwright/test';
import { loginViaUi, signupViaApi } from './helpers/auth';

test.describe('list catalogs via exercise builder', () => {
  test('loads muscle and equipment options from the API', async ({
    page,
    request,
  }) => {
    const gym = await signupViaApi(request, { role: 'Gym', prefix: 'listweb' });
    await loginViaUi(page, gym.user.email);
    await page.goto('/exercises/new');

    const muscleSelect = page.getByLabel('Target Muscle Group');
    const equipmentSelect = page.getByLabel('Equipment Required');

    await expect(muscleSelect).toBeVisible();
    await expect(equipmentSelect).toBeVisible();

    // Options are populated from GET /list/muscles and /list/equipments.
    await expect
      .poll(async () => muscleSelect.locator('option').count())
      .toBeGreaterThan(1);
    await expect
      .poll(async () => equipmentSelect.locator('option').count())
      .toBeGreaterThan(1);
  });
});
