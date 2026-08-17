import { describe, it, expect, beforeEach } from 'vitest';
import { SchematicTestRunner, UnitTestTree } from '@angular-devkit/schematics/testing';
import { HostTree } from '@angular-devkit/schematics';
import * as path from 'path';

const collectionPath = path.join(__dirname, '../../collection.json');

describe('ngx-playwright-schematics: ng-add', () => {
  let runner: SchematicTestRunner;
  let tree: UnitTestTree;

  beforeEach(() => {
    runner = new SchematicTestRunner('ngx-playwright-schematics', collectionPath);
    const hostTree = new HostTree();
    hostTree.create(
      'angular.json',
      JSON.stringify({
        version: 1,
        cli: {},
        projects: {
          'demo-app': {
            projectType: 'application',
            root: '',
            sourceRoot: 'src',
            prefix: 'app',
            architect: {
              build: {},
              serve: {},
            },
          },
        },
      })
    );
    hostTree.create(
      'package.json',
      JSON.stringify({
        name: 'demo-app',
        version: '0.0.0',
        scripts: {
          start: 'ng serve',
          build: 'ng build',
        },
        dependencies: {},
        devDependencies: {},
      })
    );
    hostTree.create('.gitignore', 'node_modules/\ndist/\n');
    tree = new UnitTestTree(hostTree);
  });

  it('should scaffold complete Playwright E2E Blueprint architecture', async () => {
    const result = await runner.runSchematic('ng-add', { project: 'demo-app' }, tree);

    expect(result.exists('/playwright.config.ts')).toBe(true);
    expect(result.exists('/.env.example')).toBe(true);
    expect(result.exists('/e2e/tsconfig.json')).toBe(true);
    expect(result.exists('/e2e/auth/default.json')).toBe(true);
    expect(result.exists('/e2e/components/header.component.ts')).toBe(true);
    expect(result.exists('/e2e/components/loader.component.ts')).toBe(true);
    expect(result.exists('/e2e/components/modal.component.ts')).toBe(true);
    expect(result.exists('/e2e/components/toast.component.ts')).toBe(true);
    expect(result.exists('/e2e/fixtures/index.ts')).toBe(true);
    expect(result.exists('/e2e/fixtures/dataFactoryFixture.ts')).toBe(true);
    expect(result.exists('/e2e/fixtures/constants.ts')).toBe(true);
    expect(result.exists('/e2e/helpers/apiClient.ts')).toBe(true);
    expect(result.exists('/e2e/pages/homePage.ts')).toBe(true);
    expect(result.exists('/e2e/pages/loginPage.ts')).toBe(true);
    expect(result.exists('/e2e/specs/app.spec.ts')).toBe(true);
    expect(result.exists('/e2e/specs/api-contract.spec.ts')).toBe(true);
    expect(result.exists('/e2e/specs/a11y.spec.ts')).toBe(true);
    expect(result.exists('/e2e/specs/visual.spec.ts')).toBe(true);
    expect(result.exists('/scripts/lib/parseResults.ts')).toBe(true);
    expect(result.exists('/scripts/html-reporter.ts')).toBe(true);
    expect(result.exists('/scripts/markdown-summary.ts')).toBe(true);
    expect(result.exists('/scripts/metrics-recorder.ts')).toBe(true);
    expect(result.exists('/src/app/core/interceptors/api-contract.interceptor.ts')).toBe(true);
    expect(result.exists('/.github/workflows/e2e.yml')).toBe(true);
    expect(result.exists('/.github/workflows/e2e-matrix.yml')).toBe(true);
  });

  it('should merge package.json scripts and enterprise dependencies', async () => {
    const result = await runner.runSchematic('ng-add', { project: 'demo-app' }, tree);
    const pkg = JSON.parse(result.readText('package.json'));

    expect(pkg.scripts['e2e']).toBe('ng e2e');
    expect(pkg.scripts['e2e:smoke']).toBe('playwright test --grep @smoke');
    expect(pkg.scripts['e2e:regression']).toBe('playwright test --grep @regression');
    expect(pkg.scripts['e2e:visual']).toBe('playwright test --grep @visual');
    expect(pkg.scripts['insights:all']).toBeDefined();

    expect(pkg.dependencies['zod']).toBeDefined();
    expect(pkg.devDependencies['@playwright/test']).toBe('1.62.1');
    expect(pkg.devDependencies['@axe-core/playwright']).toBeDefined();
    expect(pkg.devDependencies['playwright-ng-schematics']).toBeDefined();
  });

  it('should configure angular.json with architect.e2e builder and schematic collections', async () => {
    const result = await runner.runSchematic('ng-add', { project: 'demo-app' }, tree);
    const angularJson = JSON.parse(result.readText('angular.json'));

    expect(angularJson.projects['demo-app'].architect.e2e.builder).toBe(
      'playwright-ng-schematics:playwright'
    );
    expect(angularJson.cli.schematicCollections).toContain('playwright-ng-schematics');
    expect(angularJson.cli.schematicCollections).toContain('ngx-playwright-schematics');
  });

  it('should gracefully handle existing configuration and resolve conflicts', async () => {
    tree.create('/playwright.config.ts', '// existing config');
    tree.create('eslint.config.mjs', 'export default [{ rules: {} }];');

    const result = await runner.runSchematic('ng-add', { project: 'demo-app', overwrite: true }, tree);

    expect(result.exists('/playwright.config.ts')).toBe(true);
    expect(result.readText('/playwright.config.ts')).toContain('snapshotPathTemplate');
    expect(result.readText('eslint.config.mjs')).toContain('no-restricted-imports');
  });
});
