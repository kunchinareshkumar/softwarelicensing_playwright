/**
 * ManageLicensesPage - Page Object Model for the Manage Licenses module
 * Handles: list view, add, edit, delete, renew, search, filter, pagination
 */
class ManageLicensesPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;

    // ── Page Header ───────────────────────────────────────────────
    this.pageHeading        = page.locator('h1:has-text("License"), h2:has-text("License"), [data-testid="licenses-heading"]').first();
    this.addLicenseButton   = page.locator('button:has-text("Add License"), button:has-text("New License"), [data-testid="add-license-btn"]').first();
    this.exportButton       = page.locator('button:has-text("Export"), [data-testid="export-btn"]').first();
    this.importButton       = page.locator('button:has-text("Import"), [data-testid="import-btn"]').first();

    // ── Search & Filters ──────────────────────────────────────────
    this.searchInput        = page.locator('input[placeholder*="Search"], input[name="search"], [data-testid="search-input"]').first();
    this.searchButton       = page.locator('button:has-text("Search"), [data-testid="search-btn"]').first();
    this.statusFilter       = page.locator('select[name="status"], [data-testid="status-filter"]').first();
    this.typeFilter         = page.locator('select[name="type"], [data-testid="type-filter"]').first();
    this.dateFromFilter     = page.locator('input[name="dateFrom"], [data-testid="date-from"]').first();
    this.dateToFilter       = page.locator('input[name="dateTo"], [data-testid="date-to"]').first();
    this.clearFiltersBtn    = page.locator('button:has-text("Clear"), button:has-text("Reset"), [data-testid="clear-filters"]').first();
    this.applyFiltersBtn    = page.locator('button:has-text("Apply"), button:has-text("Filter"), [data-testid="apply-filters"]').first();

    // ── License Table ─────────────────────────────────────────────
    this.licenseTable       = page.locator('table.licenses-table, [data-testid="licenses-table"], .license-list').first();
    this.tableRows          = page.locator('tbody tr, [data-testid="license-row"]');
    this.tableHeaders       = page.locator('thead th, [data-testid="table-header"]');
    this.noDataMessage      = page.locator('.no-data, .empty-state, [data-testid="no-licenses"]').first();
    this.loadingIndicator   = page.locator('.table-loading, [data-testid="table-loading"]').first();

    // ── Pagination ────────────────────────────────────────────────
    this.pagination         = page.locator('.pagination, [data-testid="pagination"]').first();
    this.nextPageBtn        = page.locator('button:has-text("Next"), .page-next, [data-testid="next-page"]').first();
    this.prevPageBtn        = page.locator('button:has-text("Prev"), .page-prev, [data-testid="prev-page"]').first();
    this.currentPage        = page.locator('.current-page, [data-testid="current-page"]').first();
    this.pageSizeSelect     = page.locator('select[name="pageSize"], [data-testid="page-size"]').first();
    this.totalRecordsCount  = page.locator('.total-records, [data-testid="total-records"]').first();

    // ── Add / Edit License Modal / Form ───────────────────────────
    this.licenseModal       = page.locator('.modal, dialog, [data-testid="license-modal"]').first();
    this.modalTitle         = page.locator('.modal-title, dialog h2, [data-testid="modal-title"]').first();
    this.productNameInput   = page.locator('input[name="productName"], [data-testid="product-name"]').first();
    this.licenseKeyInput    = page.locator('input[name="licenseKey"], [data-testid="license-key"]').first();
    this.licenseTypeSelect  = page.locator('select[name="licenseType"], [data-testid="license-type"]').first();
    this.seatsInput         = page.locator('input[name="seats"], [data-testid="seats"]').first();
    this.expiryDateInput    = page.locator('input[name="expiryDate"], input[type="date"][name*="expiry"], [data-testid="expiry-date"]').first();
    this.assignedToInput    = page.locator('input[name="assignedTo"], [data-testid="assigned-to"]').first();
    this.descriptionInput   = page.locator('textarea[name="description"], [data-testid="description"]').first();
    this.statusSelect       = page.locator('select[name="status"], [data-testid="status-select"]').first();
    this.saveButton         = page.locator('button:has-text("Save"), button[type="submit"]:has-text("Save"), [data-testid="save-btn"]').first();
    this.cancelButton       = page.locator('button:has-text("Cancel"), [data-testid="cancel-btn"]').first();
    this.formErrors         = page.locator('.form-error, .field-error, [data-testid="form-error"]');

    // ── License Detail / Actions ──────────────────────────────────
    this.viewDetailsBtn     = page.locator('button:has-text("View"), a:has-text("View"), [data-testid="view-license"]').first();
    this.editBtn            = page.locator('button:has-text("Edit"), [data-testid="edit-license"]').first();
    this.deleteBtn          = page.locator('button:has-text("Delete"), [data-testid="delete-license"]').first();
    this.renewBtn           = page.locator('button:has-text("Renew"), [data-testid="renew-license"]').first();
    this.deactivateBtn      = page.locator('button:has-text("Deactivate"), [data-testid="deactivate-license"]').first();
    this.activateBtn        = page.locator('button:has-text("Activate"), [data-testid="activate-license"]').first();

    // ── Confirm Dialog ────────────────────────────────────────────
    this.confirmDialog      = page.locator('.confirm-dialog, [data-testid="confirm-dialog"], dialog.confirm').first();
    this.confirmYesBtn      = page.locator('[data-testid="confirm-yes"], button:has-text("Yes"), button:has-text("Confirm"), button:has-text("Delete")').first();
    this.confirmNoBtn       = page.locator('[data-testid="confirm-no"], button:has-text("No"), button:has-text("Cancel")').first();

    // ── Toast / Alert Messages ────────────────────────────────────
    this.successToast       = page.locator('.toast-success, .alert-success, [data-testid="success-toast"]').first();
    this.errorToast         = page.locator('.toast-error, .alert-danger, [data-testid="error-toast"]').first();

    // ── Renew Modal ───────────────────────────────────────────────
    this.renewModal         = page.locator('[data-testid="renew-modal"], .renew-modal, dialog.renew').first();
    this.renewExpiryInput   = page.locator('[data-testid="renew-expiry"], input[name="renewExpiry"]').first();
    this.renewNotesInput    = page.locator('[data-testid="renew-notes"], textarea[name="renewNotes"]').first();
    this.renewSubmitBtn     = page.locator('[data-testid="renew-submit"], button:has-text("Renew Now"), button:has-text("Confirm Renewal")').first();

    // ── Bulk Actions ──────────────────────────────────────────────
    this.selectAllCheckbox  = page.locator('thead input[type="checkbox"], [data-testid="select-all"]').first();
    this.bulkActionSelect   = page.locator('select[name="bulkAction"], [data-testid="bulk-action"]').first();
    this.bulkActionApplyBtn = page.locator('button:has-text("Apply"), [data-testid="bulk-apply"]').first();
  }

  // ── Navigation ─────────────────────────────────────────────────

  async goto() {
    await this.page.goto('/licenses');
    await this.page.waitForLoadState('networkidle');
  }

  async waitForTableLoad() {
    try {
      await this.loadingIndicator.waitFor({ state: 'hidden', timeout: 10000 });
    } catch { /* no spinner */ }
    await this.licenseTable.waitFor({ state: 'visible', timeout: 10000 });
  }

  // ── Search & Filter ────────────────────────────────────────────

  async searchLicense(term) {
    await this.searchInput.clear();
    await this.searchInput.fill(term);
    await this.page.keyboard.press('Enter');
    await this.waitForTableLoad();
  }

  async filterByStatus(status) {
    await this.statusFilter.selectOption(status);
    await this.waitForTableLoad();
  }

  async filterByType(type) {
    await this.typeFilter.selectOption(type);
    await this.waitForTableLoad();
  }

  async clearAllFilters() {
    await this.clearFiltersBtn.click();
    await this.waitForTableLoad();
  }

  async applyFilters() {
    await this.applyFiltersBtn.click();
    await this.waitForTableLoad();
  }

  // ── Add License ────────────────────────────────────────────────

  async clickAddLicense() {
    await this.addLicenseButton.click();
    await this.licenseModal.waitFor({ state: 'visible', timeout: 8000 });
  }

  /**
   * Fill the Add/Edit license form
   * @param {{ productName: string, licenseKey: string, licenseType: string, seats: string, expiryDate: string, assignedTo: string, description: string }} licenseData
   */
  async fillLicenseForm(licenseData) {
    if (licenseData.productName !== undefined) {
      await this.productNameInput.clear();
      await this.productNameInput.fill(licenseData.productName);
    }
    if (licenseData.licenseKey !== undefined) {
      await this.licenseKeyInput.clear();
      await this.licenseKeyInput.fill(licenseData.licenseKey);
    }
    if (licenseData.licenseType !== undefined) {
      await this.licenseTypeSelect.selectOption(licenseData.licenseType);
    }
    if (licenseData.seats !== undefined) {
      await this.seatsInput.clear();
      await this.seatsInput.fill(licenseData.seats);
    }
    if (licenseData.expiryDate !== undefined) {
      await this.expiryDateInput.fill(licenseData.expiryDate);
    }
    if (licenseData.assignedTo !== undefined) {
      await this.assignedToInput.clear();
      await this.assignedToInput.fill(licenseData.assignedTo);
    }
    if (licenseData.description !== undefined) {
      await this.descriptionInput.clear();
      await this.descriptionInput.fill(licenseData.description);
    }
    if (licenseData.status !== undefined) {
      await this.statusSelect.selectOption(licenseData.status);
    }
  }

  async saveLicense() {
    await this.saveButton.click();
    await this.waitForModalClose();
  }

  async cancelLicense() {
    await this.cancelButton.click();
    await this.waitForModalClose();
  }

  /**
   * Complete add-license flow
   * @param {object} licenseData
   */
  async addLicense(licenseData) {
    await this.clickAddLicense();
    await this.fillLicenseForm(licenseData);
    await this.saveLicense();
  }

  // ── Edit License ───────────────────────────────────────────────

  /**
   * Click Edit on a row by row index (0-based)
   * @param {number} rowIndex
   */
  async clickEditOnRow(rowIndex = 0) {
    const row = this.tableRows.nth(rowIndex);
    const editBtn = row.locator('button:has-text("Edit"), [data-testid="edit-license"]').first();
    await editBtn.click();
    await this.licenseModal.waitFor({ state: 'visible', timeout: 8000 });
  }

  /**
   * Full edit flow on the given row
   * @param {number} rowIndex
   * @param {object} updatedData
   */
  async editLicense(rowIndex, updatedData) {
    await this.clickEditOnRow(rowIndex);
    await this.fillLicenseForm(updatedData);
    await this.saveLicense();
  }

  // ── Delete License ─────────────────────────────────────────────

  async clickDeleteOnRow(rowIndex = 0) {
    const row = this.tableRows.nth(rowIndex);
    const deleteBtn = row.locator('button:has-text("Delete"), [data-testid="delete-license"]').first();
    await deleteBtn.click();
    await this.confirmDialog.waitFor({ state: 'visible', timeout: 8000 });
  }

  async confirmDelete() {
    await this.confirmYesBtn.click();
    await this.confirmDialog.waitFor({ state: 'hidden', timeout: 8000 });
    await this.waitForTableLoad();
  }

  async cancelDelete() {
    await this.confirmNoBtn.click();
    await this.confirmDialog.waitFor({ state: 'hidden', timeout: 8000 });
  }

  async deleteLicense(rowIndex = 0) {
    await this.clickDeleteOnRow(rowIndex);
    await this.confirmDelete();
  }

  // ── Renew License ──────────────────────────────────────────────

  async clickRenewOnRow(rowIndex = 0) {
    const row = this.tableRows.nth(rowIndex);
    const renewBtn = row.locator('button:has-text("Renew"), [data-testid="renew-license"]').first();
    await renewBtn.click();
    await this.renewModal.waitFor({ state: 'visible', timeout: 8000 });
  }

  async fillRenewalForm(renewData) {
    if (renewData.newExpiryDate) {
      await this.renewExpiryInput.fill(renewData.newExpiryDate);
    }
    if (renewData.renewalNotes) {
      await this.renewNotesInput.fill(renewData.renewalNotes);
    }
  }

  async submitRenewal() {
    await this.renewSubmitBtn.click();
    await this.renewModal.waitFor({ state: 'hidden', timeout: 10000 });
    await this.waitForTableLoad();
  }

  async renewLicense(rowIndex, renewData) {
    await this.clickRenewOnRow(rowIndex);
    await this.fillRenewalForm(renewData);
    await this.submitRenewal();
  }

  // ── Bulk Actions ───────────────────────────────────────────────

  async selectAllLicenses() {
    await this.selectAllCheckbox.check();
  }

  async selectLicenseRow(rowIndex) {
    const row = this.tableRows.nth(rowIndex);
    const checkbox = row.locator('input[type="checkbox"]').first();
    await checkbox.check();
  }

  async applyBulkAction(action) {
    await this.bulkActionSelect.selectOption(action);
    await this.bulkActionApplyBtn.click();
  }

  // ── Helpers ────────────────────────────────────────────────────

  async waitForModalClose() {
    try {
      await this.licenseModal.waitFor({ state: 'hidden', timeout: 10000 });
    } catch { /* modal may already be gone */ }
    await this.waitForTableLoad();
  }

  async getTableRowCount() {
    return await this.tableRows.count();
  }

  async getSuccessMessage() {
    await this.successToast.waitFor({ state: 'visible', timeout: 10000 });
    return await this.successToast.textContent();
  }

  async getErrorMessage() {
    await this.errorToast.waitFor({ state: 'visible', timeout: 8000 });
    return await this.errorToast.textContent();
  }

  async getLicenseDataFromRow(rowIndex = 0) {
    const row = this.tableRows.nth(rowIndex);
    const cells = await row.locator('td').allTextContents();
    return cells;
  }

  async isNoDataMessageVisible() {
    return await this.noDataMessage.isVisible();
  }

  async getTotalRecordsCount() {
    const text = await this.totalRecordsCount.textContent();
    const match = text?.match(/\d+/);
    return match ? parseInt(match[0], 10) : 0;
  }

  async navigateToNextPage() {
    await this.nextPageBtn.click();
    await this.waitForTableLoad();
  }

  async navigateToPrevPage() {
    await this.prevPageBtn.click();
    await this.waitForTableLoad();
  }

  async getFormErrors() {
    return await this.formErrors.allTextContents();
  }

  async isModalVisible() {
    return await this.licenseModal.isVisible();
  }

  async getModalTitle() {
    return await this.modalTitle.textContent();
  }
}

module.exports = { ManageLicensesPage };
