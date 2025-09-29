# @crisil/host

A Module Federation host application built with React, TypeScript, and a modern Webpack configuration.

## Project Structure

```
├── dist/                    # Production build output (generated)
├── node_modules/           # Dependencies (ignored)
├── public/                 # Static assets
│   └── index.html         # HTML template
├── src/                   # Source code (experimental)
│   ├── @types/           # TypeScript declarations
│   ├── images/           # Image assets
│   ├── resources/        # CSS and other resources
│   ├── app.tsx           # Main App component
│   └── index.tsx         # Application entry point
├── webpack/              # Webpack configuration modules
│   ├── loaders.js        # Module rules and loaders
│   ├── optimization.js   # Build optimization settings
│   ├── plugins.js        # Webpack plugins
│   └── webpack.factory.js # Main webpack config factory
├── babel.config.js       # Babel configuration
├── package.json          # Project dependencies and scripts
├── tsconfig.json         # TypeScript configuration
└── webpack.config.js     # Webpack entry point
```

## Webpack Configuration Architecture

The webpack configuration is modularized into separate files for better maintainability:

### `webpack/webpack.factory.js`
Main configuration factory that orchestrates all webpack settings:
- **Mode handling**: Development vs Production builds
- **Entry point**: `./src/index.tsx`
- **Output configuration**: Hashed filenames in production, clean builds
- **Module federation support**: Uses ES modules and top-level await
- **Dev server**: Hot reload on port 3000
- **Caching**: Filesystem caching for faster rebuilds

Key features:
- ES2020 target with ES modules output
- Content-based hashing for cache busting
- Source maps (full in production, eval in development)
- Bundle analyzer support via `ANALYZE=true`

### `webpack/loaders.js`
Comprehensive loader configuration:

#### JavaScript/TypeScript Processing
- **Babel loader** with thread-loader for multi-core processing
- **Presets**: env, react (automatic JSX), typescript
- **Production optimizations**: Console removal, prop-types stripping
- **Development features**: React refresh for hot reloading

#### Styles Processing
- **SCSS support**: Global and CSS modules
- **CSS support**: Global and CSS modules
- **PostCSS**: Modern CSS features with postcss-preset-env
- **Production**: CSS extraction and minification
- **Development**: Style injection for hot reloading

#### Asset Processing
- **Images**: PNG, JPG, GIF, WebP, AVIF with optimization
- **SVG**: Three modes - React components (default), URL import (`?url`), raw text (`?raw`)
- **Fonts**: WOFF, WOFF2, EOT, TTF, OTF
- **Media**: MP4, WebM, OGG, MP3, WAV, FLAC, AAC

### `webpack/optimization.js`
Advanced bundle optimization:

#### Code Splitting Strategy
- **Framework chunk**: React, ReactDOM, Scheduler (priority 40)
- **Vendor chunks**: Third-party packages with smart naming
- **Common chunks**: Shared application code (priority 10)
- **Runtime chunk**: Webpack runtime separate

#### Minification
- **Terser**: JavaScript minification with console removal
- **CSS Minimizer**: CSS optimization with comment removal

### `webpack/plugins.js`
Plugin orchestration:

#### Core Plugins
- **HtmlWebpackPlugin**: HTML generation with minification
- **MiniCssExtractPlugin**: CSS extraction in production
- **CopyWebpackPlugin**: Static asset copying
- **ForkTsCheckerWebpackPlugin**: TypeScript checking in separate process
- **ReactRefreshWebpackPlugin**: Development hot reloading

#### Optional Plugins
- **Bundle Analyzer**: Enabled with `ANALYZE=true` environment variable

## Source Code (Experimental)

The `src/` directory contains experimental React components and resources:

### `src/index.tsx`
Application entry point that:
- Imports global CSS reset
- Finds and validates the root DOM element
- Renders the App component using React 18's `createRoot`

### `src/app.tsx`
Main application component featuring:
- SCSS module imports for styling
- WebP image handling
- Simple component structure demonstrating the build pipeline

### `src/@types/declarations.d.ts`
Comprehensive TypeScript declarations for:
- **Image formats**: PNG, JPG, GIF, WebP, AVIF
- **SVG handling**: Default React component, URL import, raw text
- **Font formats**: WOFF, WOFF2, EOT, TTF, OTF
- **Media formats**: MP4, WebM, OGG, MP3, WAV, FLAC, AAC
- **Style modules**: SCSS and CSS modules

### Styling Architecture
- **Global styles**: `src/resources/css/reset.css` for browser normalization
- **SCSS modules**: `src/app.module.scss` demonstrates CSS modules with class exports
- **Asset integration**: Images processed through webpack pipeline

## Build Configuration

### Environment Variables
- `NODE_ENV`: Controls development/production mode
- `ANALYZE`: Set to `"true"` to generate bundle analysis report
- `PUBLIC_PATH`: Controls asset public path (defaults to `/`)

### TypeScript Configuration
- **Target**: ESNext with DOM libraries
- **Module**: ESNext with bundler resolution
- **JSX**: React JSX transform (automatic)
- **Strict mode**: Enabled for type safety

### Babel Configuration
- **Presets**: Modern ES features, React, TypeScript
- **Plugins**: Top-level await support
- **Target**: ES modules for tree shaking

## Development Workflow

1. **Development server**: `webpack serve` (port 3000)
2. **Production build**: `webpack build`
3. **Bundle analysis**: `ANALYZE=true webpack build`

## Module Federation Ready

The configuration is prepared for Module Federation with:
- ES module output format
- Top-level await support
- Proper asset handling
- Framework chunk separation

## Package Management

Uses **pnpm** (`pnpm@7.29.0`) for efficient dependency management and workspace support.