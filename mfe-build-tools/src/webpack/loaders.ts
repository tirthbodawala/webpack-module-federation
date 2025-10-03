// Node.js built-in modules
import { createRequire } from 'node:module';

// Third-party type definitions
import type { RuleSetRule, RuleSetUseItem } from 'webpack';

// Webpack plugins
import MiniCssExtractPlugin from 'mini-css-extract-plugin';

/**
 * Create a require.resolve function for ESM environments
 * This is needed to resolve module paths in ES modules where require.resolve is not available
 */
const esmRequire = createRequire(import.meta.url);
const resolveModule = esmRequire.resolve;

/**
 * Configuration options for creating webpack module rules
 */
export interface ModuleRuleOptions {
  /** Whether this is a production build */
  isProd: boolean;
  /** Unique name for CSS modules to prevent naming conflicts */
  uniqueName: string;
}

/**
 * Creates a comprehensive set of webpack module rules for handling various file types
 *
 * This function generates webpack rules for:
 * - JavaScript/TypeScript files (.js, .jsx, .ts, .tsx) with Babel compilation
 * - CSS files (.css) with optional CSS modules support
 * - SCSS files (.scss) with Sass compilation and optional CSS modules
 * - Images (.png, .jpg, .gif, .webp, .avif) with asset optimization
 * - SVG files with multiple handling modes (component, URL, raw)
 * - Font files (.woff, .woff2, .eot, .ttf, .otf)
 * - Media files (.mp4, .webm, .ogg, .mp3, .wav, .flac, .aac)
 *
 * @param options - Configuration options for the module rules
 * @returns Array of webpack module rules
 *
 * @example
 * ```typescript
 * const rules = createModuleRules({
 *   isProd: process.env.NODE_ENV === 'production',
 *   uniqueName: 'my-app'
 * });
 * ```
 */
export function createModuleRules({ isProd, uniqueName }: ModuleRuleOptions): RuleSetRule[] {
  return [
    createScriptRule(isProd),
    createGlobalScssRule(isProd, uniqueName),
    createModuleScssRule(isProd, uniqueName),
    createGlobalCssRule(isProd, uniqueName),
    createModuleCssRule(isProd, uniqueName),
    createImageRule(isProd),
    createSvgRule(isProd),
    createFontRule(isProd),
    createMediaRule(isProd),
  ];
}

/**
 * Creates webpack rule for JavaScript and TypeScript files
 * Handles .js, .jsx, .ts, .tsx files with Babel compilation
 *
 * @param isProd - Whether this is a production build
 * @returns Webpack rule for script files
 */
function createScriptRule(isProd: boolean): RuleSetRule {
  return {
    test: /\.[jt]sx?$/i, // Match .js, .jsx, .ts, .tsx files (case insensitive)
    type: 'javascript/esm', // Output as ES modules
    exclude: /node_modules/, // Don't process node_modules for performance
    use: [
      {
        loader: resolveModule('babel-loader'),
        options: createBabelOptions(isProd),
      },
    ],
  };
}

/**
 * Type for Babel plugin/preset configuration options
 */
type BabelConfigOptions = Record<string, unknown>;

/**
 * TypeScript interface for Babel loader options
 */
interface BabelOptions {
  /** Babel presets for transforming code */
  presets: (string | [string, BabelConfigOptions])[];
  /** Babel plugins for code transformations */
  plugins: (string | [string, BabelConfigOptions])[];
  /** Enable Babel caching for faster builds */
  cacheDirectory: boolean;
  /** Disable cache compression for faster I/O */
  cacheCompression: boolean;
  /** Compact output (minified) for production */
  compact: boolean;
  /** Environment-specific configuration */
  env?: {
    development?: {
      compact: boolean;
      retainLines: boolean;
    };
  };
}

/**
 * Creates Babel configuration options for JavaScript/TypeScript compilation
 *
 * Includes:
 * - @babel/preset-env for modern JavaScript features
 * - @babel/preset-react for JSX transformation
 * - @babel/preset-typescript for TypeScript support
 * - Production optimizations (remove console, prop-types, undefined variables)
 * - Development optimizations (React Refresh for HMR)
 *
 * @param isProd - Whether this is a production build
 * @returns Babel configuration options
 */
function createBabelOptions(isProd: boolean): BabelOptions {
  return {
    presets: [
      // @babel/preset-env - Transform modern JavaScript to support target browsers
      [
        resolveModule('@babel/preset-env'),
        {
          bugfixes: true, // Enable latest bugfixes for smaller output
          modules: false, // Keep ES modules for webpack tree-shaking
          targets: { esmodules: true }, // Target modern browsers with ES module support
          shippedProposals: true, // Enable shipped proposals for smaller polyfills
        },
      ],
      // @babel/preset-react - Transform JSX and React-specific features
      [
        resolveModule('@babel/preset-react'),
        {
          runtime: 'automatic', // Use React 17+ automatic JSX runtime (no need to import React)
          development: !isProd, // Enable development helpers in dev mode
        },
      ],
      // @babel/preset-typescript - Transform TypeScript to JavaScript
      [
        resolveModule('@babel/preset-typescript'),
        {
          allowDeclareFields: true, // Allow declare property syntax
          allowNamespaces: true, // Support TypeScript namespaces
          allExtensions: true, // Process all file extensions
          isTSX: true, // Support JSX in TypeScript files
          onlyRemoveTypeImports: true, // Only remove type-only imports
        },
      ],
    ],
    plugins: [
      // Core language feature plugins
      resolveModule('@babel/plugin-syntax-top-level-await'), // Enable top-level await
      resolveModule('@babel/plugin-transform-private-methods'), // Transform private methods
      resolveModule('@babel/plugin-transform-class-properties'), // Transform class properties
      resolveModule('@babel/plugin-transform-private-property-in-object'), // Transform private properties

      // Environment-specific plugins
      ...(isProd
        ? [
            // Production optimizations
            [
              resolveModule('babel-plugin-transform-remove-console'),
              { exclude: ['error', 'warn'] },
            ] as [string, BabelConfigOptions],
            resolveModule('babel-plugin-transform-react-remove-prop-types'), // Remove PropTypes in production
            [resolveModule('babel-plugin-transform-remove-undefined'), { tdz: true }] as [
              string,
              BabelConfigOptions,
            ],
          ]
        : [
            // Development optimizations
            resolveModule('react-refresh/babel'), // Enable React Fast Refresh
          ]),
    ],
    cacheDirectory: true, // Enable caching for faster subsequent builds
    cacheCompression: false, // Disable compression for faster I/O
    compact: isProd, // Compact output only in production
    env: {
      development: {
        compact: false, // Keep readable formatting in development
        retainLines: true, // Preserve line numbers for debugging
      },
    },
  };
}

/**
 * Creates webpack rule for global SCSS files (not CSS modules)
 * @param isProd - Whether this is a production build
 * @param uniqueName - Unique name for scoping
 * @returns Webpack rule for global SCSS files
 */
function createGlobalScssRule(isProd: boolean, uniqueName: string): RuleSetRule {
  return {
    test: /\.scss$/i, // Match .scss files (case insensitive)
    exclude: /\.module\.scss$/i, // Exclude module SCSS files
    use: createScssLoaders({ isProd, withModules: false, uniqueName }),
  };
}

/**
 * Creates webpack rule for SCSS module files (CSS modules)
 * @param isProd - Whether this is a production build
 * @param uniqueName - Unique name for CSS module scoping
 * @returns Webpack rule for SCSS module files
 */
function createModuleScssRule(isProd: boolean, uniqueName: string): RuleSetRule {
  return {
    test: /\.module\.scss$/i, // Match .module.scss files
    use: createScssLoaders({ isProd, withModules: true, uniqueName }),
  };
}

/**
 * Creates webpack rule for global CSS files (not CSS modules)
 * @param isProd - Whether this is a production build
 * @param uniqueName - Unique name for scoping
 * @returns Webpack rule for global CSS files
 */
function createGlobalCssRule(isProd: boolean, uniqueName: string): RuleSetRule {
  return {
    test: /\.css$/i, // Match .css files (case insensitive)
    exclude: /\.module\.css$/i, // Exclude module CSS files
    use: createCssLoaders({ isProd, withModules: false, uniqueName }),
  };
}

/**
 * Creates webpack rule for CSS module files
 * @param isProd - Whether this is a production build
 * @param uniqueName - Unique name for CSS module scoping
 * @returns Webpack rule for CSS module files
 */
function createModuleCssRule(isProd: boolean, uniqueName: string): RuleSetRule {
  return {
    test: /\.module\.css$/i, // Match .module.css files
    use: createCssLoaders({ isProd, withModules: true, uniqueName }),
  };
}

/**
 * Creates webpack rule for image files with automatic optimization
 * Small images (< 8KB) are inlined as data URLs, larger ones are emitted as files
 *
 * @param isProd - Whether this is a production build
 * @returns Webpack rule for image files
 */
function createImageRule(isProd: boolean): RuleSetRule {
  return {
    test: /\.(png|jpe?g|gif|webp|avif)$/i, // Match common image formats
    type: 'asset', // Automatic choice between inline and resource
    parser: {
      dataUrlCondition: { maxSize: 8 * 1024 }, // Inline images smaller than 8KB
    },
    generator: {
      filename: isProd
        ? 'images/[name].[contenthash:8][ext]' // Content hash for caching in production
        : 'images/[name][ext]', // Simple naming in development
    },
  };
}

/**
 * Creates webpack rule for SVG files with multiple handling modes
 *
 * SVG files can be imported in three ways:
 * - `import icon from './icon.svg'` - As React component (default)
 * - `import icon from './icon.svg?url'` - As URL string
 * - `import icon from './icon.svg?raw'` - As raw SVG string
 *
 * @param isProd - Whether this is a production build
 * @returns Webpack rule for SVG files with multiple import modes
 */
function createSvgRule(isProd: boolean): RuleSetRule {
  return {
    test: /\.svg$/i, // Match .svg files
    oneOf: [
      // Handle ?raw query - import as raw SVG string
      {
        resourceQuery: /raw/,
        type: 'asset/source', // Return the raw file content
      },
      // Handle ?url query - import as URL
      {
        resourceQuery: /url/,
        type: 'asset', // Emit as file and return URL
        generator: {
          filename: isProd
            ? 'images/[name].[contenthash:8][ext]' // Content hash for caching
            : 'images/[name][ext]', // Simple naming in development
        },
      },
      // Default behavior - import as React component
      {
        use: [
          {
            loader: resolveModule('@svgr/webpack'), // Transform SVG to React component
            options: {
              svgoConfig: {
                plugins: [
                  {
                    name: 'removeViewBox',
                    active: false, // Keep viewBox for responsive SVGs
                  },
                ],
              },
            },
          },
        ],
      },
    ],
  };
}

/**
 * Creates webpack rule for font files
 * Font files are always emitted as separate files (not inlined)
 *
 * @param isProd - Whether this is a production build
 * @returns Webpack rule for font files
 */
function createFontRule(isProd: boolean): RuleSetRule {
  return {
    test: /\.(woff2?|eot|ttf|otf)$/i, // Match common font formats
    type: 'asset/resource', // Always emit as separate files
    generator: {
      filename: isProd
        ? 'fonts/[name].[contenthash:8][ext]' // Content hash for caching
        : 'fonts/[name][ext]', // Simple naming in development
    },
  };
}

/**
 * Creates webpack rule for media files (video, audio)
 * Small media files (< 8KB) are inlined, larger ones are emitted as files
 *
 * @param isProd - Whether this is a production build
 * @returns Webpack rule for media files
 */
function createMediaRule(isProd: boolean): RuleSetRule {
  return {
    test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)$/i, // Match common media formats
    type: 'asset', // Automatic choice between inline and resource
    parser: {
      dataUrlCondition: { maxSize: 8 * 1024 }, // Inline media smaller than 8KB
    },
    generator: {
      filename: isProd
        ? 'media/[name].[contenthash:8][ext]' // Content hash for caching
        : 'media/[name][ext]', // Simple naming in development
    },
  };
}

/**
 * Configuration options for style loaders
 */
interface StyleLoadersOptions {
  /** Whether this is a production build */
  isProd: boolean;
  /** Whether to enable CSS modules */
  withModules: boolean;
  /** Unique name for CSS module scoping */
  uniqueName: string;
}

/**
 * Creates the loader chain for SCSS files
 * Chain: style-loader/MiniCssExtractPlugin -> css-loader -> postcss-loader -> sass-loader
 *
 * @param options - Style loader options
 * @returns Array of webpack loaders for SCSS processing
 */
function createScssLoaders({
  isProd,
  withModules,
  uniqueName,
}: StyleLoadersOptions): RuleSetUseItem[] {
  return [
    getStyleLoader(isProd), // Inject CSS into DOM (dev) or extract to file (prod)
    createCssLoader({ isProd, withModules, importLoaders: 2, uniqueName }), // Process CSS imports and modules
    createPostCssLoader(isProd), // PostCSS transformations (autoprefixer, etc.)
    {
      loader: resolveModule('sass-loader'), // Compile SCSS to CSS
      options: {
        sourceMap: !isProd, // Generate source maps in development
        sassOptions: { outputStyle: isProd ? 'compressed' : 'expanded' },
      },
    },
  ];
}

/**
 * Creates the loader chain for CSS files
 * Chain: style-loader/MiniCssExtractPlugin -> css-loader -> postcss-loader
 *
 * @param options - Style loader options
 * @returns Array of webpack loaders for CSS processing
 */
function createCssLoaders({
  isProd,
  withModules,
  uniqueName,
}: StyleLoadersOptions): RuleSetUseItem[] {
  return [
    getStyleLoader(isProd), // Inject CSS into DOM (dev) or extract to file (prod)
    createCssLoader({ isProd, withModules, importLoaders: 1, uniqueName }), // Process CSS imports and modules
    createPostCssLoader(isProd), // PostCSS transformations
  ];
}

/**
 * Returns the appropriate CSS style loader based on environment
 * - Development: style-loader (injects CSS into DOM)
 * - Production: MiniCssExtractPlugin.loader (extracts CSS to separate files)
 *
 * @param isProd - Whether this is a production build
 * @returns CSS style loader
 */
function getStyleLoader(isProd: boolean): string {
  return isProd ? MiniCssExtractPlugin.loader : resolveModule('style-loader');
}

/**
 * Configuration options for css-loader
 */
interface CssLoaderOptions {
  /** Whether this is a production build */
  isProd: boolean;
  /** Whether to enable CSS modules */
  withModules: boolean;
  /** Number of loaders applied before css-loader */
  importLoaders: number;
  /** Unique name for CSS module scoping */
  uniqueName: string;
}

/**
 * Creates css-loader configuration with CSS modules support
 *
 * Features:
 * - CSS modules with scoped class names
 * - Source maps in development
 * - URL filtering for security
 * - Named exports for SCSS modules
 *
 * @param options - CSS loader configuration options
 * @returns css-loader configuration object
 */
function createCssLoader({
  isProd,
  withModules,
  importLoaders,
  uniqueName,
}: CssLoaderOptions): RuleSetUseItem {
  const baseOptions: Record<string, unknown> = {
    importLoaders, // Number of loaders applied before css-loader
    sourceMap: !isProd, // Generate source maps in development
  };

  if (withModules) {
    // CSS Modules configuration
    baseOptions['modules'] = {
      localIdentName: isProd
        ? `${uniqueName}_[hash:base64:6]` // Short hash for production
        : `${uniqueName}_[name]__[local]__[hash:base64:5]`, // Readable names for development
      mode: 'local', // Enable CSS modules
      ...(importLoaders === 2 // SCSS files have 2 import loaders (postcss + sass)
        ? {
            namedExport: true, // Export class names as named exports
            exportLocalsConvention: 'camelCaseOnly', // Convert kebab-case to camelCase
          }
        : {}),
    };
  } else if (importLoaders === 2) {
    // URL filtering for SCSS files (security measure)
    baseOptions['url'] = {
      // Prevent absolute/remote URLs from being processed for security
      filter: (url: string) => !(url.startsWith('/') || url.startsWith('http')),
    };
  }

  return {
    loader: resolveModule('css-loader'),
    options: baseOptions,
  };
}

/**
 * Creates PostCSS loader configuration for CSS transformations
 *
 * Includes:
 * - postcss-preset-env: Autoprefixer and modern CSS features
 * - cssnano: CSS minification in production
 *
 * @param isProd - Whether this is a production build
 * @returns PostCSS loader configuration
 */
function createPostCssLoader(isProd: boolean): RuleSetUseItem {
  return {
    loader: resolveModule('postcss-loader'),
    options: {
      postcssOptions: {
        plugins: [
          resolveModule('postcss-preset-env'), // Autoprefixer and modern CSS polyfills
          ...(isProd ? [resolveModule('cssnano')] : []), // CSS minification in production
        ],
      },
      sourceMap: !isProd, // Generate source maps in development
    },
  };
}
