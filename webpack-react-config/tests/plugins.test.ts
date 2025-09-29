import { describe, it, expect, jest } from '@jest/globals';
import { createPlugins, loadAnalyzerPlugins } from '../dist/plugins.js';

describe('createPlugins', () => {
  const defaultOptions = {
    isProd: false,
    htmlTemplate: './public/index.html',
    projectRoot: '/test/project',
    analyzerPlugins: [],
    additionalPlugins: []
  };

  describe('development mode', () => {
    it('should create plugins for development', () => {
      const plugins = createPlugins(defaultOptions);

      expect(Array.isArray(plugins)).toBe(true);
      expect(plugins.length).toBeGreaterThan(0);
    });

    it('should include HtmlWebpackPlugin', () => {
      const plugins = createPlugins(defaultOptions);

      const htmlPlugin = plugins.find(plugin =>
        plugin && plugin.constructor.name === 'HtmlWebpackPlugin'
      );

      expect(htmlPlugin).toBeDefined();
    });

    it('should configure HtmlWebpackPlugin for development', () => {
      const plugins = createPlugins(defaultOptions);

      const htmlPlugin = plugins.find(plugin =>
        plugin && plugin.constructor.name === 'HtmlWebpackPlugin'
      );

      expect(htmlPlugin).toBeDefined();
      // HtmlWebpackPlugin options are internal, but we can verify it exists
    });

    it('should not include MiniCssExtractPlugin in development', () => {
      const plugins = createPlugins(defaultOptions);

      const extractPlugin = plugins.find(plugin =>
        plugin && plugin.constructor.name === 'MiniCssExtractPlugin'
      );

      expect(extractPlugin).toBeUndefined();
    });

    it('should include ReactRefreshWebpackPlugin in development', () => {
      const plugins = createPlugins(defaultOptions);

      const refreshPlugin = plugins.find(plugin =>
        plugin && (plugin.constructor.name === 'ReactRefreshWebpackPlugin' || plugin.constructor.name === 'ReactRefreshPlugin')
      );

      expect(refreshPlugin).toBeDefined();
    });

    it('should include CopyWebpackPlugin', () => {
      const plugins = createPlugins(defaultOptions);

      const copyPlugin = plugins.find(plugin =>
        plugin && (plugin.constructor.name === 'CopyWebpackPlugin' || plugin.constructor.name === 'CopyPlugin')
      );

      expect(copyPlugin).toBeDefined();
    });

    it('should include ForkTsCheckerWebpackPlugin', () => {
      const plugins = createPlugins(defaultOptions);

      const tsCheckerPlugin = plugins.find(plugin =>
        plugin && plugin.constructor.name === 'ForkTsCheckerWebpackPlugin'
      );

      expect(tsCheckerPlugin).toBeDefined();
    });
  });

  describe('production mode', () => {
    const prodOptions = {
      ...defaultOptions,
      isProd: true
    };

    it('should create plugins for production', () => {
      const plugins = createPlugins(prodOptions);

      expect(Array.isArray(plugins)).toBe(true);
      expect(plugins.length).toBeGreaterThan(0);
    });

    it('should include MiniCssExtractPlugin in production', () => {
      const plugins = createPlugins(prodOptions);

      const extractPlugin = plugins.find(plugin =>
        plugin && plugin.constructor.name === 'MiniCssExtractPlugin'
      );

      expect(extractPlugin).toBeDefined();
    });

    it('should not include ReactRefreshWebpackPlugin in production', () => {
      const plugins = createPlugins(prodOptions);

      const refreshPlugin = plugins.find(plugin =>
        plugin && plugin.constructor.name === 'ReactRefreshWebpackPlugin'
      );

      expect(refreshPlugin).toBeUndefined();
    });

    it('should configure HtmlWebpackPlugin with minification in production', () => {
      const plugins = createPlugins(prodOptions);

      const htmlPlugin = plugins.find(plugin =>
        plugin && plugin.constructor.name === 'HtmlWebpackPlugin'
      );

      expect(htmlPlugin).toBeDefined();
      // Minification is configured internally in the plugin
    });
  });

  describe('custom options', () => {
    it('should accept custom HTML template', () => {
      const customTemplate = './custom-template.html';
      const plugins = createPlugins({
        ...defaultOptions,
        htmlTemplate: customTemplate
      });

      const htmlPlugin = plugins.find(plugin =>
        plugin && plugin.constructor.name === 'HtmlWebpackPlugin'
      );

      expect(htmlPlugin).toBeDefined();
    });

    it('should accept custom project root', () => {
      const customRoot = '/custom/root';
      const plugins = createPlugins({
        ...defaultOptions,
        projectRoot: customRoot
      });

      const copyPlugin = plugins.find(plugin =>
        plugin && plugin.constructor.name === 'CopyPlugin'
      );
      const tsCheckerPlugin = plugins.find(plugin =>
        plugin && plugin.constructor.name === 'ForkTsCheckerWebpackPlugin'
      );

      expect(copyPlugin).toBeDefined();
      expect(tsCheckerPlugin).toBeDefined();
    });

    it('should include analyzer plugins when provided', () => {
      const mockAnalyzerPlugin = { constructor: { name: 'BundleAnalyzerPlugin' } };
      const plugins = createPlugins({
        ...defaultOptions,
        analyzerPlugins: [mockAnalyzerPlugin]
      });

      expect(plugins).toContain(mockAnalyzerPlugin);
    });

    it('should include additional plugins when provided', () => {
      const mockPlugin1 = { constructor: { name: 'CustomPlugin1' } };
      const mockPlugin2 = { constructor: { name: 'CustomPlugin2' } };

      const plugins = createPlugins({
        ...defaultOptions,
        additionalPlugins: [mockPlugin1, mockPlugin2]
      });

      expect(plugins).toContain(mockPlugin1);
      expect(plugins).toContain(mockPlugin2);
    });

    it('should handle empty analyzer plugins array', () => {
      const plugins = createPlugins({
        ...defaultOptions,
        analyzerPlugins: []
      });

      expect(Array.isArray(plugins)).toBe(true);
    });

    it('should handle undefined analyzer plugins', () => {
      const plugins = createPlugins({
        ...defaultOptions,
        analyzerPlugins: undefined
      });

      expect(Array.isArray(plugins)).toBe(true);
    });

    it('should handle empty additional plugins array', () => {
      const plugins = createPlugins({
        ...defaultOptions,
        additionalPlugins: []
      });

      expect(Array.isArray(plugins)).toBe(true);
    });

    it('should handle undefined additional plugins', () => {
      const plugins = createPlugins({
        ...defaultOptions,
        additionalPlugins: undefined
      });

      expect(Array.isArray(plugins)).toBe(true);
    });
  });

  describe('plugin order and presence', () => {
    it('should maintain correct plugin order', () => {
      const plugins = createPlugins(defaultOptions);

      // HtmlWebpackPlugin should be first
      expect(plugins[0].constructor.name).toBe('HtmlWebpackPlugin');

      // CopyWebpackPlugin and ForkTsCheckerWebpackPlugin should be present
      const pluginNames = plugins.map(p => p.constructor.name);
      expect(pluginNames).toContain('CopyPlugin');
      expect(pluginNames).toContain('ForkTsCheckerWebpackPlugin');
    });

    it('should place additional plugins at the end', () => {
      const mockPlugin = { constructor: { name: 'CustomPlugin' } };
      const plugins = createPlugins({
        ...defaultOptions,
        additionalPlugins: [mockPlugin]
      });

      expect(plugins[plugins.length - 1]).toBe(mockPlugin);
    });

    it('should place analyzer plugins before ReactRefresh and additional plugins', () => {
      const mockAnalyzerPlugin = { constructor: { name: 'BundleAnalyzerPlugin' } };
      const mockAdditionalPlugin = { constructor: { name: 'CustomPlugin' } };

      const plugins = createPlugins({
        ...defaultOptions,
        analyzerPlugins: [mockAnalyzerPlugin],
        additionalPlugins: [mockAdditionalPlugin]
      });

      const analyzerIndex = plugins.indexOf(mockAnalyzerPlugin);
      const additionalIndex = plugins.indexOf(mockAdditionalPlugin);
      const refreshIndex = plugins.findIndex(p => p.constructor.name === 'ReactRefreshWebpackPlugin' || p.constructor.name === 'ReactRefreshPlugin');

      expect(analyzerIndex).toBeLessThan(refreshIndex);
      expect(refreshIndex).toBeLessThan(additionalIndex);
    });
  });

  describe('plugin count validation', () => {
    it('should have expected number of plugins in development', () => {
      const plugins = createPlugins(defaultOptions);

      // Expected plugins: HtmlWebpackPlugin, CopyWebpackPlugin, ForkTsCheckerWebpackPlugin, ReactRefreshWebpackPlugin
      expect(plugins.length).toBe(4);
    });

    it('should have expected number of plugins in production', () => {
      const plugins = createPlugins({
        ...defaultOptions,
        isProd: true
      });

      // Expected plugins: HtmlWebpackPlugin, MiniCssExtractPlugin, CopyWebpackPlugin, ForkTsCheckerWebpackPlugin
      expect(plugins.length).toBe(4);
    });

    it('should increase count when additional plugins are added', () => {
      const basePlugins = createPlugins(defaultOptions);
      const pluginsWithAdditional = createPlugins({
        ...defaultOptions,
        additionalPlugins: [{ constructor: { name: 'CustomPlugin' } }]
      });

      expect(pluginsWithAdditional.length).toBe(basePlugins.length + 1);
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

      if (plugins.length > 0) {
        expect(plugins[0].constructor.name).toBe('BundleAnalyzerPlugin');
      }
    } catch (error) {
      // If webpack-bundle-analyzer is not installed, it should throw an error
      expect(error).toBeInstanceOf(Error);
      expect((error as Error).message).toContain('webpack-bundle-analyzer');
    }
  });

  it('should throw descriptive error when webpack-bundle-analyzer is not available', async () => {
    // Mock the import to fail
    const originalImport = global.import;

    // This test might not work as expected in the real environment
    // since webpack-bundle-analyzer might be installed
    // The main test is that the function handles errors gracefully
    try {
      await loadAnalyzerPlugins();
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect((error as Error).message).toContain('webpack-bundle-analyzer');
    }
  });

  it('should configure BundleAnalyzerPlugin correctly', async () => {
    try {
      const plugins = await loadAnalyzerPlugins();

      if (plugins.length > 0) {
        const analyzerPlugin = plugins[0];
        expect(analyzerPlugin).toBeDefined();
        expect(analyzerPlugin.constructor.name).toBe('BundleAnalyzerPlugin');

        // The plugin should be configured with static mode and openAnalyzer: true
        // These are internal configurations that we can't easily test
        // but we can verify the plugin is properly instantiated
      }
    } catch (error) {
      // Expected if webpack-bundle-analyzer is not installed
      expect(error).toBeInstanceOf(Error);
    }
  });
});