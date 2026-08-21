import * as fs from 'fs';
import * as path from 'path';

const sourceProjectDir = path.resolve(__dirname, '../../allegro-ui');
const filesDestDir = path.resolve(__dirname, '../src/ng-add/files');

const filesToSync = [
  'playwright.config.ts',
  '.env.example',
  '.github/workflows/e2e.yml',
  '.github/workflows/e2e-matrix.yml',
  'e2e/auth/default.json',
  'e2e/components/agGrid.component.ts',
  'e2e/components/cockpitWidgets.component.ts',
  'e2e/components/groupingsModal.component.ts',
  'e2e/components/header.component.ts',
  'e2e/components/highcharts.component.ts',
  'e2e/components/loader.component.ts',
  'e2e/components/modal.component.ts',
  'e2e/components/toast.component.ts',
  'e2e/components/widgetContainer.component.ts',
  'e2e/components/primeng/index.ts',
  'e2e/components/primeng/primeDropdown.component.ts',
  'e2e/components/primeng/primeMultiSelect.component.ts',
  'e2e/components/primeng/primeTable.component.ts',
  'e2e/components/primeng/primeDatePicker.component.ts',
  'e2e/components/primeng/primeDialog.component.ts',
  'e2e/components/primeng/primeToast.component.ts',
  'e2e/fixtures/a11yFixture.ts',
  'e2e/fixtures/apiFixtures.ts',
  'e2e/fixtures/componentFixtures.ts',
  'e2e/fixtures/constants.ts',
  'e2e/fixtures/creds.ts',
  'e2e/fixtures/dataFactoryFixture.ts',
  'e2e/fixtures/fixtures.ts',
  'e2e/fixtures/index.ts',
  'e2e/fixtures/pageFixtures.ts',
  'e2e/fixtures/telemetryFixture.ts',
  'e2e/global/global-setup.ts',
  'e2e/global/global-teardown.ts',
  'e2e/helpers/apiClient.ts',
  'e2e/helpers/financial.ts',
  'e2e/helpers/utils.ts',
  'e2e/pages/cockpitPage.ts',
  'e2e/pages/homePage.ts',
  'e2e/pages/loginPage.ts',
  'e2e/pages/routes.ts',
  'e2e/pages/testExtender.ts',
  'e2e/pages/viewPage.ts',
  'e2e/specs/a11y.spec.ts',
  'e2e/specs/api-contract.spec.ts',
  'e2e/specs/app.spec.ts',
  'e2e/specs/auth.setup.ts',
  'e2e/specs/view-groupings.spec.ts',
  'e2e/specs/visual.spec.ts',
  'e2e/tsconfig.json',
  'scripts/lib/parseResults.ts',
  'scripts/html-reporter.ts',
  'scripts/markdown-summary.ts',
  'scripts/metrics-recorder.ts',
  'scripts/tsconfig.json',
  'src/app/core/interceptors/api-contract.interceptor.ts',
];

export function syncTemplates(): void {
  console.log('🔄 Syncing blueprint templates into ngx-playwright-schematics/src/ng-add/files...');

  for (const relativePath of filesToSync) {
    const srcFile = path.join(sourceProjectDir, relativePath);
    const destFile = path.join(filesDestDir, `${relativePath}.template`);

    if (!fs.existsSync(srcFile)) {
      console.warn(`⚠️ Source file not found: ${srcFile}`);
      continue;
    }

    const destDir = path.dirname(destFile);
    fs.mkdirSync(destDir, { recursive: true });

    const content = fs.readFileSync(srcFile, 'utf-8');
    fs.writeFileSync(destFile, content, 'utf-8');
  }

  console.log(`✅ Synced ${filesToSync.length} template files.`);
}

if (require.main === module) {
  syncTemplates();
}
