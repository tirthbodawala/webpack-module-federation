import { createConfig } from "webpack-react-config";
import webpack from "webpack";

const webpackConfig = createConfig(webpack, {
  uniqueName: 'app1',
  port: 5001,
  moduleFederation: {
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

export default webpackConfig;
