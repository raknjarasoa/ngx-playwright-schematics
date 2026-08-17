import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { Schema } from '../ng-add/schema';

export function updateAngularJson(options: Schema): Rule {
  return (tree: Tree, context: SchematicContext) => {
    if (!tree.exists('angular.json')) {
      context.logger.warn('⚠️ angular.json not found, skipping angular.json configuration.');
      return tree;
    }

    try {
      const content = tree.readText('angular.json');
      const json = JSON.parse(content);

      const projects = json.projects || {};
      const projectNames = Object.keys(projects);

      if (projectNames.length === 0) {
        context.logger.warn('⚠️ No projects found in angular.json.');
        return tree;
      }

      const targetProject = options.project && projects[options.project]
        ? options.project
        : json.defaultProject && projects[json.defaultProject]
          ? json.defaultProject
          : projectNames[0];

      context.logger.info(`Configuring Playwright E2E builder for project: ${targetProject}`);

      for (const pName of projectNames) {
        if (!options.project || pName === targetProject) {
          const proj = projects[pName];
          if (!proj.architect) {
            proj.architect = {};
          }
          proj.architect.e2e = {
            builder: 'playwright-ng-schematics:playwright',
            options: {
              devServerTarget: `${pName}:serve`,
            },
            configurations: {
              production: {
                devServerTarget: `${pName}:serve:production`,
              },
            },
          };
        }
      }

      json.cli = json.cli || {};
      json.cli.schematicCollections = json.cli.schematicCollections || ['@schematics/angular'];

      const collections: string[] = json.cli.schematicCollections;
      if (!collections.includes('playwright-ng-schematics')) {
        collections.push('playwright-ng-schematics');
      }
      if (!collections.includes('ngx-playwright-schematics')) {
        collections.push('ngx-playwright-schematics');
      }

      tree.overwrite('angular.json', JSON.stringify(json, null, 2));
      context.logger.info('✅ Successfully updated angular.json');
    } catch (err: any) {
      context.logger.warn(`⚠️ Could not update angular.json cleanly: ${err.message}. Continuing...`);
    }

    return tree;
  };
}
