import { test, expect } from '@playwright/test';

/**
 * End-to-End browser test suite verifying complete customer purchase flow,
 * catalog search/filter, live price intelligence widget, multi-step shipping address entry,
 * payment gateway downtime handling, pending order placement, and order history ledger.
 */
test.describe('Storefront & Price Intelligence End-to-End Flow', () => {
  test('should complete the entire customer discovery and checkout journey', async ({ page }) => {
    /** Step 1: Storefront Load & Discovery */
    await page.goto('/');
    await expect(page).toHaveTitle(/KromaCommerce/i);

    await expect(page.locator('text=Zero-Margin Markup. Verified Fair Pricing.')).toBeVisible();
    await expect(page.locator('text=KROMACOMMERCE PRICE INTELLIGENCE ENGINE')).toBeVisible();

    await expect(page.locator('h3').first()).toBeVisible({ timeout: 15000 });

    /** Step 2: Category Filtering */
    const audioCategoryButton = page.locator('button:has-text("Audio")').first();
    await expect(audioCategoryButton).toBeVisible();
    await audioCategoryButton.click();

    const headphonesCard = page.locator('h3:has-text("Kroma Noise-Cancelling Wireless Headphones")');
    await expect(headphonesCard).toBeVisible();

    /** Step 3: Keyword Search */
    const searchInput = page.locator('input[placeholder*="Search products"]').first();
    await searchInput.fill('Headphones');
    await searchInput.press('Enter');

    await expect(headphonesCard).toBeVisible();

    /** Step 4: Product Details & Competitor Price Intelligence Widget */
    await headphonesCard.click();
    await page.waitForURL(/\/products\/kroma-noise-cancelling-headphones/);

    await expect(page.locator('h1:has-text("Kroma Noise-Cancelling Wireless Headphones")')).toBeVisible();
    await expect(page.locator('text=$199.99').first()).toBeVisible();

    await expect(page.getByText('Competitor Price Intelligence', { exact: true })).toBeVisible();
    await expect(page.locator('text=PLAYWRIGHT AUTOMATED')).toBeVisible();
    await expect(page.locator('text=$229.99').first()).toBeVisible();

    /** Step 5: Add Product to Cart & Cart Drawer Operations */
    const addToCartButton = page.locator('button:has-text("Add to Cart")');
    await expect(addToCartButton).toBeVisible();
    await addToCartButton.click();

    const cartDrawer = page.locator('text=Your Cart (1)');
    if (!(await cartDrawer.isVisible())) {
      const cartButton = page.locator('header button:has-text("Cart")');
      await cartButton.click();
    }

    await expect(cartDrawer).toBeVisible();
    await expect(page.locator('h4:has-text("Kroma Noise-Cancelling Wireless Headphones")')).toBeVisible();

    /** Step 6: Authentication & Multi-Step Checkout Flow */
    const initialCheckoutButton = page.locator('button:has-text("Sign In to Checkout"), button:has-text("Proceed to Shipping Address")');
    await expect(initialCheckoutButton).toBeVisible();
    await initialCheckoutButton.click();

    const authModalHeader = page.locator('text=User Authentication');
    if (await authModalHeader.isVisible()) {
      const customerQuickFill = page.locator('button:has-text("Customer")');
      if (await customerQuickFill.isVisible()) {
        await customerQuickFill.click();
      } else {
        await page.locator('input[type="email"]').fill('customer@kromacommerce.com');
        await page.locator('input[placeholder="Minimum 6 characters"]').fill('Customer123!');
      }

      await page.locator('button[type="submit"]:has-text("Sign In")').click();
      await expect(authModalHeader).not.toBeVisible();

      const cartButtonAfterLogin = page.locator('header button:has-text("Cart")');
      await cartButtonAfterLogin.click();
    }

    const proceedToShippingButton = page.locator('button:has-text("Proceed to Shipping Address")');
    await expect(proceedToShippingButton).toBeVisible();
    await proceedToShippingButton.click();

    await expect(page.locator('span:has-text("Shipping Address")')).toBeVisible();
    await page.locator('input[placeholder*="Evergreen Terrace"]').fill('742 Evergreen Terrace');
    await page.locator('input[placeholder*="Springfield"]').fill('Springfield');
    await page.locator('input[placeholder*="OR"]').fill('OR');
    await page.locator('input[placeholder*="97477"]').fill('97477');

    const proceedToPaymentButton = page.locator('button:has-text("Proceed to Payment")');
    await expect(proceedToPaymentButton).toBeVisible();
    await proceedToPaymentButton.click();

    await expect(page.locator('span:has-text("Payment Options")')).toBeVisible();
    await expect(page.locator('text=Payment Gateway Currently Down').first()).toBeVisible();
    await expect(page.locator('text=Not Paid Directly').first()).toBeVisible();
    await expect(page.locator('button:has-text("Payment Gateway Currently Down"):disabled')).toBeVisible();

    const placePendingOrderButton = page.locator('button:has-text("Place Order (Payment Pending)")');
    await expect(placePendingOrderButton).toBeVisible();
    await placePendingOrderButton.click();

    /** Step 7: Order Recorded Confirmation (Payment Pending) */
    await page.waitForURL(/\/order\/success/, { timeout: 30000 });
    await expect(page.locator('h1:has-text("Order Recorded (Payment Pending)")')).toBeVisible();
    await expect(page.locator('text=PENDING (NOT PAID DIRECTLY)')).toBeVisible();
    await expect(page.locator('text=Payment Gateway Currently Down').first()).toBeVisible();
    await expect(page.locator('text=742 Evergreen Terrace')).toBeVisible();
    await expect(page.locator('text=PAID (CONFIRMED)')).not.toBeVisible();

    /** Step 8: Order History Ledger */
    const viewOrdersLink = page.locator('a:has-text("View My Orders")');
    await expect(viewOrdersLink).toBeVisible();
    await viewOrdersLink.click();

    await page.waitForURL(/\/orders/);
    await expect(page.locator('h1:has-text("Your Order History")')).toBeVisible();
    await expect(page.locator('text=STATUS: PENDING').first()).toBeVisible();
  });
});
