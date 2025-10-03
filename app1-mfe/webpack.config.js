import { createConfig } from "mfe-build-tools/webpack";
import webpack from "webpack";

export default createConfig(webpack, {
  uniqueName: 'app1',
  entry: './src/index.tsx',
  htmlTemplate: './public/index.html',
  port: 5001,
  moduleFederation: {
    name: 'app1',
    filename: 'remoteEntry.js',
    exposes: {
      "./App": "./src/app",
    },
    remotes: {
      shared: "shared@http://localhost:4002/mf-manifest.json",
      design: "design@http://localhost:4001/mf-manifest.json",
    },
    shared: {
      react: { singleton: true },
      "react-dom": { singleton: true },
    },
  }
});
