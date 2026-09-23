import { expect, test } from '@playwright/test';

const apiUrl = process.env.E2E_API_URL ?? 'http://localhost:3001';
const password = 'secret12';

function uniqueUser(role: string) {
  const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  return {
    email: `ana-${role.toLowerCase()}-${id}@example.com`,
    username: `ana${role.toLowerCase()}${id.replace(/[^a-zA-Z0-9]/g, '').slice(0, 10)}`,
  };
}

test.describe('analytics page', () => {
  test('renders all 4 training analytics cards for an authenticated client', async ({ page }) => {
    const user = uniqueUser('Client');

    const signupResponse = await page.request.post(`${apiUrl}/auth/signup`, {
      headers: { 'X-Client-Id': `playwright-signup-${user.username}` },
      data: {
        ...user,
        password,
        role: 'Client',
      },
    });
    expect(signupResponse.status()).toBe(201);

    await page.goto('/login');
    await page.getByPlaceholder('email@mail.com').fill(user.email);
    await page.locator('input[type="password"]').fill(password);
    await page.getByRole('button', { name: /^login$/i }).click();
    await expect(page).toHaveURL(/\/dashboard$/);

    // Navigate to Analytics
    await page.goto('/analytics');
    await expect(page).toHaveURL(/\/analytics$/);

    // Verify 4 Cards are rendered
    await expect(page.getByText('Volume Trends')).toBeVisible();
    await expect(page.getByText('Muscle Load')).toBeVisible();
    await expect(page.getByText('Consistency Heatmap')).toBeVisible();
    await expect(page.getByText('Personal Records')).toBeVisible();

    // Verify consistency & intensity elements
    await expect(page.getByText('Commitment Tracking')).toBeVisible();
    await expect(page.getByText('Workout Intensity')).toBeVisible();
    await expect(page.getByText('Body Composition')).toBeVisible();
    await expect(page.getByText('Hall of Fame')).toBeVisible();
  });
});
