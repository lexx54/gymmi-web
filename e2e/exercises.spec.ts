import { expect, test } from '@playwright/test';
import {
  apiUrl,
  applyAuthToPage,
  loginAdminViaApi,
  markUserPaidViaApi,
  signupViaApi,
} from './helpers/auth';

const csvHeaders =
  'name,targetMuscle,equipment,instructions,difficulty,movementType';

const localized = (value: string) => ({ en: value, es: value });

test.describe('exercises', () => {
  test('free client can view catalog and is offered Plus to create', async ({ page, request }) => {
    const client = await signupViaApi(request, {
      role: 'Client',
      prefix: 'exclient',
    });

    await applyAuthToPage(page, client);
    await page.goto('/exercises');

    await expect(page.getByRole('heading', { level: 1, name: 'Exercises' })).toBeVisible();
    // Clients can create custom exercises on Plus; Free clients get the upsell instead of the builder.
    await page.locator('header').getByRole('button', { name: 'Create Exercise' }).click();
    await expect(
      page.getByText('Custom exercises are included with Plus, up to 5.'),
    ).toBeVisible();
    await expect(page).toHaveURL(/\/exercises$/);
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
            targetMuscle: localized(targetMuscle),
            equipment: localized(equipment),
            instructions: localized(
              'Exercise used to verify catalog filtering and pagination.',
            ),
            activationMap: {
              secondary: localized('Glutes'),
              stabilizers: localized('Calves'),
            },
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
        targetMuscle: { en: 'Quads', es: 'Cuádriceps' },
        equipment: { en: 'Barbell', es: 'Barra' },
        instructions: {
          en: 'Stand tall and squat to depth.',
          es: 'Ponte de pie y baja en sentadilla.',
        },
        activationMap: {
          secondary: { en: 'Glutes', es: 'Glúteos' },
          stabilizers: { en: 'Calves', es: 'Pantorrillas' },
        },
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
    await expect(dialog.getByText('Glutes')).toBeVisible();
    await expect(dialog.getByText('Calves')).toBeVisible();
    await expect(dialog.getByText('Photos and video coming soon')).toBeVisible();
    await expect(dialog.getByText('Front view')).toBeVisible();

    await dialog.getByRole('button', { name: /view body map/i }).click();
    const bodyMapDialog = page.getByRole('dialog', {
      name: /body activation map/i,
    });
    await expect(bodyMapDialog).toBeVisible();
    await expect(bodyMapDialog.getByRole('img', { name: 'Front' })).toBeVisible();
    await expect(bodyMapDialog.getByRole('img', { name: 'Back' })).toBeVisible();
    await bodyMapDialog
      .getByRole('button', { name: /close body activation map/i })
      .click();
    await expect(bodyMapDialog).toHaveCount(0);
    await expect(dialog.getByRole('heading', { name })).toBeVisible();

    await dialog.getByRole('button', { name: /next media/i }).click();
    await expect(dialog.getByText('Side view')).toBeVisible();

    await page.evaluate(() => localStorage.setItem('gymmi.language', 'es'));
    await page.reload();
    await page.getByRole('searchbox', { name: /filtrar ejercicios/i }).fill(name);
    await page.getByRole('heading', { name }).click();

    const spanishDialog = page.getByRole('dialog');
    await expect(spanishDialog.getByText('Cuádriceps')).toHaveCount(2);
    await expect(spanishDialog.getByText('Barra')).toBeVisible();
    await expect(spanishDialog.getByText('Glúteos')).toBeVisible();
    await expect(spanishDialog.getByText('Pantorrillas')).toBeVisible();
    await expect(
      spanishDialog.getByText('Ponte de pie y baja en sentadilla.'),
    ).toBeVisible();
  });

  test('renders the catalog without horizontal overflow on a phone viewport', async ({
    page,
    request,
  }) => {
    const admin = await loginAdminViaApi(request);
    const suffix = Date.now().toString();
    const created = await request.post(`${apiUrl}/exercises`, {
      headers: { Authorization: `Bearer ${admin.accessToken}` },
      data: {
        name: `E2E Mobile Squat ${suffix}`,
        targetMuscle: localized('Quads'),
        equipment: localized('Barbell'),
        instructions: localized('Stand tall and squat to depth.'),
        activationMap: {
          secondary: localized('Glutes'),
          stabilizers: localized('Calves'),
        },
        difficulty: 'Intermediate',
        movementType: 'Compound',
        tags: ['strength'],
      },
    });
    expect(created.status()).toBe(201);

    await page.setViewportSize({ width: 390, height: 844 });
    await applyAuthToPage(page, admin);
    await page.goto('/exercises');

    await expect(page.getByRole('heading', { level: 1, name: 'Exercises' })).toBeVisible();
    await expect(
      page.getByRole('searchbox', { name: /filter exercises/i }),
    ).toBeVisible();

    const { scrollWidth, clientWidth } = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    }));
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth);
  });

  test('paid gym can publish an exercise from the builder', async ({
    page,
    request,
  }) => {
    const admin = await loginAdminViaApi(request);
    const gym = await signupViaApi(request, { role: 'Gym', prefix: 'exgym' });
    await markUserPaidViaApi(request, admin.accessToken, gym.user.id, true);

    await applyAuthToPage(page, gym);
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

  test('trial gym at its custom exercise limit cannot publish another', async ({
    page,
    request,
  }) => {
    // New gyms start a 30-day trial with Gym Plus limits: 5 custom exercises.
    const gym = await signupViaApi(request, {
      role: 'Gym',
      prefix: 'exlimit',
    });
    const suffix = Date.now().toString();
    for (let i = 1; i <= 5; i += 1) {
      const created = await request.post(`${apiUrl}/exercises`, {
        headers: { Authorization: `Bearer ${gym.accessToken}` },
        data: {
          name: `E2E Trial Exercise ${suffix}-${i}`,
          targetMuscle: localized('Quads'),
          equipment: localized('Barbell'),
          instructions: localized('Trial gym custom exercise.'),
          activationMap: {
            secondary: localized('Glutes'),
            stabilizers: localized('Calves'),
          },
          difficulty: 'Intermediate',
          movementType: 'Compound',
          tags: ['strength'],
        },
      });
      expect(created.status()).toBe(201);
    }

    await applyAuthToPage(page, gym);
    await page.goto('/exercises/new');

    await expect(page.getByText('Your gym plan includes 5 custom exercises.')).toBeVisible();
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
