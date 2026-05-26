// fixtures/index.js
// Central Playwright fixtures — extend the base `test` with page objects and helpers

const { test: base, expect } = require('@playwright/test');
const { LoginPage }          = require('../pages/LoginPage');
const { DashboardPage }      = require('../pages/DashboardPage');
const { ManageLicensesPage } = require('../pages/ManageLicensesPage');
const testData               = require('../data/testdata.json');

/**
 * Custom fixture type declarations (JSDoc for IDE support)
 *
 * @typedef {object} CustomFixtures
 * @property {LoginPage}          loginPage
 * @property {DashboardPage}      dashboardPage
 * @property {ManageLicensesPage} manageLicensesPage
 * @property {typeof testData}    testData
 * @property {Function}           loginAsAdmin
 * @property {Function}           loginAsManager
 * @property {Function}           loginAsViewer
 * @property {Function}           loginWithCredentials
 * @property {Function}           setupAndLogin
 */


const test = base.extend({
  // ── Page Object Fixtures ────────────────────────────────────────

  /** Provides an instance of LoginPage */
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },

  /** Provides an instance of DashboardPage */
  dashboardPage: async ({ page }, use) => {
    const dashboardPage = new DashboardPage(page);
    await use(dashboardPage);
  },

  /** Provides an instance of ManageLicensesPage */
  manageLicensesPage: async ({ page }, use) => {
    const manageLicensesPage = new ManageLicensesPage(page);
    await use(manageLicensesPage);
  },

  // ── Data Fixture ────────────────────────────────────────────────

  /** Provides the full test-data object */
  testData: async ({}, use) => {
    await use(testData);
  },

  // ── Auth Helper Fixtures ────────────────────────────────────────

  /**
   * Logs in as admin and lands on the dashboard.
   * Usage: `const dashboard = await loginAsAdmin();`
   */
  loginAsAdmin: async ({ page }, use) => {
    const helper = async () => {
      const loginPage     = new LoginPage(page);
      const dashboardPage = new DashboardPage(page);

      await loginPage.goto();
      await loginPage.login(
        testData.users.admin.mobile,
        testData.users.admin.password
      );
      await dashboardPage.waitForDashboardLoad();
      return dashboardPage;
    };
    await use(helper);
  },

  /**
   * Logs in as manager and lands on the dashboard.
   */
  
  loginAsManager: async ({ page }, use) => {
    const helper = async () => {
      const loginPage     = new LoginPage(page);
      const dashboardPage = new DashboardPage(page);

      await loginPage.goto();
      await loginPage.login(
        testData.users.manager.mobile,
        testData.users.manager.password
      );
      await dashboardPage.waitForDashboardLoad();
      return dashboardPage;
    };
    await use(helper);
  },

  /**
   * Logs in as viewer and lands on the dashboard.
   */
  loginAsViewer: async ({ page }, use) => {
    const helper = async () => {
      const loginPage     = new LoginPage(page);
      const dashboardPage = new DashboardPage(page);

      await loginPage.goto();
      await loginPage.login(
        testData.users.viewer.mobile,
        testData.users.viewer.password
      );
      await dashboardPage.waitForDashboardLoad();
      return dashboardPage;
    };
    await use(helper);
  },

  /**
   * Generic login helper — pass any mobile + password.
   * Usage: `const dashboard = await loginWithCredentials('9876543210', 'Admin@123');`
   */
  loginWithCredentials: async ({ page }, use) => {
    const helper = async (mobile, password) => {
      const loginPage = new LoginPage(page);
      await loginPage.goto();
      await loginPage.login(mobile, password);
      return loginPage;
    };
    await use(helper);
  },

  /**
   * Logs in as admin, then navigates to the Manage Licenses page.
   * Returns `{ dashboardPage, manageLicensesPage }`.
   */
  setupAndLogin: async ({ page }, use) => {
    const helper = async () => {
      const loginPage          = new LoginPage(page);
      const dashboardPage      = new DashboardPage(page);
      const manageLicensesPage = new ManageLicensesPage(page);

      await loginPage.goto();
      await loginPage.login(
        testData.users.admin.mobile,
        testData.users.admin.password
      );
      await dashboardPage.waitForDashboardLoad();

      return { dashboardPage, manageLicensesPage };
    };
    await use(helper);
  },
});

// Re-export both `test` and `expect` so spec files import only from fixtures
module.exports = { test, expect };
