import { expect, test, type APIRequestContext } from '@playwright/test';
import {
  apiUrl,
  applyAuthToPage,
  loginAdminViaApi,
  markUserPaidViaApi,
  signupViaApi,
} from './helpers/auth';

async function createExercise(request: APIRequestContext, token: string, name: string) {
  const response = await request.post(`${apiUrl}/exercises`, {
    headers: { Authorization: `Bearer ${token}` },
    data: {
      name,
      targetMuscle: { en: 'Chest', es: 'Pecho' },
      equipment: { en: 'Barbell', es: 'Barra' },
      instructions: { en: 'Controlled repetitions.', es: 'Repeticiones controladas.' },
      activationMap: {
        secondary: { en: 'Triceps', es: 'Tríceps' },
        stabilizers: { en: 'Core', es: 'Core' },
      },
      difficulty: 'Intermediate',
      movementType: 'Compound',
      tags: [],
    },
  });
  expect(response.status()).toBe(201);
  return response.json() as Promise<{ id: string }>;
}

async function createRoutine(
  request: APIRequestContext,
  token: string,
  exerciseId: string,
  name: string,
) {
  const response = await request.post(`${apiUrl}/workouts`, {
    headers: { Authorization: `Bearer ${token}` },
    data: {
      name,
      description: 'E2E workout plan',
      days: [{
        weekday: 1,
        exercises: [{
          exerciseId,
          supersetColor: null,
          sets: [{ weight: 80, reps: 10, restSeconds: 90, rpe: 8 }],
        }],
      }],
    },
  });
  expect(response.status()).toBe(201);
  return response.json() as Promise<{ id: string }>;
}

test.describe('workouts', () => {
  test('trainer sees creator actions and responsive real builder', async ({ page, request }) => {
    const admin = await loginAdminViaApi(request);
    const trainer = await signupViaApi(request, { role: 'Trainer', prefix: 'workouttrainer' });
    await markUserPaidViaApi(request, admin.accessToken, trainer.user.id);
    const exercise = await createExercise(request, admin.accessToken, `E2E Bench ${Date.now()}`);
    const name = `E2E Trainer Routine ${Date.now()}`;
    const routine = await createRoutine(request, trainer.accessToken, exercise.id, name);

    await applyAuthToPage(page, trainer);
    await page.goto('/workout');
    await page.getByRole('searchbox', { name: /search your library/i }).fill(name);
    const card = page.getByRole('heading', { name }).locator('..');
    await expect(card.getByText('Owned')).toBeVisible();
    await expect(card.getByRole('link', { name: /edit/i })).toBeVisible();
    await expect(card.getByRole('button', { name: /share/i })).toBeVisible();
    await expect(card.getByRole('button', { name: /assign/i })).toBeVisible();

    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`/workout/${routine.id}/edit`);
    await expect(page.getByLabel('Routine title')).toHaveValue(name);
    await expect(page.getByLabel('Set 1 rest seconds')).toHaveValue('90');
    const overflow = await page.evaluate(() => ({
      scroll: document.documentElement.scrollWidth,
      client: document.documentElement.clientWidth,
    }));
    expect(overflow.scroll).toBeLessThanOrEqual(overflow.client);
  });

  test('client sees active assignment and read-only routine', async ({ page, request }) => {
    const admin = await loginAdminViaApi(request);
    const trainer = await signupViaApi(request, { role: 'Trainer', prefix: 'assigntrainer' });
    const client = await signupViaApi(request, { role: 'Client', prefix: 'assignclient' });
    await markUserPaidViaApi(request, admin.accessToken, trainer.user.id);
    await markUserPaidViaApi(request, admin.accessToken, client.user.id);
    const exercise = await createExercise(request, admin.accessToken, `E2E Row ${Date.now()}`);
    const name = `E2E Assigned Routine ${Date.now()}`;
    const routine = await createRoutine(request, trainer.accessToken, exercise.id, name);
    const assignment = await request.post(`${apiUrl}/workouts/${routine.id}/assignments`, {
      headers: { Authorization: `Bearer ${trainer.accessToken}` },
      data: { clientId: client.user.id, period: 'WEEK' },
    });
    expect(assignment.status()).toBe(201);

    await applyAuthToPage(page, client);
    await page.goto('/dashboard');
    await expect(page.getByText(name)).toBeVisible();
    await page.getByRole('link', { name: /open assigned routine/i }).click();
    await expect(page).toHaveURL(`/workout/${routine.id}`);
    await expect(page.getByLabel('Routine title')).toHaveValue(name);
    await expect(page.getByLabel('Routine title')).toBeDisabled();
    await expect(page.getByRole('button', { name: /remove exercise/i })).toHaveCount(0);
  });
});
