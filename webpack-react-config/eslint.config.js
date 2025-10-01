// @ts-check
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettierRecommended from 'eslint-plugin-prettier/recommended';

const tsFilePatterns = ['**/*.ts', '**/*.tsx', '**/*.cts', '**/*.mts'];
const jsFilePatterns = ['**/*.js', '**/*.mjs', '**/*.cjs'];

const disableTypeCheckedConfig = /** @type {any} */ (tseslint.configs.disableTypeChecked);

/**
 * @typedef {string | string[]} FilePatterns
 */

/**
 * @typedef {Object.<string, any>} RuleRecord
 */

/**
 * @typedef {Object} ESLintLanguageOptions
 * @property {any} [parser]
 * @property {any} [parserOptions]
 * @property {any} [projectService]
 * @property {any} [tsconfigRootDir]
 */

/**
 * @typedef {Object} ESLintConfig
 * @property {FilePatterns} [files]
 * @property {ESLintLanguageOptions} [languageOptions]
 * @property {RuleRecord} [rules]
 * @property {string[]} [ignores]
 * @property {any} [other] - allow other unknown properties
 */

/**
 * Ensures TypeScript file patterns are applied when a config doesn't specify files.
 * @param {ESLintConfig} config
 * @returns {ESLintConfig}
 */
const applyTypeScriptFiles = (config) => ({
  ...config,
  files: config.files ?? tsFilePatterns,
});

export default [
  // Ignore patterns
  {
    ignores: ['dist/**', 'node_modules/**', 'coverage/**', '**/*.d.ts', 'build/**', '.webpack/**'],
  },

  // Base ESLint recommended rules
  eslint.configs.recommended,

  // TypeScript-specific configuration
  ...tseslint.configs.strictTypeChecked.map(applyTypeScriptFiles),
  ...tseslint.configs.stylisticTypeChecked.map(applyTypeScriptFiles),
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      '@typescript-eslint/explicit-function-return-type': [
        'warn',
        {
          allowExpressions: true,
          allowTypedFunctionExpressions: true,
          allowHigherOrderFunctions: true,
        },
      ],
      '@typescript-eslint/explicit-module-boundary-types': 'warn',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-misused-promises': 'error',
      '@typescript-eslint/await-thenable': 'error',
      '@typescript-eslint/no-unnecessary-type-assertion': 'error',
      '@typescript-eslint/prefer-nullish-coalescing': 'warn',
      '@typescript-eslint/prefer-optional-chain': 'warn',
      '@typescript-eslint/consistent-type-imports': [
        'warn',
        {
          prefer: 'type-imports',
          fixStyle: 'inline-type-imports',
        },
      ],
      '@typescript-eslint/consistent-type-exports': [
        'warn',
        {
          fixMixedExportsWithInlineTypeSpecifier: true,
        },
      ],
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-debugger': 'error',
      'prefer-const': 'error',
      'no-var': 'error',
      eqeqeq: ['error', 'always'],
    },
  },
  {
    files: [
      '**/*.test.ts',
      '**/*.test.tsx',
      '**/*.spec.ts',
      '**/*.spec.tsx',
      'tests/**/*.ts',
      'tests/**/*.tsx',
    ],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/no-unsafe-function-type': 'off',
      '@typescript-eslint/restrict-plus-operands': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/prefer-nullish-coalescing': 'off',
    },
  },
  {
    files: jsFilePatterns,
    languageOptions: {
      ...disableTypeCheckedConfig.languageOptions,
    },
    rules: {
      ...disableTypeCheckedConfig.rules,
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'prefer-const': 'error',
      'no-var': 'error',
    },
  },

  // Prettier integration (must be last to override formatting rules)
  prettierRecommended,
];
