import { describe, it, expect } from '@jest/globals';
import { createOptimization } from '../src/optimization.js';

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

    it('should configure TerserPlugin', () => {
      const terserPlugin = optimization.minimizer?.find(
        (plugin: any) => plugin.constructor.name === 'TerserPlugin',
      );

      expect(terserPlugin).toBeDefined();
    });

    it('should configure CssMinimizerPlugin', () => {
      const cssMinPlugin = optimization.minimizer?.find(
        (plugin: any) => plugin.constructor.name === 'CssMinimizerPlugin',
      );

      expect(cssMinPlugin).toBeDefined();
    });

    it('should use named module and chunk ids in development', () => {
      expect(optimization.moduleIds).toBe('named');
      expect(optimization.chunkIds).toBe('named');
    });

    it('should enable module concatenation', () => {
      expect(optimization.concatenateModules).toBe(true);
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
        (plugin: any) => plugin.constructor.name === 'TerserPlugin',
      );

      expect(terserPlugin).toBeDefined();
    });

    it('should configure CssMinimizerPlugin for production', () => {
      const cssMinPlugin = optimization.minimizer?.find(
        (plugin: any) => plugin.constructor.name === 'CssMinimizerPlugin',
      );

      expect(cssMinPlugin).toBeDefined();
    });
  });

  describe('minimizer configurations', () => {
    it('should configure TerserPlugin for both modes', () => {
      const prodOpt = createOptimization({ isProd: true });
      const devOpt = createOptimization({ isProd: false });

      const prodTerser = prodOpt.minimizer?.find(
        (plugin: any) => plugin.constructor.name === 'TerserPlugin',
      );
      const devTerser = devOpt.minimizer?.find(
        (plugin: any) => plugin.constructor.name === 'TerserPlugin',
      );

      expect(prodTerser).toBeDefined();
      expect(devTerser).toBeDefined();
    });

    it('should configure CssMinimizerPlugin for both modes', () => {
      const prodOpt = createOptimization({ isProd: true });
      const devOpt = createOptimization({ isProd: false });

      const prodCss = prodOpt.minimizer?.find(
        (plugin: any) => plugin.constructor.name === 'CssMinimizerPlugin',
      );
      const devCss = devOpt.minimizer?.find(
        (plugin: any) => plugin.constructor.name === 'CssMinimizerPlugin',
      );

      expect(prodCss).toBeDefined();
      expect(devCss).toBeDefined();
    });
  });

  describe('configuration consistency', () => {
    it('should have consistent structure between production and development', () => {
      const prodOpt = createOptimization({ isProd: true });
      const devOpt = createOptimization({ isProd: false });

      expect(typeof prodOpt.minimize).toBe('boolean');
      expect(typeof devOpt.minimize).toBe('boolean');

      expect(Array.isArray(prodOpt.minimizer)).toBe(true);
      expect(Array.isArray(devOpt.minimizer)).toBe(true);

      expect(prodOpt.concatenateModules).toBe(devOpt.concatenateModules);
    });

    it('should have all required optimization properties', () => {
      const optimization = createOptimization({ isProd: false });

      const requiredProps = [
        'minimize',
        'minimizer',
        'concatenateModules',
        'moduleIds',
        'chunkIds',
      ];

      requiredProps.forEach((prop) => {
        expect(optimization).toHaveProperty(prop);
      });
    });
  });

  describe('module and chunk id generation', () => {
    it('should use appropriate ID strategy for each mode', () => {
      const prodOpt = createOptimization({ isProd: true });
      const devOpt = createOptimization({ isProd: false });

      // Production should use deterministic for better caching
      expect(prodOpt.moduleIds).toBe('deterministic');
      expect(prodOpt.chunkIds).toBe('deterministic');

      // Development should use named for better debugging
      expect(devOpt.moduleIds).toBe('named');
      expect(devOpt.chunkIds).toBe('named');
    });
  });
});
