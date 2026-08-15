import { expect, test } from '@playwright/test';
import {
  loginAdminViaApi,
  loginViaUi,
  markUserPaidViaApi,
  signupViaApi,
} from './helpers/auth';

test.describe('exercises', () => {
  test('client can view catalog but cannot create', async ({ page, request }) => {
    const client = await signupViaApi(request, {
      role: 'Client',
      prefix: 'exclient',
    });

    await loginViaUi(page, client.user.email);
    await page.goto('/exercises');

    await expect(page.getByText('Design your movement catalog')).toBeVisible();
    await expect(
      page.getByRole('button', { name: /create exercise/i }),
    ).toHaveCount(0);
  });

  test('paid gym can publish an exercise from the builder', async ({
    page,
    request,
  }) => {
    const admin = await loginAdminViaApi(request);
    const gym = await signupViaApi(request, { role: 'Gym', prefix: 'exgym' });
    await markUserPaidViaApi(request, admin.accessToken, gym.user.id, true);

    await loginViaUi(page, gym.user.email);
    await page.goto('/exercises');

    await expect(
      page.getByRole('button', { name: /create exercise/i }),
    ).toBeVisible();
    await page.getByRole('button', { name: /create exercise/i }).click();
    await expect(page).toHaveURL(/\/exercises\/new$/);

    const exerciseName = `E2E Web Squat ${Date.now()}`;
    await page.getByLabel('Exercise Name').fill(exerciseName);
    await page
      .getByPlaceholder('Break down the movement step-by-step...')
      .fill('Stand tall and squat to depth.');

    await page.getByRole('button', { name: /publish exercise/i }).click();

    await expect(page.getByText('Exercise published')).toBeVisible();
    await expect(page).toHaveURL(/\/exercises$/);
    await expect(page.getByText(exerciseName)).toBeVisible();
  });

  test('unpaid gym cannot publish an exercise', async ({ page, request }) => {
    const gym = await signupViaApi(request, {
      role: 'Gym',
      prefix: 'exunpaid',
    });

    await loginViaUi(page, gym.user.email);
    await page.goto('/exercises/new');

    await page.getByLabel('Exercise Name').fill(`Unpaid Draft ${Date.now()}`);
    await page
      .getByPlaceholder('Break down the movement step-by-step...')
      .fill('Should fail payment gate.');

    await page.getByRole('button', { name: /publish exercise/i }).click();

    await expect(page.getByText('Could not publish exercise')).toBeVisible();
    await expect(page).toHaveURL(/\/exercises\/new$/);
  });
});
