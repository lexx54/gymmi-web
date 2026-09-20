import { expect, test } from '@playwright/test';

test.describe('Landing Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('renders hero section, branding, and unauthenticated action links', async ({ page }) => {
    // Branding and navbar
    await expect(page.locator('header').getByText('GYMMI')).toBeVisible();
    await expect(page.getByRole('link', { name: /log in/i }).first()).toBeVisible();
    await expect(page.getByRole('link', { name: /get started/i }).first()).toBeVisible();

    // Hero headline and subtext
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Coaching Meets Execution');
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Elevate Every Rep');
  });

  test('navigates to signup and login from hero and navbar CTAs', async ({ page }) => {
    // Click Get Started in navbar
    const getStartedLink = page.getByRole('link', { name: /get started/i }).first();
    await getStartedLink.click();
    await expect(page).toHaveURL(/\/signup$/);

    // Return to landing page
    await page.goto('/');

    // Click Log In
    const loginLink = page.getByRole('link', { name: /log in/i }).first();
    await loginLink.click();
    await expect(page).toHaveURL(/\/login$/);
  });

  test('allows switching between feature showcase tabs', async ({ page }) => {
    // Tab list
    const featuresSection = page.locator('#features');
    await expect(featuresSection).toBeVisible();

    // Default Routine Builder tab
    await expect(featuresSection.getByText('Visual Workout Programming')).toBeVisible();

    // Click Muscle Body Map tab
    await featuresSection.getByRole('tab', { name: /muscle body map/i }).click();
    await expect(featuresSection.getByText('Interactive Muscle Targeting')).toBeVisible();

    // Interact with muscle selector
    await featuresSection.getByRole('button', { name: 'Legs' }).click();
    await expect(featuresSection.getByText('Barbell Back Squat')).toBeVisible();

    // Click Active Workout tab
    await featuresSection.getByRole('tab', { name: /active workout/i }).click();
    await expect(featuresSection.getByText('Real-Time Workout Execution')).toBeVisible();
  });

  test('allows toggling roles and billing frequency in the pricing section', async ({ page }) => {
    const pricingSection = page.locator('#pricing');
    await expect(pricingSection).toBeVisible();

    // Default Trainer plans
    await expect(pricingSection.getByText('Free Coach')).toBeVisible();
    await expect(pricingSection.getByText('Coach Plus')).toBeVisible();
    await expect(pricingSection.getByText('Coach Pro')).toBeVisible();

    // Verify Pro tier button is disabled
    const proButton = pricingSection.getByRole('button', { name: /coming soon/i }).last();
    await expect(proButton).toBeDisabled();

    // Switch to Athlete / Client tab
    await pricingSection.getByRole('tab', { name: /for athletes & clients/i }).click();
    await expect(pricingSection.getByText('Solo Athlete')).toBeVisible();
    await expect(pricingSection.getByText('Athlete Plus')).toBeVisible();
    await expect(pricingSection.getByText('Athlete Pro')).toBeVisible();

    // Switch to Annual billing
    await pricingSection.getByRole('button', { name: /annual/i }).click();
    await expect(pricingSection.getByText(/billed annually/i).first()).toBeVisible();
  });

  test('allows switching language dynamically between English and Spanish', async ({ page }) => {
    // Click language switcher button in navbar
    const langBtn = page.getByRole('button', { name: /switch language/i });
    await expect(langBtn).toBeVisible();

    // Switch to Spanish
    await langBtn.click();
    await expect(page.getByRole('heading', { level: 1 })).toContainText('El Entrenamiento se Une a la Ejecución');

    // Switch back to English
    await langBtn.click();
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Coaching Meets Execution');
  });
});
