# 🎭 ngx-playwright-schematics

[![npm version](https://img.shields.io/npm/v/ngx-playwright-schematics.svg)](https://www.npmjs.com/package/ngx-playwright-schematics)
[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](LICENSE)

An enterprise-grade Angular Schematics package that automates setting up and scaffolding a full **Playwright E2E testing architecture** into any Angular application.

---

## ⚡ Quick Start

In any Angular project root directory, run:

```bash
ng add ngx-playwright-schematics
```

Or run via generator:

```bash
ng g ngx-playwright-schematics:ng-add
```

### Options

| Option | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `--project` | `string` | *(default project)* | Specific project name in `angular.json` |
| `--installBrowsers` | `boolean` | `false` | Automatically install Playwright browser binaries |
| `--overwrite` | `boolean` | `true` | Safely resolve conflicts and update existing configuration |

Example with options:
```bash
ng add ngx-playwright-schematics --project=my-app --installBrowsers=true
```

---

## 🏛️ What It Scaffolds

Running this schematic injects the complete enterprise Playwright architecture:

### 1. Project Configuration
- **`playwright.config.ts`**: Cross-platform snapshot paths (`snapshotPathTemplate`), multi-browser support (Chromium, Firefox), sharding, Allure & JUnit reporters, session-cached auth `storageState`, and automated webServer startup.
- **`angular.json`**: Configures `architect.e2e` builder with `playwright-ng-schematics:playwright` and adds schematic collections.
- **`package.json`**: Merges 19 pre-configured NPM scripts (`e2e`, `e2e:smoke`, `e2e:regression`, `e2e:visual`, `e2e:a11y`, `e2e:api`, `insights:*`, `allure:*`) and required dependencies (`@playwright/test`, `@axe-core/playwright`, `zod`, `allure-playwright`, `tsx`, `luxon`).
- **`eslint.config.mjs`**: Injects strict architectural boundary rule (`no-restricted-imports` blocking `src/` inside `e2e/`).

### 2. Full `e2e/` Architecture
- **Component Object Model (COM)**: `HeaderComponent`, `LoaderComponent`, `ModalComponent`, `ToastComponent`.
- **Modular Fixtures (`mergeTests`)**: `componentFixtures`, `pageFixtures`, `apiFixtures`, `a11yFixture` (WCAG 2.2 AA), `dataFactoryFixture` (isolated lifecycle teardowns), and `telemetryFixture` (W3C traceparent headers).
- **Session Caching**: `e2e/specs/auth.setup.ts` pre-caching authentication to `e2e/auth/default.json`.
- **Page Objects**: `HomePage`, `LoginPage`, `Routes`.
- **Ready-to-Run Specs**: `app.spec.ts`, `api-contract.spec.ts`, `a11y.spec.ts`, `visual.spec.ts`, `auth.setup.ts`.

### 3. Application Runtime Decoupling
- **`src/app/core/interceptors/api-contract.interceptor.ts`**: Angular HTTP Interceptor that safely validates live API responses against Zod contract schemas to detect API drift early without crashing the UI.

### 4. CI/CD & Observability
- **GitHub Actions Workflows**: Matrix sharded test runs (`e2e-matrix.yml`) and standard PR validation (`e2e.yml`).
- **Telemetry & Insight Scripts**: `scripts/html-reporter.ts` (dashboard), `scripts/metrics-recorder.ts` (P95 latency, slowest tests), and `scripts/markdown-summary.ts`.

---

## 🛠️ Running Tests After Setup

```bash
# Run full E2E test suite
npm run e2e

# Fast smoke tests (P0 critical paths)
npm run e2e:smoke

# Accessibility audit (WCAG 2.2 AA)
npm run e2e:a11y

# Visual regression tests
npm run e2e:visual

# UI interactive time-travel mode
npm run e2e:ui
```

---

## 📄 License

Apache-2.0
