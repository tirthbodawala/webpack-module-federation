import { createConfig } from "webpack-react-config";
import webpack from "webpack";

const webpackConfig = createConfig(webpack, {
  uniqueName: 'app2',
  port: 3002,
  moduleFederation: {
    exposes: {
      "./App": "./src/app",
    },
    remotes: {
      config: "config@[configUrl]/remoteEntry.js",
    },
    shared: {
      react: { singleton: true },
      "react-dom": { singleton: true },
    },
  }
});

export default webpackConfig;
