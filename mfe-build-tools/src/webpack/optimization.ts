// Third-party type definitions
import type { Configuration } from 'webpack';

// Webpack optimization plugins
import TerserPlugin from 'terser-webpack-plugin';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';

/**
 * Configuration options for webpack optimization
 */
export interface OptimizationOptions {
  /** Whether this is a production build */
  isProd: boolean;
}

/**
 * Creates webpack optimization configuration for JavaScript and CSS minification
 *
 * This function configures:
 * - JavaScript minification with Terser (production only)
 * - CSS minification with CssMinimizerPlugin (production only)
 * - Module concatenation for better performance
 * - Deterministic module/chunk IDs for consistent caching
 * - Console removal in production builds
 *
 * @param options - Optimization configuration options
 * @returns Webpack optimization configuration
 *
 * @example
 * ```typescript
 * const optimization = createOptimization({
 *   isProd: process.env.NODE_ENV === 'production'
 * });
 * ```
 */
type WebpackOptimization = NonNullable<Configuration['optimization']>;

export function createOptimization({ isProd }: OptimizationOptions): WebpackOptimization {
  return {
    // Enable minification only in production
    minimize: isProd,

    // Configure minification plugins
    minimizer: [
      // JavaScript minification with Terser
      new TerserPlugin({
        terserOptions: {
          compress: {
            drop_console: isProd, // Remove console statements in production
            drop_debugger: isProd, // Remove debugger statements in production
            pure_funcs: isProd ? ['console.log', 'console.info'] : [], // Remove specific console methods
          },
          format: {
            comments: false, // Remove comments from output
          },
        },
        extractComments: false, // Don't extract comments to separate files
      }),

      // CSS minification
      new CssMinimizerPlugin({
        minimizerOptions: {
          preset: [
            'default',
            {
              discardComments: { removeAll: true }, // Remove all CSS comments
            },
          ],
        },
      }),
    ],

    // Module optimization settings
    concatenateModules: true, // Enable scope hoisting for better performance

    // Module and chunk ID generation strategy
    moduleIds: isProd ? 'deterministic' : 'named', // Consistent IDs for caching (prod) vs readable names (dev)
    chunkIds: isProd ? 'deterministic' : 'named', // Consistent chunk IDs for caching (prod) vs readable names (dev)
  };
}
