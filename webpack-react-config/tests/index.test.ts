import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals';
import { createConfig, CreateConfigOptions } from '../dist/index.js';
import type { Configuration } from 'webpack';

describe('createConfig', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe('default configuration', () => {
    it('should create a basic webpack configuration with default options', async () => {
      delete process.env.NODE_ENV; // Reset first
      process.env.NODE_ENV = 'development';
      const config = await createConfig();

      expect(config).toHaveProperty('mode', 'development');
      expect(config).toHaveProperty('entry', './src/index.tsx');
      expect(config).toHaveProperty('target', ['web', 'es2020']);
      expect(config).toHaveProperty('devtool', 'eval-cheap-module-source-map');
      expect(config.module).toHaveProperty('rules');
      expect(config).toHaveProperty('resolve');
      expect(config).toHaveProperty('optimization');
      expect(config).toHaveProperty('output');
      expect(config).toHaveProperty('plugins');
      expect(config).toHaveProperty('devServer');
      expect(config).toHaveProperty('cache');
      expect(config).toHaveProperty('stats');
    });

    it('should use NODE_ENV for default mode', async () => {
      delete process.env.NODE_ENV; // Reset first
      process.env.NODE_ENV = 'production';
      const config = await createConfig();

      expect(config.mode).toBe('production');
    });

    it('should use ANALYZE environment variable for analyzer', async () => {
      process.env.ANALYZE = 'true';
      const config = await createConfig();

      // Should not throw an error even if webpack-bundle-analyzer is not available
      expect(config).toBeDefined();
    });
  });

  describe('custom configuration options', () => {
    it('should accept custom mode', async () => {
      const config = await createConfig({ mode: 'production' });

      expect(config.mode).toBe('production');
      expect(config.devtool).toBe('source-map');
    });

    it('should accept custom entry point', async () => {
      const customEntry = './src/app.tsx';
      const config = await createConfig({ entry: customEntry });

      expect(config.entry).toBe(customEntry);
    });

    it('should accept custom project root', async () => {
      const customRoot = '/custom/path';
      const config = await createConfig({ projectRoot: customRoot });

      expect(config.output?.path).toBe('/custom/path/dist');
    });

    it('should accept custom public path', async () => {
      const customPublicPath = '/assets/';
      const config = await createConfig({ publicPath: customPublicPath });

      expect(config.output?.publicPath).toBe(customPublicPath);
    });

    it('should accept custom HTML template', async () => {
      const customTemplate = './custom-template.html';
      const config = await createConfig({ htmlTemplate: customTemplate });

      expect(config).toBeDefined();
      // The HTML template is used in plugins, we'll test this more thoroughly in plugins test
    });

    it('should accept additional plugins', async () => {
      const mockPlugin = { apply: jest.fn() };
      const config = await createConfig({ additionalPlugins: [mockPlugin] });

      expect(config.plugins).toContain(mockPlugin);
    });

    it('should accept custom cache config file', async () => {
      const customCacheFile = '/custom/cache.js';
      const config = await createConfig({ cacheConfigFile: customCacheFile });

      expect(config.cache?.buildDependencies?.config).toContain(customCacheFile);
    });

    it('should handle empty cache config file', async () => {
      const config = await createConfig({ cacheConfigFile: '' });

      expect(config.cache?.buildDependencies?.config).toEqual([]);
    });
  });

  describe('production vs development differences', () => {
    it('should configure production-specific settings', async () => {
      const config = await createConfig({ mode: 'production' });

      expect(config.mode).toBe('production');
      expect(config.devtool).toBe('source-map');
      expect(config.output?.filename).toContain('[contenthash:8]');
      expect(config.output?.chunkFilename).toContain('[contenthash:8]');
      expect(config.output?.assetModuleFilename).toContain('[contenthash:8]');
      expect(config.performance?.hints).toBe('warning');
    });

    it('should configure development-specific settings', async () => {
      const config = await createConfig({ mode: 'development' });

      expect(config.mode).toBe('development');
      expect(config.devtool).toBe('eval-cheap-module-source-map');
      expect(config.output?.filename).toBe('[name].js');
      expect(config.output?.chunkFilename).toBe('[name].chunk.js');
      expect(config.output?.assetModuleFilename).toBe('assets/[name][ext]');
      expect(config.performance?.hints).toBe(false);
    });
  });

  describe('output configuration', () => {
    it('should configure output correctly', async () => {
      const config = await createConfig({ projectRoot: '/test' });

      expect(config.output).toEqual(
        expect.objectContaining({
          clean: true,
          path: '/test/dist',
          module: true,
          chunkFormat: 'module',
          crossOriginLoading: 'anonymous',
        })
      );
    });

    it('should configure performance settings', async () => {
      const config = await createConfig({ mode: 'production' });

      expect(config.performance).toEqual({
        hints: 'warning',
        maxEntrypointSize: 512000,
        maxAssetSize: 512000,
      });
    });
  });

  describe('resolve configuration', () => {
    it('should configure resolve settings correctly', async () => {
      const config = await createConfig();

      expect(config.resolve).toEqual({
        extensions: ['.tsx', '.ts', '.jsx', '.js', '.json'],
        modules: ['node_modules'],
        symlinks: false,
      });
    });
  });

  describe('dev server configuration', () => {
    it('should configure dev server correctly', async () => {
      const config = await createConfig({ projectRoot: '/test' });

      expect(config.devServer).toEqual(
        expect.objectContaining({
          port: 3000,
          host: 'localhost',
          hot: true,
          open: true,
          historyApiFallback: true,
          compress: true,
          client: {
            overlay: { errors: true, warnings: false },
          },
          static: '/test/dist',
        })
      );
    });
  });

  describe('cache configuration', () => {
    it('should configure filesystem cache', async () => {
      const config = await createConfig({ cacheConfigFile: '/test/config.js' });

      expect(config.cache).toEqual({
        type: 'filesystem',
        buildDependencies: {
          config: ['/test/config.js'],
        },
      });
    });
  });

  describe('stats configuration', () => {
    it('should configure stats correctly', async () => {
      const config = await createConfig();

      expect(config.stats).toEqual({
        preset: 'minimal',
        moduleTrace: true,
        errorDetails: true,
      });
    });
  });

  describe('experiments configuration', () => {
    it('should enable modern webpack features', async () => {
      const config = await createConfig();

      expect(config.experiments).toEqual({
        outputModule: true,
        topLevelAwait: true,
      });
    });
  });

  describe('customize function', () => {
    it('should apply customize function to config', async () => {
      const customize = jest.fn((config: Configuration) => {
        config.mode = 'production';
        return config;
      });

      const config = await createConfig({
        mode: 'development',
        customize
      });

      expect(customize).toHaveBeenCalled();
      expect(config.mode).toBe('production');
    });

    it('should handle customize function returning void', async () => {
      const customize = jest.fn((config: Configuration) => {
        config.mode = 'production';
        // Return void
      });

      const config = await createConfig({
        mode: 'development',
        customize
      });

      expect(customize).toHaveBeenCalled();
      expect(config.mode).toBe('production');
    });

    it('should handle customize function returning new config', async () => {
      const newConfig = { mode: 'none' as const, entry: './custom.js' };
      const customize = jest.fn(() => newConfig);

      const config = await createConfig({ customize });

      expect(customize).toHaveBeenCalled();
      expect(config).toEqual(newConfig);
    });
  });

  describe('overrides', () => {
    it('should apply additional overrides to config', async () => {
      const overrides = {
        target: 'node',
        externals: { lodash: 'lodash' }
      };

      const config = await createConfig(overrides);

      expect(config.target).toBe('node');
      expect(config.externals).toEqual({ lodash: 'lodash' });
    });

    it('should merge overrides with default config', async () => {
      const config = await createConfig({
        mode: 'production',
        devtool: false,
        bail: true
      });

      expect(config.mode).toBe('production');
      expect(config.devtool).toBe(false);
      expect(config.bail).toBe(true);
      // Should still have other default properties
      expect(config.entry).toBe('./src/index.tsx');
      expect(config.resolve).toBeDefined();
    });
  });

  describe('analyzer integration', () => {
    it('should handle analyzer loading gracefully when webpack-bundle-analyzer is not available', async () => {
      const config = await createConfig({ analyze: true });

      expect(config).toBeDefined();
      expect(config.plugins).toBeDefined();
      // Should not crash even if analyzer fails to load
    });
  });

  describe('error handling', () => {
    it('should handle missing projectRoot gracefully', async () => {
      const config = await createConfig({ projectRoot: undefined });

      expect(config).toBeDefined();
      expect(config.output?.path).toBeDefined();
    });
  });
});