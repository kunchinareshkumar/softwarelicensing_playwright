# 🔐 Software Licensing App — Playwright Automation Suite

[![Playwright Tests](https://img.shields.io/badge/Playwright-E2E%20Tests-brightgreen?logo=playwright)](https://playwright.dev)
[![JavaScript](https://img.shields.io/badge/Language-JavaScript-yellow?logo=javascript)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

End-to-end test automation for a **Software Licensing Web Application** built with [Playwright](https://playwright.dev) and JavaScript. Covers the complete user journey — mobile login, dashboard validation, and full license management (add, edit, delete, renew, search, filter).

---

## 📁 Project Structure

```
playwright-license-automation/
│
├── tests/                        # All spec (test) files
│   ├── login.spec.js             # 20 Login test cases (positive, negative, UI, security)
│   ├── dashboard.spec.js         # 21 Dashboard test cases (widgets, navigation, logout)
│   ├── manageLicenses.spec.js    # 30 Manage Licenses tests (CRUD, search, filter, paginate)
│   └── e2e.spec.js               # 8 End-to-End user journey tests
│
├── pages/                        # Page Object Models (POM)
│   ├── LoginPage.js              # Login page locators + actions
│   ├── DashboardPage.js          # Dashboard page locators + actions
│   └── ManageLicensesPage.js     # Manage Licenses locators + all CRUD actions
│
├── fixtures/
│   └── index.js                  # Custom Playwright fixtures (page objects + auth helpers)
│
├── data/
│   └── testdata.json             # All test data (users, licenses, search terms, validation)
│
├── utils/
│   └── helpers.js                # Reusable utility functions (toast, screenshots, dates, etc.)
│
├── reports/                      # Auto-generated test reports (HTML + JSON)
├── test-results/                 # Screenshots, videos, traces on failure
│
├── playwright.config.js          # Playwright configuration (browsers, reporters, timeouts)
├── package.json                  # Project dependencies and npm scripts
├── .env.example                  # Environment variable template
└── .gitignore
```

---

## 🧪 Test Coverage

### 🔐 Login (`tests/login.spec.js`) — 20 tests

| Test ID | Description |
|---------|-------------|
| TC_LOGIN_001 | Admin login with valid mobile and password |
| TC_LOGIN_002 | Manager login with valid credentials |
| TC_LOGIN_003 | Viewer login with valid credentials |
| TC_LOGIN_004 | Redirect to dashboard after successful login |
| TC_LOGIN_005 | User name displayed in header after login |
| TC_LOGIN_006 | Login fails with invalid mobile and password |
| TC_LOGIN_007 | Login fails with valid mobile but wrong password |
| TC_LOGIN_008 | Login fails with empty mobile number |
| TC_LOGIN_009 | Login fails with empty password |
| TC_LOGIN_010 | Login fails with both fields empty |
| TC_LOGIN_011 | Login fails with invalid mobile format (letters) |
| TC_LOGIN_012 | Login fails with short mobile number |
| TC_LOGIN_013 | Password is masked by default |
| TC_LOGIN_014 | Password visibility toggle works |
| TC_LOGIN_015 | Login page title / heading is visible |
| TC_LOGIN_016 | Forgot password link is present |
| TC_LOGIN_017 | Mobile field accepts only numeric input |
| TC_LOGIN_018 | Session persists after page refresh |
| TC_LOGIN_019 | Logout navigates back to login page |
| TC_LOGIN_020 | Cannot access dashboard without login |

### 📊 Dashboard (`tests/dashboard.spec.js`) — 21 tests

| Test ID | Description |
|---------|-------------|
| TC_DASH_001–004 | Page structure (load, sidebar, header, widgets) |
| TC_DASH_005–009 | Widget data (total, active, expiring, expired, data integrity) |
| TC_DASH_010–013 | Navigation (Licenses, Reports, Settings, breadcrumb) |
| TC_DASH_014–015 | Quick actions (Add License, View All) |
| TC_DASH_016–017 | User info (name, notification bell) |
| TC_DASH_018–019 | Logout & session clearing |
| TC_DASH_020–021 | Responsiveness (1280px desktop, 768px tablet) |

### 📋 Manage Licenses (`tests/manageLicenses.spec.js`) — 30 tests

| Category | Test IDs | Coverage |
|----------|----------|----------|
| Page Load | TC_LIC_001–004 | Structure, heading, table, empty state |
| Add License | TC_LIC_005–010 | Open modal, title, submit, validation, cancel, bulk |
| Edit License | TC_LIC_011–014 | Open modal, title, update, cancel safety |
| Delete License | TC_LIC_015–017 | Confirm dialog, cancel, confirm delete |
| Renew License | TC_LIC_018–019 | Open modal, successful renewal |
| Search | TC_LIC_020–022 | Valid term, invalid term, clear search |
| Filter | TC_LIC_023–025 | Status filter, type filter, clear filters |
| Pagination | TC_LIC_026–027 | Controls visible, next page navigation |
| Bulk Actions | TC_LIC_028 | Select all checkbox |
| Export | TC_LIC_029–030 | Button visible, file download triggered |

### 🚀 End-to-End (`tests/e2e.spec.js`) — 8 journeys

| Test ID | User Journey |
|---------|-------------|
| E2E_001 | Admin: Login → Dashboard stats → Add License → Search verify |
| E2E_002 | Admin: Login → Add License → Edit → Verify update |
| E2E_003 | Admin: Login → Add License → Delete → Verify removal |
| E2E_004 | Admin: Login → Add License → Renew → Verify new expiry |
| E2E_005 | Manager: Login → Dashboard → License list (view) |
| E2E_006 | Search + Status filter combined flow |
| E2E_007 | Failed login → Retry → Successful login |
| E2E_008 | Login → Logout → Login again (session management) |

---

## 🚀 Getting Started

### Prerequisites

| Tool | Version |
|------|---------|
| Node.js | ≥ 18.x |
| npm | ≥ 9.x |

### 1. Clone the repository

```bash
git clone https://github.com/your-username/playwright-license-automation.git
cd playwright-license-automation
```

### 2. Install dependencies

```bash
npm install
```

### 3. Install Playwright browsers

```bash
npx playwright install
```

### 4. Configure environment

```bash
cp .env.example .env
```

Edit `.env` and set your application URL and credentials:

```env
BASE_URL=https://your-license-app.com
ADMIN_MOBILE=9876543210
ADMIN_PASSWORD=Admin@123
```

### 5. Update test data

Edit `data/testdata.json` to match your application's test accounts and sample data.

---

## ▶️ Running Tests

### Run all tests

```bash
npm test
```

### Run specific test suites

```bash
npm run test:login        # Login tests only
npm run test:dashboard    # Dashboard tests only
npm run test:licenses     # Manage Licenses tests only
npm run test:e2e          # End-to-End journey tests only
```

### Run with browser visible (headed mode)

```bash
npm run test:headed
```

### Run in interactive UI mode

```bash
npm run test:ui
```

### Debug a test step-by-step

```bash
npm run test:debug
```

### View HTML test report

```bash
npm run report
```

---

## 🌍 Multi-Browser Execution

By default, tests run on **Chromium** only. To run on all configured browsers, edit `playwright.config.js` or use:

```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
npx playwright test --project="Mobile Chrome"
npx playwright test --project="Mobile Safari"
```

---

## 📄 Test Data (`data/testdata.json`)

The test data file is the single source of truth for all test inputs:

```jsonc
{
  "users": {
    "admin":   { "mobile": "9876543210", "password": "Admin@123", "role": "admin" },
    "manager": { "mobile": "9123456789", "password": "Manager@456", "role": "manager" },
    "viewer":  { "mobile": "9001122334", "password": "Viewer@789", "role": "viewer" },
    "invalid": { "mobile": "0000000000", "password": "WrongPass@000" }
  },
  "licenses": {
    "newLicense":  { "productName": "...", "licenseKey": "...", ... },
    "editLicense": { "updatedSeats": "25", "updatedLicenseType": "Annual", ... },
    "renewLicense":{ "newExpiryDate": "2026-12-31", ... },
    "bulkLicenses": [ ... ]
  },
  "search": { "validSearchTerm": "Enterprise", "filterStatus": "Active" }
}
```

> **Security note:** Never commit real credentials to version control. Use `.env` for sensitive values and reference them via `process.env` in your config.

---

## 🏗️ Architecture

### Page Object Model (POM)

Each page has its own class containing:
- **Locators** — all element selectors in one place
- **Actions** — reusable methods (e.g. `login()`, `addLicense()`)
- **Assertions** — helper methods returning state (e.g. `isModalVisible()`)

```
Page Object  →  Fixture  →  Spec File
LoginPage    →  loginPage   →  login.spec.js
DashboardPage → dashboardPage → dashboard.spec.js
ManageLicensesPage → manageLicensesPage → manageLicenses.spec.js
```

### Custom Fixtures (`fixtures/index.js`)

The fixtures extend Playwright's base `test` with:

| Fixture | Type | Purpose |
|---------|------|---------|
| `loginPage` | Page Object | LoginPage instance |
| `dashboardPage` | Page Object | DashboardPage instance |
| `manageLicensesPage` | Page Object | ManageLicensesPage instance |
| `testData` | Object | Full testdata.json |
| `loginAsAdmin` | Function | One-call admin login |
| `loginAsManager` | Function | One-call manager login |
| `loginAsViewer` | Function | One-call viewer login |
| `loginWithCredentials` | Function | Generic credential login |
| `setupAndLogin` | Function | Login + navigate to Licenses |

### Utilities (`utils/helpers.js`)

| Function | Purpose |
|----------|---------|
| `generateLicenseKey(prefix)` | Unique license key for each test run |
| `getFutureDate(days)` | Dynamic future expiry date |
| `getPastDate(days)` | Past date for expired license tests |
| `waitForToast(page, type)` | Wait for and read toast notifications |
| `takeScreenshot(page, name, testInfo)` | Named screenshot + attach to report |
| `tableContainsValue(page, selector, value)` | Check if table row contains a value |
| `waitForApiResponse(page, urlPattern)` | Intercept API calls |
| `retryAction(fn, attempts, delay)` | Retry flaky actions |

---

## 📊 Reports

Playwright generates three types of reports automatically:

| Report | Location | Description |
|--------|----------|-------------|
| HTML Report | `reports/html-report/` | Rich visual report with screenshots, videos, traces |
| JSON Results | `reports/results.json` | Machine-readable results for CI integration |
| Console List | Terminal output | Real-time pass/fail output |

### Open HTML Report

```bash
npm run report
# or
npx playwright show-report reports/html-report
```

---

## 🔄 CI/CD Integration

### GitHub Actions example

```yaml
# .github/workflows/playwright.yml
name: Playwright Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright Browsers
        run: npx playwright install --with-deps

      - name: Run Playwright tests
        env:
          BASE_URL: ${{ secrets.BASE_URL }}
          ADMIN_MOBILE: ${{ secrets.ADMIN_MOBILE }}
          ADMIN_PASSWORD: ${{ secrets.ADMIN_PASSWORD }}
        run: npm test

      - name: Upload HTML Report
        uses: actions/upload-artifact@v4
        if: always()
        with:
          name: playwright-report
          path: reports/html-report/
          retention-days: 30
```

---

## ⚙️ Configuration Reference (`playwright.config.js`)

| Setting | Value | Notes |
|---------|-------|-------|
| `timeout` | 60 000 ms | Per-test timeout |
| `expect.timeout` | 10 000 ms | Assertion timeout |
| `retries` | 2 (CI) / 1 (local) | Auto-retry on flaky tests |
| `screenshot` | `only-on-failure` | Attach on failure |
| `video` | `on-first-retry` | Record video on retry |
| `trace` | `on-first-retry` | Capture trace on retry |
| `workers` | 2 (local) / 1 (CI) | Parallelism |

---

## 🛠️ Locator Strategy

Locators are written with a **priority fallback** pattern for resilience:

```js
// Example: primary → secondary → fallback
this.loginButton = page.locator(
  'button[type="submit"], button:has-text("Login"), button:has-text("Sign In")'
).first();
```

**Preferred order:**
1. `data-testid` attributes (most stable)
2. ARIA roles / labels
3. Semantic HTML (type, name, placeholder)
4. Text content (`:has-text()`)

> **Tip:** Ask your developers to add `data-testid` attributes to interactive elements for maximum selector stability.

---

## 📌 Best Practices Used

- ✅ **Page Object Model** — clean separation of locators and test logic
- ✅ **Custom Fixtures** — no login boilerplate in every test
- ✅ **Centralised test data** — `testdata.json` as single source of truth
- ✅ **Dynamic data** — `generateLicenseKey()` and `getFutureDate()` prevent data conflicts
- ✅ **Soft assertions** — `test.skip()` for optional UI elements
- ✅ **Graceful waits** — `waitForLoadState('networkidle')` over fixed `page.waitForTimeout()`
- ✅ **Retry logic** — automatic Playwright retries + custom `retryAction()` helper
- ✅ **Multi-browser** — Chromium, Firefox, WebKit, Mobile Chrome/Safari
- ✅ **CI-ready** — GitHub Actions workflow template included

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feat/new-test-module`
3. Add/update tests following the POM structure
4. Run the full suite before opening a PR: `npm test`
5. Open a Pull Request with a clear description

---

## 📜 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## 💡 Troubleshooting

| Issue | Solution |
|-------|----------|
| `Browser not found` | Run `npx playwright install` |
| `Timeout waiting for element` | Increase `actionTimeout` in config or update the locator |
| `Login redirects to wrong page` | Update `BASE_URL` in `.env` |
| `Tests pass locally but fail on CI` | Check secrets, set `headless: true`, increase `retries` |
| `Locator not found` | Inspect the actual DOM and update the selector in the Page Object |

---

> Built with ❤️ using [Playwright](https://playwright.dev) | Made for scalable, maintainable test automation
