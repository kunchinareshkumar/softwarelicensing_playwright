/**
 * LoginPage - Page Object Model for the Login screen
 * Handles: mobile login, password input, OTP (if applicable), login submission
 */
class LoginPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;

    // ── Locators ──────────────────────────────────────────────────
    this.mobileInput        = page.locator('input[name="mobile"], input[placeholder*="Mobile"], input[type="tel"]').first();
    this.passwordInput      = page.locator('input[name="password"], input[type="password"]').first();
    this.loginButton        = page.locator('button[type="submit"], button:has-text("Login"), button:has-text("Sign In")').first();
    this.forgotPasswordLink = page.locator('a:has-text("Forgot"), a:has-text("forgot password")').first();
    this.rememberMeCheckbox = page.locator('input[type="checkbox"][name*="remember"], label:has-text("Remember")').first();
    this.errorMessage       = page.locator('.error-message, .alert-danger, [data-testid="login-error"], .login-error').first();
    this.successMessage     = page.locator('.success-message, .alert-success, [data-testid="login-success"]').first();
    this.mobileError        = page.locator('[data-testid="mobile-error"], .mobile-error, #mobile-error').first();
    this.passwordError      = page.locator('[data-testid="password-error"], .password-error, #password-error').first();
    this.pageTitle          = page.locator('h1, h2, .login-title, [data-testid="page-title"]').first();
    this.logo               = page.locator('.logo, img[alt*="logo"], [data-testid="logo"]').first();
    this.showPasswordToggle = page.locator('button[aria-label*="password"], .toggle-password, [data-testid="show-password"]').first();
    this.loadingSpinner     = page.locator('.spinner, .loading, [data-testid="loading"]').first();
  }

  // ── Navigation ─────────────────────────────────────────────────

  /** Navigate to the login page */
  async goto() {
    await this.page.goto('/login');
    await this.page.waitForLoadState('networkidle');
  }

  // ── Actions ────────────────────────────────────────────────────

  /**
   * Fill the mobile number field
   * @param {string} mobile
   */
  async enterMobile(mobile) {
    await this.mobileInput.waitFor({ state: 'visible' });
    await this.mobileInput.clear();
    await this.mobileInput.fill(mobile);
  }

  /**
   * Fill the password field
   * @param {string} password
   */
  async enterPassword(password) {
    await this.passwordInput.waitFor({ state: 'visible' });
    await this.passwordInput.clear();
    await this.passwordInput.fill(password);
  }

  /** Click the Login / Sign In button */
  async clickLogin() {
    await this.loginButton.waitFor({ state: 'visible' });
    await this.loginButton.click();
  }

  /**
   * Full login flow: fill credentials and submit
   * @param {string} mobile
   * @param {string} password
   */
  async login(mobile, password) {
    await this.enterMobile(mobile);
    await this.enterPassword(password);
    await this.clickLogin();
  }

  /** Toggle password visibility (show / hide) */
  async togglePasswordVisibility() {
    await this.showPasswordToggle.click();
  }

  /** Check the "Remember Me" checkbox */
  async checkRememberMe() {
    if (!(await this.rememberMeCheckbox.isChecked())) {
      await this.rememberMeCheckbox.check();
    }
  }

  /** Click the Forgot Password link */
  async clickForgotPassword() {
    await this.forgotPasswordLink.click();
  }

  // ── Assertions ─────────────────────────────────────────────────

  /** @returns {Promise<boolean>} */
  async isLoginPageVisible() {
    return await this.loginButton.isVisible();
  }

  /** @returns {Promise<string>} */
  async getErrorMessage() {
    await this.errorMessage.waitFor({ state: 'visible', timeout: 8000 });
    return await this.errorMessage.textContent();
  }

  /** @returns {Promise<string>} */
  async getMobileError() {
    await this.mobileError.waitFor({ state: 'visible', timeout: 5000 });
    return await this.mobileError.textContent();
  }

  /** @returns {Promise<string>} */
  async getPasswordError() {
    await this.passwordError.waitFor({ state: 'visible', timeout: 5000 });
    return await this.passwordError.textContent();
  }

  /** @returns {Promise<string>} input[type="password"] type vs "text" */
  async getPasswordInputType() {
    return await this.passwordInput.getAttribute('type');
  }

  /** Wait until the loading spinner disappears */
  async waitForLoadingToFinish() {
    try {
      await this.loadingSpinner.waitFor({ state: 'hidden', timeout: 15000 });
    } catch {
      // spinner may not be present; ignore
    }
  }
}

module.exports = { LoginPage };
