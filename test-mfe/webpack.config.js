import { createWebpackConfig } from 'mfe-build-tools/webpack';

export default createWebpackConfig({
  entry: './src/index.tsx',
  template: './public/index.html',
  moduleFederation: {
    name: 'testMfe',
    filename: 'remoteEntry.js',
    exposes: {
      './App': './src/App',
    },
  },
});
