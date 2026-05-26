# softwarelicensing_playwright

Software licesing web application - playwright Javascript automation

---

### Project structure at a glance

```
playwright-license-automation/
├── tests/
│   ├── login.spec.js          → 20 test cases (positive, negative, security, UI)
│   ├── dashboard.spec.js      → 21 test cases (widgets, nav, logout, responsive)
│   ├── manageLicenses.spec.js → 30 test cases (CRUD, search, filter, pagination, export)
│   └── e2e.spec.js            → 8 full journey tests (Login→Add→Edit→Delete→Renew)
├── pages/
│   ├── LoginPage.js           → All login locators + actions (POM)
│   ├── DashboardPage.js       → Dashboard locators + navigation helpers
│   └── ManageLicensesPage.js  → Full CRUD locators + all form/modal actions
├── fixtures/index.js          → loginAsAdmin, loginAsManager, setupAndLogin helpers
├── data/testdata.json         → All users, licenses, search terms, validation data
├── utils/helpers.js           → generateLicenseKey, getFutureDate, waitForToast, etc.
├── playwright.config.js       → Multi-browser, retries, reporters, timeouts
├── .env.example               → BASE_URL, credentials template
└── README.md                  → Full GitHub-ready documentation
```

### Quick start after unzipping

```bash
cd playwright-license-automation
npm install
npx playwright install
cp .env.example .env        # Set your BASE_URL
npx playwright test         # Run everything
npx playwright show-report  # Open HTML report
```

### Key design decisions

- **POM + Fixtures** — zero login boilerplate in tests; just use `loginAsAdmin()` fixture
- **Resilient locators** — each locator has 2–3 fallback selectors (data-testid → semantic HTML → text)
- **Dynamic test data** — `generateLicenseKey()` and `getFutureDate()` prevent conflicts between runs
- **Smart skips** — optional UI elements use `test.skip()` instead of hard failures
- **CI-ready** — GitHub Actions YAML is included in the README for immediate use
