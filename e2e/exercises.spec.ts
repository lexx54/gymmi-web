import { expect, test } from '@playwright/test';
import {
  applyAuthToPage,
  loginAdminViaApi,
  loginViaUi,
  markUserPaidViaApi,
  signupViaApi,
} from './helpers/auth';

const csvHeaders =
  'name,targetMuscle,equipment,instructions,difficulty,movementType';

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
    await expect(page.getByRole('button', { name: /bulk csv/i })).toHaveCount(0);
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

    // Empty catalog also renders a "Create Exercise" button inside the
    // NoExercises empty state (role="status"); target the header action.
    const createExerciseButton = page
      .getByRole('button', { name: /create exercise/i })
      .first();
    await expect(createExerciseButton).toBeVisible();
    await createExerciseButton.click();
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

  test('paid gym can import exercises from the bulk CSV modal', async ({
    page,
    request,
  }) => {
    test.setTimeout(60_000);
    const admin = await loginAdminViaApi(request);
    const gym = await signupViaApi(request, { role: 'Gym', prefix: 'excsv' });
    await markUserPaidViaApi(request, admin.accessToken, gym.user.id, true);

    const exerciseName = `E2E Bulk Squat ${Date.now()}`;
    const csv = [
      csvHeaders,
      `${exerciseName},Quads,Barbell,Stand tall and squat to depth.,Intermediate,Compound`,
      ',Chest,Barbell,Missing required name,Beginner,Compound',
    ].join('\n');

    await applyAuthToPage(page, gym);
    await page.goto('/exercises');

    await page.getByRole('button', { name: /bulk csv/i }).first().click();

    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await expect(dialog.getByText('Required columns', { exact: true })).toBeVisible();
    await expect(dialog.getByRole('button', { name: /upload csv/i })).toBeDisabled();

    await dialog.locator('input[type="file"]').setInputFiles({
      name: 'exercises.csv',
      mimeType: 'text/csv',
      buffer: Buffer.from(csv, 'utf8'),
    });
    await expect(dialog.getByText('exercises.csv')).toBeVisible();

    await dialog.getByRole('button', { name: /upload csv/i }).click();

    await expect(page.getByText('Created 1 exercises from CSV')).toBeVisible();
    await expect(dialog.getByText('Created 1 exercises, skipped 1 rows.')).toBeVisible();
    await expect(dialog.getByText(/Row 3:/)).toBeVisible();

    await dialog.getByRole('button', { name: /^cancel$/i }).click();
    await expect(dialog).toHaveCount(0);
    await expect(page.getByText(exerciseName)).toBeVisible();
  });
});
