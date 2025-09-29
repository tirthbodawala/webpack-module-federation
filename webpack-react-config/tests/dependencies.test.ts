import { describe, it, expect } from '@jest/globals';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

describe('Dependencies', () => {
  let packageJson: any;

  beforeAll(async () => {
    const content = await readFile(resolve(process.cwd(), 'package.json'), 'utf8');
    packageJson = JSON.parse(content);
  });

  describe('Package.json structure', () => {
    it('should have all required fields', () => {
      expect(packageJson).toHaveProperty('name');
      expect(packageJson).toHaveProperty('version');
      expect(packageJson).toHaveProperty('description');
      expect(packageJson).toHaveProperty('main');
      expect(packageJson).toHaveProperty('types');
      expect(packageJson).toHaveProperty('exports');
      expect(packageJson).toHaveProperty('files');
      expect(packageJson).toHaveProperty('scripts');
    });

    it('should have proper ESM package exports', () => {
      expect(packageJson.exports).toBeDefined();
      expect(packageJson.exports['.']).toBeDefined();
      expect(packageJson.exports['.']).toHaveProperty('types');
      expect(packageJson.exports['.']).toHaveProperty('default');
    });

    it('should have correct file extensions for exports', () => {
      expect(packageJson.main).toMatch(/\.js$/);
      expect(packageJson.types).toMatch(/\.d\.ts$/);
      expect(packageJson.exports['.'].default).toMatch(/\.js$/);
    });
  });

  describe('Required webpack dependencies', () => {
    const requiredDependencies = [
      '@babel/core',
      '@babel/preset-env',
      '@babel/preset-react',
      '@babel/preset-typescript',
      'babel-loader',
      'css-loader',
      'html-webpack-plugin',
      'mini-css-extract-plugin',
      'sass-loader',
      'style-loader',
      'terser-webpack-plugin'
    ];

    it('should have all required webpack dependencies', () => {
      const allDeps = {
        ...packageJson.dependencies,
        ...packageJson.optionalDependencies
      };

      requiredDependencies.forEach(dep => {
        expect(allDeps).toHaveProperty(dep);
      });
    });

    it('should have webpack and typescript as peer dependencies', () => {
      expect(packageJson.peerDependencies).toHaveProperty('webpack');
      expect(packageJson.peerDependencies).toHaveProperty('typescript');
      expect(packageJson.peerDependencies).toHaveProperty('react');
      expect(packageJson.peerDependencies).toHaveProperty('react-dom');
    });
  });

  describe('Development dependencies', () => {
    const requiredDevDeps = [
      '@jest/globals',
      '@types/jest',
      '@types/node',
      '@types/webpack',
      'jest',
      'rimraf',
      'ts-jest',
      'typescript'
    ];

    it('should have all required development dependencies', () => {
      requiredDevDeps.forEach(dep => {
        expect(packageJson.devDependencies).toHaveProperty(dep);
      });
    });
  });

  describe('Version constraints', () => {
    it('should use appropriate version ranges for stability', () => {
      const deps = packageJson.dependencies || {};
      const devDeps = packageJson.devDependencies || {};

      // Check that most dependencies use caret (^) for minor updates
      Object.entries({ ...deps, ...devDeps }).forEach(([name, version]) => {
        if (typeof version === 'string') {
          // Most dependencies should use ^ for automatic minor updates
          expect(version).toMatch(/^[\^~]?\d+/);
        }
      });
    });

    it('should have compatible peer dependency versions', () => {
      const peerDeps = packageJson.peerDependencies || {};

      // React should be 18+
      expect(peerDeps.react).toMatch(/>=18/);
      expect(peerDeps['react-dom']).toMatch(/>=18/);

      // Webpack should be 5+
      expect(peerDeps.webpack).toMatch(/>=5/);

      // TypeScript should be 4+
      expect(peerDeps.typescript).toMatch(/>=4/);
    });
  });

  describe('Script validation', () => {
    const requiredScripts = [
      'build',
      'build:clean',
      'build:esm',
      'test',
      'test:coverage',
      'deps:update'
    ];

    it('should have all required npm scripts', () => {
      requiredScripts.forEach(script => {
        expect(packageJson.scripts).toHaveProperty(script);
      });
    });

    it('should have proper prepublishOnly script', () => {
      expect(packageJson.scripts.prepublishOnly).toContain('npm run build');
      expect(packageJson.scripts.prepublishOnly).toContain('npm run test');
    });

    it('should have dependency update scripts', () => {
      expect(packageJson.scripts['deps:update']).toContain('npm run test');
      expect(packageJson.scripts['deps:update']).toContain('npm run build');
    });
  });

  describe('Files configuration', () => {
    it('should only include dist folder in published package', () => {
      expect(packageJson.files).toContain('dist');
      expect(packageJson.files.length).toBe(1);
    });
  });

  describe('Dependency security', () => {
    it('should not have any known vulnerable patterns', () => {
      const allDeps = {
        ...packageJson.dependencies,
        ...packageJson.devDependencies,
        ...packageJson.optionalDependencies
      };

      // Check for common vulnerable packages (these should be avoided)
      const vulnerablePatterns = [
        'event-stream',
        'flatmap-stream',
        'eslint-scope',
        'bootstrap-sass'
      ];

      vulnerablePatterns.forEach(pattern => {
        expect(allDeps).not.toHaveProperty(pattern);
      });
    });

    it('should not have direct dependencies on native modules', () => {
      const deps = packageJson.dependencies || {};

      // These packages often cause issues in different environments
      const nativeModules = [
        'fsevents',
        'node-sass', // deprecated in favor of sass
        'node-gyp'
      ];

      nativeModules.forEach(mod => {
        expect(deps).not.toHaveProperty(mod);
      });
    });
  });

  describe('Babel configuration dependencies', () => {
    it('should have consistent babel preset versions', () => {
      const deps = packageJson.dependencies || {};
      const babelDeps = Object.keys(deps).filter(dep => dep.startsWith('@babel/'));

      expect(babelDeps.length).toBeGreaterThan(5); // Should have multiple babel packages

      babelDeps.forEach(dep => {
        expect(deps[dep]).toMatch(/^\^7\./); // Should all be v7.x
      });
    });
  });

  describe('Webpack plugin dependencies', () => {
    const expectedPlugins = [
      'html-webpack-plugin',
      'mini-css-extract-plugin',
      'copy-webpack-plugin',
      'fork-ts-checker-webpack-plugin',
      '@pmmmwh/react-refresh-webpack-plugin',
      'terser-webpack-plugin',
      'css-minimizer-webpack-plugin'
    ];

    it('should have all webpack plugins as dependencies', () => {
      const deps = { ...packageJson.dependencies, ...packageJson.optionalDependencies };

      expectedPlugins.forEach(plugin => {
        expect(deps).toHaveProperty(plugin);
      });
    });
  });

  describe('Loader dependencies', () => {
    const expectedLoaders = [
      'babel-loader',
      'css-loader',
      'sass-loader',
      'style-loader',
      'postcss-loader',
      'thread-loader',
      'image-webpack-loader'
    ];

    it('should have all webpack loaders as dependencies', () => {
      const deps = packageJson.dependencies || {};

      expectedLoaders.forEach(loader => {
        expect(deps).toHaveProperty(loader);
      });
    });
  });

  describe('Optional dependencies', () => {
    it('should have webpack-bundle-analyzer as optional dependency', () => {
      expect(packageJson.optionalDependencies).toHaveProperty('webpack-bundle-analyzer');
    });

    it('should handle optional dependencies gracefully', () => {
      // Optional deps should not break the build if missing
      const optionalDeps = packageJson.optionalDependencies || {};

      Object.keys(optionalDeps).forEach(dep => {
        expect(typeof optionalDeps[dep]).toBe('string');
        expect(optionalDeps[dep]).toMatch(/^\^?\d+/);
      });
    });
  });
});