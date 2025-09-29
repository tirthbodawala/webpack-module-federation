import webpack from "webpack";
import { createConfig } from "webpack-react-config";

const webpackConfig = createConfig(webpack, {
  uniqueName: 'shared',
  port: 4002,
  moduleFederation: {
    exposes: {
      "./Provider": "./src/Provider",
      "./Context": "./src/Context",
    },
    shared: {
      react: { singleton: true },
      "react-dom": { singleton: true },
    },
  },
});

export default webpackConfig;
