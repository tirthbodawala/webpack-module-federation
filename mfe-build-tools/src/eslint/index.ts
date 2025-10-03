import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintConfigPrettier from 'eslint-config-prettier';
import type { TSESLint } from '@typescript-eslint/utils';

/**
 * Shared ESLint configuration for MFE projects
 * Based on strict TypeScript standards with Prettier integration
 */
const config: Array<TSESLint.FlatConfig.Config> = [
  // Ignore patterns for non-source files
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/build/**',
      '**/.webpack/**',
      '**/coverage/**',
      '**/@mf-types/**',
    ],
  },

  // Base ESLint recommended rules
  eslint.configs.recommended,

  // TypeScript ESLint strict configuration (market standard)
  ...tseslint.configs.strictTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,

  // TypeScript project configuration
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },

  // Custom rules for code quality and consistency
  {
    rules: {
      // Enforce explicit function return types (market standard)
      '@typescript-eslint/explicit-function-return-type': [
        'error',
        {
          allowExpressions: true,
          allowTypedFunctionExpressions: true,
          allowHigherOrderFunctions: true,
        },
      ],

      // Enforce explicit module boundary types
      '@typescript-eslint/explicit-module-boundary-types': 'error',

      // Prevent unused variables (TypeScript rule, more accurate than ESLint)
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],

      // Consistent type imports (market standard)
      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          prefer: 'type-imports',
          fixStyle: 'separate-type-imports',
        },
      ],

      // Consistent type exports
      '@typescript-eslint/consistent-type-exports': [
        'error',
        {
          fixMixedExportsWithInlineTypeSpecifier: true,
        },
      ],

      // Enforce using `type` for type definitions (avoids conflict with interfaces)
      '@typescript-eslint/consistent-type-definitions': ['error', 'type'],

      // Enforce array type syntax consistency (market standard: Array<T>)
      '@typescript-eslint/array-type': [
        'error',
        {
          default: 'generic',
          readonly: 'generic',
        },
      ],

      // Require Promise-like statements to be properly awaited
      '@typescript-eslint/no-floating-promises': 'error',

      // Disallow misused Promises
      '@typescript-eslint/no-misused-promises': [
        'error',
        {
          checksVoidReturn: {
            attributes: false,
          },
        },
      ],

      // Naming conventions (market standard)
      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: 'default',
          format: ['camelCase'],
          leadingUnderscore: 'allow',
          trailingUnderscore: 'forbid',
        },
        {
          selector: 'variable',
          format: ['camelCase', 'UPPER_CASE', 'PascalCase'],
          leadingUnderscore: 'allow',
        },
        {
          selector: 'parameter',
          format: ['camelCase'],
          leadingUnderscore: 'allow',
        },
        {
          selector: 'typeLike',
          format: ['PascalCase'],
        },
        {
          selector: 'enumMember',
          format: ['PascalCase', 'UPPER_CASE'],
        },
        {
          selector: 'property',
          format: null, // Allow any format for object properties
        },
      ],

      // Enforce explicit accessibility modifiers (classes)
      '@typescript-eslint/explicit-member-accessibility': [
        'error',
        {
          accessibility: 'explicit',
          overrides: {
            constructors: 'no-public',
          },
        },
      ],

      // Disallow non-null assertions (use proper type guards instead)
      '@typescript-eslint/no-non-null-assertion': 'error',

      // Require consistent use of type assertions
      '@typescript-eslint/consistent-type-assertions': [
        'error',
        {
          assertionStyle: 'as',
          objectLiteralTypeAssertions: 'never',
        },
      ],

      // General code quality rules
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-debugger': 'error',
      'prefer-const': 'error',
      'no-var': 'error',
      eqeqeq: ['error', 'always', { null: 'ignore' }],
      curly: ['error', 'all'],
      'no-throw-literal': 'error',

      // Import organization (no conflicts with Prettier)
      'sort-imports': [
        'error',
        {
          ignoreCase: true,
          ignoreDeclarationSort: true, // Use import sorting tools instead
        },
      ],
    },
  },

  // Disable type-aware linting for JavaScript files
  {
    files: ['**/*.js', '**/*.mjs', '**/*.cjs'],
    ...tseslint.configs.disableTypeChecked,
  },

  // Prettier configuration - MUST be last to override conflicting rules
  eslintConfigPrettier,
];

export default config;
