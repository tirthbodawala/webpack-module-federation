import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import webpack from 'webpack';
import { createConfig } from '../src/index.js';
import { type WebpackConfigWithDevServer } from '../src/@types/types.js';

describe('createConfig', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe('default configuration', () => {
    it('should create a basic webpack configuration with default options', async () => {
      process.env['NODE_ENV'] = 'development';
      const config = await createConfig(webpack, { uniqueName: 'test-app' });

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
    });

    it('should use NODE_ENV for default mode', async () => {
      process.env['NODE_ENV'] = 'production';
      const config = await createConfig(webpack, { uniqueName: 'test-app' });

      expect(config.mode).toBe('production');
    });

    it('should use ANALYZE environment variable for analyzer', async () => {
      process.env['ANALYZE'] = 'true';
      const config = await createConfig(webpack, { uniqueName: 'test-app' });

      expect(config).toBeDefined();
    });
  });

  describe('custom configuration options', () => {
    it('should accept custom mode', async () => {
      const config = await createConfig(webpack, {
        uniqueName: 'test-app',
        mode: 'production',
      });

      expect(config.mode).toBe('production');
      expect(config.devtool).toBe('source-map');
    });

    it('should accept custom entry point', async () => {
      const customEntry = './src/app.tsx';
      const config = await createConfig(webpack, {
        uniqueName: 'test-app',
        entry: customEntry,
      });

      expect(config.entry).toBe(customEntry);
    });

    it('should accept custom project root', async () => {
      const customRoot = '/custom/path';
      const config = await createConfig(webpack, {
        uniqueName: 'test-app',
        projectRoot: customRoot,
      });

      expect(config.output?.path).toBe('/custom/path/dist');
    });

    it('should accept custom port and host', async () => {
      const config = await createConfig(webpack, {
        uniqueName: 'test-app',
        port: 8080,
        host: '127.0.0.1',
      });

      expect(config.devServer?.port).toBe(8080);
      expect(config.devServer?.host).toBe('127.0.0.1');
    });

    it('should accept custom HTML template', async () => {
      const customTemplate = './custom-template.html';
      const config = await createConfig(webpack, {
        uniqueName: 'test-app',
        htmlTemplate: customTemplate,
      });

      expect(config).toBeDefined();
      expect(config.plugins).toBeDefined();
    });

    it('should accept additional plugins', async () => {
      const mockPlugin = {
        apply: () => {
          // noop - ensure method is not empty to satisfy linters/compilers
          return undefined;
        },
      };
      const config = await createConfig(webpack, {
        uniqueName: 'test-app',
        additionalPlugins: [mockPlugin],
      });

      expect(config.plugins).toContain(mockPlugin);
    });
  });

  describe('production vs development differences', () => {
    it('should configure production-specific settings', async () => {
      const config = await createConfig(webpack, {
        uniqueName: 'test-app',
        mode: 'production',
      });

      expect(config.mode).toBe('production');
      expect(config.devtool).toBe('source-map');
      expect(config.output?.filename).toContain('[contenthash:8]');
      expect(config.output?.chunkFilename).toContain('[contenthash:8]');
      expect(config.output?.assetModuleFilename).toContain('[contenthash:8]');
      expect(config.performance).not.toBe(false);
      expect((config.performance as any).hints).toBe('warning');
    });

    it('should configure development-specific settings', async () => {
      const config = await createConfig(webpack, {
        uniqueName: 'test-app',
        mode: 'development',
      });

      expect(config.mode).toBe('development');
      expect(config.devtool).toBe('eval-cheap-module-source-map');
      expect(config.output?.filename).toBe('[name].js');
      expect(config.output?.chunkFilename).toBe('[name].chunk.js');
      expect(config.output?.assetModuleFilename).toBe('assets/[name][ext]');
      expect((config.performance as any).hints).toBe(false);
    });
  });

  describe('output configuration', () => {
    it('should configure output correctly', async () => {
      const config = await createConfig(webpack, {
        uniqueName: 'my-app',
        projectRoot: '/test',
      });

      expect(config.output).toEqual(
        expect.objectContaining({
          uniqueName: 'my-app',
          clean: true,
          path: '/test/dist',
          crossOriginLoading: 'anonymous',
        }),
      );
    });

    it('should configure performance settings', async () => {
      const config = await createConfig(webpack, {
        uniqueName: 'test-app',
        mode: 'production',
      });

      expect(config.performance).toEqual({
        hints: 'warning',
        maxEntrypointSize: 512000,
        maxAssetSize: 512000,
      });
    });
  });

  describe('resolve configuration', () => {
    it('should configure resolve settings correctly', async () => {
      const config = await createConfig(webpack, { uniqueName: 'test-app' });

      expect(config.resolve).toEqual({
        extensions: ['.tsx', '.ts', '.jsx', '.js', '.json'],
        modules: ['node_modules'],
        symlinks: false,
      });
    });
  });

  describe('dev server configuration', () => {
    it('should configure dev server correctly', async () => {
      const config = await createConfig(webpack, {
        uniqueName: 'test-app',
        projectRoot: '/test',
        port: 3000,
        host: '0.0.0.0',
      });

      expect(config.devServer).toEqual(
        expect.objectContaining({
          port: 3000,
          host: '0.0.0.0',
          hot: true,
          historyApiFallback: true,
          compress: true,
        }),
      );
    });
  });

  describe('experiments configuration', () => {
    it('should enable top level await', async () => {
      const config = await createConfig(webpack, { uniqueName: 'test-app' });

      expect(config.experiments).toEqual({ topLevelAwait: true });
    });
  });

  describe('customize function', () => {
    it('should apply customize function to config', async () => {
      const customize = (config: WebpackConfigWithDevServer): WebpackConfigWithDevServer => {
        config.mode = 'production';
        return config;
      };

      const config = await createConfig(webpack, {
        uniqueName: 'test-app',
        mode: 'development',
        customize,
      });

      expect(config.mode).toBe('production');
    });
  });

  describe('overrides', () => {
    it('should apply additional overrides to config', async () => {
      const config = await createConfig(webpack, {
        uniqueName: 'test-app',
        mode: 'production',
        devtool: false,
      });

      expect(config.mode).toBe('production');
      expect(config.devtool).toBe(false);
      expect(config.entry).toBe('./src/index.tsx');
      expect(config.resolve).toBeDefined();
    });
  });

  describe('Module Federation', () => {
    it('should configure Module Federation when provided', async () => {
      const moduleFederation = {
        name: 'myApp',
        filename: 'remoteEntry.js',
        exposes: {
          './Component': './src/Component',
        },
      };

      const config = await createConfig(webpack, {
        uniqueName: 'test-app',
        moduleFederation,
      });

      expect(config.plugins).toBeDefined();
      const mfPlugin = config.plugins?.find(
        (p: any) => p?.constructor?.name === 'ModuleFederationPlugin',
      );
      expect(mfPlugin).toBeDefined();
    });
  });

  describe('real configuration generation', () => {
    it('should generate valid webpack configuration with all required fields', async () => {
      const config = await createConfig(webpack, {
        uniqueName: 'real-app',
        mode: 'development',
        entry: './src/index.tsx',
        port: 3000,
      });

      // Verify all essential webpack config properties exist
      expect(config.mode).toBe('development');
      expect(config.entry).toBe('./src/index.tsx');
      expect(Array.isArray(config.module?.rules)).toBe(true);
      expect(config.module?.rules?.length).toBeGreaterThan(0);
      expect(Array.isArray(config.plugins)).toBe(true);
      expect(config.plugins?.length).toBeGreaterThan(0);
      expect(config.optimization).toBeDefined();
      expect(config.resolve?.extensions).toContain('.tsx');
      expect(config.resolve?.extensions).toContain('.ts');
    });
  });
});
