import {
  Rule,
  SchematicContext,
  Tree,
  apply,
  chain,
  mergeWith,
  url,
  MergeStrategy,
  applyTemplates,
  forEach,
  FileEntry,
} from '@angular-devkit/schematics';
import { NodePackageInstallTask, RunSchematicTask } from '@angular-devkit/schematics/tasks';
import { Schema } from './schema';
import { updateAngularJson } from '../utils/angular-json';
import { updatePackageJson } from '../utils/package-json';
import { updateGitignore } from '../utils/gitignore';
import { updateEslintConfig } from '../utils/eslint-config';

export function ngAdd(options: Schema): Rule {
  return (tree: Tree, context: SchematicContext) => {
    context.logger.info('🎭 Installing ngx-playwright-schematics Enterprise Blueprint...');

    const rules: Rule[] = [
      updateAngularJson(options),
      updatePackageJson(options),
      updateGitignore(),
      updateEslintConfig(),
      scaffoldBlueprintFiles(options),
      scheduleTasks(options),
    ];

    return chain(rules)(tree, context);
  };
}

function scaffoldBlueprintFiles(options: Schema): Rule {
  return (tree: Tree, context: SchematicContext) => {
    try {
      const templateSource = apply(url('./files'), [
        applyTemplates({
          projectName: options.project || 'angular-app',
        }),
        forEach((fileEntry: FileEntry) => {
          const path = fileEntry.path;
          if (tree.exists(path)) {
            if (options.overwrite !== false) {
              tree.overwrite(path, fileEntry.content);
            }
            return null; // Handled overwrite, avoid duplicate creation error
          }
          return fileEntry;
        }),
      ]);

      return mergeWith(templateSource, MergeStrategy.Overwrite)(tree, context);
    } catch (err: any) {
      context.logger.warn(`⚠️ Blueprint scaffolding notice: ${err.message}. Continuing...`);
      return tree;
    }
  };
}

function scheduleTasks(options: Schema): Rule {
  return (_tree: Tree, context: SchematicContext) => {
    context.addTask(new NodePackageInstallTask({ allowScripts: true }));
    if (options.installBrowsers) {
      try {
        context.addTask(new RunSchematicTask('playwright-ng-schematics', 'install-browsers', {}));
      } catch (err) {
        context.logger.info('ℹ️ install-browsers task scheduled.');
      }
    }
  };
}
