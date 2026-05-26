/**
 * DashboardPage - Page Object Model for the Software Licensing Dashboard
 * Handles: stats widgets, navigation menu, quick actions, notifications
 */
class DashboardPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;

    // ── Header / Navbar ───────────────────────────────────────────
    this.headerLogo        = page.locator('.header-logo, .navbar-brand, [data-testid="header-logo"]').first();
    this.userAvatar        = page.locator('.user-avatar, .avatar, [data-testid="user-avatar"]').first();
    this.userNameDisplay   = page.locator('.user-name, [data-testid="user-name"], .navbar .username').first();
    this.logoutButton      = page.locator('button:has-text("Logout"), a:has-text("Logout"), [data-testid="logout"]').first();
    this.notificationBell  = page.locator('.notification-bell, [data-testid="notifications"], button[aria-label*="notification"]').first();
    this.notificationBadge = page.locator('.notification-count, .badge, [data-testid="notification-count"]').first();

    // ── Sidebar Navigation ────────────────────────────────────────
    this.sidebar           = page.locator('.sidebar, nav.sidebar, [data-testid="sidebar"]').first();
    this.navDashboard      = page.locator('a:has-text("Dashboard"), [data-testid="nav-dashboard"]').first();
    this.navManageLicenses = page.locator('a:has-text("Manage Licenses"), a:has-text("Licenses"), [data-testid="nav-licenses"]').first();
    this.navUsers          = page.locator('a:has-text("Users"), [data-testid="nav-users"]').first();
    this.navReports        = page.locator('a:has-text("Reports"), [data-testid="nav-reports"]').first();
    this.navSettings       = page.locator('a:has-text("Settings"), [data-testid="nav-settings"]').first();

    // ── Dashboard Stat Widgets ────────────────────────────────────
    this.totalLicensesWidget   = page.locator('[data-testid="widget-total"], .widget-total-licenses, .card:has-text("Total Licenses")').first();
    this.activeLicensesWidget  = page.locator('[data-testid="widget-active"], .widget-active-licenses, .card:has-text("Active")').first();
    this.expiringSoonWidget    = page.locator('[data-testid="widget-expiring"], .widget-expiring, .card:has-text("Expiring")').first();
    this.expiredWidget         = page.locator('[data-testid="widget-expired"], .widget-expired, .card:has-text("Expired")').first();

    // ── Quick Actions ─────────────────────────────────────────────
    this.addLicenseQuickBtn    = page.locator('button:has-text("Add License"), [data-testid="quick-add-license"]').first();
    this.viewAllLicensesBtn    = page.locator('a:has-text("View All"), button:has-text("View All"), [data-testid="view-all-licenses"]').first();

    // ── Recent Activity / Table ───────────────────────────────────
    this.recentActivitySection = page.locator('.recent-activity, [data-testid="recent-activity"]').first();
    this.activityRows          = page.locator('.recent-activity tr, [data-testid="activity-row"]');

    // ── Charts ────────────────────────────────────────────────────
    this.licenseChart          = page.locator('.license-chart, canvas, [data-testid="license-chart"]').first();

    // ── Page Heading ──────────────────────────────────────────────
    this.pageHeading           = page.locator('h1, h2, .page-title, [data-testid="page-heading"]').first();
    this.breadcrumb            = page.locator('.breadcrumb, [data-testid="breadcrumb"]').first();
  }

  // ── Navigation ─────────────────────────────────────────────────

  async goto() {
    await this.page.goto('/dashboard');
    await this.page.waitForLoadState('networkidle');
  }

  async waitForDashboardLoad() {
    await this.page.waitForLoadState('networkidle');
    await this.totalLicensesWidget.waitFor({ state: 'visible', timeout: 15000 });
  }

  // ── Widget Getters ─────────────────────────────────────────────

  async getTotalLicensesCount() {
    const text = await this.totalLicensesWidget.locator('.count, .value, h3, span').first().textContent();
    return parseInt(text?.trim() || '0', 10);
  }

  async getActiveLicensesCount() {
    const text = await this.activeLicensesWidget.locator('.count, .value, h3, span').first().textContent();
    return parseInt(text?.trim() || '0', 10);
  }

  async getExpiringSoonCount() {
    const text = await this.expiringSoonWidget.locator('.count, .value, h3, span').first().textContent();
    return parseInt(text?.trim() || '0', 10);
  }

  async getExpiredCount() {
    const text = await this.expiredWidget.locator('.count, .value, h3, span').first().textContent();
    return parseInt(text?.trim() || '0', 10);
  }

  // ── Navigation Actions ─────────────────────────────────────────

  async navigateToManageLicenses() {
    await this.navManageLicenses.click();
    await this.page.waitForLoadState('networkidle');
  }

  async navigateToUsers() {
    await this.navUsers.click();
    await this.page.waitForLoadState('networkidle');
  }

  async navigateToReports() {
    await this.navReports.click();
    await this.page.waitForLoadState('networkidle');
  }

  async navigateToSettings() {
    await this.navSettings.click();
    await this.page.waitForLoadState('networkidle');
  }

  // ── User Actions ───────────────────────────────────────────────

  async getUserName() {
    return await this.userNameDisplay.textContent();
  }

  async clickUserAvatar() {
    await this.userAvatar.click();
  }

  async logout() {
    // Try direct click first; if inside a dropdown, open it first
    try {
      await this.logoutButton.click({ timeout: 3000 });
    } catch {
      await this.userAvatar.click();
      await this.logoutButton.click();
    }
    await this.page.waitForLoadState('networkidle');
  }

  async getNotificationCount() {
    const text = await this.notificationBadge.textContent();
    return parseInt(text?.trim() || '0', 10);
  }

  // ── Quick Actions ──────────────────────────────────────────────

  async clickAddLicense() {
    await this.addLicenseQuickBtn.click();
    await this.page.waitForLoadState('networkidle');
  }

  async clickViewAllLicenses() {
    await this.viewAllLicensesBtn.click();
    await this.page.waitForLoadState('networkidle');
  }

  // ── Assertions ─────────────────────────────────────────────────

  async isDashboardVisible() {
    return await this.totalLicensesWidget.isVisible();
  }

  async isSidebarVisible() {
    return await this.sidebar.isVisible();
  }

  async getPageHeading() {
    return await this.pageHeading.textContent();
  }

  async getRecentActivityCount() {
    return await this.activityRows.count();
  }

  async isNavigationItemActive(itemName) {
    const navItem = this.page.locator(`[data-testid="nav-${itemName.toLowerCase()}"], a:has-text("${itemName}")`).first();
    const classes = await navItem.getAttribute('class') || '';
    return classes.includes('active') || classes.includes('selected') || classes.includes('current');
  }
}

module.exports = { DashboardPage };
