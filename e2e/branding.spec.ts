import { expect, test, type APIRequestContext } from '@playwright/test';
import {
  apiUrl,
  applyAuthToPage,
  loginAdminViaApi,
  markUserPaidViaApi,
  signupViaApi,
  type AuthResponse,
} from './helpers/auth';

async function createExercise(request: APIRequestContext, token: string) {
  const response = await request.post(`${apiUrl}/exercises`, {
    headers: { Authorization: `Bearer ${token}` },
    data: {
      name: `E2E Brand Bench ${Date.now()}`,
      targetMuscle: { en: 'Chest', es: 'Pecho' },
      equipment: { en: 'Barbell', es: 'Barra' },
      instructions: { en: 'Controlled.', es: 'Controlado.' },
      activationMap: { secondary: { en: 'Triceps', es: 'Tríceps' }, stabilizers: { en: 'Core', es: 'Core' } },
      difficulty: 'Intermediate',
      movementType: 'Compound',
      tags: [],
    },
  });
  expect(response.status()).toBe(201);
  return (await response.json()) as { id: string };
}

async function assignRoutine(request: APIRequestContext, coach: AuthResponse, client: AuthResponse, exerciseId: string, name: string) {
  const routine = await request.post(`${apiUrl}/workouts`, {
    headers: { Authorization: `Bearer ${coach.accessToken}` },
    data: {
      name,
      days: [{ weekday: 1, exercises: [{ exerciseId, supersetColor: null, sets: [{ weight: 80, reps: 8, restSeconds: 90 }] }] }],
    },
  });
  expect(routine.status()).toBe(201);
  const contract = await request.post(`${apiUrl}/contracts`, {
    headers: { Authorization: `Bearer ${client.accessToken}` },
    data: { trainerId: coach.user.id, period: 'MONTH' },
  });
  expect(contract.status()).toBe(201);
  const accepted = await request.post(`${apiUrl}/contracts/${(await contract.json()).id}/accept`, {
    headers: { Authorization: `Bearer ${coach.accessToken}` },
  });
  expect(accepted.status()).toBe(201);
  const assigned = await request.post(`${apiUrl}/workouts/${(await routine.json()).id}/assignments`, {
    headers: { Authorization: `Bearer ${coach.accessToken}` },
    data: { clientId: client.user.id, period: 'MONTH' },
  });
  expect(assigned.status()).toBe(201);
}

test.describe('custom branding', () => {
  test('Pro coach sets a brand in Settings; their client sees it on the plan and routine', async ({ page, request }) => {
    const admin = await loginAdminViaApi(request);
    const coach = await signupViaApi(request, { role: 'Trainer', prefix: 'brandcoach' });
    const client = await signupViaApi(request, { role: 'Client', prefix: 'brandathlete' });
    await markUserPaidViaApi(request, admin.accessToken, coach.user.id, true, 'pro');

    // Coach: Settings → Your brand
    await applyAuthToPage(page, coach);
    await page.goto('/settings');
    const card = page.getByTestId('brand-settings-card');
    await card.getByPlaceholder('e.g. Iron Coaching').fill('Iron Coaching');
    await card.getByRole('radio', { name: '#0b3d91' }).click();
    await expect(card.getByTestId('brand-band')).toHaveText(/Coached by Iron Coaching/);
    await card.getByRole('button', { name: 'Save brand' }).click();
    await expect(page.getByText('Brand saved')).toBeVisible();

    const exercise = await createExercise(request, admin.accessToken);
    const name = `E2E Branded Plan ${Date.now()}`;
    await assignRoutine(request, coach, client, exercise.id, name);

    // Client: dashboard plan card, library card, routine page
    await applyAuthToPage(page, client);
    await page.goto('/dashboard');
    const band = page.getByTestId('brand-band').first();
    await expect(band).toHaveText(/Coached by Iron Coaching/);
    await expect(band).toHaveCSS('background-color', 'rgb(11, 61, 145)');

    await page.goto('/workout');
    await expect(page.getByRole('heading', { name }).locator('..').getByTestId('brand-band')).toHaveText(/Iron Coaching/);

    const assignment = await request.get(`${apiUrl}/workouts/assignments/me`, {
      headers: { Authorization: `Bearer ${client.accessToken}` },
    });
    const { routineId } = (await assignment.json()) as { routineId: string };
    await page.goto(`/workout/${routineId}`);
    await expect(page.getByTestId('brand-band')).toHaveText(/Coached by Iron Coaching/);
  });

  test('a Plus coach sees the brand card locked behind Coach Pro', async ({ page, request }) => {
    const admin = await loginAdminViaApi(request);
    const coach = await signupViaApi(request, { role: 'Trainer', prefix: 'brandpluscoach' });
    await markUserPaidViaApi(request, admin.accessToken, coach.user.id, true, 'plus');

    await applyAuthToPage(page, coach);
    await page.goto('/settings');
    const card = page.getByTestId('brand-settings-card');
    await expect(card.getByPlaceholder('e.g. Iron Coaching')).toBeDisabled();
    await card.getByRole('button', { name: 'Unlock with Coach Pro' }).click();
    await expect(page.getByRole('dialog', { name: 'Unlock more with Pro' })).toBeVisible();
  });
});
