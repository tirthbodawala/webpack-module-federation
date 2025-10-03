import type { Config } from 'stylelint';

/**
 * Shared Stylelint configuration for CRISIL projects
 * Supports CSS, SCSS, and Mantine-specific syntax
 */
const config: Config = {
  extends: ['stylelint-config-standard', 'stylelint-config-standard-scss'],
  customSyntax: 'postcss-scss',
  rules: {
    // Allow empty sources (for files with only comments or imports)
    'no-empty-source': null,

    // SCSS specific rules
    'scss/at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: ['tailwind', 'apply', 'variants', 'responsive', 'screen', 'mixin', 'include'],
      },
    ],

    // Allow unknown properties (for CSS modules and custom properties)
    'property-no-unknown': [
      true,
      {
        ignoreProperties: ['composes'],
      },
    ],

    // Relax selector class pattern for CSS modules and BEM
    'selector-class-pattern': null,

    // Allow vendor prefixes (autoprefixer will handle)
    'property-no-vendor-prefix': null,
    'value-no-vendor-prefix': null,

    // Custom property pattern (CSS variables)
    'custom-property-pattern': null,

    // Function patterns - Allow Mantine's light-dark() function
    'function-no-unknown': [
      true,
      {
        ignoreFunctions: ['theme', 'screen', 'rem', 'em', 'light-dark'],
      },
    ],

    // Allow Mantine $variables in media queries (handled by postcss-simple-vars)
    'media-query-no-invalid': null,

    // SCSS operators
    'scss/operator-no-newline-after': null,
    'scss/operator-no-unspaced': null,

    // Allow $ variables (SCSS/Mantine variables like $mantine-breakpoint-sm)
    'value-keyword-case': null,

    // Don't error on unknown at-rules (Mantine mixins)
    'at-rule-no-unknown': null,

    // Allow nested selectors (CSS nesting and SCSS)
    'selector-nested-pattern': null,
    'no-descending-specificity': null,
  },
  ignoreFiles: [
    '**/node_modules/**',
    '**/dist/**',
    '**/build/**',
    '**/.webpack/**',
    '**/coverage/**',
  ],
};

export default config;
