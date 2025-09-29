// Third-party imports
import webpack from 'webpack';
import type { Configuration as WebpackConfiguration } from 'webpack';
import type { Configuration as DevServerConfiguration } from "webpack-dev-server";
import type { ModuleFederationPluginOptions } from '@module-federation/enhanced/webpack';

/**
 * Extended webpack configuration that includes dev server configuration
 * This type combines the standard webpack configuration with webpack-dev-server options
 */
export type WebpackConfigWithDevServer = WebpackConfiguration & {
  /** Optional webpack-dev-server configuration */
  devServer?: DevServerConfiguration;
};

/**
 * Type alias for webpack's Module Federation Plugin constructor
 */
// export type ModuleFederationPlugin = typeof webpack.container.ModuleFederationPlugin;

/**
 * Type for Module Federation plugin options
 * Extracts the first parameter type from the ModuleFederationPlugin constructor
 */
export type ModuleFederationOptions = ModuleFederationPluginOptions;

/**
 * Type alias for the webpack instance
 * Used to access webpack's internal plugins and utilities
 */
export type WebpackInstanceType = typeof webpack;

/**
 * Configuration options for creating a webpack configuration
 * This interface defines all the available options that can be passed to createConfig
 */
export interface CreateConfigOptions {
  /** Unique name for the application (used for CSS modules and Module Federation) */
  uniqueName: string;

  /** Webpack build mode - defaults to process.env.NODE_ENV or 'development' */
  mode?: WebpackConfiguration["mode"];

  /** Enable bundle analysis - defaults to process.env.ANALYZE === 'true' */
  analyze?: boolean;

  /** Entry point for the application - defaults to './src/index.tsx' */
  entry?: string;

  /** Project root directory - defaults to process.cwd() */
  projectRoot?: string;

  /** Development server port - defaults to 3000 */
  port?: number;

  /** Development server host - defaults to 'localhost' */
  host?: string;

  /** Public path for assets - defaults to 'auto' */
  publicPath?: string;

  /** Path to HTML template file - defaults to './public/index.html' */
  htmlTemplate?: string;

  /** Additional webpack plugins to include in the configuration */
  additionalPlugins?: WebpackConfiguration["plugins"];

  /** Module Federation configuration options (optional) */
  moduleFederation?: ModuleFederationOptions;

  /**
   * Custom configuration function to modify the generated webpack config
   * @param config - The generated webpack configuration
   * @returns Modified configuration or void (to modify in place)
   */
  customize?: (config: WebpackConfigWithDevServer) => WebpackConfigWithDevServer | void;

  /** Additional configuration overrides - merged with the final config */
  [key: string]: any;
};