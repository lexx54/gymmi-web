import { expect, test } from '@playwright/test';
import {
  apiUrl,
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

  test('filters exercises and paginates the catalog at 10 per page', async ({
    page,
    request,
  }) => {
    const admin = await loginAdminViaApi(request);
    const suffix = Date.now().toString();
    const targetMuscle = `E2E Muscle ${suffix}`;
    const equipment = `E2E Equipment ${suffix}`;

    const responses = await Promise.all(
      Array.from({ length: 11 }, (_, index) =>
        request.post(`${apiUrl}/exercises`, {
          headers: { Authorization: `Bearer ${admin.accessToken}` },
          data: {
            name: `E2E Filter Exercise ${suffix}-${index + 1}`,
            targetMuscle,
            equipment,
            instructions: 'Exercise used to verify catalog filtering and pagination.',
            difficulty: index < 6 ? 'Novice' : 'Elite',
            movementType: 'Compound',
            tags: [],
          },
        }),
      ),
    );
    responses.forEach((response) => expect(response.status()).toBe(201));

    await applyAuthToPage(page, admin);
    await page.goto('/exercises');

    await page
      .getByRole('combobox', { name: /filter by target muscle/i })
      .selectOption(targetMuscle);
    await page
      .getByRole('combobox', { name: /filter by equipment/i })
      .selectOption(equipment);

    await expect(page.getByText('Showing 1–10 of 11 exercises')).toBeVisible();
    await expect(page.locator('main article')).toHaveCount(10);
    await expect(page.getByText('Page 1 of 2')).toBeVisible();

    await page.getByRole('button', { name: /next/i }).click();
    await expect(page.getByText('Showing 11–11 of 11 exercises')).toBeVisible();
    await expect(page.locator('main article')).toHaveCount(1);

    await page
      .getByRole('combobox', { name: /filter by level/i })
      .selectOption('Novice');
    await expect(page.getByText('Showing 1–6 of 6 exercises')).toBeVisible();
    await expect(page.locator('main article')).toHaveCount(6);
    await expect(page.getByText(/Page \d+ of \d+/)).toHaveCount(0);
  });

  test('opens exercise details from a catalog card', async ({ page, request }) => {
    const admin = await loginAdminViaApi(request);
    const suffix = Date.now().toString();
    const name = `E2E Detail Squat ${suffix}`;
    const created = await request.post(`${apiUrl}/exercises`, {
      headers: { Authorization: `Bearer ${admin.accessToken}` },
      data: {
        name,
        targetMuscle: 'Quads',
        equipment: 'Barbell',
        instructions: 'Stand tall and squat to depth.',
        difficulty: 'Intermediate',
        movementType: 'Compound',
        tags: ['Strength'],
      },
    });
    expect(created.status()).toBe(201);

    await applyAuthToPage(page, admin);
    await page.goto('/exercises');

    await page.getByRole('searchbox', { name: /filter exercises/i }).fill(name);
    await page.getByRole('heading', { name }).click();

    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole('heading', { name })).toBeVisible();
    await expect(dialog.getByText('Stand tall and squat to depth.')).toBeVisible();
    await expect(dialog.getByText('Photos and video coming soon')).toBeVisible();
    await expect(dialog.getByText('Front view')).toBeVisible();

    await dialog.getByRole('button', { name: /next media/i }).click();
    await expect(dialog.getByText('Side view')).toBeVisible();
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
