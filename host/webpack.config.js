import { createConfig } from 'webpack-react-config';
import webpack from 'webpack';
import { tanstackRouter } from '@tanstack/router-plugin/webpack';

const webpackConfig = createConfig(webpack, {
  uniqueName: 'host',
  port: 3000,
  moduleFederation: {
    remotes: {
      app1: 'app1@http://localhost:5001/mf-manifest.json',
      app2: 'app2@http://localhost:5002/mf-manifest.json',
      shared: 'shared@http://localhost:4002/mf-manifest.json',
      design: 'design@http://localhost:4001/mf-manifest.json',
    },
    shared: {
      react: { singleton: true },
      'react-dom': { singleton: true },
      '@tanstack/react-router': { singleton: true },
    },
  },
  additionalPlugins: [
    tanstackRouter({
      target: 'react',
      autoCodeSplitting: true,
    }),
  ],
});

export default webpackConfig;
