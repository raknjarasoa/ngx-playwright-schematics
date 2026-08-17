import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';

export function updateGitignore(): Rule {
  return (tree: Tree, context: SchematicContext) => {
    if (!tree.exists('.gitignore')) {
      return tree;
    }

    try {
      let content = tree.readText('.gitignore');
      const requiredEntries = [
        '# Playwright & E2E Artifacts',
        '/test-results/',
        '/playwright-report/',
        '/playwright/.cache/',
        '/artifacts/',
        '/allure-results/',
        '/allure-report/',
        'blob-report/',
        'all-blobs/',
      ];

      const toAdd = requiredEntries.filter((entry) => !content.includes(entry));

      if (toAdd.length > 0) {
        content = content.trimEnd() + '\n\n' + toAdd.join('\n') + '\n';
        tree.overwrite('.gitignore', content);
        context.logger.info('✅ Successfully updated .gitignore');
      }
    } catch (err: any) {
      context.logger.warn(`⚠️ Could not update .gitignore cleanly: ${err.message}. Continuing...`);
    }

    return tree;
  };
}
