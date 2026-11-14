import { test, expect } from '@playwright/test';

/**
 * End-to-End test suite verifying role-based access control (RBAC) on the administrative console
 * and authentication modal security controls.
 * Strictly asserts authentication and authorization boundaries for unauthenticated visitors,
 * standard customer accounts, and administrative accounts.
 */
test.describe('Admin Portal Access Control & RBAC Enforcement', () => {
  /**
   * Test 1: Unauthenticated visitor accessing /admin directly
   */
  test('should display 401 Unauthorized card and restrict admin table for unauthenticated visitors', async ({ page }) => {
    await page.goto('/admin');

    await expect(page.locator('text=401 Unauthorized')).toBeVisible();
    await expect(page.locator('h1:has-text("Authentication Required")')).toBeVisible();
    await expect(page.locator('button:has-text("Sign In as Administrator")')).toBeVisible();
    await expect(page.locator('a:has-text("Return to Storefront")')).toBeVisible();

    await expect(page.locator('text=Tracked Catalog Products & Competitor Target Links')).not.toBeVisible();
    await expect(page.locator('button:has-text("Run Playwright Price Sync")')).not.toBeVisible();
    await expect(page.locator('h1:has-text("Admin & Scraping Console")')).not.toBeVisible();
  });

  /**
   * Test 2: Unauthenticated visitor navbar visibility
   */
  test('should not render Admin Console or Admin links in navbar for unauthenticated visitors', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('header a:has-text("Admin Console")')).not.toBeVisible();
    await expect(page.locator('header a:has-text("Admin")')).not.toBeVisible();
    await expect(page.locator('header button:has-text("Sign In")')).toBeVisible();
  });

  /**
   * Test 3: Authenticated customer accessing /admin
   */
  test('should display 403 Forbidden card and restrict admin controls for standard customer accounts', async ({ page }) => {
    await page.goto('/');

    const signInButton = page.locator('header button:has-text("Sign In")');
    await expect(signInButton).toBeVisible();
    await signInButton.click();

    const authModal = page.locator('text=User Authentication');
    await expect(authModal).toBeVisible();

    await page.locator('input[type="email"]').fill('customer@kromacommerce.com');
    await page.locator('input[placeholder="Minimum 6 characters"]').fill('Customer123!');
    await page.locator('button[type="submit"]:has-text("Sign In")').click();

    await expect(authModal).not.toBeVisible();
    await expect(page.locator('header').getByText('(CUSTOMER)')).toBeVisible();

    await page.goto('/admin');

    await expect(page.locator('text=403 Forbidden')).toBeVisible();
    await expect(page.locator('h1:has-text("Administrator Clearance Required")')).toBeVisible();
    await expect(page.locator('text=customer@kromacommerce.com')).toBeVisible();
    await expect(page.locator('text=[CUSTOMER]')).toBeVisible();
    await expect(page.locator('text=This portal requires elevated [ADMIN] privileges')).toBeVisible();
    await expect(page.locator('button:has-text("Switch to Administrator Account")')).toBeVisible();
    await expect(page.locator('a:has-text("Return to Storefront")')).toBeVisible();

    await expect(page.locator('text=Tracked Catalog Products & Competitor Target Links')).not.toBeVisible();
    await expect(page.locator('button:has-text("Run Playwright Price Sync")')).not.toBeVisible();
    await expect(page.locator('h1:has-text("Admin & Scraping Console")')).not.toBeVisible();
  });

  /**
   * Test 4: Authenticated customer navbar verification
   */
  test('should not display Admin link in navbar for authenticated customer', async ({ page }) => {
    await page.goto('/');

    const signInButton = page.locator('header button:has-text("Sign In")');
    await expect(signInButton).toBeVisible();
    await signInButton.click();

    const authModal = page.locator('text=User Authentication');
    await expect(authModal).toBeVisible();

    await page.locator('input[type="email"]').fill('customer@kromacommerce.com');
    await page.locator('input[placeholder="Minimum 6 characters"]').fill('Customer123!');
    await page.locator('button[type="submit"]:has-text("Sign In")').click();

    await expect(authModal).not.toBeVisible();
    await expect(page.locator('header').getByText('(CUSTOMER)')).toBeVisible();

    await expect(page.locator('header a:has-text("Admin Console")')).not.toBeVisible();
    await expect(page.locator('header a:has-text("Admin")')).not.toBeVisible();
    await expect(page.locator('header a:has-text("Orders")')).toBeVisible();
  });

  /**
   * Test 5: Authenticated administrator access and controls
   */
  test('should display Admin link in navbar and grant full access to admin console for administrator', async ({ page }) => {
    await page.goto('/');

    const signInButton = page.locator('header button:has-text("Sign In")');
    await expect(signInButton).toBeVisible();
    await signInButton.click();

    const authModal = page.locator('text=User Authentication');
    await expect(authModal).toBeVisible();

    await page.locator('input[type="email"]').fill('admin@kromacommerce.com');
    await page.locator('input[placeholder="Minimum 6 characters"]').fill('Admin123!');
    await page.locator('button[type="submit"]:has-text("Sign In")').click();

    await expect(authModal).not.toBeVisible();
    await expect(page.locator('header').getByText('(ADMIN)')).toBeVisible();

    const adminConsoleLink = page.getByRole('link', { name: 'Admin Console' });
    const adminNavLink = page.getByRole('link', { name: 'Admin', exact: true });

    await expect(adminConsoleLink).toBeVisible();
    await expect(adminNavLink).toBeVisible();

    await adminNavLink.click();
    await page.waitForURL(/\/admin/);

    await expect(page.locator('h1:has-text("Admin & Scraping Console")')).toBeVisible();
    await expect(page.locator('button:has-text("Run Playwright Price Sync")')).toBeVisible();
    await expect(page.getByText('API Gateway', { exact: true })).toBeVisible();
    await expect(page.getByText('Auth Service', { exact: true })).toBeVisible();
    await expect(page.getByText('Catalog Service', { exact: true })).toBeVisible();
    await expect(page.getByText('Scraper Service', { exact: true })).toBeVisible();

    await expect(page.locator('text=Tracked Catalog Products & Competitor Target Links')).toBeVisible();
    await expect(page.locator('table')).toBeVisible();
    await expect(page.locator('table th:has-text("Product Name")')).toBeVisible();
    await expect(page.locator('table th:has-text("Competitor Target URL")')).toBeVisible();
  });

  /**
   * Test 6: Show/Hide password toggle in authentication modal
   */
  test('should toggle password visibility and aria-label between masked and unmasked in AuthModal', async ({ page }) => {
    await page.goto('/');

    const signInButton = page.locator('header button:has-text("Sign In")');
    await expect(signInButton).toBeVisible();
    await signInButton.click();

    const authModal = page.locator('text=User Authentication');
    await expect(authModal).toBeVisible();

    const passwordInput = page.locator('input[placeholder="Minimum 6 characters"]');
    const showPasswordButton = page.locator('button[aria-label="Show password"]');
    const hidePasswordButton = page.locator('button[aria-label="Hide password"]');

    /** Assert initial masked state */
    await expect(passwordInput).toHaveAttribute('type', 'password');
    await expect(showPasswordButton).toBeVisible();
    await expect(hidePasswordButton).not.toBeVisible();

    /** Input password and click Show password button */
    await passwordInput.fill('Admin123!');
    await showPasswordButton.click();

    /** Assert unmasked state */
    await expect(passwordInput).toHaveAttribute('type', 'text');
    await expect(hidePasswordButton).toBeVisible();
    await expect(showPasswordButton).not.toBeVisible();
    await expect(passwordInput).toHaveValue('Admin123!');

    /** Click Hide password button */
    await hidePasswordButton.click();

    /** Assert reverted masked state */
    await expect(passwordInput).toHaveAttribute('type', 'password');
    await expect(showPasswordButton).toBeVisible();
    await expect(hidePasswordButton).not.toBeVisible();
    await expect(passwordInput).toHaveValue('Admin123!');
  });
});
