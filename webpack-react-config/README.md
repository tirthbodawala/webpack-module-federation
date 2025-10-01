# webpack-react-config

A reusable, battle-tested webpack configuration for React applications with TypeScript support and Module Federation. This package provides sensible defaults while remaining highly customizable for your specific needs.

## Features

- 🚀 **React 18+ support** with automatic JSX runtime
- 📘 **TypeScript support** with Babel compilation
- 🎨 **CSS & SCSS support** with CSS modules and PostCSS
- 🖼️ **Asset optimization** - images, fonts, SVGs with multiple import modes
- ⚡ **Development server** with hot module replacement
- 📦 **Production optimization** - code splitting, minification, tree shaking
- 🔄 **Module Federation** support for micro-frontends
- 🧹 **Zero configuration** - works out of the box with sensible defaults
- 🔧 **Fully customizable** via options and customize function

## Installation

```bash
npm install webpack-react-config

# Install peer dependencies
npm install react react-dom webpack webpack-cli typescript
```

## Quick Start

Create a `webpack.config.js` in your project root:

```javascript
import webpack from 'webpack';
import { createConfig } from 'webpack-react-config';

export default await createConfig(webpack, {
  uniqueName: 'my-app',
});
```

That's it! Your React app is now ready to build.

## Usage

### Basic Configuration

```javascript
import webpack from 'webpack';
import { createConfig } from 'webpack-react-config';

export default await createConfig(webpack, {
  uniqueName: 'my-app',
  mode: 'development',
  entry: './src/index.tsx',
  port: 3000,
});
```

### Production Build

```javascript
import webpack from 'webpack';
import { createConfig } from 'webpack-react-config';

export default await createConfig(webpack, {
  uniqueName: 'my-app',
  mode: 'production',
});
```

### With Module Federation

```javascript
import webpack from 'webpack';
import { createConfig } from 'webpack-react-config';

export default await createConfig(webpack, {
  uniqueName: 'host-app',
  moduleFederation: {
    name: 'host',
    remotes: {
      app1: 'app1@http://localhost:3001/remoteEntry.js',
    },
    shared: {
      react: { singleton: true },
      'react-dom': { singleton: true },
    },
  },
});
```

### Advanced Customization

```javascript
import webpack from 'webpack';
import { createConfig } from 'webpack-react-config';
import { resolve } from 'path';

export default await createConfig(webpack, {
  uniqueName: 'my-app',
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  projectRoot: __dirname,
  customize: (config) => {
    // Add path aliases
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': resolve(__dirname, 'src'),
      '@components': resolve(__dirname, 'src/components'),
    };
    return config;
  },
});
```

## Configuration Options

| Option                | Type                   | Default                          | Description                                      |
| --------------------- | ---------------------- | -------------------------------- | ------------------------------------------------ |
| `uniqueName`          | `string`               | **required**                     | Unique name for your app (used in CSS modules)  |
| `mode`                | `string`               | `process.env.NODE_ENV \| 'development'` | Webpack build mode                               |
| `analyze`             | `boolean`              | `process.env.ANALYZE === 'true'` | Enable webpack bundle analyzer                   |
| `entry`               | `string`               | `'./src/index.tsx'`              | Entry point for your application                 |
| `projectRoot`         | `string`               | `process.cwd()`                  | Project root directory                           |
| `port`                | `number`               | `3000`                           | Dev server port                                  |
| `host`                | `string`               | `'0.0.0.0'`                      | Dev server host                                  |
| `htmlTemplate`        | `string`               | `'./public/index.html'`          | Path to HTML template                            |
| `additionalPlugins`   | `WebpackPluginInstance[]` | `[]`                             | Additional webpack plugins                       |
| `moduleFederation`    | `object`               | `undefined`                      | Module Federation configuration                  |
| `customize`           | `function`             | `undefined`                      | Function to customize the webpack config         |

## Project Structure

The configuration assumes this project structure:

```
your-project/
├── public/
│   └── index.html          # HTML template
├── src/
│   ├── index.tsx           # Entry point
│   └── ...                 # Your source files
├── tsconfig.json           # TypeScript config
├── package.json
└── webpack.config.js       # Webpack config
```

## Scripts

Add these scripts to your `package.json`:

```json
{
  "scripts": {
    "dev": "webpack serve --mode=development",
    "build": "webpack --mode=production",
    "analyze": "ANALYZE=true npm run build"
  }
}
```

## What's Included

### Loaders

- **Babel** - ES6+, TypeScript, JSX/TSX transformation
  - React automatic JSX runtime (no need to import React)
  - Modern browser targeting with ES modules
  - Production optimizations (remove console, prop-types, etc.)
  - Development enhancements (React Refresh for HMR)
- **CSS/SCSS** - Full CSS and SCSS support
  - CSS Modules with unique scoped class names
  - PostCSS with autoprefixer and modern CSS features
  - Separate CSS extraction in production
  - Style injection in development for HMR
- **Images** - PNG, JPG, GIF, WebP, AVIF
  - Automatic inlining for files < 8KB
  - Content-based hashing for cache busting
- **SVGs** - Three import modes:
  - Default: `import Icon from './icon.svg'` - React component
  - URL: `import iconUrl from './icon.svg?url'` - URL string
  - Raw: `import iconSvg from './icon.svg?raw'` - Raw SVG string
- **Fonts** - WOFF, WOFF2, TTF, OTF, EOT
- **Media** - MP4, WebM, OGG, MP3, WAV, FLAC, AAC

### Plugins

- **HtmlWebpackPlugin** - HTML generation with optimizations
- **MiniCssExtractPlugin** - CSS extraction (production)
- **CopyWebpackPlugin** - Copy static assets from public/
- **ReactRefreshWebpackPlugin** - Fast refresh (development)
- **ModuleFederationPlugin** - Micro-frontend support (optional)
- **BundleAnalyzerPlugin** - Bundle analysis (optional, via `ANALYZE=true`)

### Optimization

- **JavaScript minification** - Terser with:
  - Console removal (production)
  - Comment removal
  - Dead code elimination
- **CSS minification** - CSSNano with comment removal
- **Module concatenation** - Scope hoisting for smaller bundles
- **Deterministic IDs** - Consistent module/chunk IDs for better caching
- **Source maps** - Full source maps in production, eval maps in development

## Module Federation

This config includes built-in support for [@module-federation/enhanced](https://module-federation.io/):

```javascript
export default await createConfig(webpack, {
  uniqueName: 'my-app',
  moduleFederation: {
    name: 'myApp',
    filename: 'remoteEntry.js',
    exposes: {
      './Component': './src/Component',
    },
    remotes: {
      anotherApp: 'anotherApp@http://localhost:3001/remoteEntry.js',
    },
    shared: {
      react: { singleton: true },
      'react-dom': { singleton: true },
    },
  },
});
```

## CSS Modules

CSS Modules are automatically enabled for files with `.module.css` or `.module.scss` extensions:

```tsx
import styles from './Component.module.scss';

function Component() {
  return <div className={styles.container}>Hello</div>;
}
```

For SCSS modules, you can use named exports:

```tsx
import { container, title } from './Component.module.scss';

function Component() {
  return (
    <div className={container}>
      <h1 className={title}>Hello</h1>
    </div>
  );
}
```

## Environment Variables

- `NODE_ENV` - Sets the webpack mode (`development` or `production`)
- `ANALYZE` - Set to `'true'` to enable bundle analyzer

## TypeScript Configuration

Recommended `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "jsx": "react-jsx",
    "moduleResolution": "bundler",
    "esModuleInterop": true,
    "strict": true,
    "skipLibCheck": true
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist"]
}
```

## Troubleshooting

### Bundle Analyzer Not Working

Install the optional dependency:

```bash
npm install --save-optional webpack-bundle-analyzer
```

### Module Federation Errors

Make sure both the host and remote apps are running and accessible at the specified URLs.

### CSS Modules Not Working

Ensure your files have the `.module.css` or `.module.scss` extension.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

MIT

## Changelog

### v1.0.0

- Initial release with React 18+ support
- TypeScript compilation with Babel
- CSS/SCSS with CSS modules
- Module Federation support
- Production optimizations
- Bundle analysis support