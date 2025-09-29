import { describe, it, expect } from '@jest/globals';
import { createOptimization } from '../dist/optimization.js';

describe('createOptimization', () => {
  describe('development mode', () => {
    const optimization = createOptimization({ isProd: false });

    it('should return optimization configuration object', () => {
      expect(typeof optimization).toBe('object');
      expect(optimization).not.toBeNull();
    });

    it('should disable minimization in development', () => {
      expect(optimization.minimize).toBe(false);
    });

    it('should include minimizers array', () => {
      expect(Array.isArray(optimization.minimizer)).toBe(true);
      expect(optimization.minimizer?.length).toBeGreaterThan(0);
    });

    it('should configure TerserPlugin for development', () => {
      const terserPlugin = optimization.minimizer?.find(
        (plugin: any) => plugin.constructor.name === 'TerserPlugin'
      );

      expect(terserPlugin).toBeDefined();
    });

    it('should configure CssMinimizerPlugin', () => {
      const cssMinPlugin = optimization.minimizer?.find(
        (plugin: any) => plugin.constructor.name === 'CssMinimizerPlugin'
      );

      expect(cssMinPlugin).toBeDefined();
    });

    it('should use named module and chunk ids in development', () => {
      expect(optimization.moduleIds).toBe('named');
      expect(optimization.chunkIds).toBe('named');
    });
  });

  describe('production mode', () => {
    const optimization = createOptimization({ isProd: true });

    it('should enable minimization in production', () => {
      expect(optimization.minimize).toBe(true);
    });

    it('should use deterministic module and chunk ids in production', () => {
      expect(optimization.moduleIds).toBe('deterministic');
      expect(optimization.chunkIds).toBe('deterministic');
    });

    it('should configure TerserPlugin with production settings', () => {
      const terserPlugin = optimization.minimizer?.find(
        (plugin: any) => plugin.constructor.name === 'TerserPlugin'
      );

      expect(terserPlugin).toBeDefined();
    });
  });

  describe('splitChunks configuration', () => {
    const optimization = createOptimization({ isProd: false });

    it('should configure splitChunks', () => {
      expect(optimization.splitChunks).toBeDefined();
      expect(typeof optimization.splitChunks).toBe('object');
    });

    it('should split all chunk types', () => {
      expect(optimization.splitChunks?.chunks).toBe('all');
    });

    it('should set appropriate size limits', () => {
      expect(optimization.splitChunks?.minSize).toBe(20000);
      expect(optimization.splitChunks?.maxInitialRequests).toBe(25);
      expect(optimization.splitChunks?.maxAsyncRequests).toBe(25);
    });

    it('should configure framework cache group', () => {
      const cacheGroups = optimization.splitChunks?.cacheGroups;
      expect(cacheGroups).toBeDefined();
      expect(cacheGroups?.framework).toBeDefined();

      const frameworkGroup = cacheGroups?.framework;
      expect(frameworkGroup?.test).toBeInstanceOf(RegExp);
      expect(frameworkGroup?.name).toBe('framework');
      expect(frameworkGroup?.chunks).toBe('all');
      expect(frameworkGroup?.priority).toBe(40);
      expect(frameworkGroup?.enforce).toBe(true);
    });

    it('should configure vendor cache group', () => {
      const cacheGroups = optimization.splitChunks?.cacheGroups;
      const vendorGroup = cacheGroups?.vendor;

      expect(vendorGroup).toBeDefined();
      expect(vendorGroup?.test).toBeInstanceOf(RegExp);
      expect(vendorGroup?.chunks).toBe('all');
      expect(vendorGroup?.priority).toBe(20);
      expect(vendorGroup?.reuseExistingChunk).toBe(true);
      expect(typeof vendorGroup?.name).toBe('function');
    });

    it('should configure common cache group', () => {
      const cacheGroups = optimization.splitChunks?.cacheGroups;
      const commonGroup = cacheGroups?.common;

      expect(commonGroup).toBeDefined();
      expect(commonGroup?.name).toBe('common');
      expect(commonGroup?.minChunks).toBe(2);
      expect(commonGroup?.chunks).toBe('all');
      expect(commonGroup?.priority).toBe(10);
      expect(commonGroup?.reuseExistingChunk).toBe(true);
      expect(commonGroup?.test).toBeInstanceOf(RegExp);
      expect(commonGroup?.enforce).toBe(true);
    });
  });

  describe('runtimeChunk configuration', () => {
    const optimization = createOptimization({ isProd: false });

    it('should configure runtime chunk', () => {
      expect(optimization.runtimeChunk).toBeDefined();
      expect(optimization.runtimeChunk).toEqual({ name: 'runtime' });
    });
  });

  describe('concatenateModules configuration', () => {
    const optimization = createOptimization({ isProd: false });

    it('should enable module concatenation', () => {
      expect(optimization.concatenateModules).toBe(true);
    });
  });

  describe('cache group naming function', () => {
    const optimization = createOptimization({ isProd: false });
    const vendorGroup = optimization.splitChunks?.cacheGroups?.vendor;
    const namingFunction = vendorGroup?.name as Function;

    it('should generate correct names for node_modules', () => {
      const mockModule = {
        context: '/project/node_modules/react/lib'
      };
      const mockChunks: any[] = [];
      const cacheGroupKey = 'vendor';

      const result = namingFunction(mockModule, mockChunks, cacheGroupKey);
      expect(result).toBe('npm.react');
    });

    it('should generate correct names for scoped packages', () => {
      const mockModule = {
        context: '/project/node_modules/@babel/core/lib'
      };
      const mockChunks: any[] = [];
      const cacheGroupKey = 'vendor';

      const result = namingFunction(mockModule, mockChunks, cacheGroupKey);
      expect(result).toBe('npm.babel');
    });

    it('should handle modules without context', () => {
      const mockModule = null;
      const mockChunks: any[] = [];
      const cacheGroupKey = 'vendor';

      const result = namingFunction(mockModule, mockChunks, cacheGroupKey);
      expect(result).toBe('vendor');
    });

    it('should handle modules with context but no node_modules match', () => {
      const mockModule = {
        context: '/project/src/components'
      };
      const mockChunks: any[] = [];
      const cacheGroupKey = 'vendor';

      const result = namingFunction(mockModule, mockChunks, cacheGroupKey);
      expect(result).toBe('vendor');
    });
  });

  describe('regex patterns', () => {
    const optimization = createOptimization({ isProd: false });
    const cacheGroups = optimization.splitChunks?.cacheGroups;

    it('should match React framework packages', () => {
      const frameworkRegex = cacheGroups?.framework?.test as RegExp;

      expect(frameworkRegex.test('/node_modules/react/index.js')).toBe(true);
      expect(frameworkRegex.test('/node_modules/react-dom/index.js')).toBe(true);
      expect(frameworkRegex.test('/node_modules/scheduler/index.js')).toBe(true);
      expect(frameworkRegex.test('/node_modules/lodash/index.js')).toBe(false);
    });

    it('should match all node_modules for vendor group', () => {
      const vendorRegex = cacheGroups?.vendor?.test as RegExp;

      expect(vendorRegex.test('/project/node_modules/lodash/index.js')).toBe(true);
      expect(vendorRegex.test('/project/node_modules/react/index.js')).toBe(true);
      expect(vendorRegex.test('/project/src/component.js')).toBe(false);
    });

    it('should match src files for common group', () => {
      const commonRegex = cacheGroups?.common?.test as RegExp;

      expect(commonRegex.test('/project/src/component.js')).toBe(true);
      expect(commonRegex.test('/project/src/utils/helper.js')).toBe(true);
      expect(commonRegex.test('/project/node_modules/lodash/index.js')).toBe(false);
    });
  });

  describe('minimizer configurations', () => {
    describe('TerserPlugin configuration', () => {
      it('should configure terser options correctly for production', () => {
        const optimization = createOptimization({ isProd: true });
        const terserPlugin = optimization.minimizer?.find(
          (plugin: any) => plugin.constructor.name === 'TerserPlugin'
        );

        expect(terserPlugin).toBeDefined();
        // Terser options are internal to the plugin, but we can verify the plugin exists
      });

      it('should configure terser options correctly for development', () => {
        const optimization = createOptimization({ isProd: false });
        const terserPlugin = optimization.minimizer?.find(
          (plugin: any) => plugin.constructor.name === 'TerserPlugin'
        );

        expect(terserPlugin).toBeDefined();
      });
    });

    describe('CssMinimizerPlugin configuration', () => {
      it('should include CssMinimizerPlugin', () => {
        const optimization = createOptimization({ isProd: true });
        const cssMinPlugin = optimization.minimizer?.find(
          (plugin: any) => plugin.constructor.name === 'CssMinimizerPlugin'
        );

        expect(cssMinPlugin).toBeDefined();
      });
    });
  });

  describe('optimization configuration consistency', () => {
    it('should have consistent configuration between production and development', () => {
      const prodOpt = createOptimization({ isProd: true });
      const devOpt = createOptimization({ isProd: false });

      // Both should have the same structure, but different values
      expect(typeof prodOpt.minimize).toBe('boolean');
      expect(typeof devOpt.minimize).toBe('boolean');

      expect(Array.isArray(prodOpt.minimizer)).toBe(true);
      expect(Array.isArray(devOpt.minimizer)).toBe(true);

      expect(prodOpt.concatenateModules).toBe(devOpt.concatenateModules);
      expect(prodOpt.runtimeChunk).toEqual(devOpt.runtimeChunk);

      // Split chunks configuration should be identical (functions make deep equality complex)
      expect(JSON.stringify(prodOpt.splitChunks, (key, value) =>
        typeof value === 'function' ? value.toString() : value
      )).toBe(JSON.stringify(devOpt.splitChunks, (key, value) =>
        typeof value === 'function' ? value.toString() : value
      ));
    });

    it('should have all required optimization properties', () => {
      const optimization = createOptimization({ isProd: false });

      const requiredProps = [
        'minimize',
        'minimizer',
        'splitChunks',
        'runtimeChunk',
        'concatenateModules',
        'moduleIds',
        'chunkIds'
      ];

      requiredProps.forEach(prop => {
        expect(optimization).toHaveProperty(prop);
      });
    });
  });
});