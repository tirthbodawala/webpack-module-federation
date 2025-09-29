import { describe, it, expect, jest } from '@jest/globals';
import { createModuleRules } from '../dist/loaders.js';
import type { RuleSetRule } from 'webpack';

describe('createModuleRules', () => {
  describe('development mode', () => {
    const rules = createModuleRules({ isProd: false });

    it('should return an array of rules', () => {
      expect(Array.isArray(rules)).toBe(true);
      expect(rules.length).toBe(9); // 9 different rule types
    });

    it('should create script rule for TypeScript/JavaScript files', () => {
      const scriptRule = rules.find(rule =>
        rule && typeof rule === 'object' && 'test' in rule &&
        rule.test instanceof RegExp && rule.test.test('.tsx')
      ) as RuleSetRule;

      expect(scriptRule).toBeDefined();
      expect(scriptRule.test).toEqual(/\.[jt]sx?$/i);
      expect(scriptRule.type).toBe('javascript/esm');
      expect(scriptRule.exclude).toEqual(/node_modules/);
      expect(Array.isArray(scriptRule.use)).toBe(true);
    });

    it('should configure babel loader in script rule', () => {
      const scriptRule = rules.find(rule =>
        rule && typeof rule === 'object' && 'test' in rule &&
        rule.test instanceof RegExp && rule.test.test('.tsx')
      ) as RuleSetRule;

      const babelLoader = Array.isArray(scriptRule.use) ?
        scriptRule.use.find((loader: any) =>
          typeof loader === 'object' && loader.loader === 'babel-loader'
        ) : null;

      expect(babelLoader).toBeDefined();
      expect(babelLoader).toHaveProperty('options');
    });

    it('should create global SCSS rule', () => {
      const scssRule = rules[1] as RuleSetRule; // Second rule should be global SCSS

      expect(scssRule).toBeDefined();
      expect(scssRule.test).toEqual(/\.scss$/i);
      expect(scssRule.exclude).toEqual(/\.module\.scss$/i);
    });

    it('should create module SCSS rule', () => {
      const moduleScssRule = rules[2] as RuleSetRule; // Third rule should be module SCSS

      expect(moduleScssRule).toBeDefined();
      expect(moduleScssRule.test).toEqual(/\.module\.scss$/i);
    });

    it('should create global CSS rule', () => {
      const cssRule = rules[3] as RuleSetRule; // Fourth rule should be global CSS

      expect(cssRule).toBeDefined();
      expect(cssRule.test).toEqual(/\.css$/i);
      expect(cssRule.exclude).toEqual(/\.module\.css$/i);
    });

    it('should create module CSS rule', () => {
      const moduleCssRule = rules[4] as RuleSetRule; // Fifth rule should be module CSS

      expect(moduleCssRule).toBeDefined();
      expect(moduleCssRule.test).toEqual(/\.module\.css$/i);
    });

    it('should create image rule', () => {
      const imageRule = rules.find(rule =>
        rule && typeof rule === 'object' && 'test' in rule &&
        rule.test instanceof RegExp && rule.test.test('image.png')
      ) as RuleSetRule;

      expect(imageRule).toBeDefined();
      expect(imageRule.test).toEqual(/\.(png|jpe?g|gif|webp|avif)$/i);
      expect(imageRule.type).toBe('asset');
      expect(imageRule.parser).toEqual({ dataUrlCondition: { maxSize: 8 * 1024 } });
    });

    it('should create SVG rule with oneOf for different use cases', () => {
      const svgRule = rules.find(rule =>
        rule && typeof rule === 'object' && 'test' in rule &&
        rule.test instanceof RegExp && rule.test.test('icon.svg')
      ) as RuleSetRule;

      expect(svgRule).toBeDefined();
      expect(svgRule.test).toEqual(/\.svg$/i);
      expect(svgRule.oneOf).toBeDefined();
      expect(Array.isArray(svgRule.oneOf)).toBe(true);
      expect(svgRule.oneOf?.length).toBe(3); // raw, url, component
    });

    it('should create font rule', () => {
      const fontRule = rules.find(rule =>
        rule && typeof rule === 'object' && 'test' in rule &&
        rule.test instanceof RegExp && rule.test.test('font.woff2')
      ) as RuleSetRule;

      expect(fontRule).toBeDefined();
      expect(fontRule.test).toEqual(/\.(woff2?|eot|ttf|otf)$/i);
      expect(fontRule.type).toBe('asset/resource');
    });

    it('should create media rule', () => {
      const mediaRule = rules.find(rule =>
        rule && typeof rule === 'object' && 'test' in rule &&
        rule.test instanceof RegExp && rule.test.test('video.mp4')
      ) as RuleSetRule;

      expect(mediaRule).toBeDefined();
      expect(mediaRule.test).toEqual(/\.(mp4|webm|ogg|mp3|wav|flac|aac)$/i);
      expect(mediaRule.type).toBe('asset');
      expect(mediaRule.parser).toEqual({ dataUrlCondition: { maxSize: 8 * 1024 } });
    });

    it('should use style-loader in development', () => {
      const scssRule = rules[1] as RuleSetRule; // Second rule is global SCSS

      const styleLoader = Array.isArray(scssRule.use) ?
        scssRule.use[0] : null;

      expect(styleLoader).toBe('style-loader');
    });

    it('should not use image optimization in development', () => {
      const imageRule = rules.find(rule =>
        rule && typeof rule === 'object' && 'test' in rule &&
        rule.test instanceof RegExp && rule.test.test('image.png')
      ) as RuleSetRule;

      expect(imageRule.use).toEqual([]);
    });
  });

  describe('production mode', () => {
    const rules = createModuleRules({ isProd: true });

    it('should use MiniCssExtractPlugin loader in production', () => {
      const scssRule = rules[1] as RuleSetRule; // Second rule is global SCSS

      const extractLoader = Array.isArray(scssRule.use) ?
        scssRule.use[0] : null;

      expect(typeof extractLoader).toBe('string');
      expect(extractLoader).toContain('mini-css-extract-plugin');
    });

    it('should include image optimization in production', () => {
      const imageRule = rules.find(rule =>
        rule && typeof rule === 'object' && 'test' in rule &&
        rule.test instanceof RegExp && rule.test.test('image.png')
      ) as RuleSetRule;

      expect(Array.isArray(imageRule.use)).toBe(true);
      expect(imageRule.use?.length).toBeGreaterThan(0);

      const imageOptimizer = Array.isArray(imageRule.use) ?
        imageRule.use.find((loader: any) =>
          typeof loader === 'object' && loader.loader === 'image-webpack-loader'
        ) : null;

      expect(imageOptimizer).toBeDefined();
    });

    it('should use hashed filenames in production', () => {
      const imageRule = rules.find(rule =>
        rule && typeof rule === 'object' && 'test' in rule &&
        rule.test instanceof RegExp && rule.test.test('image.png')
      ) as RuleSetRule;

      expect(imageRule.generator?.filename).toBe('images/[name].[contenthash:8][ext]');
    });

    it('should use simple filenames in development', () => {
      const devRules = createModuleRules({ isProd: false });
      const imageRule = devRules.find(rule =>
        rule && typeof rule === 'object' && 'test' in rule &&
        rule.test instanceof RegExp && rule.test.test('image.png')
      ) as RuleSetRule;

      expect(imageRule.generator?.filename).toBe('images/[name][ext]');
    });

    it('should configure production babel plugins', () => {
      const scriptRule = rules.find(rule =>
        rule && typeof rule === 'object' && 'test' in rule &&
        rule.test instanceof RegExp && rule.test.test('.tsx')
      ) as RuleSetRule;

      const babelLoader = Array.isArray(scriptRule.use) ?
        scriptRule.use.find((loader: any) =>
          typeof loader === 'object' && loader.loader === 'babel-loader'
        ) : null;

      expect(babelLoader).toHaveProperty('options.plugins');
      expect(babelLoader.options.compact).toBe(true);
    });

    it('should configure development babel plugins', () => {
      const devRules = createModuleRules({ isProd: false });
      const scriptRule = devRules.find(rule =>
        rule && typeof rule === 'object' && 'test' in rule &&
        rule.test instanceof RegExp && rule.test.test('.tsx')
      ) as RuleSetRule;

      const babelLoader = Array.isArray(scriptRule.use) ?
        scriptRule.use.find((loader: any) =>
          typeof loader === 'object' && loader.loader === 'babel-loader'
        ) : null;

      expect(babelLoader.options.compact).toBe(false);
    });
  });

  describe('SVG rule variations', () => {
    const rules = createModuleRules({ isProd: false });
    const svgRule = rules.find(rule =>
      rule && typeof rule === 'object' && 'test' in rule &&
      rule.test instanceof RegExp && rule.test.test('icon.svg')
    ) as RuleSetRule;

    it('should handle raw SVG imports', () => {
      const rawRule = svgRule.oneOf?.[0];
      expect(rawRule).toHaveProperty('resourceQuery', /raw/);
      expect(rawRule).toHaveProperty('type', 'asset/source');
    });

    it('should handle URL SVG imports', () => {
      const urlRule = svgRule.oneOf?.[1];
      expect(urlRule).toHaveProperty('resourceQuery', /url/);
      expect(urlRule).toHaveProperty('type', 'asset');
    });

    it('should handle component SVG imports', () => {
      const componentRule = svgRule.oneOf?.[2];
      expect(componentRule).toHaveProperty('use');

      const svgrLoader = Array.isArray(componentRule?.use) ?
        componentRule.use.find((loader: any) =>
          typeof loader === 'object' && loader.loader === '@svgr/webpack'
        ) : null;

      expect(svgrLoader).toBeDefined();
    });
  });

  describe('CSS modules configuration', () => {
    const rules = createModuleRules({ isProd: false });

    it('should configure CSS modules for .module.css files', () => {
      const moduleCssRule = rules[4] as RuleSetRule; // Fifth rule is module CSS

      const cssLoader = Array.isArray(moduleCssRule.use) ?
        moduleCssRule.use.find((loader: any) =>
          typeof loader === 'object' && loader.loader === 'css-loader'
        ) : null;

      expect(cssLoader).toBeDefined();
      expect(cssLoader.options).toHaveProperty('modules');
    });

    it('should configure CSS modules for .module.scss files', () => {
      const moduleScssRule = rules[2] as RuleSetRule; // Third rule is module SCSS

      const cssLoader = Array.isArray(moduleScssRule.use) ?
        moduleScssRule.use.find((loader: any) =>
          typeof loader === 'object' && loader.loader === 'css-loader'
        ) : null;

      expect(cssLoader).toBeDefined();
      expect(cssLoader.options).toHaveProperty('modules');
    });

    it('should use different module naming for production vs development', () => {
      const prodRules = createModuleRules({ isProd: true });
      const devRules = createModuleRules({ isProd: false });

      const prodCssRule = prodRules[4] as RuleSetRule; // Fifth rule is module CSS
      const devCssRule = devRules[4] as RuleSetRule; // Fifth rule is module CSS

      const prodCssLoader = Array.isArray(prodCssRule.use) ?
        prodCssRule.use.find((loader: any) =>
          typeof loader === 'object' && loader.loader === 'css-loader'
        ) : null;

      const devCssLoader = Array.isArray(devCssRule.use) ?
        devCssRule.use.find((loader: any) =>
          typeof loader === 'object' && loader.loader === 'css-loader'
        ) : null;

      expect(prodCssLoader.options.modules.localIdentName).toBe('[hash:base64:6]');
      expect(devCssLoader.options.modules.localIdentName).toBe('[name]__[local]__[hash:base64:5]');
    });
  });

  describe('PostCSS configuration', () => {
    const rules = createModuleRules({ isProd: false });
    const scssRule = rules[1] as RuleSetRule; // Second rule is global SCSS

    it('should include PostCSS loader', () => {
      const postCssLoader = Array.isArray(scssRule.use) ?
        scssRule.use.find((loader: any) =>
          typeof loader === 'object' && loader.loader === 'postcss-loader'
        ) : null;

      expect(postCssLoader).toBeDefined();
      expect(postCssLoader.options.postcssOptions.plugins).toContain('postcss-preset-env');
    });

    it('should include cssnano in production', () => {
      const prodRules = createModuleRules({ isProd: true });
      const prodScssRule = prodRules[1] as RuleSetRule; // Second rule is global SCSS

      const postCssLoader = Array.isArray(prodScssRule.use) ?
        prodScssRule.use.find((loader: any) =>
          typeof loader === 'object' && loader.loader === 'postcss-loader'
        ) : null;

      expect(postCssLoader.options.postcssOptions.plugins).toContain('cssnano');
    });

    it('should not include cssnano in development', () => {
      const postCssLoader = Array.isArray(scssRule.use) ?
        scssRule.use.find((loader: any) =>
          typeof loader === 'object' && loader.loader === 'postcss-loader'
        ) : null;

      expect(postCssLoader.options.postcssOptions.plugins).not.toContain('cssnano');
    });
  });

  describe('thread loader configuration', () => {
    const rules = createModuleRules({ isProd: false });
    const scriptRule = rules.find(rule =>
      rule && typeof rule === 'object' && 'test' in rule &&
      rule.test instanceof RegExp && rule.test.test('.tsx')
    ) as RuleSetRule;

    it('should include thread-loader for parallel processing', () => {
      const threadLoader = Array.isArray(scriptRule.use) ?
        scriptRule.use.find((loader: any) =>
          typeof loader === 'object' && loader.loader === 'thread-loader'
        ) : null;

      expect(threadLoader).toBeDefined();
      expect(threadLoader.options).toHaveProperty('workers');
      expect(typeof threadLoader.options.workers).toBe('number');
      expect(threadLoader.options.workers).toBeGreaterThan(0);
    });
  });
});