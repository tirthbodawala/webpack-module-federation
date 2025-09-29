# webpack-react-config

A reusable webpack configuration for React applications with TypeScript support. This package provides a battle-tested webpack setup with sensible defaults for React development and production builds.

## Features

- 🚀 **React 18+ support** with automatic JSX runtime
- 📘 **TypeScript support** with type checking
- 🎨 **CSS & SCSS support** with modules and PostCSS
- 🖼️ **Asset optimization** (images, fonts, SVGs)
- ⚡ **Development server** with hot reload
- 📦 **Production optimization** with code splitting
- 🧹 **Built-in loaders and plugins** - no configuration needed
- 🔧 **Customizable** with override options

## Installation

```bash
npm install webpack-react-config

# Install peer dependencies
npm install react react-dom webpack webpack-cli typescript
```

## Usage

### Basic Usage

Create a `webpack.config.js` in your project root:

```javascript
import { createConfig } from 'webpack-react-config';

export default createConfig();
```

### With Custom Options

```javascript
import { createConfig } from 'webpack-react-config';

export default createConfig({
  entry: './src/app.tsx',
  publicPath: '/my-app/',
  htmlTemplate: './src/index.html',
  additionalPlugins: [
    // Your custom webpack plugins
  ]
});
```

### Advanced Customization

```javascript
import { createConfig } from 'webpack-react-config';

export default createConfig({
  mode: 'production',
  projectRoot: __dirname,
  customize: (config) => {
    // Modify the webpack config
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, 'src')
    };
    return config;
  }
});
```

### Using with Environment Variables

```javascript
import { createConfig } from 'webpack-react-config';

export default createConfig({
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  analyze: process.env.ANALYZE === 'true'
});
```

## Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `mode` | `'development' \| 'production'` | `process.env.NODE_ENV ?? 'development'` | Webpack mode |
| `analyze` | `boolean` | `process.env.ANALYZE === 'true'` | Enable bundle analyzer |
| `entry` | `string \| string[] \| object` | `'./src/index.tsx'` | Entry point(s) |
| `projectRoot` | `string` | `process.cwd()` | Project root directory |
| `publicPath` | `string` | `'/dist/'` | Public path for assets |
| `htmlTemplate` | `string` | `'./public/index.html'` | HTML template file |
| `additionalPlugins` | `WebpackPluginInstance[]` | `[]` | Additional plugins |
| `customize` | `function` | `undefined` | Function to customize config |

## Project Structure

The configuration assumes this project structure:

```
your-project/
├── public/
│   └── index.html          # HTML template
├── src/
│   ├── index.tsx          # Entry point
│   └── ...                # Your source files
├── tsconfig.json          # TypeScript config
└── webpack.config.js      # Webpack config
```

## Scripts

Add these scripts to your `package.json`:

```json
{
  "scripts": {
    "dev": "webpack serve",
    "build": "webpack --mode=production",
    "analyze": "ANALYZE=true npm run build"
  }
}
```

## What's Included

### Loaders
- **Babel** - ES6+, TypeScript, JSX transformation
- **CSS/SCSS** - With modules support and PostCSS
- **Images** - PNG, JPG, GIF, WebP, AVIF with optimization
- **SVGs** - As React components or assets
- **Fonts** - WOFF, WOFF2, TTF, OTF
- **Media** - MP4, WebM, MP3, etc.

### Plugins
- **HtmlWebpackPlugin** - HTML generation
- **MiniCssExtractPlugin** - CSS extraction in production
- **CopyWebpackPlugin** - Copy public assets
- **ForkTsCheckerWebpackPlugin** - TypeScript type checking
- **ReactRefreshWebpackPlugin** - Fast refresh in development

### Optimization
- **Code splitting** - Vendor, framework, and common chunks
- **Minification** - Terser for JS, CSSNano for CSS
- **Tree shaking** - Dead code elimination
- **Asset optimization** - Image compression, font subsetting

## License

MIT