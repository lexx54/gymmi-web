import { expect, test, type Page } from '@playwright/test';
import { password, uniqueUser } from './helpers/auth';

test.describe('signup', () => {
  test('renders step 1 of the signup wizard', async ({ page }) => {
    await page.goto('/signup');

    await expect(page.getByRole('heading', { name: 'Create account' })).toBeVisible();
    await expect(page.getByText('Step 1 of 3')).toBeVisible();
    await expect(page.getByTestId('role-client')).toBeVisible();
    await expect(page.getByTestId('role-trainer')).toBeVisible();
    await expect(page.getByTestId('input-email')).toBeVisible();
    await expect(page.getByTestId('input-username')).toBeVisible();
    await expect(page.getByTestId('step1-next')).toBeVisible();
  });

  test('shows client validation errors and stays on step 1 for an empty submit', async ({
    page,
  }) => {
    await page.goto('/signup');

    await page.getByTestId('step1-next').click();

    await expect(page.getByText('Email is required')).toBeVisible();
    await expect(page.getByTestId('signup-step-1')).toBeVisible();
    await expect(page.getByTestId('signup-step-2')).toHaveCount(0);
    await expect(page).toHaveURL(/\/signup$/);
  });

  test('creates a client account through the wizard and redirects to login', async ({ page }) => {
    const user = uniqueUser('signup');

    let response = await completeWizard(page, user);
    if (response.status() === 429) {
      // Signup is rate-limited per IP and the whole suite shares 127.0.0.1. After a 429 the page
      // locks itself, so wait for the API window to reset, reload, and go through the wizard again.
      const retryAfter = Number(response.headers()['retry-after']);
      const waitMs = (Number.isFinite(retryAfter) && retryAfter > 0 ? retryAfter : 60) * 1000 + 500;
      test.info().setTimeout(test.info().timeout + waitMs);
      await page.waitForTimeout(waitMs);
      response = await completeWizard(page, user);
    }
    expect(response.status()).toBe(201);

    await expect(page.getByText('Account created successfully!')).toBeVisible();
    await expect(page).toHaveURL(/\/login$/);
  });
});

/** Fills all three wizard steps as a client, submits, and returns the signup API response. */
async function completeWizard(page: Page, user: ReturnType<typeof uniqueUser>) {
  await page.goto('/signup');

  // Step 1: role and credentials
  await page.getByTestId('role-client').click();
  await page.getByTestId('input-email').fill(user.email);
  await page.getByTestId('input-username').fill(user.username);
  await page.getByTestId('input-password').fill(password);
  await page.getByTestId('input-confirmPassword').fill(password);
  await page.getByTestId('step1-next').click();

  // Step 2: body and goals
  await expect(page.getByTestId('signup-step-2')).toBeVisible();
  await page.getByTestId('input-age').fill('26');
  await page.getByTestId('select-gender').selectOption('male');
  await page.getByTestId('input-height').fill('182');
  await page.getByTestId('input-weight').fill('78');
  await page.getByTestId('select-goal').selectOption({ index: 1 });
  await page.getByTestId('step2-next').click();

  // Step 3: review, accept the Terms, confirm
  await expect(page.getByTestId('signup-step-confirmation')).toBeVisible();
  await expect(page.getByText(user.email)).toBeVisible();
  await page.getByTestId('input-accept-terms').check();
  const [response] = await Promise.all([
    page.waitForResponse(
      (res) => res.url().endsWith('/auth/signup') && res.request().method() === 'POST',
    ),
    page.getByTestId('confirm-signup-btn').click(),
  ]);
  return response;
}
