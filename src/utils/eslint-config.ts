import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';

export function updateEslintConfig(): Rule {
  return (tree: Tree, context: SchematicContext) => {
    const eslintFile = 'eslint.config.mjs';
    const e2eDecouplingPattern = 'no-restricted-imports';

    try {
      if (!tree.exists(eslintFile)) {
        const defaultEslint = `import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';

export default [
  {
    files: ['src/**/*.ts', 'scripts/**/*.ts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
    },
    rules: {
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
  },
  {
    files: ['e2e/**/*.ts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
    },
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['src/**', '../src/**', '../../src/**', '**/src/**'],
              message: 'E2E tests must remain completely decoupled from application implementation code. Do not import files from src/.',
            },
          ],
        },
      ],
    },
  },
];
`;
        tree.create(eslintFile, defaultEslint);
        context.logger.info(`✅ Created ${eslintFile} with strict source decoupling rule.`);
        return tree;
      }

      const content = tree.readText(eslintFile);
      if (!content.includes(e2eDecouplingPattern)) {
        context.logger.info(`ℹ️ Adding E2E decoupling rule to existing ${eslintFile}`);
        const e2eBlock = `  {
    files: ['e2e/**/*.ts'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['src/**', '../src/**', '../../src/**', '**/src/**'],
              message: 'E2E tests must remain completely decoupled from application implementation code. Do not import files from src/.',
            },
          ],
        },
      ],
    },
  },
];`;
        const updated = content.replace(/\]\s*;?\s*$/, e2eBlock);
        tree.overwrite(eslintFile, updated);
      }
    } catch (err: any) {
      context.logger.warn(`⚠️ Could not update eslint config cleanly: ${err.message}. Continuing...`);
    }

    return tree;
  };
}
