/**
 * @fileoverview Main webpack configuration factory for React applications
 *
 * This module provides a comprehensive webpack configuration builder that supports:
 * - TypeScript/JSX compilation, CSS/SCSS processing, asset handling
 * - Development server, Module Federation, bundle optimization
 *
 * The code is organized into focused helper functions for better readability and maintainability.
 */

// Node.js built-in modules
import { resolve } from 'node:path';

// Third-party type definitions
import type { Configuration as WebpackConfiguration } from 'webpack';

// Internal modules - organized by functionality
import { createModuleRules } from './loaders.js';
import { createPlugins, loadAnalyzerPlugins } from './plugins.js';
import { createOptimization } from './optimization.js';
import {
  type CreateConfigOptions,
  type ModuleFederationOptions,
  type WebpackConfigWithDevServer,
  type WebpackInstanceType,
} from './@types/types.js';

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Gets the default webpack mode from environment variables
 */
const getDefaultMode = (): WebpackConfiguration['mode'] =>
  (process.env['NODE_ENV'] as WebpackConfiguration['mode']) ?? 'development';

/**
 * Checks if bundle analysis is enabled via environment variable
 */
const getDefaultAnalyze = (): boolean => process.env['ANALYZE'] === 'true';

/**
 * Configures Module Federation with sensible defaults
 */
function configureModuleFederation(
  moduleFederation?: ModuleFederationOptions,
  uniqueName?: string,
): void {
  if (moduleFederation && Object.keys(moduleFederation).length) {
    moduleFederation.name ??= uniqueName;
    moduleFederation.filename ??= 'remoteEntry.js';
  }
}

/**
 * Resolves node_modules paths for loader resolution
 */
function resolveNodeModulesPaths(projectRoot: string): {
  appNodeModules: string;
  pkgNodeModules: string;
} {
  const appNodeModules = resolve(projectRoot, 'node_modules');
  let pkgNodeModules: string;

  try {
    pkgNodeModules = resolve(appNodeModules, 'webpack-react-config/node_modules');
  } catch {
    pkgNodeModules = resolve(appNodeModules, 'webpack-react-config/node_modules');
  }

  return { appNodeModules, pkgNodeModules };
}

/**
 * Loads bundle analyzer plugins if analysis is requested
 */
async function loadBundleAnalyzerPlugins(
  analyze: boolean,
): Promise<WebpackConfiguration['plugins']> {
  if (!analyze) return [];

  try {
    return await loadAnalyzerPlugins();
  } catch (error) {
    console.warn('Bundle analyzer plugins could not be loaded:', (error as Error).message);
    return [];
  }
}

/**
 * Creates the core webpack configuration object
 */
function createCoreConfig(options: {
  mode: WebpackConfiguration['mode'];
  entry: string;
  isProd: boolean;
  uniqueName: string;
  appNodeModules: string;
  pkgNodeModules: string;
  distPath: string;
  publicPath: string;
}): Partial<WebpackConfigWithDevServer> {
  const { mode, entry, isProd, uniqueName, appNodeModules, pkgNodeModules, distPath, publicPath } =
    options;

  return {
    mode,
    entry,
    target: ['web', 'es2020'],
    experiments: { topLevelAwait: true },
    devtool: isProd ? 'source-map' : 'eval-cheap-module-source-map',

    module: {
      rules: createModuleRules({ isProd, uniqueName }),
    },

    resolve: {
      extensions: ['.tsx', '.ts', '.jsx', '.js', '.json'],
      modules: ['node_modules'],
      symlinks: false,
    },

    resolveLoader: {
      symlinks: false,
      modules: [appNodeModules, pkgNodeModules],
    },

    optimization: createOptimization({ isProd }),

    output: {
      uniqueName,
      clean: true,
      path: distPath,
      filename: isProd ? '[name].[contenthash:8].js' : '[name].js',
      chunkFilename: isProd ? '[name].[contenthash:8].chunk.js' : '[name].chunk.js',
      assetModuleFilename: isProd ? 'assets/[name].[contenthash:8][ext]' : 'assets/[name][ext]',
      publicPath,
      crossOriginLoading: 'anonymous' as const,
    },

    performance: {
      hints: isProd ? ('warning' as const) : false,
      maxEntrypointSize: 512000,
      maxAssetSize: 512000,
    },

    stats: {
      preset: 'minimal' as const,
      moduleTrace: true,
      errorDetails: true,
    },
  };
}

/**
 * Creates development server configuration
 */
function createDevServerConfig(options: {
  port: number;
  host: string;
  distPath: string;
}): WebpackConfigWithDevServer['devServer'] {
  const { port, host, distPath } = options;

  return {
    port,
    host,
    hot: true,
    historyApiFallback: true,
    compress: true,
    client: {
      overlay: false,
      webSocketURL: { port },
    },
    static: distPath,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization',
    },
  };
}

// ============================================================================
// MAIN EXPORT FUNCTION
// ============================================================================

/**
 * Creates a comprehensive webpack configuration for React applications with TypeScript support
 *
 * Features:
 * - TypeScript/JSX compilation with Babel
 * - CSS/SCSS processing with CSS modules support
 * - Asset handling (images, fonts, media)
 * - Development server configuration
 * - Module Federation support (optional)
 * - Bundle optimization and code splitting
 * - Bundle analysis (optional)
 *
 * @param webpackInstance - The webpack instance to use for plugins
 * @param options - Configuration options for customizing the webpack build
 * @returns Promise resolving to a complete webpack configuration with dev server settings
 *
 * @example
 * ```typescript
 * import webpack from 'webpack';
 * import { createConfig } from 'webpack-react-config';
 *
 * const config = await createConfig(webpack, {
 *   uniqueName: 'my-app',
 *   mode: 'production',
 *   entry: './src/index.tsx',
 *   port: 3000
 * });
 * ```
 */
export async function createConfig(
  webpackInstance: WebpackInstanceType,
  {
    uniqueName,
    mode = getDefaultMode(),
    analyze = getDefaultAnalyze(),
    entry = './src/index.tsx',
    projectRoot = process.cwd(),
    port = 3000,
    host = '0.0.0.0',
    htmlTemplate = './public/index.html',
    additionalPlugins = [],
    moduleFederation,
    customize,
    ...overrides
  }: CreateConfigOptions,
): Promise<WebpackConfigWithDevServer> {
  // Configure Module Federation with defaults
  configureModuleFederation(moduleFederation, uniqueName);

  // Setup basic configuration
  const isProd = mode === 'production';
  const distPath = resolve(projectRoot, 'dist');
  const { appNodeModules, pkgNodeModules } = resolveNodeModulesPaths(projectRoot);

  // Load analyzer plugins if requested
  const analyzerPlugins = await loadBundleAnalyzerPlugins(analyze);

  // Create core webpack configuration
  const coreConfig = createCoreConfig({
    mode,
    entry,
    isProd,
    uniqueName,
    appNodeModules,
    pkgNodeModules,
    distPath,
    publicPath: `http://${host}:${port.toString()}/`,
  });

  // Create development server configuration
  const devServer = createDevServerConfig({ port, host, distPath });

  // Assemble final configuration
  const config: WebpackConfigWithDevServer = {
    ...coreConfig,
    plugins: createPlugins({
      webpackInstance,
      isProd,
      htmlTemplate,
      projectRoot,
      analyzerPlugins,
      additionalPlugins,
      moduleFederation,
    }),
    devServer,
    ...overrides, // Apply user overrides
  };

  // Apply custom configuration function if provided
  return typeof customize === 'function' ? customize(config) : config;
}

/**
 * Default export for convenience - same as createConfig
 *
 * @example
 * ```typescript
 * import createConfig from 'webpack-react-config';
 * // or
 * import { createConfig } from 'webpack-react-config';
 * ```
 */
export default createConfig;
