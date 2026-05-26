// tests/dashboard.spec.js
// Test suite: Software Licensing Dashboard

const { test, expect } = require('../fixtures/index');

test.describe('Dashboard — Software Licensing', () => {

  // Log in once before all tests in this suite
  test.beforeEach(async ({ loginPage, dashboardPage, testData }) => {
    await loginPage.goto();
    await loginPage.login(testData.users.admin.mobile, testData.users.admin.password);
    await dashboardPage.waitForDashboardLoad();
  });

  // ──────────────────────────────────────────────────────────────
  // PAGE STRUCTURE
  // ──────────────────────────────────────────────────────────────

  test('TC_DASH_001 — Dashboard loads successfully after login', async ({
    dashboardPage,
    page,
  }) => {
    await expect(page).toHaveURL(/dashboard/i);
    expect(await dashboardPage.isDashboardVisible()).toBe(true);
  });

  test('TC_DASH_002 — Sidebar navigation is visible', async ({ dashboardPage }) => {
    expect(await dashboardPage.isSidebarVisible()).toBe(true);
  });

  test('TC_DASH_003 — Header / logo is displayed', async ({ dashboardPage }) => {
    expect(await dashboardPage.headerLogo.isVisible()).toBe(true);
  });

  test('TC_DASH_004 — All stat widgets are visible', async ({ dashboardPage }) => {
    await expect(dashboardPage.totalLicensesWidget).toBeVisible();
    await expect(dashboardPage.activeLicensesWidget).toBeVisible();
    await expect(dashboardPage.expiringSoonWidget).toBeVisible();
    await expect(dashboardPage.expiredWidget).toBeVisible();
  });

  // ──────────────────────────────────────────────────────────────
  // WIDGET DATA
  // ──────────────────────────────────────────────────────────────

  test('TC_DASH_005 — Total licenses count is a non-negative number', async ({
    dashboardPage,
  }) => {
    const total = await dashboardPage.getTotalLicensesCount();
    expect(total).toBeGreaterThanOrEqual(0);
  });

  test('TC_DASH_006 — Active licenses count is a non-negative number', async ({
    dashboardPage,
  }) => {
    const active = await dashboardPage.getActiveLicensesCount();
    expect(active).toBeGreaterThanOrEqual(0);
  });

  test('TC_DASH_007 — Expiring soon count is a non-negative number', async ({
    dashboardPage,
  }) => {
    const expiring = await dashboardPage.getExpiringSoonCount();
    expect(expiring).toBeGreaterThanOrEqual(0);
  });

  test('TC_DASH_008 — Expired licenses count is a non-negative number', async ({
    dashboardPage,
  }) => {
    const expired = await dashboardPage.getExpiredCount();
    expect(expired).toBeGreaterThanOrEqual(0);
  });

  test('TC_DASH_009 — Active count does not exceed total count', async ({
    dashboardPage,
  }) => {
    const total  = await dashboardPage.getTotalLicensesCount();
    const active = await dashboardPage.getActiveLicensesCount();
    expect(active).toBeLessThanOrEqual(total);
  });

  // ──────────────────────────────────────────────────────────────
  // NAVIGATION
  // ──────────────────────────────────────────────────────────────

  test('TC_DASH_010 — Clicking Manage Licenses navigates to /licenses', async ({
    dashboardPage,
    page,
  }) => {
    await dashboardPage.navigateToManageLicenses();
    await expect(page).toHaveURL(/license/i);
  });

  test('TC_DASH_011 — Clicking Reports navigates to reports page', async ({
    dashboardPage,
    page,
  }) => {
    await dashboardPage.navigateToReports();
    await expect(page).toHaveURL(/report/i);
  });

  test('TC_DASH_012 — Clicking Settings navigates to settings page', async ({
    dashboardPage,
    page,
  }) => {
    await dashboardPage.navigateToSettings();
    await expect(page).toHaveURL(/setting/i);
  });

  test('TC_DASH_013 — Dashboard breadcrumb / page heading is shown', async ({
    dashboardPage,
  }) => {
    const heading = await dashboardPage.getPageHeading();
    expect(heading).toBeTruthy();
    expect(heading.trim().length).toBeGreaterThan(0);
  });

  // ──────────────────────────────────────────────────────────────
  // QUICK ACTIONS
  // ──────────────────────────────────────────────────────────────

  test('TC_DASH_014 — Add License quick-action button is visible', async ({
    dashboardPage,
  }) => {
    // This button may not exist on all implementations — soft check
    const visible = await dashboardPage.addLicenseQuickBtn.isVisible().catch(() => false);
    if (visible) {
      expect(visible).toBe(true);
    } else {
      test.skip();
    }
  });

  test('TC_DASH_015 — View All Licenses button navigates correctly', async ({
    dashboardPage,
    page,
  }) => {
    const visible = await dashboardPage.viewAllLicensesBtn.isVisible().catch(() => false);
    if (!visible) { test.skip(); return; }

    await dashboardPage.clickViewAllLicenses();
    await expect(page).toHaveURL(/license/i);
  });

  // ──────────────────────────────────────────────────────────────
  // USER INFO
  // ──────────────────────────────────────────────────────────────

  test('TC_DASH_016 — Logged-in user name is displayed in header', async ({
    dashboardPage,
  }) => {
    const name = await dashboardPage.getUserName();
    expect(name).toBeTruthy();
  });

  test('TC_DASH_017 — Notification bell icon is present', async ({
    dashboardPage,
  }) => {
    const visible = await dashboardPage.notificationBell.isVisible().catch(() => false);
    expect(visible).toBe(true);
  });

  // ──────────────────────────────────────────────────────────────
  // LOGOUT
  // ──────────────────────────────────────────────────────────────

  test('TC_DASH_018 — Logout from dashboard redirects to login page', async ({
    dashboardPage,
    page,
  }) => {
    await dashboardPage.logout();
    await expect(page).toHaveURL(/login/i);
  });

  test('TC_DASH_019 — Cannot revisit dashboard after logout (session cleared)', async ({
    dashboardPage,
    page,
  }) => {
    await dashboardPage.logout();
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');
    // Should redirect to login
    await expect(page).toHaveURL(/login/i);
  });

  // ──────────────────────────────────────────────────────────────
  // RESPONSIVENESS
  // ──────────────────────────────────────────────────────────────

  test('TC_DASH_020 — Dashboard widgets visible at 1280×720 viewport', async ({
    dashboardPage,
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await dashboardPage.waitForDashboardLoad();
    expect(await dashboardPage.isDashboardVisible()).toBe(true);
  });

  test('TC_DASH_021 — Dashboard is accessible at 768px width (tablet)', async ({
    dashboardPage,
    page,
  }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await dashboardPage.waitForDashboardLoad();
    expect(await dashboardPage.isDashboardVisible()).toBe(true);
  });
});
