// utils/helpers.js
// Shared utility functions used across all spec files

const { expect } = require('@playwright/test');

/**
 * Wait for a toast/alert message and return its text.
 * @param {import('@playwright/test').Page} page
 * @param {'success'|'error'|'warning'|'info'} [type='success']
 * @param {number} [timeout=8000]
 * @returns {Promise<string>}
 */
async function waitForToast(page, type = 'success', timeout = 8000) {
  const selectors = {
    success: '.toast-success, .alert-success, [data-testid="success-toast"]',
    error:   '.toast-error, .alert-danger, .alert-error, [data-testid="error-toast"]',
    warning: '.toast-warning, .alert-warning, [data-testid="warning-toast"]',
    info:    '.toast-info, .alert-info, [data-testid="info-toast"]',
  };
  const toast = page.locator(selectors[type] || selectors.success).first();
  await toast.waitFor({ state: 'visible', timeout });
  return (await toast.textContent())?.trim() || '';
}

/**
 * Dismiss any visible modal/dialog.
 * @param {import('@playwright/test').Page} page
 */
async function dismissModal(page) {
  const closeBtn = page.locator('button.close, button[aria-label="Close"], .modal-close, [data-dismiss="modal"]').first();
  if (await closeBtn.isVisible()) {
    await closeBtn.click();
  } else {
    await page.keyboard.press('Escape');
  }
}

/**
 * Take a named screenshot and attach it to the test report.
 * @param {import('@playwright/test').Page} page
 * @param {string} name  Filename (without extension)
 * @param {import('@playwright/test').TestInfo} testInfo
 */
async function takeScreenshot(page, name, testInfo) {
  const screenshotPath = testInfo.outputPath(`${name}.png`);
  await page.screenshot({ path: screenshotPath, fullPage: true });
  await testInfo.attach(name, { path: screenshotPath, contentType: 'image/png' });
}

/**
 * Generate a unique license key for use in tests.
 * @param {string} [prefix='TEST']
 * @returns {string}
 */
function generateLicenseKey(prefix = 'TEST') {
  const ts   = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${ts}-${rand}`;
}

/**
 * Return a future date string in YYYY-MM-DD format.
 * @param {number} [daysFromNow=365]
 * @returns {string}
 */
function getFutureDate(daysFromNow = 365) {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  return d.toISOString().split('T')[0];
}

/**
 * Return a past date string in YYYY-MM-DD format.
 * @param {number} [daysAgo=30]
 * @returns {string}
 */
function getPastDate(daysAgo = 30) {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().split('T')[0];
}

/**
 * Retry a function up to `maxAttempts` times with a delay between each.
 * @param {Function} fn        Async function to retry
 * @param {number} [maxAttempts=3]
 * @param {number} [delay=1000]  Milliseconds between attempts
 */
async function retryAction(fn, maxAttempts = 3, delay = 1000) {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (err) {
      if (attempt === maxAttempts) throw err;
      await new Promise(r => setTimeout(r, delay));
    }
  }
}

/**
 * Verify a table contains a row whose cells include the given value.
 * @param {import('@playwright/test').Page} page
 * @param {string} tableSelector
 * @param {string} searchValue
 * @returns {Promise<boolean>}
 */
async function tableContainsValue(page, tableSelector, searchValue) {
  const rows = page.locator(`${tableSelector} tbody tr`);
  const count = await rows.count();
  for (let i = 0; i < count; i++) {
    const rowText = await rows.nth(i).textContent();
    if (rowText?.includes(searchValue)) return true;
  }
  return false;
}

/**
 * Scroll to the bottom of the page.
 * @param {import('@playwright/test').Page} page
 */
async function scrollToBottom(page) {
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
}

/**
 * Clear browser local storage and session storage.
 * @param {import('@playwright/test').Page} page
 */
async function clearBrowserStorage(page) {
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
}

/**
 * Assert that the current URL matches the expected pattern.
 * @param {import('@playwright/test').Page} page
 * @param {string|RegExp} pattern
 */
async function assertUrl(page, pattern) {
  await expect(page).toHaveURL(pattern);
}

/**
 * Wait for a network response matching the URL pattern.
 * @param {import('@playwright/test').Page} page
 * @param {string|RegExp} urlPattern
 * @returns {Promise<import('@playwright/test').Response>}
 */
async function waitForApiResponse(page, urlPattern) {
  return page.waitForResponse(
    response => {
      const url    = response.url();
      const status = response.status();
      return (typeof urlPattern === 'string' ? url.includes(urlPattern) : urlPattern.test(url)) && status < 400;
    },
    { timeout: 15000 }
  );
}

/**
 * Format a date string from YYYY-MM-DD to DD/MM/YYYY (common display format).
 * @param {string} dateStr
 * @returns {string}
 */
function formatDisplayDate(dateStr) {
  const [y, m, d] = dateStr.split('-');
  return `${d}/${m}/${y}`;
}

/**
 * Generate a random integer between min and max (inclusive).
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports = {
  waitForToast,
  dismissModal,
  takeScreenshot,
  generateLicenseKey,
  getFutureDate,
  getPastDate,
  retryAction,
  tableContainsValue,
  scrollToBottom,
  clearBrowserStorage,
  assertUrl,
  waitForApiResponse,
  formatDisplayDate,
  randomInt,
};
