import { describe, it, expect } from '@jest/globals';
import { createModuleRules } from '../src/loaders.js';
import type { RuleSetRule } from 'webpack';

interface LoaderObject {
  loader?: string;
  options?: unknown;
}

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const isLoaderObject = (item: unknown): item is LoaderObject =>
  typeof item === 'object' && item !== null && 'loader' in item;

const getLoaderByName = (
  ruleUse: RuleSetRule['use'] | undefined,
  loaderName: string,
): LoaderObject | undefined => {
  const candidates = ruleUse as unknown;

  if (Array.isArray(candidates)) {
    return candidates.find(
      (item): item is LoaderObject => isLoaderObject(item) && item.loader === loaderName,
    );
  }

  if (isLoaderObject(candidates) && candidates.loader === loaderName) {
    return candidates;
  }

  return undefined;
};

const getLoaderOptions = (loader: LoaderObject): Record<string, unknown> | undefined =>
  isPlainObject(loader.options) ? loader.options : undefined;

const getModulesOptions = (loader: LoaderObject): Record<string, unknown> | undefined => {
  const options = getLoaderOptions(loader);
  if (!options) {
    return undefined;
  }

  const modules = options['modules'];
  return isPlainObject(modules) ? modules : undefined;
};

const getModulesLocalIdentName = (loader: LoaderObject): string | undefined => {
  const modules = getModulesOptions(loader);
  const localIdentName = modules?.['localIdentName'];
  return typeof localIdentName === 'string' ? localIdentName : undefined;
};

const getPostCssPlugins = (loader: LoaderObject): unknown[] | undefined => {
  const options = getLoaderOptions(loader);
  if (!options) {
    return undefined;
  }

  const postCssOptions = options['postcssOptions'];
  if (!isPlainObject(postCssOptions)) {
    return undefined;
  }

  const plugins = postCssOptions['plugins'];
  return Array.isArray(plugins) ? plugins : undefined;
};

describe('createModuleRules', () => {
  describe('development mode', () => {
    const rules = createModuleRules({ isProd: false, uniqueName: 'test-app' });

    it('should return an array of rules', () => {
      expect(Array.isArray(rules)).toBe(true);
      expect(rules.length).toBeGreaterThan(0);
    });

    it('should create script rule for TypeScript/JavaScript files', () => {
      const scriptRule = rules.find(
        (rule) =>
          typeof rule === 'object' &&
          'test' in rule &&
          rule.test instanceof RegExp &&
          rule.test.test('.tsx'),
      );

      expect(scriptRule).toBeDefined();
      if (scriptRule) {
        expect(scriptRule.test).toEqual(/\.[jt]sx?$/i);
        expect(scriptRule.type).toBe('javascript/esm');
        expect(scriptRule.exclude).toEqual(/node_modules/);
        expect(Array.isArray(scriptRule.use)).toBe(true);
      }
    });

    it('should configure babel loader with correct presets and plugins', () => {
      const scriptRule = rules.find(
        (rule) =>
          typeof rule === 'object' &&
          'test' in rule &&
          rule.test instanceof RegExp &&
          rule.test.test('.tsx'),
      );

      expect(scriptRule).toBeDefined();
      if (scriptRule) {
        const babelLoader = getLoaderByName(scriptRule.use, 'babel-loader');

        expect(babelLoader).toBeDefined();
        if (babelLoader) {
          const options = getLoaderOptions(babelLoader);

          expect(options).toBeDefined();
          if (options) {
            expect(options).toHaveProperty('presets');
            expect(options).toHaveProperty('plugins');
            expect(options['cacheDirectory']).toBe(true);
          }
        }
      }
    });

    it('should create global SCSS rule', () => {
      const scssRule = rules[1];

      expect(scssRule).toBeDefined();
      if (scssRule) {
        expect(scssRule.test).toEqual(/\.scss$/i);
        expect(scssRule.exclude).toEqual(/\.module\.scss$/i);
      }
    });

    it('should create module SCSS rule', () => {
      const moduleScssRule = rules[2];

      expect(moduleScssRule).toBeDefined();
      if (moduleScssRule) {
        expect(moduleScssRule.test).toEqual(/\.module\.scss$/i);
      }
    });

    it('should create global CSS rule', () => {
      const cssRule = rules[3];

      expect(cssRule).toBeDefined();
      if (cssRule) {
        expect(cssRule.test).toEqual(/\.css$/i);
        expect(cssRule.exclude).toEqual(/\.module\.css$/i);
      }
    });

    it('should create module CSS rule', () => {
      const moduleCssRule = rules[4];

      expect(moduleCssRule).toBeDefined();
      if (moduleCssRule) {
        expect(moduleCssRule.test).toEqual(/\.module\.css$/i);
      }
    });

    it('should create image rule with proper configuration', () => {
      const imageRule = rules.find(
        (rule) =>
          typeof rule === 'object' &&
          'test' in rule &&
          rule.test instanceof RegExp &&
          rule.test.test('image.png'),
      );

      expect(imageRule).toBeDefined();
      if (imageRule) {
        expect(imageRule.test).toEqual(/\.(png|jpe?g|gif|webp|avif)$/i);
        expect(imageRule.type).toBe('asset');
        expect(imageRule.parser).toEqual({ dataUrlCondition: { maxSize: 8 * 1024 } });
        expect(imageRule.generator?.['filename']).toBe('images/[name][ext]');
      }
    });

    it('should create SVG rule with oneOf for different import modes', () => {
      const svgRule = rules.find(
        (rule) =>
          typeof rule === 'object' &&
          'test' in rule &&
          rule.test instanceof RegExp &&
          rule.test.test('icon.svg'),
      );

      expect(svgRule).toBeDefined();
      if (svgRule) {
        expect(svgRule.test).toEqual(/\.svg$/i);
        expect(svgRule.oneOf).toBeDefined();
        expect(Array.isArray(svgRule.oneOf)).toBe(true);
        expect(svgRule.oneOf?.length).toBe(3);

        // Test raw SVG import
        const rawRule = svgRule.oneOf?.[0];
        expect(rawRule).toHaveProperty('resourceQuery', /raw/);
        expect(rawRule).toHaveProperty('type', 'asset/source');

        // Test URL SVG import
        const urlRule = svgRule.oneOf?.[1];
        expect(urlRule).toHaveProperty('resourceQuery', /url/);
        expect(urlRule).toHaveProperty('type', 'asset');

        // Test component SVG import
        const componentRule = svgRule.oneOf?.[2];
        expect(componentRule).toHaveProperty('use');
      }
    });

    it('should create font rule', () => {
      const fontRule = rules.find(
        (rule) =>
          typeof rule === 'object' &&
          'test' in rule &&
          rule.test instanceof RegExp &&
          rule.test.test('font.woff2'),
      );

      expect(fontRule).toBeDefined();
      if (fontRule) {
        expect(fontRule.test).toEqual(/\.(woff2?|eot|ttf|otf)$/i);
        expect(fontRule.type).toBe('asset/resource');
        expect(fontRule.generator?.['filename']).toBe('fonts/[name][ext]');
      }
    });

    it('should create media rule', () => {
      const mediaRule = rules.find(
        (rule) =>
          typeof rule === 'object' &&
          'test' in rule &&
          rule.test instanceof RegExp &&
          rule.test.test('video.mp4'),
      );

      expect(mediaRule).toBeDefined();
      if (mediaRule) {
        expect(mediaRule.test).toEqual(/\.(mp4|webm|ogg|mp3|wav|flac|aac)$/i);
        expect(mediaRule.type).toBe('asset');
        expect(mediaRule.parser).toEqual({ dataUrlCondition: { maxSize: 8 * 1024 } });
        expect(mediaRule.generator?.['filename']).toBe('media/[name][ext]');
      }
    });

    it('should use style-loader in development for CSS', () => {
      const scssRule = rules[1];
      expect(scssRule).toBeDefined();
      if (scssRule) {
        const styleLoader = Array.isArray(scssRule.use) ? scssRule.use[0] : null;
        expect(styleLoader).toBe('style-loader');
      }
    });
  });

  describe('production mode', () => {
    const rules = createModuleRules({ isProd: true, uniqueName: 'test-app' });

    it('should use MiniCssExtractPlugin loader in production', () => {
      const scssRule = rules[1];
      expect(scssRule).toBeDefined();
      if (scssRule) {
        const extractLoader = Array.isArray(scssRule.use) ? scssRule.use[0] : null;
        expect(typeof extractLoader).toBe('string');
        expect(extractLoader).toContain('mini-css-extract-plugin');
      }
    });

    it('should use hashed filenames in production for assets', () => {
      const imageRule = rules.find(
        (rule) =>
          typeof rule === 'object' &&
          'test' in rule &&
          rule.test instanceof RegExp &&
          rule.test.test('image.png'),
      );

      expect(imageRule).toBeDefined();
      if (imageRule) {
        expect(imageRule.generator?.['filename']).toBe('images/[name].[contenthash:8][ext]');
      }
    });

    it('should configure babel with production optimizations', () => {
      const scriptRule = rules.find(
        (rule) =>
          typeof rule === 'object' &&
          'test' in rule &&
          rule.test instanceof RegExp &&
          rule.test.test('.tsx'),
      );

      expect(scriptRule).toBeDefined();
      if (scriptRule) {
        const babelLoader = getLoaderByName(scriptRule.use, 'babel-loader');

        expect(babelLoader).toBeDefined();
        if (babelLoader) {
          const options = getLoaderOptions(babelLoader);

          expect(options).toBeDefined();
          if (options) {
            expect(options['compact']).toBe(true);
            const plugins = options['plugins'];
            expect(Array.isArray(plugins)).toBe(true);
          }
        }
      }
    });
  });

  describe('CSS modules configuration', () => {
    const rules = createModuleRules({ isProd: false, uniqueName: 'my-app' });

    it('should configure CSS modules for .module.css files', () => {
      const moduleCssRule = rules[4];
      expect(moduleCssRule).toBeDefined();
      if (moduleCssRule) {
        const cssLoader = getLoaderByName(moduleCssRule.use, 'css-loader');

        expect(cssLoader).toBeDefined();
        if (cssLoader) {
          const modules = getModulesOptions(cssLoader);

          expect(modules).toBeDefined();
          const localIdentName = getModulesLocalIdentName(cssLoader);
          expect(localIdentName).toBeDefined();
          if (localIdentName) {
            expect(localIdentName).toContain('my-app');
          }
        }
      }
    });

    it('should use different naming for production vs development', () => {
      const prodRules = createModuleRules({ isProd: true, uniqueName: 'my-app' });
      const devRules = createModuleRules({ isProd: false, uniqueName: 'my-app' });

      const prodCssRule = prodRules[4];
      const devCssRule = devRules[4];

      expect(prodCssRule).toBeDefined();
      expect(devCssRule).toBeDefined();

      if (prodCssRule) {
        const prodCssLoader = getLoaderByName(prodCssRule.use, 'css-loader');

        expect(prodCssLoader).toBeDefined();
        if (prodCssLoader) {
          const localIdentName = getModulesLocalIdentName(prodCssLoader);
          expect(localIdentName).toBe('my-app_[hash:base64:6]');
        }
      }

      if (devCssRule) {
        const devCssLoader = getLoaderByName(devCssRule.use, 'css-loader');

        expect(devCssLoader).toBeDefined();
        if (devCssLoader) {
          const localIdentName = getModulesLocalIdentName(devCssLoader);
          expect(localIdentName).toBe('my-app_[name]__[local]__[hash:base64:5]');
        }
      }
    });
  });

  describe('PostCSS configuration', () => {
    const rules = createModuleRules({ isProd: false, uniqueName: 'test-app' });
    const scssRule = rules[1];

    it('should include PostCSS loader in the chain', () => {
      expect(scssRule).toBeDefined();
      if (scssRule) {
        const postCssLoader = getLoaderByName(scssRule.use, 'postcss-loader');

        expect(postCssLoader).toBeDefined();
        if (postCssLoader) {
          const plugins = getPostCssPlugins(postCssLoader);

          expect(plugins).toBeDefined();
          if (plugins) {
            expect(plugins).toContain('postcss-preset-env');
          }
        }
      }
    });

    it('should include cssnano in production', () => {
      const prodRules = createModuleRules({ isProd: true, uniqueName: 'test-app' });
      const prodScssRule = prodRules[1];

      expect(prodScssRule).toBeDefined();
      if (prodScssRule) {
        const postCssLoader = getLoaderByName(prodScssRule.use, 'postcss-loader');

        expect(postCssLoader).toBeDefined();
        if (postCssLoader) {
          const plugins = getPostCssPlugins(postCssLoader);

          expect(plugins).toBeDefined();
          if (plugins) {
            expect(plugins).toContain('cssnano');
          }
        }
      }
    });

    it('should not include cssnano in development', () => {
      expect(scssRule).toBeDefined();
      if (scssRule) {
        const postCssLoader = getLoaderByName(scssRule.use, 'postcss-loader');

        expect(postCssLoader).toBeDefined();
        if (postCssLoader) {
          const plugins = getPostCssPlugins(postCssLoader);

          expect(plugins).toBeDefined();
          if (plugins) {
            expect(plugins).not.toContain('cssnano');
          }
        }
      }
    });
  });

  describe('sass loader configuration', () => {
    it('should configure sass-loader with correct options', () => {
      const rules = createModuleRules({ isProd: false, uniqueName: 'test-app' });
      const scssRule = rules[1];

      expect(scssRule).toBeDefined();
      if (scssRule) {
        const sassLoader = getLoaderByName(scssRule.use, 'sass-loader');

        expect(sassLoader).toBeDefined();
        if (sassLoader) {
          const options = getLoaderOptions(sassLoader);

          expect(options).toBeDefined();
          if (options) {
            expect(options).toHaveProperty('sourceMap', true);
            expect(options['sassOptions']).toBeDefined();
          }
        }
      }
    });
  });
});
