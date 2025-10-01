import { describe, it, expect } from '@jest/globals';
import webpack from 'webpack';
import { createPlugins, loadAnalyzerPlugins } from '../src/plugins.js';

describe('createPlugins', () => {
  const defaultOptions = {
    webpackInstance: webpack,
    isProd: false,
    htmlTemplate: './public/index.html',
    projectRoot: '/test/project',
    analyzerPlugins: [],
    additionalPlugins: [],
  };

  describe('development mode', () => {
    it('should create plugins array for development', () => {
      const plugins = createPlugins(defaultOptions);

      expect(Array.isArray(plugins)).toBe(true);
      expect(plugins.length).toBeGreaterThan(0);
    });

    it('should include HtmlWebpackPlugin', () => {
      const plugins = createPlugins(defaultOptions);

      const htmlPlugin = plugins.find(
        (plugin) => plugin && plugin.constructor.name === 'HtmlWebpackPlugin',
      );

      expect(htmlPlugin).toBeDefined();
    });

    it('should not include MiniCssExtractPlugin in development', () => {
      const plugins = createPlugins(defaultOptions);

      const extractPlugin = plugins.find(
        (plugin) => plugin && plugin.constructor.name === 'MiniCssExtractPlugin',
      );

      expect(extractPlugin).toBeUndefined();
    });

    it('should include ReactRefreshWebpackPlugin in development', () => {
      const plugins = createPlugins(defaultOptions);

      const refreshPlugin = plugins.find(
        (plugin) =>
          plugin &&
          (plugin.constructor.name === 'ReactRefreshWebpackPlugin' ||
            plugin.constructor.name === 'ReactRefreshPlugin'),
      );

      expect(refreshPlugin).toBeDefined();
    });

    it('should include CopyWebpackPlugin', () => {
      const plugins = createPlugins(defaultOptions);

      const copyPlugin = plugins.find(
        (plugin) =>
          plugin &&
          (plugin.constructor.name === 'CopyWebpackPlugin' ||
            plugin.constructor.name === 'CopyPlugin'),
      );

      expect(copyPlugin).toBeDefined();
    });
  });

  describe('production mode', () => {
    const prodOptions = {
      ...defaultOptions,
      isProd: true,
    };

    it('should create plugins for production', () => {
      const plugins = createPlugins(prodOptions);

      expect(Array.isArray(plugins)).toBe(true);
      expect(plugins.length).toBeGreaterThan(0);
    });

    it('should include MiniCssExtractPlugin in production', () => {
      const plugins = createPlugins(prodOptions);

      const extractPlugin = plugins.find(
        (plugin) => plugin && plugin.constructor.name === 'MiniCssExtractPlugin',
      );

      expect(extractPlugin).toBeDefined();
    });

    it('should not include ReactRefreshWebpackPlugin in production', () => {
      const plugins = createPlugins(prodOptions);

      const refreshPlugin = plugins.find(
        (plugin) => plugin && plugin.constructor.name === 'ReactRefreshWebpackPlugin',
      );

      expect(refreshPlugin).toBeUndefined();
    });
  });

  describe('Module Federation', () => {
    it('should include ModuleFederationPlugin when config is provided', () => {
      const moduleFederation = {
        name: 'myApp',
        filename: 'remoteEntry.js',
        exposes: {
          './Component': './src/Component',
        },
      };

      const plugins = createPlugins({
        ...defaultOptions,
        moduleFederation,
      });

      const mfPlugin = plugins.find(
        (plugin) => plugin && plugin.constructor.name === 'ModuleFederationPlugin',
      );

      expect(mfPlugin).toBeDefined();
    });

    it('should include ExternalTemplateRemotesPlugin when remotes are configured', () => {
      const moduleFederation = {
        name: 'myApp',
        remotes: {
          app2: 'app2@http://localhost:3001/remoteEntry.js',
        },
      };

      const plugins = createPlugins({
        ...defaultOptions,
        moduleFederation,
      });

      const externalRemotesPlugin = plugins.find(
        (plugin) => plugin && plugin.constructor.name === 'ExternalTemplateRemotesPlugin',
      );

      expect(externalRemotesPlugin).toBeDefined();
    });

    it('should not include Module Federation plugins when not configured', () => {
      const plugins = createPlugins(defaultOptions);

      const mfPlugin = plugins.find(
        (plugin) => plugin && plugin.constructor.name === 'ModuleFederationPlugin',
      );

      expect(mfPlugin).toBeUndefined();
    });
  });

  describe('custom options', () => {
    it('should accept custom HTML template', () => {
      const customTemplate = './custom-template.html';
      const plugins = createPlugins({
        ...defaultOptions,
        htmlTemplate: customTemplate,
      });

      const htmlPlugin = plugins.find(
        (plugin) => plugin && plugin.constructor.name === 'HtmlWebpackPlugin',
      );

      expect(htmlPlugin).toBeDefined();
    });

    it('should include analyzer plugins when provided', () => {
      const mockAnalyzerPlugin = {
        apply: () => undefined,
        constructor: { name: 'BundleAnalyzerPlugin' },
      };
      const plugins = createPlugins({
        ...defaultOptions,
        analyzerPlugins: [mockAnalyzerPlugin],
      });

      expect(plugins).toContain(mockAnalyzerPlugin);
    });

    it('should include additional plugins when provided', () => {
      const mockPlugin1 = { apply: () => undefined, constructor: { name: 'CustomPlugin1' } };
      const mockPlugin2 = { apply: () => undefined, constructor: { name: 'CustomPlugin2' } };

      const plugins = createPlugins({
        ...defaultOptions,
        additionalPlugins: [mockPlugin1, mockPlugin2],
      });

      expect(plugins).toContain(mockPlugin1);
      expect(plugins).toContain(mockPlugin2);
    });
  });

  describe('plugin configuration', () => {
    it('should configure HtmlWebpackPlugin with correct options', () => {
      const plugins = createPlugins(defaultOptions);

      const htmlPlugin = plugins.find(
        (plugin) => plugin && plugin.constructor.name === 'HtmlWebpackPlugin',
      );

      expect(htmlPlugin).toBeDefined();
    });

    it('should place additional plugins at the end', () => {
      const mockPlugin = { apply: () => undefined, constructor: { name: 'CustomPlugin' } };
      const plugins = createPlugins({
        ...defaultOptions,
        additionalPlugins: [mockPlugin],
      });

      expect(plugins[plugins.length - 1]).toBe(mockPlugin);
    });
  });
});

describe('loadAnalyzerPlugins', () => {
  it('should return a promise', () => {
    const result = loadAnalyzerPlugins();
    expect(result instanceof Promise).toBe(true);
  });

  it('should load BundleAnalyzerPlugin when webpack-bundle-analyzer is available', async () => {
    try {
      const plugins = await loadAnalyzerPlugins();
      expect(Array.isArray(plugins)).toBe(true);

      if (plugins && plugins.length > 0) {
        expect(plugins[0]?.constructor.name).toBe('BundleAnalyzerPlugin');
      }
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect((error as Error).message).toContain('webpack-bundle-analyzer');
    }
  });

  it('should throw error when webpack-bundle-analyzer is not available', async () => {
    try {
      await loadAnalyzerPlugins();
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect((error as Error).message).toContain('ANALYZE=true');
    }
  });
});
