import { expect, test } from '@playwright/test';
import { applyAuthToPage, signupViaApi } from './helpers/auth';

test.describe('analytics page', () => {
  test('renders all 4 training analytics cards for an authenticated client', async ({ page, request }) => {
    const client = await signupViaApi(request, { role: 'Client', prefix: 'analytics' });
    await applyAuthToPage(page, client);

    // Navigate to Analytics
    await page.goto('/analytics');
    await expect(page).toHaveURL(/\/analytics$/);

    // Verify 4 Cards are rendered
    await expect(page.getByText('Volume Trends')).toBeVisible();
    await expect(page.getByText('Muscle Load')).toBeVisible();
    await expect(page.getByText('Consistency Heatmap')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Personal Records' })).toBeVisible();

    // Verify consistency & intensity elements
    await expect(page.getByText('Commitment Tracking')).toBeVisible();
    await expect(page.getByText('Workout Intensity')).toBeVisible();
    await expect(page.getByText('Body Composition')).toBeVisible();
    await expect(page.getByText('Hall of Fame')).toBeVisible();
  });
});
