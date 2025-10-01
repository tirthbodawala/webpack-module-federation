/**
 * Prettier configuration for consistent code formatting
 * Compatible with ESLint - no conflicting rules
 * @type {import('prettier').Config}
 */
export default {
  // Line width - market standard
  printWidth: 100,

  // Indentation - use 2 spaces (market standard for TypeScript/React)
  tabWidth: 2,
  useTabs: false,

  // Semicolons - always use (market standard for TypeScript)
  semi: true,

  // Quotes - single quotes (market standard for TypeScript/React)
  singleQuote: true,

  // Quote props - as-needed (market standard)
  quoteProps: 'as-needed',

  // JSX quotes - double quotes (market standard)
  jsxSingleQuote: false,

  // Trailing commas - all (market standard for ES2017+)
  trailingComma: 'all',

  // Bracket spacing - true (market standard)
  bracketSpacing: true,

  // JSX brackets - false (market standard)
  bracketSameLine: false,

  // Arrow function parentheses - always (market standard)
  arrowParens: 'always',

  // Prose wrap - preserve (market standard for markdown)
  proseWrap: 'preserve',

  // HTML whitespace sensitivity - css (market standard)
  htmlWhitespaceSensitivity: 'css',

  // End of line - lf (market standard for cross-platform)
  endOfLine: 'lf',

  // Embedded language formatting - auto (market standard)
  embeddedLanguageFormatting: 'auto',

  // Single attribute per line - false (market standard)
  singleAttributePerLine: false,
};