import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { Schema } from '../ng-add/schema';

export function updatePackageJson(options: Schema): Rule {
  return (tree: Tree, context: SchematicContext) => {
    if (!tree.exists('package.json')) {
      context.logger.warn('⚠️ package.json not found, skipping dependencies update.');
      return tree;
    }

    try {
      const content = tree.readText('package.json');
      const json = JSON.parse(content);

      json.scripts = json.scripts || {};
      const blueprintScripts: Record<string, string> = {
        'e2e': 'ng e2e',
        'e2e:smoke': 'playwright test --grep @smoke',
        'e2e:regression': 'playwright test --grep @regression',
        'e2e:a11y': 'playwright test --grep @a11y',
        'e2e:visual': 'playwright test --grep @visual',
        'e2e:api': 'playwright test --grep @api',
        'e2e:ui': 'playwright test --ui',
        'e2e:headed': 'playwright test --headed',
        'e2e:debug': 'playwright test --debug',
        'e2e:report': 'playwright show-report artifacts/playwright-report',
        'e2e:docker': 'docker run --rm --network host -v $(pwd):/work -w /work mcr.microsoft.com/playwright:v1.62.1-jammy npx playwright test',
        'e2e:docker:update-snapshots': 'docker run --rm --network host -v $(pwd):/work -w /work mcr.microsoft.com/playwright:v1.62.1-jammy npx playwright test e2e/specs/visual.spec.ts --update-snapshots',
        'allure:generate': 'allure generate artifacts/allure-results -o artifacts/allure-report --clean',
        'allure:report': 'npm run allure:generate && allure open ./artifacts/allure-report',
        'insights:report': 'tsx scripts/markdown-summary.ts',
        'insights:dashboard': 'tsx scripts/html-reporter.ts',
        'insights:collect': 'tsx scripts/metrics-recorder.ts',
        'insights:all': 'npm run insights:collect && npm run insights:report && npm run insights:dashboard',
        'lint:e2e': 'npx eslint e2e',
      };

      for (const [key, val] of Object.entries(blueprintScripts)) {
        if (!json.scripts[key] || options.overwrite !== false) {
          json.scripts[key] = val;
        }
      }

      json.dependencies = json.dependencies || {};
      if (!json.dependencies['zod']) {
        json.dependencies['zod'] = '^3.23.8';
      }

      json.devDependencies = json.devDependencies || {};
      const blueprintDevDependencies: Record<string, string> = {
        '@axe-core/playwright': '^4.13.0',
        '@playwright/test': '1.62.1',
        'allure-commandline': '^2.43.0',
        'allure-playwright': '^3.10.2',
        'dotenv': '^17.4.2',
        'luxon': '^3.7.2',
        '@types/luxon': '^3.7.4',
        'playwright-ng-schematics': '^21.1.1',
        'tsx': '^4.23.12',
      };

      for (const [pkg, version] of Object.entries(blueprintDevDependencies)) {
        if (!json.devDependencies[pkg] || options.overwrite !== false) {
          json.devDependencies[pkg] = version;
        }
      }

      json.dependencies = sortKeys(json.dependencies);
      json.devDependencies = sortKeys(json.devDependencies);

      tree.overwrite('package.json', JSON.stringify(json, null, 2));
      context.logger.info('✅ Successfully updated package.json scripts and dependencies');
    } catch (err: any) {
      context.logger.warn(`⚠️ Could not update package.json cleanly: ${err.message}. Continuing...`);
    }

    return tree;
  };
}

function sortKeys(obj: Record<string, string>): Record<string, string> {
  return Object.keys(obj)
    .sort()
    .reduce((res: Record<string, string>, key: string) => {
      res[key] = obj[key];
      return res;
    }, {});
}
