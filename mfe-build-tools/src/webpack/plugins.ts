// Node.js built-in modules
import { resolve } from 'node:path';

// Third-party type definitions
import type { Configuration, WebpackPluginInstance } from 'webpack';

/**
 * Type for webpack plugins array - more specific than Configuration['plugins']
 */
type WebpackPlugins = (WebpackPluginInstance | null | false | undefined | '' | 0)[];

// Webpack plugins
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';

import ExternalTemplateRemotesPlugin from 'external-remotes-plugin';
import { ModuleFederationPlugin } from '@module-federation/enhanced/webpack';

// Internal type definitions
import { type ModuleFederationOptions, type WebpackInstanceType } from './@types/types';
import { parseEnvironmentVariables } from './utils/env.util.js';

/**
 * Configuration options for creating webpack plugins
 */
export interface CreatePluginsOptions {
  /** Webpack instance for accessing internal plugins */
  webpackInstance: WebpackInstanceType;
  /** Whether this is a production build */
  isProd: boolean;
  /** Path to HTML template file */
  htmlTemplate: string;
  /** Root directory of the project */
  projectRoot: string;
  /** Bundle analyzer plugins (optional) */
  analyzerPlugins?: WebpackPlugins;
  /** Additional user-provided plugins (optional) */
  additionalPlugins?: WebpackPlugins;
  /** Module Federation configuration (optional) */
  moduleFederation?: ModuleFederationOptions;
}

/**
 * Creates a comprehensive set of webpack plugins for React applications
 *
 * This function generates webpack plugins for:
 * - Module Federation (if configured)
 * - HTML generation with optimization
 * - CSS extraction (production only)
 * - Static file copying from public directory
 * - React Fast Refresh (development only)
 * - Bundle analysis (if requested)
 * - Custom additional plugins
 *
 * @param options - Plugin configuration options
 * @returns Array of webpack plugins
 *
 * @example
 * ```typescript
 * const plugins = createPlugins({
 *   webpackInstance: webpack,
 *   isProd: false,
 *   htmlTemplate: './public/index.html',
 *   projectRoot: process.cwd(),
 *   additionalPlugins: [new SomeCustomPlugin()]
 * });
 * ```
 */
export function createPlugins({
  webpackInstance,
  isProd,
  htmlTemplate,
  projectRoot,
  analyzerPlugins = [],
  additionalPlugins = [],
  moduleFederation,
}: CreatePluginsOptions): WebpackPlugins {
  // Module Federation Plugin - enables micro-frontend architecture
  const moduleFederationPlugins: WebpackPlugins =
    moduleFederation && Object.keys(moduleFederation).length
      ? [new ModuleFederationPlugin(moduleFederation)]
      : [];

  // External Template Remotes Plugin - handles external remote loading for Module Federation
  const externalRemotesPlugins: WebpackPlugins =
    moduleFederation?.remotes && Object.keys(moduleFederation.remotes).length
      ? // eslint-disable-next-line @typescript-eslint/no-unsafe-call -- external-remotes-plugin lacks proper type definitions
        [new ExternalTemplateRemotesPlugin() as WebpackPluginInstance]
      : [];

  const plugins: WebpackPlugins = [
    new webpackInstance.DefinePlugin(parseEnvironmentVariables(projectRoot, isProd)),
    ...moduleFederationPlugins,
    ...externalRemotesPlugins,

    // HTML Generation Plugin - creates HTML file with injected bundles
    new HtmlWebpackPlugin({
      template: htmlTemplate, // Use custom HTML template
      minify: isProd
        ? {
            // Production HTML minification options
            removeComments: true, // Remove HTML comments
            collapseWhitespace: true, // Collapse whitespace
            removeRedundantAttributes: true, // Remove redundant attributes
            useShortDoctype: true, // Use short DOCTYPE
            removeEmptyAttributes: true, // Remove empty attributes
            removeStyleLinkTypeAttributes: true, // Remove type="text/css" from style links
            keepClosingSlash: true, // Keep closing slash for self-closing tags
            minifyJS: true, // Minify inline JavaScript
            minifyCSS: true, // Minify inline CSS
            minifyURLs: true, // Minify URLs
          }
        : false, // No minification in development for better debugging
      meta: { viewport: 'width=device-width, initial-scale=1' }, // Mobile-friendly viewport
    }),

    // CSS Extraction Plugin - extract CSS to separate files in production
    ...(isProd
      ? [
          new MiniCssExtractPlugin({
            filename: '[name].[contenthash:8].css', // Main CSS files with content hash
            chunkFilename: '[id].[contenthash:8].css', // CSS chunks with content hash
            ignoreOrder: true, // Ignore CSS order warnings (for CSS modules)
          }),
        ]
      : []), // In development, CSS is injected into DOM via style-loader

    // Copy Plugin - copy static files from public directory
    new CopyWebpackPlugin({
      patterns: [
        {
          from: resolve(projectRoot, 'public'), // Source directory
          to: '.', // Copy to output root
          globOptions: {
            ignore: ['**/index.html'], // Ignore HTML template (handled by HtmlWebpackPlugin)
          },
          noErrorOnMissing: true, // Don't fail if public directory doesn't exist
        },
      ],
    }),

    // Bundle analyzer plugins (if enabled)
    ...analyzerPlugins,

    // React Fast Refresh Plugin - enable hot reloading in development
    ...(!isProd
      ? [
          new ReactRefreshWebpackPlugin({
            overlay: false,
            exclude: [/node_modules/, /bootstrap\.js$/, /remoteEntry\.js$/, /mf-manifest\.json$/],
          }),
        ]
      : []),

    // User-provided additional plugins
    ...additionalPlugins,
  ];

  return plugins;
}

/**
 * Dynamically loads webpack bundle analyzer plugins
 *
 * This function uses dynamic imports to load the webpack-bundle-analyzer plugin
 * only when needed, avoiding the need to have it as a required dependency.
 *
 * @returns Promise resolving to array of bundle analyzer plugins
 * @throws Error if webpack-bundle-analyzer is not installed
 *
 * @example
 * ```typescript
 * // Only load analyzer in production with ANALYZE=true
 * if (process.env.ANALYZE === 'true') {
 *   const analyzerPlugins = await loadAnalyzerPlugins();
 *   // Use analyzerPlugins in webpack config
 * }
 * ```
 */
export async function loadAnalyzerPlugins(): Promise<Configuration['plugins']> {
  try {
    // Dynamic import - only loads when analyzer is requested
    const { BundleAnalyzerPlugin } = await import('webpack-bundle-analyzer');
    return [
      new BundleAnalyzerPlugin({
        analyzerMode: 'static', // Generate static HTML report
        openAnalyzer: true, // Automatically open the report in browser
      }),
    ];
  } catch (error) {
    throw new Error(
      'Set ANALYZE=true only after adding webpack-bundle-analyzer: ' + (error as Error).message,
    );
  }
}
