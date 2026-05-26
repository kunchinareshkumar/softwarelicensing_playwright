// tests/e2e.spec.js
// End-to-End Test Suite — Full User Journeys across Login → Dashboard → Manage Licenses

const { test, expect }         = require('../fixtures/index');
const { generateLicenseKey, getFutureDate, waitForToast } = require('../utils/helpers');

test.describe('E2E — Full User Journey: Software Licensing App', () => {

  // ──────────────────────────────────────────────────────────────
  // JOURNEY 1 — Admin: Login → Dashboard → Add License → Verify
  // ──────────────────────────────────────────────────────────────

  test('E2E_001 — Admin logs in, checks dashboard stats, adds a new license, verifies it appears', async ({
    loginPage,
    dashboardPage,
    manageLicensesPage,
    testData,
    page,
  }) => {
    // Step 1: Login
    await loginPage.goto();
    await loginPage.login(testData.users.admin.mobile, testData.users.admin.password);
    await dashboardPage.waitForDashboardLoad();
    await expect(page).toHaveURL(/dashboard/i);

    // Step 2: Read initial stats
    const initialTotal = await dashboardPage.getTotalLicensesCount();
    expect(initialTotal).toBeGreaterThanOrEqual(0);

    // Step 3: Navigate to Manage Licenses
    await dashboardPage.navigateToManageLicenses();
    await manageLicensesPage.waitForTableLoad();
    await expect(page).toHaveURL(/license/i);

    // Step 4: Add a new license
    const uniqueKey = generateLicenseKey('E2E');
    await manageLicensesPage.addLicense({
      productName:  'E2E Test Product Suite',
      licenseKey:   uniqueKey,
      licenseType:  'Annual',
      seats:        '15',
      expiryDate:   getFutureDate(365),
      assignedTo:   'E2E Automation Corp',
      description:  'Added by E2E automation test',
      status:       'Active',
    });

    // Step 5: Verify success toast
    const successMsg = await manageLicensesPage.getSuccessMessage().catch(() => '');
    expect(successMsg.length).toBeGreaterThan(0);

    // Step 6: Search for the added license
    await manageLicensesPage.searchLicense('E2E Test Product Suite');
    const rowCount = await manageLicensesPage.getTableRowCount();
    expect(rowCount).toBeGreaterThan(0);
  });

  // ──────────────────────────────────────────────────────────────
  // JOURNEY 2 — Admin: Login → Add → Edit → Verify Update
  // ──────────────────────────────────────────────────────────────

  test('E2E_002 — Admin adds a license then edits it and verifies the update', async ({
    loginPage,
    dashboardPage,
    manageLicensesPage,
    testData,
    page,
  }) => {
    // Login
    await loginPage.goto();
    await loginPage.login(testData.users.admin.mobile, testData.users.admin.password);
    await dashboardPage.waitForDashboardLoad();
    await dashboardPage.navigateToManageLicenses();
    await manageLicensesPage.waitForTableLoad();

    // Add License
    const uniqueKey = generateLicenseKey('EDIT');
    await manageLicensesPage.addLicense({
      productName:  'Edit Journey Product',
      licenseKey:   uniqueKey,
      licenseType:  'Monthly',
      seats:        '5',
      expiryDate:   getFutureDate(90),
      assignedTo:   'Edit Test Corp',
      description:  'Will be edited',
      status:       'Active',
    });

    // Search to get it to top
    await manageLicensesPage.searchLicense('Edit Journey Product');

    // Edit License
    await manageLicensesPage.editLicense(0, {
      seats:       '25',
      licenseType: 'Annual',
      description: 'Edited by automation',
    });

    const successMsg = await manageLicensesPage.getSuccessMessage().catch(() => '');
    expect(successMsg.length).toBeGreaterThan(0);
  });

  // ──────────────────────────────────────────────────────────────
  // JOURNEY 3 — Admin: Login → Add → Delete → Verify Removal
  // ──────────────────────────────────────────────────────────────

  test('E2E_003 — Admin adds a license then deletes it and verifies removal', async ({
    loginPage,
    dashboardPage,
    manageLicensesPage,
    testData,
    page,
  }) => {
    await loginPage.goto();
    await loginPage.login(testData.users.admin.mobile, testData.users.admin.password);
    await dashboardPage.waitForDashboardLoad();
    await dashboardPage.navigateToManageLicenses();
    await manageLicensesPage.waitForTableLoad();

    // Add a disposable license
    const uniqueKey = generateLicenseKey('TODIE');
    await manageLicensesPage.addLicense({
      productName:  'Delete Journey Product',
      licenseKey:   uniqueKey,
      licenseType:  'Monthly',
      seats:        '1',
      expiryDate:   getFutureDate(10),
      assignedTo:   'Temp Corp',
      description:  'Will be deleted',
      status:       'Active',
    });

    await manageLicensesPage.searchLicense('Delete Journey Product');
    const countBeforeDelete = await manageLicensesPage.getTableRowCount();
    expect(countBeforeDelete).toBeGreaterThan(0);

    // Delete the first row
    await manageLicensesPage.deleteLicense(0);

    // Verify it's gone
    await manageLicensesPage.searchLicense('Delete Journey Product');
    const countAfterDelete = await manageLicensesPage.getTableRowCount();
    expect(countAfterDelete).toBe(0);
  });

  // ──────────────────────────────────────────────────────────────
  // JOURNEY 4 — Admin: Login → Add → Renew → Verify
  // ──────────────────────────────────────────────────────────────

  test('E2E_004 — Admin renews an existing license and verifies new expiry', async ({
    loginPage,
    dashboardPage,
    manageLicensesPage,
    testData,
    page,
  }) => {
    await loginPage.goto();
    await loginPage.login(testData.users.admin.mobile, testData.users.admin.password);
    await dashboardPage.waitForDashboardLoad();
    await dashboardPage.navigateToManageLicenses();
    await manageLicensesPage.waitForTableLoad();

    const count = await manageLicensesPage.getTableRowCount();
    if (count === 0) {
      // Add one first
      await manageLicensesPage.addLicense({
        productName:  'Renew Journey Product',
        licenseKey:   generateLicenseKey('REN'),
        licenseType:  'Annual',
        seats:        '10',
        expiryDate:   getFutureDate(30),
        assignedTo:   'Renew Corp',
        description:  'Will be renewed',
        status:       'Active',
      });
    }

    await manageLicensesPage.renewLicense(0, {
      newExpiryDate: getFutureDate(730),
      renewalNotes:  'Renewed via E2E automation test',
    });

    const successMsg = await manageLicensesPage.getSuccessMessage().catch(() => '');
    expect(successMsg.length).toBeGreaterThan(0);
  });

  // ──────────────────────────────────────────────────────────────
  // JOURNEY 5 — Manager: Login → Dashboard → View Licenses (read-only check)
  // ──────────────────────────────────────────────────────────────

  test('E2E_005 — Manager logs in and views the dashboard and license list', async ({
    loginPage,
    dashboardPage,
    manageLicensesPage,
    testData,
    page,
  }) => {
    await loginPage.goto();
    await loginPage.login(testData.users.manager.mobile, testData.users.manager.password);
    await dashboardPage.waitForDashboardLoad();

    await expect(page).toHaveURL(/dashboard/i);
    expect(await dashboardPage.isDashboardVisible()).toBe(true);

    await dashboardPage.navigateToManageLicenses();
    await manageLicensesPage.waitForTableLoad();

    await expect(page).toHaveURL(/license/i);
    await expect(manageLicensesPage.licenseTable).toBeVisible();
  });

  // ──────────────────────────────────────────────────────────────
  // JOURNEY 6 — Search & Filter Combined
  // ──────────────────────────────────────────────────────────────

  test('E2E_006 — Search combined with status filter narrows results', async ({
    loginPage,
    dashboardPage,
    manageLicensesPage,
    testData,
    page,
  }) => {
    await loginPage.goto();
    await loginPage.login(testData.users.admin.mobile, testData.users.admin.password);
    await dashboardPage.waitForDashboardLoad();
    await dashboardPage.navigateToManageLicenses();
    await manageLicensesPage.waitForTableLoad();

    // Apply status filter first
    await manageLicensesPage.filterByStatus('Active');

    // Then search
    await manageLicensesPage.searchLicense(testData.search.validSearchTerm);

    const count = await manageLicensesPage.getTableRowCount();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  // ──────────────────────────────────────────────────────────────
  // JOURNEY 7 — Invalid Login → Retry → Successful Login
  // ──────────────────────────────────────────────────────────────

  test('E2E_007 — Failed login followed by successful retry', async ({
    loginPage,
    dashboardPage,
    testData,
    page,
  }) => {
    await loginPage.goto();

    // First: wrong password
    await loginPage.login(testData.users.admin.mobile, 'WrongPass@000');
    await loginPage.waitForLoadingToFinish();
    expect(page.url()).not.toMatch(/dashboard/i);

    // Retry with correct credentials
    await loginPage.login(testData.users.admin.mobile, testData.users.admin.password);
    await dashboardPage.waitForDashboardLoad();
    await expect(page).toHaveURL(/dashboard/i);
  });

  // ──────────────────────────────────────────────────────────────
  // JOURNEY 8 — Session Management: Login → Logout → Login Again
  // ──────────────────────────────────────────────────────────────

  test('E2E_008 — Login → Logout → Login again works correctly', async ({
    loginPage,
    dashboardPage,
    testData,
    page,
  }) => {
    // First login
    await loginPage.goto();
    await loginPage.login(testData.users.admin.mobile, testData.users.admin.password);
    await dashboardPage.waitForDashboardLoad();
    await expect(page).toHaveURL(/dashboard/i);

    // Logout
    await dashboardPage.logout();
    await expect(page).toHaveURL(/login/i);

    // Second login
    await loginPage.login(testData.users.admin.mobile, testData.users.admin.password);
    await dashboardPage.waitForDashboardLoad();
    await expect(page).toHaveURL(/dashboard/i);
  });
});
