# mfe-build-tools

Complete build toolchain for MFE (Module Federation) projects. This package includes everything you need: Webpack, ESLint, Prettier, Stylelint, and TypeScript configurations.

## Features

✅ **Webpack Configuration** - React + TypeScript + Module Federation
✅ **ESLint** - Strict TypeScript rules
✅ **Prettier** - Code formatting
✅ **Stylelint** - CSS/SCSS linting with Mantine support
✅ **TypeScript** - Multiple configurations (React, Node, Library)
✅ **Zero Additional Dependencies** - Everything bundled in one package

## Installation

```bash
npm install --save-dev mfe-build-tools
```

**That's it!** No need to install webpack, eslint, prettier, stylelint, typescript, or any other tools separately. Everything is included.

## Usage

### 1. Webpack Configuration

**`webpack.config.js`:**

```javascript
import { createWebpackConfig } from 'mfe-build-tools/webpack';

export default createWebpackConfig({
  entry: './src/index.tsx',
  moduleFederation: {
    name: 'myApp',
    filename: 'remoteEntry.js',
    exposes: {
      './App': './src/App',
    },
  },
});
```

### 2. ESLint Configuration

**`eslint.config.js`:**

```javascript
import eslintConfig from 'mfe-build-tools/eslint';

export default eslintConfig;
```

### 3. Prettier Configuration

**`prettier.config.js`:**

```javascript
import prettierConfig from 'mfe-build-tools/prettier';

export default prettierConfig;
```

### 4. Stylelint Configuration

**`stylelint.config.js`:**

```javascript
import stylelintConfig from 'mfe-build-tools/stylelint';

export default stylelintConfig;
```

### 5. TypeScript Configuration

**For React Projects** - `tsconfig.json`:

```json
{
  "extends": "mfe-build-tools/typescript/react",
  "compilerOptions": {
    "noPropertyAccessFromIndexSignature": false
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
}
```

**For Node Projects:**

```json
{
  "extends": "mfe-build-tools/typescript/node",
  "include": ["src/**/*"]
}
```

**For Library Projects:**

```json
{
  "extends": "mfe-build-tools/typescript/library",
  "compilerOptions": {
    "outDir": "./dist"
  }
}
```

## Complete Project Setup

### 1. Install the package

```bash
npm install --save-dev mfe-build-tools
```

### 2. Create configuration files

**`package.json` scripts:**

```json
{
  "scripts": {
    "dev": "webpack serve",
    "build": "webpack",
    "lint": "eslint .",
    "lint:fix": "eslint . --fix",
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    "stylelint": "stylelint \"**/*.{css,scss}\"",
    "stylelint:fix": "stylelint \"**/*.{css,scss}\" --fix",
    "type-check": "tsc --noEmit",
    "check": "npm run type-check && npm run lint && npm run stylelint && npm run format:check",
    "fix": "npm run lint:fix && npm run stylelint:fix && npm run format"
  }
}
```

**`webpack.config.js`:**

```javascript
import { createWebpackConfig } from 'mfe-build-tools/webpack';

export default createWebpackConfig({
  entry: './src/index.tsx',
  template: './public/index.html',
  moduleFederation: {
    name: 'host',
    remotes: {
      app1: 'app1@http://localhost:3001/remoteEntry.js',
    },
    shared: {
      react: { singleton: true, eager: true },
      'react-dom': { singleton: true, eager: true },
    },
  },
});
```

**`eslint.config.js`:**

```javascript
import eslintConfig from 'mfe-build-tools/eslint';
export default eslintConfig;
```

**`prettier.config.js`:**

```javascript
import prettierConfig from 'mfe-build-tools/prettier';
export default prettierConfig;
```

**`stylelint.config.js`:**

```javascript
import stylelintConfig from 'mfe-build-tools/stylelint';
export default stylelintConfig;
```

**`tsconfig.json`:**

```json
{
  "extends": "mfe-build-tools/typescript/react",
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
}
```

### 3. Run commands

```bash
npm run dev          # Start dev server
npm run build        # Production build
npm run check        # Run all checks
npm run fix          # Fix all issues
```

## What's Included

### Dependencies (All Bundled)

- **Webpack & Loaders:** webpack, webpack-cli, webpack-dev-server, babel-loader, css-loader, sass-loader, style-loader, etc.
- **Babel:** @babel/core, @babel/preset-react, @babel/preset-typescript, @babel/preset-env
- **Module Federation:** @module-federation/enhanced
- **Linting:** eslint, typescript-eslint, stylelint, prettier
- **TypeScript:** typescript
- **React Tools:** react-refresh, @pmmmwh/react-refresh-webpack-plugin
- **CSS Tools:** postcss, sass, cssnano
- **Optimization:** terser-webpack-plugin, css-minimizer-webpack-plugin

### Configurations

- **ESLint:** Strict TypeScript rules, Prettier integration
- **Stylelint:** Standard + SCSS + Mantine support
- **TypeScript:** 4 variants (base, react, node, library)
- **Prettier:** Consistent code formatting
- **Webpack:** React + TypeScript + Module Federation + HMR

## Webpack Configuration Options

```typescript
createWebpackConfig({
  // Required
  entry: string;

  // Optional
  template?: string;
  outputPath?: string;
  port?: number;
  publicPath?: string;

  // Module Federation
  moduleFederation?: {
    name: string;
    filename?: string;
    exposes?: Record<string, string>;
    remotes?: Record<string, string>;
    shared?: Record<string, any>;
  };

  // Webpack overrides
  webpack?: (config: Configuration) => Configuration;
});
```

## TypeScript Configurations

### `typescript/base.json`
Strict base configuration with all best practices enabled.

### `typescript/react.json`
Extends base, adds React-specific settings (JSX, DOM types, bundler resolution).

### `typescript/node.json`
Extends base, adds Node.js-specific settings (NodeNext module resolution).

### `typescript/library.json`
Extends base, adds library-specific settings (declaration files, source maps).

## Stylelint Features

- ✅ Standard CSS/SCSS rules
- ✅ Mantine `$mantine-breakpoint-*` variables
- ✅ Mantine `light-dark()` function
- ✅ CSS Modules support
- ✅ PostCSS variables support
- ✅ Nested selectors support

## Migration from Individual Packages

If you're migrating from separate packages:

**Before:**
```json
{
  "devDependencies": {
    "webpack": "^5.0.0",
    "webpack-cli": "^6.0.0",
    "eslint": "^9.0.0",
    "prettier": "^3.0.0",
    "stylelint": "^16.0.0",
    "typescript": "^5.0.0",
    "@crisil/eslint-config": "^1.0.0",
    "@crisil/ts-config": "^1.0.0",
    "webpack-react-config": "^1.0.0"
    // ... and 50+ more packages
  }
}
```

**After:**
```json
{
  "devDependencies": {
    "mfe-build-tools": "^1.0.0"
  }
}
```

## License

MIT
