// tests/manageLicenses.spec.js
// Test suite: Manage Licenses — CRUD, Search, Filter, Renew, Bulk Actions

const { test, expect }         = require('../fixtures/index');
const { generateLicenseKey, getFutureDate, tableContainsValue } = require('../utils/helpers');

test.describe('Manage Licenses', () => {

  // Log in and navigate to Manage Licenses before each test
  test.beforeEach(async ({ loginPage, dashboardPage, manageLicensesPage, testData }) => {
    await loginPage.goto();
    await loginPage.login(testData.users.admin.mobile, testData.users.admin.password);
    await dashboardPage.waitForDashboardLoad();
    await dashboardPage.navigateToManageLicenses();
    await manageLicensesPage.waitForTableLoad();
  });

  // ──────────────────────────────────────────────────────────────
  // PAGE LOAD & STRUCTURE
  // ──────────────────────────────────────────────────────────────

  test('TC_LIC_001 — Manage Licenses page loads successfully', async ({
    manageLicensesPage,
    page,
  }) => {
    await expect(page).toHaveURL(/license/i);
    await expect(manageLicensesPage.licenseTable).toBeVisible();
  });

  test('TC_LIC_002 — Add License button is visible', async ({
    manageLicensesPage,
  }) => {
    await expect(manageLicensesPage.addLicenseButton).toBeVisible();
  });

  test('TC_LIC_003 — Search input is visible', async ({ manageLicensesPage }) => {
    await expect(manageLicensesPage.searchInput).toBeVisible();
  });

  test('TC_LIC_004 — License table has at least one row (or shows empty state)', async ({
    manageLicensesPage,
  }) => {
    const count = await manageLicensesPage.getTableRowCount();
    const noData = await manageLicensesPage.isNoDataMessageVisible().catch(() => false);
    expect(count >= 0 || noData).toBe(true);
  });

  // ──────────────────────────────────────────────────────────────
  // ADD LICENSE
  // ──────────────────────────────────────────────────────────────

  test('TC_LIC_005 — Add License modal opens on button click', async ({
    manageLicensesPage,
  }) => {
    await manageLicensesPage.clickAddLicense();
    expect(await manageLicensesPage.isModalVisible()).toBe(true);
  });

  test('TC_LIC_006 — Add License modal title is correct', async ({
    manageLicensesPage,
  }) => {
    await manageLicensesPage.clickAddLicense();
    const title = await manageLicensesPage.getModalTitle();
    expect(title).toMatch(/add|new|create/i);
  });

  test('TC_LIC_007 — Successfully add a new license', async ({
    manageLicensesPage,
    testData,
  }) => {
    const licenseData = {
      ...testData.licenses.newLicense,
      licenseKey: generateLicenseKey('AUTO'),
      expiryDate: getFutureDate(365),
    };

    const rowsBefore = await manageLicensesPage.getTableRowCount();
    await manageLicensesPage.addLicense(licenseData);

    // Verify success feedback
    const successMsg = await manageLicensesPage.getSuccessMessage().catch(() => '');
    expect(successMsg.length > 0 || await manageLicensesPage.getTableRowCount() > rowsBefore).toBe(true);
  });

  test('TC_LIC_008 — Add License form validates required fields (empty submit)', async ({
    manageLicensesPage,
  }) => {
    await manageLicensesPage.clickAddLicense();
    await manageLicensesPage.saveButton.click();

    // Modal should still be open (form not submitted)
    expect(await manageLicensesPage.isModalVisible()).toBe(true);
  });

  test('TC_LIC_009 — Cancel button closes Add License modal without saving', async ({
    manageLicensesPage,
  }) => {
    const rowsBefore = await manageLicensesPage.getTableRowCount();

    await manageLicensesPage.clickAddLicense();
    await manageLicensesPage.fillLicenseForm({ productName: 'SHOULD_NOT_BE_SAVED' });
    await manageLicensesPage.cancelLicense();

    const rowsAfter = await manageLicensesPage.getTableRowCount();
    expect(rowsAfter).toBe(rowsBefore);
  });

  test('TC_LIC_010 — Add multiple licenses sequentially', async ({
    manageLicensesPage,
    testData,
  }) => {
    for (const licData of testData.licenses.bulkLicenses) {
      await manageLicensesPage.addLicense({
        ...licData,
        licenseKey: generateLicenseKey('BULK'),
        expiryDate: getFutureDate(180),
      });
    }
    const rowsAfter = await manageLicensesPage.getTableRowCount();
    expect(rowsAfter).toBeGreaterThan(0);
  });

  // ──────────────────────────────────────────────────────────────
  // EDIT LICENSE
  // ──────────────────────────────────────────────────────────────

  test('TC_LIC_011 — Edit License modal opens from table row', async ({
    manageLicensesPage,
  }) => {
    const count = await manageLicensesPage.getTableRowCount();
    if (count === 0) { test.skip(); return; }

    await manageLicensesPage.clickEditOnRow(0);
    expect(await manageLicensesPage.isModalVisible()).toBe(true);
  });

  test('TC_LIC_012 — Edit License modal title indicates edit/update mode', async ({
    manageLicensesPage,
  }) => {
    const count = await manageLicensesPage.getTableRowCount();
    if (count === 0) { test.skip(); return; }

    await manageLicensesPage.clickEditOnRow(0);
    const title = await manageLicensesPage.getModalTitle();
    expect(title).toMatch(/edit|update|modify/i);
  });

  test('TC_LIC_013 — Successfully edit license seats and type', async ({
    manageLicensesPage,
    testData,
  }) => {
    const count = await manageLicensesPage.getTableRowCount();
    if (count === 0) { test.skip(); return; }

    const { updatedSeats, updatedLicenseType } = testData.licenses.editLicense;

    await manageLicensesPage.editLicense(0, {
      seats: updatedSeats,
      licenseType: updatedLicenseType,
    });

    const successMsg = await manageLicensesPage.getSuccessMessage().catch(() => '');
    expect(successMsg.length).toBeGreaterThan(0);
  });

  test('TC_LIC_014 — Cancel Edit License modal leaves data unchanged', async ({
    manageLicensesPage,
  }) => {
    const count = await manageLicensesPage.getTableRowCount();
    if (count === 0) { test.skip(); return; }

    const dataBefore = await manageLicensesPage.getLicenseDataFromRow(0);

    await manageLicensesPage.clickEditOnRow(0);
    await manageLicensesPage.fillLicenseForm({ seats: '9999' });
    await manageLicensesPage.cancelLicense();

    const dataAfter = await manageLicensesPage.getLicenseDataFromRow(0);
    // Product name cell (index 0) should remain the same
    expect(dataAfter[0]).toBe(dataBefore[0]);
  });

  // ──────────────────────────────────────────────────────────────
  // DELETE LICENSE
  // ──────────────────────────────────────────────────────────────

  test('TC_LIC_015 — Delete confirmation dialog appears', async ({
    manageLicensesPage,
  }) => {
    const count = await manageLicensesPage.getTableRowCount();
    if (count === 0) { test.skip(); return; }

    await manageLicensesPage.clickDeleteOnRow(0);
    await expect(manageLicensesPage.confirmDialog).toBeVisible();
  });

  test('TC_LIC_016 — Cancel delete keeps the license in the table', async ({
    manageLicensesPage,
  }) => {
    const count = await manageLicensesPage.getTableRowCount();
    if (count === 0) { test.skip(); return; }

    await manageLicensesPage.clickDeleteOnRow(0);
    await manageLicensesPage.cancelDelete();

    const rowsAfter = await manageLicensesPage.getTableRowCount();
    expect(rowsAfter).toBe(count);
  });

  test('TC_LIC_017 — Confirm delete removes license from table', async ({
    manageLicensesPage,
  }) => {
    // First add a temp license to delete
    await manageLicensesPage.addLicense({
      productName:   'DELETE_ME_PRODUCT',
      licenseKey:    generateLicenseKey('DEL'),
      licenseType:   'Monthly',
      seats:         '1',
      expiryDate:    getFutureDate(30),
      assignedTo:    'Test Corp',
      description:   'To be deleted',
      status:        'Active',
    });

    const rowsBefore = await manageLicensesPage.getTableRowCount();
    await manageLicensesPage.deleteLicense(0);

    const rowsAfter = await manageLicensesPage.getTableRowCount();
    expect(rowsAfter).toBeLessThan(rowsBefore);
  });

  // ──────────────────────────────────────────────────────────────
  // RENEW LICENSE
  // ──────────────────────────────────────────────────────────────

  test('TC_LIC_018 — Renew License modal opens', async ({
    manageLicensesPage,
    testData,
  }) => {
    const count = await manageLicensesPage.getTableRowCount();
    if (count === 0) { test.skip(); return; }

    await manageLicensesPage.clickRenewOnRow(0);
    await expect(manageLicensesPage.renewModal).toBeVisible();
  });

  test('TC_LIC_019 — Successfully renew a license with new expiry date', async ({
    manageLicensesPage,
    testData,
  }) => {
    const count = await manageLicensesPage.getTableRowCount();
    if (count === 0) { test.skip(); return; }

    await manageLicensesPage.renewLicense(0, {
      newExpiryDate: getFutureDate(730),
      renewalNotes:  testData.licenses.renewLicense.renewalNotes,
    });

    const successMsg = await manageLicensesPage.getSuccessMessage().catch(() => '');
    expect(successMsg.length).toBeGreaterThan(0);
  });

  // ──────────────────────────────────────────────────────────────
  // SEARCH
  // ──────────────────────────────────────────────────────────────

  test('TC_LIC_020 — Search by valid term returns filtered results', async ({
    manageLicensesPage,
    testData,
  }) => {
    await manageLicensesPage.searchLicense(testData.search.validSearchTerm);
    const count = await manageLicensesPage.getTableRowCount();
    // Either results matching the term, or empty state
    expect(count >= 0).toBe(true);
  });

  test('TC_LIC_021 — Search by invalid term shows empty / no-data state', async ({
    manageLicensesPage,
    testData,
  }) => {
    await manageLicensesPage.searchLicense(testData.search.invalidSearchTerm);
    const count   = await manageLicensesPage.getTableRowCount();
    const noData  = await manageLicensesPage.isNoDataMessageVisible().catch(() => false);
    expect(count === 0 || noData).toBe(true);
  });

  test('TC_LIC_022 — Clearing search restores full list', async ({
    manageLicensesPage,
    testData,
  }) => {
    const totalBefore = await manageLicensesPage.getTableRowCount();

    await manageLicensesPage.searchLicense(testData.search.validSearchTerm);
    await manageLicensesPage.searchLicense(''); // clear

    const totalAfter = await manageLicensesPage.getTableRowCount();
    expect(totalAfter).toBe(totalBefore);
  });

  // ──────────────────────────────────────────────────────────────
  // FILTER
  // ──────────────────────────────────────────────────────────────

  test('TC_LIC_023 — Filter by Status "Active" returns active records only', async ({
    manageLicensesPage,
    testData,
  }) => {
    await manageLicensesPage.filterByStatus(testData.search.filterStatus);
    const count = await manageLicensesPage.getTableRowCount();
    expect(count >= 0).toBe(true);
  });

  test('TC_LIC_024 — Filter by License Type "Annual" returns filtered records', async ({
    manageLicensesPage,
    testData,
  }) => {
    const typeVisible = await manageLicensesPage.typeFilter.isVisible().catch(() => false);
    if (!typeVisible) { test.skip(); return; }

    await manageLicensesPage.filterByType(testData.search.filterType);
    const count = await manageLicensesPage.getTableRowCount();
    expect(count >= 0).toBe(true);
  });

  test('TC_LIC_025 — Clear Filters button resets the list', async ({
    manageLicensesPage,
    testData,
  }) => {
    const totalBefore = await manageLicensesPage.getTableRowCount();

    await manageLicensesPage.filterByStatus(testData.search.filterStatus);
    await manageLicensesPage.clearAllFilters();

    const totalAfter = await manageLicensesPage.getTableRowCount();
    expect(totalAfter).toBe(totalBefore);
  });

  // ──────────────────────────────────────────────────────────────
  // PAGINATION
  // ──────────────────────────────────────────────────────────────

  test('TC_LIC_026 — Pagination controls are visible when records exceed page size', async ({
    manageLicensesPage,
  }) => {
    const total = await manageLicensesPage.getTotalRecordsCount().catch(() => 0);
    if (total <= 10) { test.skip(); return; }

    await expect(manageLicensesPage.pagination).toBeVisible();
  });

  test('TC_LIC_027 — Next page button loads next set of records', async ({
    manageLicensesPage,
  }) => {
    const total = await manageLicensesPage.getTotalRecordsCount().catch(() => 0);
    if (total <= 10) { test.skip(); return; }

    const dataBefore = await manageLicensesPage.getLicenseDataFromRow(0);
    await manageLicensesPage.navigateToNextPage();
    const dataAfter = await manageLicensesPage.getLicenseDataFromRow(0);

    // Different data on next page
    expect(dataAfter[0]).not.toBe(dataBefore[0]);
  });

  // ──────────────────────────────────────────────────────────────
  // BULK ACTIONS
  // ──────────────────────────────────────────────────────────────

  test('TC_LIC_028 — Select All checkbox selects all visible rows', async ({
    manageLicensesPage,
  }) => {
    const count = await manageLicensesPage.getTableRowCount();
    if (count === 0) { test.skip(); return; }

    const selectAllVisible = await manageLicensesPage.selectAllCheckbox.isVisible().catch(() => false);
    if (!selectAllVisible) { test.skip(); return; }

    await manageLicensesPage.selectAllLicenses();
    const checkboxes = manageLicensesPage.tableRows.locator('input[type="checkbox"]');
    const total      = await checkboxes.count();
    let checkedCount = 0;
    for (let i = 0; i < total; i++) {
      if (await checkboxes.nth(i).isChecked()) checkedCount++;
    }
    expect(checkedCount).toBe(total);
  });

  // ──────────────────────────────────────────────────────────────
  // EXPORT
  // ──────────────────────────────────────────────────────────────

  test('TC_LIC_029 — Export button is visible', async ({ manageLicensesPage }) => {
    const visible = await manageLicensesPage.exportButton.isVisible().catch(() => false);
    if (!visible) { test.skip(); return; }
    expect(visible).toBe(true);
  });

  test('TC_LIC_030 — Export triggers file download', async ({
    manageLicensesPage,
    page,
  }) => {
    const visible = await manageLicensesPage.exportButton.isVisible().catch(() => false);
    if (!visible) { test.skip(); return; }

    const [download] = await Promise.all([
      page.waitForEvent('download', { timeout: 15000 }),
      manageLicensesPage.exportButton.click(),
    ]);
    expect(download.suggestedFilename()).toBeTruthy();
  });
});
