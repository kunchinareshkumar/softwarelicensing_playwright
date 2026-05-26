// tests/login.spec.js
// Test suite: Login with Mobile Number & Password

const { test, expect } = require('../fixtures/index');
const { assertUrl }    = require('../utils/helpers');

test.describe('Login — Mobile & Password', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  // ──────────────────────────────────────────────────────────────
  // POSITIVE TEST CASES
  // ──────────────────────────────────────────────────────────────

  test('TC_LOGIN_001 — Admin login with valid mobile and password', async ({
    loginPage,
    dashboardPage,
    testData,
    page,
  }) => {
    const { mobile, password } = testData.users.admin;

    await loginPage.login(mobile, password);
    await dashboardPage.waitForDashboardLoad();

    await expect(page).toHaveURL(/dashboard/i);
    expect(await dashboardPage.isDashboardVisible()).toBe(true);
  });

  test('TC_LOGIN_002 — Manager login with valid credentials', async ({
    loginPage,
    dashboardPage,
    testData,
    page,
  }) => {
    const { mobile, password } = testData.users.manager;

    await loginPage.login(mobile, password);
    await dashboardPage.waitForDashboardLoad();

    await expect(page).toHaveURL(/dashboard/i);
    expect(await dashboardPage.isDashboardVisible()).toBe(true);
  });

  test('TC_LOGIN_003 — Viewer login with valid credentials', async ({
    loginPage,
    dashboardPage,
    testData,
    page,
  }) => {
    const { mobile, password } = testData.users.viewer;

    await loginPage.login(mobile, password);
    await dashboardPage.waitForDashboardLoad();

    await expect(page).toHaveURL(/dashboard/i);
    expect(await dashboardPage.isDashboardVisible()).toBe(true);
  });

  test('TC_LOGIN_004 — Redirect to dashboard after successful login', async ({
    loginPage,
    dashboardPage,
    testData,
    page,
  }) => {
    await loginPage.login(testData.users.admin.mobile, testData.users.admin.password);
    await dashboardPage.waitForDashboardLoad();

    // URL must contain "dashboard"
    expect(page.url()).toMatch(/dashboard/i);
  });

  test('TC_LOGIN_005 — User name is displayed in header after login', async ({
    loginPage,
    dashboardPage,
    testData,
  }) => {
    await loginPage.login(testData.users.admin.mobile, testData.users.admin.password);
    await dashboardPage.waitForDashboardLoad();

    const userName = await dashboardPage.getUserName();
    expect(userName).toBeTruthy();
    expect(userName.length).toBeGreaterThan(0);
  });

  // ──────────────────────────────────────────────────────────────
  // NEGATIVE TEST CASES
  // ──────────────────────────────────────────────────────────────

  test('TC_LOGIN_006 — Login fails with invalid mobile and password', async ({
    loginPage,
    testData,
    page,
  }) => {
    const { mobile, password } = testData.users.invalid;

    await loginPage.login(mobile, password);
    await loginPage.waitForLoadingToFinish();

    const error = await loginPage.getErrorMessage();
    expect(error).toBeTruthy();
    // Should stay on login page
    expect(page.url()).not.toMatch(/dashboard/i);
  });

  test('TC_LOGIN_007 — Login fails with valid mobile but wrong password', async ({
    loginPage,
    testData,
    page,
  }) => {
    await loginPage.login(testData.users.admin.mobile, 'WrongPass@999');
    await loginPage.waitForLoadingToFinish();

    const error = await loginPage.getErrorMessage();
    expect(error).toBeTruthy();
    expect(page.url()).not.toMatch(/dashboard/i);
  });

  test('TC_LOGIN_008 — Login fails with empty mobile number', async ({
    loginPage,
    page,
  }) => {
    await loginPage.enterMobile('');
    await loginPage.enterPassword('Admin@123');
    await loginPage.clickLogin();

    // Either a field-level error OR a page-level error should appear
    const mobileError = await loginPage.mobileInput.evaluate(el => el.validationMessage);
    expect(
      mobileError.length > 0 ||
      await loginPage.mobileError.isVisible().catch(() => false)
    ).toBe(true);

    expect(page.url()).not.toMatch(/dashboard/i);
  });

  test('TC_LOGIN_009 — Login fails with empty password', async ({
    loginPage,
    page,
  }) => {
    await loginPage.enterMobile('9876543210');
    await loginPage.enterPassword('');
    await loginPage.clickLogin();

    const passwordError = await loginPage.passwordInput.evaluate(el => el.validationMessage);
    expect(
      passwordError.length > 0 ||
      await loginPage.passwordError.isVisible().catch(() => false)
    ).toBe(true);

    expect(page.url()).not.toMatch(/dashboard/i);
  });

  test('TC_LOGIN_010 — Login fails with both fields empty', async ({
    loginPage,
    page,
  }) => {
    await loginPage.clickLogin();
    // Should not navigate away
    expect(page.url()).not.toMatch(/dashboard/i);
  });

  test('TC_LOGIN_011 — Login fails with invalid mobile number format (letters)', async ({
    loginPage,
    testData,
    page,
  }) => {
    await loginPage.login(testData.validation.invalidMobileFormat, 'Admin@123');
    await loginPage.waitForLoadingToFinish();

    expect(page.url()).not.toMatch(/dashboard/i);
  });

  test('TC_LOGIN_012 — Login fails with short mobile number (< 10 digits)', async ({
    loginPage,
    testData,
    page,
  }) => {
    await loginPage.login(testData.validation.shortMobile, 'Admin@123');
    await loginPage.waitForLoadingToFinish();

    expect(page.url()).not.toMatch(/dashboard/i);
  });

  // ──────────────────────────────────────────────────────────────
  // UI / UX VALIDATIONS
  // ──────────────────────────────────────────────────────────────

  test('TC_LOGIN_013 — Password is masked by default', async ({ loginPage }) => {
    await loginPage.enterPassword('Admin@123');
    const inputType = await loginPage.getPasswordInputType();
    expect(inputType).toBe('password');
  });

  test('TC_LOGIN_014 — Password visibility toggle works', async ({ loginPage }) => {
    await loginPage.enterPassword('Admin@123');

    const typeBefore = await loginPage.getPasswordInputType();
    expect(typeBefore).toBe('password');

    await loginPage.togglePasswordVisibility();
    const typeAfter = await loginPage.getPasswordInputType();
    expect(typeAfter).toBe('text');
  });

  test('TC_LOGIN_015 — Login page title / heading is visible', async ({
    loginPage,
    page,
  }) => {
    await expect(page).toHaveTitle(/.+/);
  });

  test('TC_LOGIN_016 — Forgot password link is present', async ({ loginPage }) => {
    expect(await loginPage.forgotPasswordLink.isVisible()).toBe(true);
  });

  test('TC_LOGIN_017 — Mobile field accepts only numeric input (10 digits)', async ({
    loginPage,
    testData,
  }) => {
    await loginPage.enterMobile(testData.users.admin.mobile);
    const value = await loginPage.mobileInput.inputValue();
    expect(/^\d{10}$/.test(value.replace(/\s|-/g, ''))).toBe(true);
  });

  // ──────────────────────────────────────────────────────────────
  // SESSION / SECURITY
  // ──────────────────────────────────────────────────────────────

  test('TC_LOGIN_018 — Session persists after page refresh', async ({
    loginPage,
    dashboardPage,
    testData,
    page,
  }) => {
    await loginPage.login(testData.users.admin.mobile, testData.users.admin.password);
    await dashboardPage.waitForDashboardLoad();

    await page.reload();
    await page.waitForLoadState('networkidle');

    expect(page.url()).toMatch(/dashboard/i);
  });

  test('TC_LOGIN_019 — Logout navigates back to login page', async ({
    loginPage,
    dashboardPage,
    testData,
    page,
  }) => {
    await loginPage.login(testData.users.admin.mobile, testData.users.admin.password);
    await dashboardPage.waitForDashboardLoad();

    await dashboardPage.logout();

    await expect(page).toHaveURL(/login/i);
  });

  test('TC_LOGIN_020 — Cannot access dashboard without login (redirects to login)', async ({
    page,
  }) => {
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');
    expect(page.url()).toMatch(/login/i);
  });
});
